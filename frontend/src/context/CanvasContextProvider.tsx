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

export type TUser = {
  userName: string;
  color: string;
  currentInput?: string;
};

export type TInputs = {
  currentUser: string;
  value: string;
  color: string;
};

export type TMessageContainer = {
  usersList: Record<string, TUser>;
  inputsList: Record<string, TInputs>;
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
  me: TUser | null;
  setMe: React.Dispatch<React.SetStateAction<TUser | null>>;
  sendJsonMessage: SendJsonMessage;
  lastJsonMessage: unknown;
};

const SOCKET_URL = `ws://${import.meta.env.VITE_SOCKET_URL}:3000`;

export const CanvasContext = createContext<IContextProps | null>(null);

const CanvasContextProvider = ({ children }: { children: ReactNode }) => {
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
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasContextProvider;
