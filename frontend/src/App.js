import toast, { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import Resources from "./components/resources/Resources";

const notify = () => toast("Here is your toast.");

function App() {
  return (
    <>
      <Toaster />
      <Navbar />
      <Resources />
    </>
  );
}

export default App;
