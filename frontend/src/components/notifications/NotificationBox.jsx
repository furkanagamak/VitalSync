import tmpNotifications from "../../tmp/data/notifications";
import { useState, useEffect } from "react";

import { IoMedkitOutline } from "react-icons/io5";
import { FaRegCircleCheck } from "react-icons/fa6";
import { CiCircleInfo } from "react-icons/ci";
import { FiAlertTriangle } from "react-icons/fi";

import { timeAgo } from "../../utils/helperFunctions";
import { useAuth } from "../../providers/authProvider";
import { useSocketContext } from "../../providers/SocketProvider";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

const NotificationBox = () => {
  const [notifications, setNotifications] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { socket } = useSocketContext();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`/users/${user?.id}/notifications`);
        setNotifications(response.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchNotifications();
    }

    const handleNewNotification = () => {
      if (user?.id) {
        fetchNotifications();
      }
    };

    socket?.on("procedure complete - refresh", handleNewNotification);
    socket?.on("new chat message - refresh", handleNewNotification);
    socket?.on("new process - refresh", handleNewNotification);

    return () => {
      socket?.off("procedure complete - refresh", handleNewNotification);
      socket?.off("new chat message - refresh", handleNewNotification);
      socket?.off("new process - refresh", handleNewNotification);
    };
  }, [user?.id, socket]);

  if (isLoading) return <div>Loading ...</div>;
  return (
    <div className="flex flex-col px-4 space-y-4 mt-4 w-full m-auto">
      <h1 className="text-primary text-3xl font-semibold">My Notifications</h1>
      <section className="flex flex-col p-16 bg-secondary rounded-xl border-black border-4 h-full space-y-8 w-5/6 m-auto">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification, i) => (
            <NotificationBoxItem
              key={notification._id}
              notification={notification}
            />
          ))
        ) : (
          <div className="text-3xl text-center py-8">
            <h2>No notifications to display.</h2>
            <p>Check back later for updates.</p>
          </div>
        )}
      </section>
    </div>
  );
};

const NotificationBoxItem = ({ notification }) => {
  let CurrIcon = null;

  // Determine which icon component to use based on the notification type
  if (notification.type === "action") {
    CurrIcon = <IoMedkitOutline className="text-yellow-500 w-12 h-12" />;
  } else if (notification.type === "check") {
    CurrIcon = <FaRegCircleCheck className="text-green-500 w-12 h-12" />;
  } else if (notification.type === "Chat Message") {
    CurrIcon = <CiCircleInfo className="text-blue-500 w-12 h-12" />;
  } else if (notification.type === "alert") {
    CurrIcon = <FiAlertTriangle className="text-red-500 w-8 h-12" />;
  }

  return (
    <div>
      <div className="bg-primary text-white space-y-4 flex flex-col md:grid grid-cols-10">
        <section className="flex flex-col items-center space-y-8 col-start-1 col-end-3 md:border-r-4 p-4 text-center relative">
          <p className="mr-auto absolute top-2 left-2"></p>
          {CurrIcon}
          <h1 className="text-2xl">{notification.title}</h1>
        </section>
        <section className="col-start-3 col-end-11 p-4 text-xl">
          <p>{notification.text}</p>
        </section>
      </div>
      <p className="flex justify-end text-xl">
        {timeAgo(notification.timeCreated)}
      </p>
    </div>
  );
};

export default NotificationBox;
