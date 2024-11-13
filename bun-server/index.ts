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

type TListItem = {
  position: number;
  mass: number;
  symbol: string;
  name: string;
  color: string;
};

const PORT = 3000;

// const users: { [socketId: string]: TUserData } = {}; Är samma sak som raden under
// const users: Record<string, TUserData> = {};

const usersList: Record<string, TUser> = {};
const inputsList: Record<string, TInputs | null> = {};
const dndList: TListItem[] = [];

const messageDictionary: {
  usersList: Record<string, TUser> | undefined;
  inputsList: Record<string, TInputs | null> | undefined;
  dndList: typeof dndList | undefined;
  dragging?: {
    draggingUser: TUser;
    draggedItem: TListItem;
  };
  resetColor?: boolean;
} = {
  usersList: undefined,
  inputsList: undefined,
  dndList: dndList,
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
        list,
        value,
        position,
        draggableId,
        destination,
      } = typeof message === "string" ? JSON.parse(message) : null;

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
        /*
          Aktiveras när en Draggable-komponent börjar dras och skickar "dragStart" som topic.
          Sätter `dragging` i `messageDictionary` till ett objekt som innehåller information om användaren som drar och det objekt som dras.
          Detta gör att andra användare kan se vilken användare som drar ett objekt och vilken färg de har.
          Innehåll:
          - topic: "dragStart",
          - draggableId: id för det dragna objektet,
          - userName: namnet på användaren som drar,
          - color: användarens färg.
          */
        case "dragStart":
          messageDictionary.dragging = {
            draggingUser: { userName, color, position: { x: 0, y: 0 } },
            draggedItem: {
              symbol: draggableId,
              name: "",
              mass: 0,
              position: 0,
              color: color,
            },
          };
          break;
        /*
          Aktiveras när en Draggable-komponent dras till en ny position och skickar "dragUpdate" som topic.
          Uppdaterar `dragging` i `messageDictionary`.
          Tillåter andra användare att se var objektet befinner sig under dragningen.
          Innehåll:
          - topic: "dragUpdate",
          - draggableId: id för det dragna objektet,
          - destination: den nya positionen.
          */
        case "dragUpdate":
          if (destination !== undefined) {
            messageDictionary.dragging = {
              draggingUser: { userName, color, position: { x: 0, y: 0 } },
              draggedItem: {
                symbol: draggableId,
                name: "",
                mass: 0,
                position: destination,
                color: color,
              },
            };
          }
          break;
        case "updateList":
          messageDictionary["dndList"] = list;
          break;
        /*
          Aktiveras när en Draggable-komponent släpps och skickar "dragEnd" som topic.
          Tar bort `dragging` informationen från `messageDictionary` för att signalera att ingen dragning längre pågår.
          Uppdaterar `dndList` med den slutliga versionen av listan efter dragningen och sätter `resetColor` till true för att återställa färgen på objektet.
          Innehåll:
          - topic: "dragEnd",
          - list: den slutliga listan efter att dragningen är klar,
          - resetColor: för att signalera att användarens färg ska återställas.
          */

        case "dragEnd":
          if (messageDictionary.dragging) {
            delete messageDictionary.dragging;
          }
          messageDictionary["dndList"] = list;
          messageDictionary["resetColor"] = true;
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
/*
const dndServer = Bun.serve({
  port: 3009,
  fetch(req) {
    const upgraded = dndServer.upgrade(req, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });

    if (upgraded) return undefined;
  },
  websocket: {
    publishToSelf: true,
    open(ws) {
      ws.subscribe("hehe");
    },
    message(ws, message) {
      ws.publish("hehe", message);
    },
  },
});
*/
