import {
  createContext,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { animals, colors } from "../assets/username_properties";
import useWebSocket from "react-use-websocket";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { useListState, UseListStateHandlers } from "@mantine/hooks";

export type TUserPosition = { x: number; y: number };

export type TUser = {
  userName: string;
  color: string;
  currentInput?: string;
  position: TUserPosition;
};

export type TInputs = {
  currentUser: string;
  value: string;
  color: string;
};

export type TListItem = {
  position: number;
  mass: number;
  symbol: string;
  name: string;
};

export type TMessageContainer = {
  usersList: Record<string, TUser>;
  inputsList: Record<string, TInputs>;
  dndList: TListItem[];
};

export type IContextProps = {
  connectedUsers: Record<string, TUser> | undefined;
  setConnectedUsers: React.Dispatch<
    React.SetStateAction<Record<string, TUser> | undefined>
  >;
  inputsList: Record<string, TInputs | null> | undefined;
  setInputsList: React.Dispatch<
    React.SetStateAction<Record<string, TInputs | null> | undefined>
  >;
  me: Pick<TUser, "userName" | "color"> | null;
  setMe: React.Dispatch<
    React.SetStateAction<Pick<TUser, "userName" | "color"> | null>
  >;
  sendJsonMessage: SendJsonMessage;
  lastJsonMessage: unknown;
  state: TListItem[];
  handlers: UseListStateHandlers<TListItem>;
};

const data: TListItem[] = [
  { position: 6, mass: 12.011, symbol: "C", name: "Carbon" },
  { position: 7, mass: 14.007, symbol: "N", name: "Nitrogen" },
  { position: 39, mass: 88.906, symbol: "Y", name: "Yttrium" },
  { position: 56, mass: 137.33, symbol: "Ba", name: "Barium" },
  { position: 58, mass: 140.12, symbol: "Ce", name: "Cerium" },
];

const SOCKET_URL = `ws://${import.meta.env.VITE_SOCKET_URL}:3000`;

export const CanvasContext = createContext<IContextProps | null>(null);

const CanvasContextProvider = ({ children }: { children: ReactNode }) => {
  const [connectedUsers, setConnectedUsers] = useState<Record<string, TUser>>();
  const [inputsList, setInputsList] =
    useState<Record<string, TInputs | null>>();
  const [me, setMe] = useState<Pick<TUser, "userName" | "color"> | null>(null);
  const [state, handlers] = useListState(data);

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
        position: {
          x: 0,
          y: 0,
        },
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
    <CanvasContext.Provider
      value={{
        connectedUsers,
        setConnectedUsers,
        inputsList,
        setInputsList,
        me,
        setMe,
        sendJsonMessage,
        lastJsonMessage,
        state,
        handlers,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasContextProvider;
