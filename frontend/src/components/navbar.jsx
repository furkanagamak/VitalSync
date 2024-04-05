import { CiBellOn } from "react-icons/ci";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";
import NotificationDropDown from "./notifications/NotificationDropDown";

const Navbar = () => {
  return (
    <nav className="h-20 bg-primary flex text-white">
      <Header />
      <Tabs />
      <UserNav />
      <Notifications />
      <Menu />
    </nav>
  );
};

const Header = () => {
  return (
    <div className="w-32 flex justify-evenly items-center font-semibold text-2xl mx-2">
      <img src="/logo.png" className="w-12 h-12" alt="logo" />
      <div className="">
        <h1 className="mr-2">Vital</h1>
        <h1 className="ml-2">Sync</h1>
      </div>
    </div>
  );
};

const Tabs = () => {
  const navigate = useNavigate(); 
  const navigateToRoster = () => navigate('/Roster');
  return (
    <div className="hidden md:flex border-x-2 border-white text-2xl flex text-center">
      <section className="border-r-2 px-8 flex pb-2">
        <p className="my-auto ">Roster</p>
      </section>
      <section className="px-8 flex pb-2">
        <p className="my-auto">Admin Actions</p>
      </section>
    </div>
  );
};

const UserNav = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/Profile');
  };

  return (
    <div className="ml-auto flex space-x-4 items-center mx-2">
      <p className="hidden md:block text-2xl">John Smith</p>
      <img src="/logo512.png" className="h-12 w-12" />
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
      <button className="flex items-center ml-2 mr-4" onClick={flickDropDown}>
        <CiBellOn className="h-12 w-12 text-black bg-white rounded-full" />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-20">
          <NotificationDropDown />
        </div>
      )}
    </>
  );
};

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const triggerIsOpen = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <>
      <button className="md:hidden mr-2" onClick={triggerIsOpen}>
        <IoMenu className="w-12 h-12 text-white" />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-20 bg-primary text-2xl text-center z-10">
          <div className="border-b-2 p-2">Roster</div>
          <div className="border-b-2 p-2">Admin Actions</div>
        </div>
      )}
    </>
  );
};

export default Navbar;
