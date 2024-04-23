import { CiBellOn } from "react-icons/ci";
import { useState, useEffect } from "react";
import { IoMenu } from "react-icons/io5";
import NotificationDropDown from "./notifications/NotificationDropDown";
import { useNavigate } from "react-router-dom";
import { TbLogout } from "react-icons/tb";
import { useAuth } from "../providers/authProvider.js";
import { useSocketContext } from "../providers/SocketProvider.js";

const Navbar = () => {
  const { user, fetchImg } = useAuth();
  const socket = useSocketContext();

  if (!user) return "error loading user!";
  return (
    <nav className="h-20 bg-primary flex text-white">
      <Header />
      <Tabs userType={user.accountType} />
      <UserNav
        id={user.id}
        firstName={user.firstName}
        lastName={user.lastName}
        profileUrl={user.profileUrl}
        fetchImg={fetchImg}
      />
      <Notifications />
      <LogoutButton />
      <Menu userType={user.accountType} />
    </nav>
  );
};

const Header = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/home");
  };

  return (
    <div
      id="navHeader"
      className="w-32 flex justify-evenly items-center font-semibold text-2xl mx-2 cursor-pointer"
      onClick={handleNavigate}
    >
      <img src="/logo.png" className="w-12 h-12" alt="logo" />
      <div>
        <h1 className="mr-2">Vital</h1>
        <h1 className="ml-2">Sync</h1>
      </div>
    </div>
  );
};

const Tabs = ({ userType }) => {
  const navigate = useNavigate();
  const navigateToRoster = () => navigate("/Roster");
  const navigateToAdminActions = () => navigate("/adminActions");
  return (
    <div className="border-x-2 border-white text-2xl hidden md:flex text-center">
      <section className="border-r-2 px-8 flex pb-2">
        <button className="my-auto" onClick={navigateToRoster}>
          Roster
        </button>
      </section>
      {userType === "admin" && (
        <section className="px-8 flex pb-2">
          <button onClick={navigateToAdminActions} className="my-auto">
            Admin Actions
          </button>
        </section>
      )}
    </div>
  );
};

const UserNav = ({ id, firstName, lastName, profileUrl, fetchImg }) => {
  const [url, setUrl] = useState("/profileicon.png");
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/Profile/${id}`);
  };

  useEffect(() => {
    const fetchUserImg = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/user/profilePicture/url/${id}`
        );

        const txt = await res.text();
        if (res.ok) {
          if (txt !== "") setUrl(txt);
        } else {
          console.log("server responded with error text ", txt);
        }
      } catch (e) {
        console.log("fetch profile image fail");
      }
    };

    fetchUserImg();
  }, [profileUrl, id, fetchImg]);

  return (
    <div
      title="Click on this button to view your profile."
      className="ml-auto space-x-4 flex items-center mx-2 cursor-pointer"
      onClick={handleNavigate}
      id="userNav"
    >
      <p className="text-2xl hidden md:block">{`${firstName} ${lastName}`}</p>
      <div className="h-12 w-12 overflow-hidden rounded-full">
        <img src={url} alt="Profile" className="h-full w-full object-cover" />
      </div>
    </div>
  );
};

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const flickDropDown = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <>
      <button
        title="Click on this button to view notifications."
        id="notificationsBtn"
        className="flex items-center ml-2 mr-4"
        onClick={flickDropDown}
      >
        <CiBellOn className="h-12 w-12 text-black bg-white rounded-full" />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-20 z-10">
          <NotificationDropDown closeDropDown={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
};

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  return (
    <button
      title="Click on this button to logout."
      id="logoutbtn"
      onClick={handleLogout}
      className="flex items-center ml-0 mr-4"
    >
      <TbLogout className="h-12 w-12 text-black bg-white rounded-full p-1.5" />
    </button>
  );
};

const Menu = ({ userType }) => {
  const [isOpen, setIsOpen] = useState(false);

  const triggerIsOpen = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const navigate = useNavigate();
  const navigateToRoster = () => navigate("/Roster");
  const navigateToAdminActions = () => navigate("/adminActions");

  return (
    <>
      <button className="md:hidden mr-2" onClick={triggerIsOpen}>
        <IoMenu className="w-12 h-12 text-white" />
      </button>
      {isOpen && (
        <div className="md:hidden absolute right-0 top-20 bg-primary text-2xl text-center z-10 flex flex-col">
          <button onClick={navigateToRoster} className="border-b-2 p-2">
            Roster
          </button>
          {userType === "admin" && (
            <button onClick={navigateToAdminActions} className="border-b-2 p-2">
              Admin Actions
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
