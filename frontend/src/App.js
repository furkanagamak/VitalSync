import toast, { Toaster } from "react-hot-toast";
import Navbar from "./components/navbar.jsx";
import Resources from "./components/resources/Resources";
import AdminActions from "./components/AdminActions";
import CreateAccount from "./components/CreateAccount";

const notify = () => toast("Here is your toast.");

function App() {
  return (
    <>
      <Toaster />
      <Navbar />
      <CreateAccount />
    </>
  );
}

export default App;
