import toast, { Toaster } from "react-hot-toast";
import Navbar from "./components/navbar.jsx";
import AssignedProcesses from "./components/mainmenu/AssignedProcesses";

const notify = () => toast("Here is your toast.");

function App() {
  return (
    <>
      <Toaster />
      <Navbar />
      <AssignedProcesses />
    </>
  );
}

export default App;
