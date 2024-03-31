import toast, { Toaster } from "react-hot-toast";
import Navbar from "./components/navbar.jsx";
const notify = () => toast("Here is your toast.");

function App() {
  return (
    <>
      <Toaster />
      <Navbar />
    </>
  );
}

export default App;
