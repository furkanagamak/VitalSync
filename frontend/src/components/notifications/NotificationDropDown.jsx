import tmpNotifications from "../../tmp/data/notifications";
import { useState, useEffect } from "react";

import { IoMedkitOutline } from "react-icons/io5";
import { FaRegCircleCheck } from "react-icons/fa6";
import { CiCircleInfo } from "react-icons/ci";
import { FiAlertTriangle } from "react-icons/fi";
import { HiOutlineDotsVertical } from "react-icons/hi";

import { timeAgo } from "../../utils/helperFunctions";
import { Link } from "react-router-dom";
import { useAuth } from "../../providers/authProvider";
import { useSocketContext } from "../../providers/SocketProvider";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

const NotificationDropDown = ({ navToNotificationBox, closeDropDown }) => {
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
    <div className="w-[450px] h-[600px] bg-secondary p-4 flex flex-col space-y-4 overflow-auto">
      {notifications && notifications.length > 0 ? (
        notifications.map((notification, i) => {
          if (i <= 3)
            return (
              <NotificationDDItem
                key={notification._id}
                notification={notification}
              />
            );
          else return null;
        })
      ) : (
        <div className="text-2xl text-center my-20 text-black">
          No new notifications.
        </div>
      )}
      <Link
        to="/notifications"
        className="flex justify-center text-black"
        id="notificationsBoxBtn"
        onClick={closeDropDown}
      >
        <HiOutlineDotsVertical className="h-8 w-8" />
      </Link>
    </div>
  );
};

const NotificationDDItem = ({ notification }) => {
  let CurrIcon = null;

  // Determine which icon component to use based on the notification type
  if (notification.type === "action") {
    CurrIcon = <IoMedkitOutline className="text-yellow-500 w-8 h-8 m-auto" />;
  } else if (notification.type === "check") {
    CurrIcon = <FaRegCircleCheck className="text-green-500 w-8 h-8 m-auto" />;
  } else if (notification.type === "Chat Message") {
    CurrIcon = <CiCircleInfo className="text-blue-500 w-8 h-8 m-auto" />;
  } else if (notification.type === "alert") {
    CurrIcon = <FiAlertTriangle className="text-red-500 w-8 h-8 m-auto" />;
  }
  const firstSentence = notification.text.split(".")[0];
  const processId = notification.processID;

  return (
    <Link to={`/processDetails/${processId}`} className="no-underline">
      <div className="bg-primary text-white p-4 space-y-4">
        <section className="grid grid-cols-5">
          {CurrIcon}
          <h1 className="col-start-2 col-end-5 mx-auto text-xl">
            {notification.title}
          </h1>
        </section>
        <section>
          <p>{firstSentence + "."}</p>
        </section>
        <p className="flex justify-end">{timeAgo(notification.timeCreated)}</p>
      </div>
    </Link>
  );
};

export default NotificationDropDown;
