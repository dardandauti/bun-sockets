import { useEffect, useRef } from "react";
import InputContainer from "../../components/InputContainer";
import throttle from "lodash.throttle";
import useWebSocket from "react-use-websocket";
import { Cursor } from "../../components/Cursor";
type TUserData = {
  userName: string;
  color: string;
  state: { x: number; y: number };
};

function renderCursors(users: { [key: string]: TUserData }) {
  return Object.keys(users).map((uuid) => {
    const user = users[uuid];

    return (
      <Cursor
        key={uuid}
        point={[user.state.x, user.state.y]}
        color={user.color}
        name={user.userName}
      />
    );
  });
}

const Canvas = () => {
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    "ws://localhost:3003"
    // Lägg till en parameter som kommer ta in namnet på användaren?
  );

  const sendThrottledMessage = useRef(throttle(sendJsonMessage, 50));

  useEffect(() => {
    sendJsonMessage({
      x: 0,
      y: 0,
    });

    window.addEventListener("mousemove", (e) => {
      sendThrottledMessage.current({
        x: e.clientX,
        y: e.clientY,
      });
    });
  }, []);
  return (
    <div>
      <h1>Canvas</h1>
      <InputContainer />
      {lastJsonMessage ? (
        renderCursors(lastJsonMessage as { [key: string]: TUserData })
      ) : (
        <></>
      )}
    </div>
  );
};

export default Canvas;
