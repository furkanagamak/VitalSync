import toast, { Toaster } from "react-hot-toast";
import Navbar from "./components/navbar.jsx";
import ProcessDetails from "./components/ProcessDetails";

const notify = () => toast("Here is your toast.");

function App() {
  return (
    <>
      <Toaster />
      <Navbar />
      <ProcessDetails />
    </>
  );
}

export default App;
