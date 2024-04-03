import tmpNotifications from "../../tmp/data/notifications";
import { useState, useEffect } from "react";

import { IoMedkitOutline } from "react-icons/io5";
import { FaRegCircleCheck } from "react-icons/fa6";
import { CiCircleInfo } from "react-icons/ci";
import { FiAlertTriangle } from "react-icons/fi";

import { timeAgo } from "../../utils/helperFunctions";

const NotificationBox = () => {
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setNotifications(tmpNotifications);
    };
    fetchNotifications();
  }, []);

  if (!notifications) return <div>Loading ...</div>;
  return (
    <div className="flex flex-col px-4 space-y-4 mt-4 w-full m-auto">
      <h1 className="text-primary text-3xl font-semibold">My Notifications</h1>
      <section className="flex flex-col p-16 bg-secondary rounded-xl border-black border-4 h-full space-y-8 w-5/6 m-auto">
        {notifications.map((notification, i) => {
          return <NotificationBoxItem notification={notification} />;
        })}
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
  } else if (notification.type === "info") {
    CurrIcon = <CiCircleInfo className="text-blue-500 w-12 h-12" />;
  } else if (notification.type === "alert") {
    CurrIcon = <FiAlertTriangle className="text-red-500 w-8 h-12" />;
  }

  return (
    <div>
      <div className="bg-primary text-white space-y-4 grid grid-cols-10">
        <section className="flex flex-col items-center space-y-8 col-start-1 col-end-3 border-r-4 p-4 text-center relative">
          <p className="mr-auto absolute top-2 left-2">X</p>
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
