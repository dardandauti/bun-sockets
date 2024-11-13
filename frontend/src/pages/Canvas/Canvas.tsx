import throttle from "lodash.throttle";
import { useContext, useEffect, useRef } from "react";
import { Cursor } from "../../components/Cursor";
import InputContainer from "../../components/InputContainer";
import {
  CanvasContext,
  IContextProps,
  TMessageContainer,
} from "../../context/CanvasContextProvider";

function renderCursors(
  messageContainer: TMessageContainer,
  currentUser: string
) {
  const users = messageContainer.usersList;

  if (Object.keys(users).length > 0) {
    return Object.keys(users).map((uuid) => {
      const user = users[uuid];

      if (user.userName === currentUser) return;

      return (
        <Cursor
          key={uuid}
          point={[user.position.x, user.position.y]}
          color={user.color}
          name={user.userName}
        />
      );
    });
  }
}

const Canvas = () => {
  const { sendJsonMessage, lastJsonMessage, me } = useContext(
    CanvasContext
  ) as IContextProps;

  const sendThrottledMessage = useRef(throttle(sendJsonMessage, 50));

  useEffect(() => {
    window.addEventListener("mousemove", (e) => {
      sendThrottledMessage.current({
        topic: "mouseMove",
        position: {
          x: e.clientX,
          y: e.clientY,
        },
      });
    });
  }, []);

  return (
    <div>
      <h1>Canvas</h1>
      <InputContainer />
      {lastJsonMessage ? (
        renderCursors(
          lastJsonMessage as TMessageContainer,
          me?.userName as string
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default Canvas;
