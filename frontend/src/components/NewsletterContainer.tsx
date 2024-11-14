import { ActionIcon, Tooltip } from "@mantine/core";
import classes from "./NewsletterContainer.module.scss";
import { useContext, useMemo } from "react";
import { CanvasContext, IContextProps } from "../context/CanvasContextProvider";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import Headline from "./Headline";
import Bodytext from "./Bodytext";
import SubHeadline from "./SubHeadline";

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

const NewsletterContainer = () => {
  const { connectedUsers, me, containerList, sendJsonMessage, move } =
    useContext(CanvasContext) as IContextProps;

  const borderRadius = "6px";

  const handleOnChange = (id, value) => {
    sendJsonMessage({
      topic: "valueChange",
      inputId: id,
      value: value,
    });
  };

  const handleOnFocus = (id) => {
    sendJsonMessage({
      topic: "inputFocused",
      inputId: id,
      userName: me?.userName,
      color: me?.color,
    });
  };

  const handleOnBlur = (id) => {
    sendJsonMessage({
      topic: "inputBlurred",
      inputId: id,
      userName: me?.userName,
    });
  };

  const items = useMemo(
    () =>
      containerList?.map(
        (item, index) => {
          const borderColor = item.occupied
            ? item.occupied.color
            : "transparent";

          switch (item.type) {
            case "headline":
              return (
                <div className={classes.container}>
                  <Headline
                    key={item.id}
                    content={item.content}
                    onChange={handleOnChange}
                    onFocus={() => handleOnFocus(item.id)}
                    onBlur={() => handleOnBlur(item.id)}
                    id={item.id}
                    borderColor={borderColor}
                  />
                </div>
              );

            case "bread":
              return (
                <div className={classes.container}>
                  <Bodytext
                    key={item.id}
                    content={item.content}
                    onChange={handleOnChange}
                    onFocus={() => handleOnFocus(item.id)}
                    onBlur={() => handleOnBlur(item.id)}
                    id={item.id}
                    borderColor={borderColor}
                  />
                </div>
              );

            case "image":
              return <></>;

            case "sub-headline":
              return (
                <div className={classes.container}>
                  <SubHeadline
                    key={item.id}
                    content={item.content}
                    onChange={handleOnChange}
                    onFocus={() => handleOnFocus(item.id)}
                    onBlur={() => handleOnBlur(item.id)}
                    id={item.id}
                    borderColor={borderColor}
                  />
                </div>
              );

            default:
              break;
          }
        }
        /* 


        <div key={item.id} className={classes.container}>
          <div id={`${item.id}_wrapper`} className={classes.inputWrapper}>
            {containerList[index].occupied && (
              <p
                style={{
                  backgroundColor: containerList[index].occupied.color,
                }}
                className={classes.inputName}
              >
                {containerList[index].occupied.user !== me?.userName
                  ? containerList[index].occupied.user
                  : "Me"}
              </p>
            )}
            <input
              placeholder={item.id}
              id={containerList[index].id}
              style={
                containerList[index].occupied
                  ? {
                      border: `solid 2px ${containerList[index].occupied.color}`,
                      borderRadius: `${borderRadius} 0px ${borderRadius} ${borderRadius}`,
                    }
                  : undefined
              }
              className={classes.input}
              value={containerList[index].content}
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
                containerList[index].occupied
                  ? containerList[index].occupied.user !== me?.userName
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

          <div key={item.id} className={classes.item} style={{ gap: "16px" }}>
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
      )),
      */
      ),
    [containerList]
  );

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
        {items}
      </div>
    </div>
  );
};

export default NewsletterContainer;
