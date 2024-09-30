import { Tooltip } from "@mantine/core";
import { useEffect, useLayoutEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import classes from "./Home.module.scss";

type TUser = {
  userName: string;
  color: string;
  currentInput?: string;
};

type TInputs = {
  currentUser: string;
  value: string;
  color: string;
};

type TMessageContainer = {
  usersList: Record<string, TUser>;
  inputsList: Record<string, TInputs>;
};

const bubbleStyle = {
  borderRadius: "50%",
  width: "38px",
  height: "38px",
  margin: "2px",
  color: "white",
  fontWeight: "bold",
  fontSize: 16,
  justifyContent: "center",
  display: "flex",
  alignItems: "center",
};

const SOCKET_URL = "ws://localhost:3000";
//const SOCKET_URL = "ws://192.168.1.226:3000";//   home
//const SOCKET_URL = "ws://10.66.246.96:3000"; //   work

function InputContainer() {
  const [connectedUsers, setConnectedUsers] = useState<Record<string, TUser>>();
  const [inputsList, setInputsList] =
    useState<Record<string, TInputs | null>>();
  const [me, setMe] = useState<TUser | null>(null);
  const borderRadius = "6px";

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(SOCKET_URL, {
    onOpen: () => {
      // Skicka med den nya användarens information (namn och färg)
      const userName = `${colors[Math.floor(Math.random() * 20)]}_${
        animals[Math.floor(Math.random() * 20)]
      }`;
      const color = "#" + Math.floor(Math.random() * 16777215).toString(16);

      sendJsonMessage({
        topic: "createInputList",
        inputsList,
      });

      sendJsonMessage({
        topic: "addNew",
        userName,
        color,
      });

      setMe({
        userName,
        color,
      });
    },
    onClose: () => {
      sendJsonMessage({
        userName: me?.userName,
      });
    },
  });

  useEffect(() => {
    if (lastJsonMessage) {
      const typedResponse = lastJsonMessage as TMessageContainer;
      setConnectedUsers(typedResponse.usersList);
      setInputsList(typedResponse.inputsList);
    }
  }, [lastJsonMessage]);

  useLayoutEffect(() => {
    const childList = document.getElementById("parent")
      ?.children as HTMLCollection;

    const list: Record<string, TInputs | null> = {};

    childList &&
      Array.from(childList)
        .filter((child) => child.id.includes("input"))
        .forEach((child) => (list[child.id] = null));

    setInputsList(list);
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flex: 0,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginBottom: 32,
        }}
      >
        <p style={{ marginRight: 8 }}>Connected users:</p>
        {connectedUsers && (
          <>
            <Tooltip label={me?.userName}>
              <div style={{ ...bubbleStyle, background: `${me?.color}8D` }}>
                {me?.userName[0]}
              </div>
            </Tooltip>
            {Object.values(connectedUsers)
              .filter((user) => user.userName !== me?.userName)
              .map((user) => (
                <Tooltip label={user.userName}>
                  <div
                    style={{ ...bubbleStyle, background: `${user.color}8D` }}
                  >
                    {user.userName[0]}
                  </div>
                </Tooltip>
              ))}
          </>
        )}
      </div>
      <div
        id="parent"
        style={{
          display: "flex",
          gap: 8,
          flexDirection: "column",
          width: "fit-content",
        }}
      >
        <div id="input1_wrapper" className={classes.inputWrapper}>
          {inputsList?.["input1"]?.currentUser && (
            <p
              style={{
                backgroundColor: inputsList?.["input1"]?.color,
              }}
              className={classes.inputName}
            >
              {inputsList?.["input1"]?.currentUser}
            </p>
          )}
          <input
            id="input1"
            style={
              inputsList?.["input1"]?.currentUser
                ? {
                    border: `solid 2px ${inputsList?.["input1"]?.color}`,
                    borderRadius: `${borderRadius} 0px ${borderRadius} ${borderRadius}`,
                  }
                : undefined
            }
            className={classes.input}
            defaultValue={inputsList?.["input1"]?.value}
            value={inputsList?.["input1"]?.value}
            onChange={(e) => {
              sendJsonMessage({
                topic: "valueChange",
                inputId: e.target.id,
                value: e.target.value,
              });
            }}
            onFocus={(e) => {
              sendJsonMessage({
                topic: "inputFocused",
                inputId: e.target.id,
                userName: me?.userName,
                color: me?.color,
              });
            }}
            disabled={
              inputsList?.["input1"]?.currentUser
                ? inputsList["input1"]?.currentUser !== me?.userName
                : false
            }
            onBlur={(e) => {
              sendJsonMessage({
                topic: "inputBlurred",
                inputId: e.target.id,
                userName: me?.userName,
              });
            }}
          />
        </div>

        <div id="input2_wrapper" className={classes.inputWrapper}>
          {inputsList?.["input2"]?.currentUser && (
            <p
              style={{
                backgroundColor: inputsList?.["input2"]?.color,
              }}
              className={classes.inputName}
            >
              {inputsList?.["input2"]?.currentUser}
            </p>
          )}
          <input
            id="input2"
            style={
              inputsList?.["input2"]?.currentUser
                ? {
                    border: `solid 2px ${inputsList?.["input2"]?.color}`,
                    borderRadius: `${borderRadius} 0px ${borderRadius} ${borderRadius}`,
                  }
                : undefined
            }
            className={classes.input}
            value={inputsList?.["input2"]?.value}
            onChange={(e) => {
              sendJsonMessage({
                topic: "valueChange",
                inputId: e.target.id,
                value: e.target.value,
              });
            }}
            onFocus={(e) => {
              sendJsonMessage({
                topic: "inputFocused",
                inputId: e.target.id,
                userName: me?.userName,
                color: me?.color,
              });
            }}
            disabled={
              inputsList?.["input2"]?.currentUser
                ? inputsList["input2"]?.currentUser !== me?.userName
                : false
            }
            onBlur={(e) => {
              sendJsonMessage({
                topic: "inputBlurred",
                inputId: e.target.id,
                userName: me?.userName,
              });
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* <p>Connected users: {JSON.stringify(connectedUsers)?.toString()}</p> */}
          {/* <p>Inputs: {JSON.stringify(inputsList)?.toString()}</p> */}
          {/* <p>Me: {JSON.stringify(me)?.toString()}</p> */}
        </div>
      </div>
    </div>
  );
}

export default InputContainer;

const animals = [
  "Lion",
  "Elephant",
  "Giraffe",
  "Tiger",
  "Zebra",
  "Kangaroo",
  "Dolphin",
  "Penguin",
  "Gorilla",
  "Bear",
  "Koala",
  "Rhino",
  "Cheetah",
  "Crocodile",
  "Eagle",
  "Panda",
  "Shark",
  "Wolf",
  "Fox",
  "Owl",
];

const colors = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Purple",
  "Orange",
  "Pink",
  "Black",
  "White",
  "Gray",
  "Brown",
  "Violet",
  "Cyan",
  "Magenta",
  "Teal",
  "Maroon",
  "Beige",
  "Turquoise",
  "Lavender",
  "Gold",
];
