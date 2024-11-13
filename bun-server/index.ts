type TUserPosition = { x: number; y: number };

type TUser = {
  userName: string;
  color: string;
  currentInput?: string;
  position: TUserPosition;
};

type TContainerColor = {
  user: string;
  color: string;
};

type TContentContainer = {
  id: string;
  type: string;
  content: string;
  occupied: TContainerColor | null;
};

const PORT = 3000;

// const users: { [socketId: string]: TUserData } = {}; Är samma sak som raden under
// const users: Record<string, TUserData> = {};

const usersList: Record<string, TUser> = {};

const messageDictionary: {
  usersList: typeof usersList | undefined;
  containerList: TContentContainer[];
} = {
  usersList: undefined,
  containerList: [],
};

const server = Bun.serve<string>({
  port: PORT,
  fetch(req, server) {
    const socketId = crypto.randomUUID();

    const upgraded = server.upgrade(req, {
      data: socketId,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });

    if (upgraded) return undefined;
  },
  websocket: {
    publishToSelf: true,
    open(ws) {
      ws.subscribe("general");
      ws.publish("general", JSON.stringify(messageDictionary));
    },
    message(ws, message) {
      const socketID = ws.data.toString();
      const {
        topic,
        userName,
        color,
        inputId,
        containerList,
        list,
        value,
        position,
      } = typeof message === "string" ? JSON.parse(message) : null;

      switch (topic) {
        case "createInputList":
          messageDictionary["containerList"] =
            containerList as typeof messageDictionary.containerList;
          break;
        case "addNew":
          usersList[socketID] = {
            userName: userName,
            color: color,
            position: position,
          };
          messageDictionary["usersList"] = { ...usersList };
          break;
        case "inputFocused":
          let focusedIndex = messageDictionary.containerList.findIndex(
            (item: TContentContainer) => item.id === inputId
          );
          messageDictionary.containerList[focusedIndex] = {
            ...messageDictionary.containerList[focusedIndex],
            occupied: {
              user: userName,
              color: color,
            },
          };
          messageDictionary["containerList"] = messageDictionary.containerList;
          break;
        case "inputBlurred":
          const blurredIndex = messageDictionary.containerList.findIndex(
            (item: TContentContainer) => item.id === inputId
          );
          messageDictionary.containerList[blurredIndex] = {
            ...messageDictionary.containerList[blurredIndex],
            occupied: null,
          };
          messageDictionary["containerList"] = messageDictionary.containerList;
          break;
        case "valueChange":
          const valueChangeIndex = messageDictionary.containerList.findIndex(
            (item: TContentContainer) => item.id === inputId
          );
          messageDictionary.containerList[valueChangeIndex] = {
            ...messageDictionary.containerList[valueChangeIndex],
            content: value,
          };
          messageDictionary["containerList"] = messageDictionary.containerList;
          break;
        case "mouseMove":
          usersList[socketID] = { ...usersList[socketID], position: position };
          messageDictionary["usersList"] = { ...usersList };
          break;
        case "listChange":
          messageDictionary["containerList"] = list;
          break;
        default:
          break;
      }

      ws.publish("general", JSON.stringify(messageDictionary));
    },
    close(ws) {
      const socketID = ws.data.toString();
      delete usersList[socketID];

      messageDictionary["usersList"] = usersList;
      ws.publish("general", JSON.stringify(messageDictionary));
    },
  },
});

console.log(`Listening on localhost:${server.port}`);
