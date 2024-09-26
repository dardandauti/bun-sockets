import { Avatar, Tooltip } from "@mantine/core";
import { useEffect, useLayoutEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

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
//const SOCKET_URL = "ws://192.168.1.226:3000";

function InputContainer() {
  const [connectedUsers, setConnectedUsers] = useState<Record<string, TUser>>();
  const [inputsList, setInputsList] =
    useState<Record<string, TInputs | null>>();
  const [me, setMe] = useState<TUser | null>(null);

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
        .filter((child) => child.nodeName === "INPUT")
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
                  {/* <Avatar color={`${user.color}8D`} variant="filled">
                    {user.userName[0]}
                  </Avatar> */}
                </Tooltip>
              ))}
          </>
        )}
      </div>
      <div
        id="parent"
        style={{ display: "flex", gap: 8, flexDirection: "column" }}
      >
        <input
          id="abcdef"
          style={
            inputsList?.["abcdef"]?.currentUser
              ? {
                  border: `solid 2px ${inputsList?.["abcdef"].color}`,
                }
              : undefined
          }
          value={inputsList?.["abcdef"]?.value}
          onChange={(e) => {
            inputsList?.["abcdef"]?.value;
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
            inputsList?.["abcdef"]?.currentUser
              ? inputsList["abcdef"]?.currentUser !== me?.userName
              : false
          }
          // Disable this to test input-blocker
          onBlur={(e) => {
            sendJsonMessage({
              topic: "inputBlurred",
              inputId: e.target.id,
              userName: me?.userName,
            });
          }}
        />
        <input
          id="input2"
          style={
            inputsList?.["input2"]?.currentUser
              ? {
                  border: `solid 2px ${inputsList?.["input2"].color}`,
                }
              : undefined
          }
          value={inputsList?.["input2"]?.value}
          onChange={(e) => {
            inputsList?.["input2"]?.value;
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
          // Disable this to test input-blocker
          onBlur={(e) => {
            sendJsonMessage({
              topic: "inputBlurred",
              inputId: e.target.id,
              userName: me?.userName,
            });
          }}
        />
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
