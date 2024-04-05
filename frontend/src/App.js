import toast, { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import Resources from "./components/resources/Resources";

import Login from "./components/Login.js";
import RecoveryPage from "./components/RecoveryPage.js";
import Roster from "./components/Roster.js";
import Profile from "./components/Profile.js";
import ResourceView from "./components/resources/ResourceView";
import AssignedProcesses from "./components/mainmenu/AssignedProcesses";
import BoardProcessView from "./components/mainmenu/BoardProcessView";
import ProcessDetails from "./components/ProcessDetails";
import AdminActions from "./components/AdminActions";
import CreateAccount from "./components/CreateAccount";
import ResourceEdit from "./components/resources/ResourceEdit";
import ResourceCreate from "./components/resources/ResourceCreate";
import NotificationBox from "./components/notifications/NotificationBox";

const notify = () => toast("Here is your toast.");

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/RecoveryPage" element={<RecoveryPage />} />
        <Route
          path="/Roster"
          element={
            <>
              <Navbar />
              <Roster />
            </>
          }
        />
        <Route
          path="/Profile"
          element={
            <>
              <Navbar />
              <Profile />
            </>
          }
        />
      </Routes>
      <Routes>
        <Route
          path="/home"
          element={
            <>
              <Navbar />
              <AssignedProcesses />
            </>
          }
        />
        <Route
          path="/adminActions"
          element={
            <>
              <Navbar />
              <AdminActions />
            </>
          }
        />
        <Route
          path="/createAccount"
          element={
            <>
              <Navbar />
              <CreateAccount />
            </>
          }
        />
        <Route
          path="/resources"
          element={
            <>
              <Navbar />
              <ResourceView />
            </>
          }
        />
        <Route
          path="/resources/create"
          element={
            <>
              <Navbar />
              <ResourceCreate />
            </>
          }
        />
        <Route
          path="/notifications"
          element={
            <>
              <Navbar />
              <NotificationBox />
            </>
          }
        />
        <Route
          path="/boardProcess"
          element={
            <>
              <Navbar />
              <BoardProcessView />
            </>
          }
        />
        <Route
          path="/processDetails"
          element={
            <>
              <Navbar />
              <ProcessDetails />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
