import "@mantine/core/styles.css";
import throttle from "lodash.throttle";
import { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import { Cursor } from "./Cursor";
import { DndListHandle } from "./DndListHandle";
import { Blockquote, Input } from "@mantine/core";
import classes from "./Home.module.scss";
import InputContainer from "./InputContainer";

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

function Home() {
  /*   const { sendJsonMessage, lastJsonMessage } = useWebSocket(
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
  }, []); */

  return (
    <>
      <InputContainer />

      {/* <DndListHandle /> */}

      {/* {lastJsonMessage ? (
        renderCursors(lastJsonMessage as { [key: string]: TUserData })
      ) : (
        <></>
      )} */}
    </>
  );
}

export default Home;
