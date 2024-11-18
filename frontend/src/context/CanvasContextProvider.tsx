import { createContext, ReactNode, useEffect, useState } from "react";
import { animals, colors } from "../assets/username_properties";
import useWebSocket from "react-use-websocket";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

export type TUserPosition = { x: number; y: number };

export type TUser = {
  userName: string;
  color: string;
  currentInput?: string;
  position: TUserPosition;
};

export type TContentContainer = {
  id: string;
  type: string;
  content: string;
  occupied: TContainerColor | null;
};

export type TContainerColor = {
  user: string;
  color: string;
};

export type TMessageContainer = {
  usersList: Record<string, TUser>;
  containerList: TContentContainer[];
};

export type IContextProps = {
  connectedUsers: Record<string, TUser> | undefined;
  setConnectedUsers: React.Dispatch<
    React.SetStateAction<Record<string, TUser> | undefined>
  >;
  containerList: TContentContainer[];
  setContainerList: React.Dispatch<React.SetStateAction<TContentContainer[]>>;
  me: Pick<TUser, "userName" | "color"> | null;
  setMe: React.Dispatch<
    React.SetStateAction<Pick<TUser, "userName" | "color"> | null>
  >;
  sendJsonMessage: SendJsonMessage;
  lastJsonMessage: unknown;
  move: (from: number, to: number) => void;
};

const SOCKET_URL = `ws://${import.meta.env.VITE_SOCKET_URL}:3000`;

export const CanvasContext = createContext<IContextProps | null>(null);

const CanvasContextProvider = ({ children }: { children: ReactNode }) => {
  const [connectedUsers, setConnectedUsers] = useState<Record<string, TUser>>();
  const [containerList, setContainerList] = useState<TContentContainer[]>([]);
  const [me, setMe] = useState<Pick<TUser, "userName" | "color"> | null>(null);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(SOCKET_URL, {
    onOpen: () => {
      // Skicka med den nya användarens information (namn och färg)
      const userName = `${colors[Math.floor(Math.random() * 20)]}_${
        animals[Math.floor(Math.random() * 20)]
      }`;
      const color = "#" + Math.floor(Math.random() * 16777215).toString(16);

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

  function move(from: number, to: number) {
    const placeholder = {
      ...containerList[from],
      occupied: { user: me?.userName || "", color: me?.color || "" },
    };
    const temp = [...containerList].filter((_, index) => index !== from);

    temp.splice(to, 0, placeholder);

    sendJsonMessage({
      topic: "listChange",
      list: temp,
    });

    setTimeout(() => {
      const clearedList = temp.map((item, index) =>
        index === to ? { ...item, occupied: null } : item
      );
      setContainerList(clearedList);
      sendJsonMessage({
        topic: "listChange",
        list: clearedList,
      });
    }, 500);
  }

  useEffect(() => {
    if (lastJsonMessage) {
      const typedResponse = lastJsonMessage as TMessageContainer;
      setConnectedUsers(typedResponse.usersList);
      setContainerList(typedResponse.containerList);
    }
  }, [lastJsonMessage]);

  // Maybe need to use this to fetch data and then paint the DOM
  /*  useLayoutEffect(() => {
    const childList = document.getElementById("parent")
      ?.children as HTMLCollection;

    const list: Record<string, TContentContainer | null>[] = [];

    childList &&
      Array.from(childList)
        .filter((child) => child.id.includes("input"))
        .forEach((child) => (list[child.id] = null));

    setContainerList(list);
  }, []); */

  return (
    <CanvasContext.Provider
      value={{
        connectedUsers,
        setConnectedUsers,
        containerList,
        setContainerList,
        me,
        setMe,
        sendJsonMessage,
        lastJsonMessage,
        move,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasContextProvider;
