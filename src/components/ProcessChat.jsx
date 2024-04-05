import tmpMessages from "../tmp/data/messages";
import { useState, useEffect } from "react";

const ProcessChat = ({ id }) => {
  const [messages, setMessages] = useState(null);
  const currUser = "006";

  useEffect(() => {
    const fetchMessages = async () => {
      setMessages(tmpMessages);
    };
    fetchMessages();
  }, []);

  return (
    <div className="flex flex-col h-full w-full p-4 bg-white">
      <div className="overflow-y-auto space-y-2 h-[500px]">
        {messages &&
          messages.map((message, index) => (
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
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-grow p-2 rounded-l-md border border-gray-300 focus:outline-none"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-r-md">
          Send
        </button>
      </div>
    </div>
  );
};

const MessageItem = ({ message, currUser, isSuccessive, isLast }) => {
  const isCurrUser = message.userId === currUser;

  if (isCurrUser)
    return (
      <div className="flex justify-end space-x-4 text-right ml-auto">
        <section>
          {!isSuccessive && <h1 className="text-sm">{message.userName}</h1>}
          <div className="bg-highlightGreen text-white p-2">{message.text}</div>
          {isLast && <div className="">{message.timeCreated}</div>}
        </section>
        <div className="w-10 h-10 mt-2">
          {!isSuccessive && (
            <img src={message.userImage} className="w-10 h-10" />
          )}
        </div>
      </div>
    );
  else
    return (
      <div className="flex space-x-4">
        <div className="w-10 h-10 mt-2">
          {!isSuccessive && (
            <img src={message.userImage} className="w-10 h-10" />
          )}
        </div>
        <section>
          {!isSuccessive && <h1 className="text-sm">{message.userName}</h1>}
          <div className="bg-primary text-white p-2">{message.text}</div>
          {isLast && <div className="">{message.timeCreated}</div>}
        </section>
      </div>
    );
};

export default ProcessChat;
