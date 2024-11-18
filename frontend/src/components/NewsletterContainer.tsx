import { ActionIcon, Tooltip } from "@mantine/core";
import classes from "./NewsletterContainer.module.scss";
import { useContext, useMemo } from "react";
import { CanvasContext, IContextProps } from "../context/CanvasContextProvider";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import Headline from "./Headline";
import Bodytext from "./Bodytext";
import SubHeadline from "./SubHeadline";
import ComponentContainer from "./ComponentContainer";
import ImageInput from "./ImageInput";

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
  const { connectedUsers, me, containerList, sendJsonMessage } = useContext(
    CanvasContext
  ) as IContextProps;

  const handleOnChange = (id: string, value: string) => {
    sendJsonMessage({
      topic: "valueChange",
      inputId: id,
      value: value,
    });
  };

  const handleOnFocus = (id: string) => {
    sendJsonMessage({
      topic: "inputFocused",
      inputId: id,
      userName: me?.userName,
      color: me?.color,
    });
  };

  const handleOnBlur = (id: string) => {
    sendJsonMessage({
      topic: "inputBlurred",
      inputId: id,
      userName: me?.userName,
    });
  };

  const items = useMemo(
    () =>
      containerList?.map((item, index) => {
        const borderColor = item.occupied ? item.occupied.color : "transparent";

        switch (item.type) {
          case "headline":
            return (
              <ComponentContainer key={item.id} componentId={item.id}>
                <Headline
                  key={item.id}
                  content={item.content}
                  onChange={handleOnChange}
                  onFocus={() => handleOnFocus(item.id)}
                  onBlur={() => handleOnBlur(item.id)}
                  id={item.id}
                  borderColor={borderColor}
                />
              </ComponentContainer>
            );

          case "bread":
            return (
              <ComponentContainer key={item.id} componentId={item.id}>
                <Bodytext
                  key={item.id}
                  content={item.content}
                  onChange={handleOnChange}
                  onFocus={() => handleOnFocus(item.id)}
                  onBlur={() => handleOnBlur(item.id)}
                  id={item.id}
                  borderColor={borderColor}
                />
              </ComponentContainer>
            );

          case "image":
            return <ImageInput key={item.id} item={item} />;

          case "sub-headline":
            return (
              <ComponentContainer key={item.id} componentId={item.id}>
                <SubHeadline
                  key={item.id}
                  content={item.content}
                  onChange={handleOnChange}
                  onFocus={() => handleOnFocus(item.id)}
                  onBlur={() => handleOnBlur(item.id)}
                  id={item.id}
                  borderColor={borderColor}
                />
              </ComponentContainer>
            );

          default:
            break;
        }
      }),
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
