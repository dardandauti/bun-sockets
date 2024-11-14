import { ReactNode, useContext, useMemo } from "react";
import { CanvasContext, IContextProps } from "../context/CanvasContextProvider";
import classes from "./NewsletterContainer.module.scss";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";

const ComponentContainer = ({
  componentId,
  children,
}: {
  componentId: string;
  children: ReactNode;
}) => {
  const { me, containerList, move } = useContext(
    CanvasContext
  ) as IContextProps;

  const temp = useMemo(
    () => containerList.find((item) => item.id === componentId),
    [containerList]
  );

  const index = useMemo(
    () => containerList.findIndex((item) => item.id === componentId),
    [containerList]
  );

  return (
    <div id={`${componentId}_wrapper`} className={classes.containerWrapper}>
      <div
        key={`${componentId}_container`}
        style={
          temp?.occupied
            ? {
                borderColor: temp?.occupied?.color,
                borderTopRightRadius: 0,
              }
            : undefined
        }
        className={classes.container}
      >
        {temp?.occupied && (
          <p
            style={{
              backgroundColor: temp?.occupied?.color,
            }}
            className={classes.occupiedPopover}
          >
            {temp?.occupied.user !== me?.userName ? temp?.occupied.user : "Me"}
          </p>
        )}
        {children}
      </div>
      <div
        key={`${componentId}_utilities`}
        className={classes.item}
        style={{ gap: "16px" }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <ActionIcon
            variant="subtle"
            disabled={
              index === 0 ||
              (containerList[index].occupied
                ? containerList[index].occupied.user !== me?.userName
                : false)
            }
            onClick={() => move(index, index - 1)}
          >
            <IconArrowUp />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            disabled={
              index === containerList.length - 1 ||
              (containerList[index].occupied
                ? containerList[index].occupied.user !== me?.userName
                : false)
            }
            onClick={() => move(index, index + 1)}
          >
            <IconArrowDown />
          </ActionIcon>
        </div>
      </div>
    </div>
  );
};

export default ComponentContainer;
