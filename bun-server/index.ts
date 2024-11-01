type TUserPosition = { x: number; y: number };

type TUser = {
  userName: string;
  color: string;
  currentInput?: string;
  position: TUserPosition;
};

type TInputs = {
  currentUser?: string;
  value?: string;
  color?: string;
};

const PORT = 3000;

// const users: { [socketId: string]: TUserData } = {}; Är samma sak som raden under
// const users: Record<string, TUserData> = {};

const usersList: Record<string, TUser> = {};
const inputsList: Record<string, TInputs | null> = {};

const messageDictionary: {
  usersList: typeof usersList | undefined;
  inputsList: typeof inputsList | undefined;
} = {
  usersList: undefined,
  inputsList: undefined,
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
      const { topic, userName, color, inputId, list, value, position } =
        typeof message === "string" ? JSON.parse(message) : null;

      switch (topic) {
        case "createInputList":
          messageDictionary["inputsList"] = list;
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
          inputsList[inputId] = {
            currentUser: userName,
            color: color,
          };
          messageDictionary["inputsList"] = { ...inputsList };
          break;
        case "inputBlurred":
          inputsList[inputId] = null;
          messageDictionary["inputsList"] = { ...inputsList };
          break;
        case "valueChange":
          inputsList[inputId] = { ...inputsList[inputId], value: value };
          messageDictionary["inputsList"] = { ...inputsList };
          break;
        case "mouseMove":
          usersList[socketID] = { ...usersList[socketID], position: position };
          messageDictionary["usersList"] = { ...usersList };
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
