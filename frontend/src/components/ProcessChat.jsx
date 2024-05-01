import tmpMessages from "../tmp/data/messages";
import { useState, useEffect, useRef } from "react";
import { useSocketContext } from "../providers/SocketProvider";
import { useAuth } from "../providers/authProvider.js";
import { UTCToEastern } from "../utils/helperFunctions.js";
import toast from "react-hot-toast";

const ProcessChat = ({ id }) => {
  const [messages, setMessages] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [refreshTick, setRefreshTick] = useState(false);
  const [processCompleted, setProcessCompleted] = useState(null);
  const messagesContainerRef = useRef(null);
  const { socket } = useSocketContext();
  const { user } = useAuth();

  const triggerRefresh = () => {
    setRefreshTick((refreshTick) => !refreshTick);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const trimmedMsg = messageInput.trim();
    if (trimmedMsg === "") return;
    socket.emit("chatMessage", user.id, trimmedMsg, id);
    setMessageInput("");
  };

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // check if process is completed
  useEffect(() => {
    const fetchCheckCompletedProcess = async () => {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/processCompleted/${id}`
      );
      if (res.ok) {
        setProcessCompleted(await res.json());
      } else {
        toast.error(await res.text());
      }
    };
    fetchCheckCompletedProcess();

    socket.on("procedure complete - refresh", () => {
      fetchCheckCompletedProcess();
    });
  }, []);

  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/chatMessages/${id}`,
          {
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();
          const convertMessageDate = data.map((message) => {
            return {
              ...message,
              timeCreated: UTCToEastern(message.timeCreated),
            };
          });
          // convert time zone
          setMessages(convertMessageDate);
        } else {
          toast.error("Was not able to load messages ...");
          console.log(await res.text());
        }
      } catch (error) {
        console.error("Failed to fetch process details:", error);
      }
    };
    fetchMessages();
  }, [refreshTick]);

  // socket events
  useEffect(() => {
    if (!socket) return;
    socket.on("new chat message - refresh", () => {
      triggerRefresh();
    });
  }, [socket]);

  if (!user || !socket || !messages) return <div>Loading ...</div>;

  const currUser = user.id;
  return (
    <div className="flex flex-col h-full w-full p-4 bg-white">
      <div
        className="overflow-y-auto space-y-2 h-[500px] p-4"
        ref={messagesContainerRef}
      >
        <h1 className="flex justify-center items-center bg-primary p-4 text-white font-bold text-xl">
          This is the start of the chat
        </h1>
        {messages.length === 0 ? (
          <div className="h-[300px] flex justify-center items-center">
            There are no chat yet ...
          </div>
        ) : (
          <></>
        )}
        {messages.map((message, index) => (
          <MessageItem
            key={index}
            message={message}
            currUser={currUser}
            isSuccessive={
              index === 0
                ? false
                : messages[index - 1].userId === message.userId
            }
            isLast={
              index === messages.length - 1
                ? true
                : message.userId !== messages[index + 1].userId
            }
          />
        ))}
      </div>
      {!processCompleted && (
        <form className="flex items-center" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow p-2 rounded-l-md border border-gray-300 focus:outline-none"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
            type="submit"
          >
            Send
          </button>
        </form>
      )}
      {processCompleted && (
        <div className="text-center">This process is completed</div>
      )}
    </div>
  );
};

const MessageItem = ({ message, currUser, isSuccessive, isLast }) => {
  const isCurrUser = message.userId === currUser;
  const profileImg = message.userImage ? message.userImage : "/profileicon.png";
  if (isCurrUser)
    return (
      <div className="flex justify-end space-x-4 text-right ml-auto">
        <section>
          {!isSuccessive && <h1 className="text-sm">{message.userName}</h1>}
          <div className="text-white p-2 bg-highlightGreen w-fit ml-auto rounded">
            {message.text}
          </div>
          {isLast && <div className="">{message.timeCreated}</div>}
        </section>
        <div className="w-10 h-10 mt-2">
          {!isSuccessive && <img src={profileImg} className="w-10 h-10" />}
        </div>
      </div>
    );
  else
    return (
      <div className="flex space-x-4">
        <div className="w-10 h-10 mt-2">
          {!isSuccessive && <img src={profileImg} className="w-10 h-10" />}
        </div>
        <section>
          {!isSuccessive && <h1 className="text-sm">{message.userName}</h1>}
          <div className="bg-primary text-white p-2 w-fit mr-auto rounded">
            {message.text}
          </div>
          {isLast && <div className="">{message.timeCreated}</div>}
        </section>
      </div>
    );
};

export default ProcessChat;
