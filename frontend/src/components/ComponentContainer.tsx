import { ReactNode, useContext, useMemo } from "react";
import { CanvasContext, IContextProps } from "../context/CanvasContextProvider";
import classes from "./NewsletterContainer.module.scss";

const ComponentContainer = ({
  componentId,
  children,
}: {
  componentId: string;
  children: ReactNode;
}) => {
  const { me, containerList } = useContext(CanvasContext) as IContextProps;

  const temp = useMemo(
    () => containerList.find((item) => item.id === componentId),
    [containerList]
  );

  return (
    <div id={`${componentId}_wrapper`} className={classes.containerWrapper}>
      <div
        key={componentId}
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
    </div>
  );
};

export default ComponentContainer;
