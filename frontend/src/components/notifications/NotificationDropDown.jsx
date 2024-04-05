import tmpNotifications from "../../tmp/data/notifications";
import { useState, useEffect } from "react";

import { IoMedkitOutline } from "react-icons/io5";
import { FaRegCircleCheck } from "react-icons/fa6";
import { CiCircleInfo } from "react-icons/ci";
import { FiAlertTriangle } from "react-icons/fi";
import { HiOutlineDotsVertical } from "react-icons/hi";

import { timeAgo } from "../../utils/helperFunctions";
import { Link } from "react-router-dom";

const NotificationDropDown = ({ navToNotificationBox, closeDropDown }) => {
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setNotifications(tmpNotifications);
    };
    fetchNotifications();
  }, []);

  if (!notifications) return <div>Loading ...</div>;
  return (
    <div className="w-[450px] h-[600px] bg-secondary p-4 flex flex-col space-y-4 overflow-auto">
      {notifications.map((notification, i) => {
        if (i <= 3) return <NotificationDDItem notification={notification} />;
        else return <></>;
      })}
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
  } else if (notification.type === "info") {
    CurrIcon = <CiCircleInfo className="text-blue-500 w-8 h-8 m-auto" />;
  } else if (notification.type === "alert") {
    CurrIcon = <FiAlertTriangle className="text-red-500 w-8 h-8 m-auto" />;
  }
  const firstSentence = notification.text.split(".")[0];

  return (
    <div className="bg-primary text-white p-4 space-y-4">
      <section className="grid grid-cols-5">
        {CurrIcon}
        <h1 className="col-start-2 col-end-5 mx-auto text-xl">
          {notification.title}
        </h1>
        <p className="ml-auto">X</p>
      </section>
      <section>
        <p>{firstSentence}</p>
      </section>
      <p className="flex justify-end">{timeAgo(notification.timeCreated)}</p>
    </div>
  );
};

export default NotificationDropDown;
