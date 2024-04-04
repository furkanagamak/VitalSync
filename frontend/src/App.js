import toast, { Toaster } from "react-hot-toast";
import Navbar from "./components/navbar.jsx";
import BoardProcessView from "./components/mainmenu/BoardProcessView";

const notify = () => toast("Here is your toast.");

function App() {
  return (
    <>
      <Toaster />
      <Navbar />
      <BoardProcessView />
    </>
  );
}

export default App;
