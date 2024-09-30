/* type TUserData = {
  userName: string;
  color: string;
  state: { x: number; y: number };
}; */

type TUser = {
  userName: string;
  color: string;
  currentInput?: string;
};

type TInputs = {
  currentUser?: string;
  value?: string;
  color?: string;
};

const PORT = 3000;

// const users: { [socketId: string]: TUserData } = {}; Är samma sak som raden under
/* const users: Record<string, TUserData> = {}; */

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

      /* const userName = `${colors[Math.floor(Math.random() * 20)]}_${
        animals[Math.floor(Math.random() * 20)]
      }`;
      const color = "#" + Math.floor(Math.random() * 16777215).toString(16);

      const user: TUserData = {
        userName,
        color,
        state: {
          x: 0,
          y: 0,
        },
        }; 
        users[ws.data] = user;
        
        ws.publish("general", `The user ${user.userName} has joined!`);
        */
      //console.log("open: ", ws);
      ws.publish("general", JSON.stringify(messageDictionary));
    },
    message(ws, message) {
      /* const id = ws.data as keyof typeof users;
      //console.log("message ws: ", ws);
      //console.log("message: ", message);
      const temp: TUserData = JSON.parse(message.toString());
      // Genom att göra såhär så kan vi även skicka med vilken topic som ska visas??
      // alltså kan vi subscribea till olika kanaler genom att skicka den propertyn till specifik kanal.

      users[id] = { ...users[id], state: temp.state };
      ws.publish("general", JSON.stringify(users));
      ws.send(JSON.stringify(users));
      // console.log(users[id]); */
      const socketID = ws.data.toString();
      const { topic, userName, color, inputId, list, value } =
        typeof message === "string" ? JSON.parse(message) : null;

      switch (topic) {
        case "createInputList":
          messageDictionary["inputsList"] = list;
          break;
        case "addNew":
          usersList[socketID] = {
            userName: userName,
            color: color,
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

        default:
          break;
      }

      ws.publish("general", JSON.stringify(messageDictionary));
    },
    close(ws) {
      /* const id = ws.data as keyof typeof users;
      ws.publish("general", users[id].userName + " has left the channel");

      delete users[id];
      console.log("Client connection closed", id);
      //console.log("close: ", ws.data);
      */
      const socketID = ws.data.toString();
      delete usersList[socketID];

      messageDictionary["usersList"] = usersList;
      ws.publish("general", JSON.stringify(messageDictionary));
    },
  },
});

console.log(`Listening on localhost:${server.port}`);

const pointerServer = Bun.serve({
  port: 3003,
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
    open(ws) {
      ws.subscribe("general");
    },
    message(ws, message) {
      ws.publish("general", message);
    },
  },
});
