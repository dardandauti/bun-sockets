import { Tooltip } from "@mantine/core";
import classes from "./Home.module.scss";
import { useContext } from "react";
import { CanvasContext, IContextProps } from "../context/CanvasContextProvider";

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

function InputContainer() {
  const { connectedUsers, me, inputsList, sendJsonMessage } = useContext(
    CanvasContext
  ) as IContextProps;

  const borderRadius = "6px";

  return (
    <div>
      <div
        style={{
          display: "flex",
          flex: 0,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
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
                <Tooltip key={user.color} label={user.userName}>
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
              {inputsList?.["input1"]?.currentUser !== me?.userName
                ? inputsList?.["input1"]?.currentUser
                : "Me"}
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
              {inputsList?.["input2"]?.currentUser !== me?.userName
                ? inputsList?.["input2"]?.currentUser
                : "Me"}
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
