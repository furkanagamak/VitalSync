import { CiBellOn } from "react-icons/ci";

const Navbar = () => {
  return (
    <nav className="h-20 bg-primary flex text-white">
      <Header />
      <Tabs />
      <UserNav />
      <Notifications />
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
  return (
    <div className="border-x-2 border-white text-2xl flex text-center">
      <section className="border-r-2 px-8 flex pb-2">
        <p className="my-auto ">Roster</p>
      </section>
      <section className="px-8 flex pb-2">
        <p className="my-auto ">Admin Actions</p>
      </section>
    </div>
  );
};

const UserNav = () => {
  return (
    <div className="ml-auto flex space-x-4 items-center mx-2">
      <p className="text-2xl">John Smith</p>
      <img src="/logo512.png" className="h-12 w-12" />
    </div>
  );
};

const Notifications = () => {
  return (
    <div className="flex items-center ml-2 mr-4">
      <CiBellOn className="h-12 w-12 text-black bg-white rounded-full" />
    </div>
  );
};

export default Navbar;
