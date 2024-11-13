import cx from "clsx";
import { rem, Text } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DragUpdate,
} from "@hello-pangea/dnd";
import { IconGripVertical } from "@tabler/icons-react";
import classes from "./DndListHandle.module.css";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  CanvasContext,
  IContextProps,
  TListItem,
  TMessageContainer,
} from "../context/CanvasContextProvider";
import useWebSocket from "react-use-websocket";

/*
const data: TListItem[] = [
  { position: 6, mass: 12.011, symbol: "C", name: "Carbon" },
  { position: 7, mass: 14.007, symbol: "N", name: "Nitrogen" },
  { position: 39, mass: 88.906, symbol: "Y", name: "Yttrium" },
  { position: 56, mass: 137.33, symbol: "Ba", name: "Barium" },
  { position: 58, mass: 140.12, symbol: "Ce", name: "Cerium" },
];*/

export function DndListHandle() {
  const { sendJsonMessage, lastJsonMessage, state, handlers, me } = useContext(
    CanvasContext
  ) as IContextProps;
  /*
  const [state, handlers] = useListState(data);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    "ws://localhost:3009"
  );
*/

  const [remoteDragging, setRemoteDragging] = useState<{
    userName: string;
    item: TListItem | null;
    color: string;
  } | null>(null);

  const [disableDrag, setDisableDrag] = useState(false);

  const getItems = (list: TListItem[]) =>
    list?.map((item, index) => (
      <Draggable
        key={item.symbol}
        index={index}
        draggableId={item.symbol}
        isDragDisabled={
          disableDrag && remoteDragging?.userName !== me?.userName
        }
      >
        {(provided, snapshot) => (
          <div
            className={cx(classes.item, {
              [classes.itemDragging]: snapshot.isDragging,
              [classes.disabledItem]:
                disableDrag &&
                !snapshot.isDragging &&
                remoteDragging?.userName !== me?.userName,
            })}
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={{
              ...provided.draggableProps.style,
              border: snapshot.isDragging
                ? `solid 2px ${me?.color}`
                : remoteDragging && remoteDragging.item?.symbol === item.symbol
                ? `solid 2px ${remoteDragging.color}`
                : "none",
            }}
          >
            <div {...provided.dragHandleProps} className={classes.dragHandle}>
              <IconGripVertical
                style={{
                  width: rem(18),
                  height: rem(18),
                }}
                stroke={1.5}
              />
            </div>
            <Text className={classes.symbol}>{item.symbol}</Text>
            <div>
              <Text>{item.name}</Text>
              <Text c="dimmed" size="sm">
                Position: {item.position} • Mass: {item.mass}
              </Text>
            </div>
          </div>
        )}
      </Draggable>
    ));

  const memoizedItems = useMemo(
    () =>
      (lastJsonMessage as {
        topic: string;
        dndList: TListItem[];
      })
        ? getItems(
            (
              lastJsonMessage as {
                topic: string;
                dndList: TListItem[];
              }
            ).dndList
          )
        : getItems(state),
    [lastJsonMessage]
  );

  useEffect(() => {
    sendJsonMessage({
      topic: "updateList",
      list: state,
    });
  }, [state]);

  /*
useEffect för att uppdetar varje gång ett nytt meddelande tas emot från vår WebSocket.
Om `message.resetColor` är true, anropas `setRemoteDragging(null)` och `setDisableDrag(false)` för att ta bort användarens färger.
Om en annan användare drar i en Draggable-komponent uppdateras `remoteDragging` med detaljer om användaren och objektet:
   - userName: sätts till användarnamnet för den som drar,
   - item: sätts till det objekt som dras, tillsammans med dess `position`,
   - color: sätts till användarens färg.
   Dessutom sätts setDisabledDrag(true) för att hindra andra användare från att dra i andra Draggable-komponenter
Om objektets aktuella position inte matchar `dragging.draggedItem.position`, uppdateras listan för att flytta objektet till rätt position.
*/
  useEffect(() => {
    if (!lastJsonMessage) return;
    const message = lastJsonMessage as TMessageContainer;
    if (message.resetColor) {
      setDisableDrag(false);
      setRemoteDragging(null);
    }

    const { dragging } = message;
    if (!dragging || dragging.draggingUser.userName === me?.userName) return;

    if (dragging && dragging.draggingUser.userName !== me?.userName) {
      setRemoteDragging({
        userName: dragging.draggingUser.userName,
        item: {
          ...dragging.draggedItem,
          position: dragging.draggedItem.position,
        },
        color: dragging.draggingUser.color,
      });
      setDisableDrag(true);
    }

    const currentIndex = state.findIndex(
      (el) => el.symbol === dragging.draggedItem.symbol
    );

    if (currentIndex !== dragging.draggedItem.position) {
      handlers.reorder({
        from: currentIndex,
        to: dragging.draggedItem.position,
      });
    }
  }, [lastJsonMessage, me, handlers, state]);

  return (
    <DragDropContext
      /*
Aktiveras när en Draggable-komponent börjar dras genom att hitta draggableId === symbol. 
Därefter skickar vi ett meddelande till vår WebSocket som innehåller:
 - topic: "dragStart",
 - draggableId: id för det dragna elementet,
 - userName: användarnamn för den som utför dragningen.
 - color: vår användares färg
   */
      onDragStart={(start: { draggableId: string }) => {
        const item = state.find((el) => el.symbol === start.draggableId);

        if (item) {
          sendJsonMessage({
            topic: "dragStart",
            draggableId: start.draggableId,
            userName: me?.userName,
            color: me?.color,
          });
        } else {
          console.error(
            `Item with symbol ${start.draggableId} not found in state`
          );
        }
      }}
      /* 
Aktiveras när en Draggable-komponent dras till en ny position.
Kontrollerar först om destinationen existerar.
Om destinationen finns skickar vi ett meddelande till vår WebSocket som innehåller:
 - topic: "dragUpdate",
 - draggableId: id för det dragna elementet,
 - destination: index för den nya positionen,
 - userName: användarnamn för den som utför dragningen.
 */
      onDragUpdate={(update: DragUpdate) => {
        const { draggableId, destination } = update;

        if (destination) {
          sendJsonMessage({
            topic: "dragUpdate",
            draggableId: draggableId,
            destination: destination.index,
            userName: me?.userName,
          });
        }
      }}
      /*
Aktiveras när en när dragningen avslutas.
Kontrollerar först om destinationen finns.
Om destinationen är giltig, använder vi `handlers.reorder` för att flytta objektet i listan från `source.index` till `destination.index`.
Nollställer `RemoteDragging` och `DisableDrag` för att indikera att inget objekt längre dras.
Skickar ett meddelande till WebSocket med:
  - topic: "dragEnd",
  - list: den uppdaterade listan.
*/
      onDragEnd={({ destination, source }: DropResult) => {
        if (destination) {
          handlers.reorder({
            from: source.index,
            to: destination.index,
          });
        }
        setDisableDrag(false);
        setRemoteDragging(null);
        sendJsonMessage({
          topic: "dragEnd",
          list: state,
        });
      }}
    >
      <Droppable droppableId="dnd-list" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {memoizedItems}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
