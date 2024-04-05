import toast, { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import Login from "./components/Login.js"
import RecoveryPage from "./components/RecoveryPage.js"
import Roster from "./components/Roster.js"
import Profile from "./components/Profile.js"
const notify = () => toast("Here is your toast.");

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/RecoveryPage" element={<RecoveryPage />} />
        <Route path="/Roster" element={
          <>
          <Navbar />
          <Roster />
          </>
        }/>
        <Route path="/Profile" element={
          <>
          <Navbar />
          <Profile />
          </>
        }/>
      </Routes>

    </BrowserRouter>
  );
}

export default App;
