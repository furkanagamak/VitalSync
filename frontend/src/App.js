import toast, { Toaster } from "react-hot-toast";
import Navbar from "./components/navbar.jsx";
import { ProcessManagementContainer } from "./components/processManagement.js";
const notify = () => toast("Here is your toast.");

function App() {
  return (
    <>
      <Toaster />
      <Navbar />
      <ProcessManagementContainer></ProcessManagementContainer>
    </>
  );
}

export default App;
