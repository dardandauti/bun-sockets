import cx from "clsx";
import { rem, Text } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { IconGripVertical } from "@tabler/icons-react";
import classes from "./DndListHandle.module.css";
import { useContext, useEffect, useMemo } from "react";
import {
  CanvasContext,
  IContextProps,
  TListItem,
} from "../context/CanvasContextProvider";
import useWebSocket from "react-use-websocket";

const data: TListItem[] = [
  { position: 6, mass: 12.011, symbol: "C", name: "Carbon", color: "" },
  { position: 7, mass: 14.007, symbol: "N", name: "Nitrogen", color: "" },
  { position: 39, mass: 88.906, symbol: "Y", name: "Yttrium", color: "" },
  { position: 56, mass: 137.33, symbol: "Ba", name: "Barium", color: "" },
  { position: 58, mass: 140.12, symbol: "Ce", name: "Cerium", color: "" },
];

export function DndListHandle() {
  const { sendJsonMessage, lastJsonMessage, state, handlers, me } = useContext(
    CanvasContext
  ) as IContextProps;
  /*   const [state, handlers] = useListState(data);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    "ws://localhost:3009"
  ); */

  const getItems = (list: TListItem[]) =>
    list.map((item, index) => (
      <Draggable key={item.symbol} index={index} draggableId={item.symbol}>
        {(provided, snapshot) => (
          <div
            className={cx(classes.item, {
              [classes.itemDragging]: snapshot.isDragging,
            })}
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={
              snapshot.isDragging
                ? {
                    ...provided.draggableProps.style,
                    border: `2px solid ${item?.color}`,
                    transitionDuration: `0.001s`,
                  }
                : { ...provided.draggableProps.style }
            }
          >
            <div {...provided.dragHandleProps} className={classes.dragHandle}>
              <IconGripVertical
                style={{ width: rem(18), height: rem(18) }}
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
      (lastJsonMessage as { topic: string; dndList: TListItem[] })
        ? getItems(
            (lastJsonMessage as { topic: string; dndList: TListItem[] })
              .dndList as TListItem[]
          )
        : getItems(state),
    [lastJsonMessage]
  );

  /*   useEffect(() => {
    if (lastJsonMessage) {
      const container = lastJsonMessage as any;

      container.list?.length > 0 && handlers.setState(container.list);
    }
  }, [lastJsonMessage]); */
  let draggableId = "";

  useEffect(() => {
    sendJsonMessage({
      topic: "dragEnd",
      list: state,
      draggedId: draggableId,
    });
  }, [state]);

  return (
    <DragDropContext
      /*       onBeforeDragStart={(start) => {
        console.log(start);
      }} */
      onDragStart={(node, provided) => {
        console.log(node.draggableId);
        draggableId = node.draggableId;
        sendJsonMessage({
          topic: "dragStart",
          draggedId: node.draggableId,
          list: state,
        });
      }}
      onDragEnd={({ destination, source }) =>
        handlers.reorder({
          from: source.index,
          to: destination?.index || 0,
        })
      }
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
