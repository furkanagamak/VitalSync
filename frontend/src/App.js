import toast, { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import Login from "./components/Login.js"
import RecoveryPage from "./components/RecoveryPage.js"
import Roster from "./components/Roster.js"
import Profile from "./components/Profile.js"
import { ActiveProcessesList } from "./components/processManagement/activeProcessesList.js";
import { ModifyProcessLanding } from "./components/processManagement/modifyProcessLanding.js";
import ContainedNewSection from "./components/processManagement/containedNewSection.js";
import ContainedNewProcedureList from "./components/processManagement/containedProcedureList.js";
import ContainedNewProcedure from "./components/processManagement/containedNewProcedure.js";
import ModifyStaffAssignments from "./components/processManagement/modifyStaffAssignments.js";
import ModifyResourceAssignments from "./components/processManagement/modifyResourceAssignments.js";
import PendingStaffModify from "./components/processManagement/pendingStaffModify.js";
import PendingResourceModify from "./components/processManagement/pendingResourceModify.js";
import ProcessTable from "./components/processManagement/processTable.js";
import PatientInformationForm from "./components/processManagement/patientForm.js";
import CreateStaffAssignments from "./components/processManagement/createStaffAssign.js";
import CreateResourceAssignments from "./components/processManagement/createResourceAssign.js";
import PendingNewResources from "./components/processManagement/pendingNewResources.js";
import PendingNewStaff from "./components/processManagement/pendingNewStaff.js";
import CreateReviewStaffAssignments from "./components/processManagement/createReviewStaff.js";
import CreateReviewResourceAssignments from "./components/processManagement/createReviewResources.js";
import CompletedProcessRecords from "./components/completedProcessRecords.js";
import ReviewStaffAssignments from "./components/processManagement/reviewStaffAssignments.js";
import ReviewResourceAssignments from "./components/processManagement/reviewResourceAssignments.js";

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


        <Route path="/modifyProcess/landing" element={
          <>
          <Navbar />
          <ModifyProcessLanding />
          </>
        }/>
        <Route path="/modifyProcess/addSection" element={
          <>
          <Navbar />
          <ContainedNewSection />
          </>
        }/>
        <Route path="/modifyProcess/addProcedure" element={
          <>
          <Navbar />
          <ContainedNewProcedureList/>
          </>
        }/>
        <Route path="/modifyProcess/modifyProcedure" element={
          <>
          <Navbar />
          <ContainedNewProcedure />
          </>
        }/>
        <Route path="/modifyProcess/staffAssignments" element={
          <>
          <Navbar />
          <ModifyStaffAssignments />
          </>
        }/>
        <Route path="/modifyProcess/resourceAssignments" element={
          <>
          <Navbar />
          < ModifyResourceAssignments />
          </>
        }/>
        <Route path="/modifyProcess/pendingStaffAssignments" element={
          <>
          <Navbar />
          < PendingStaffModify />
          </>
        }/>
        <Route path="/modifyProcess/pendingResourceAssignments" element={
          <>
          <Navbar />
          < PendingResourceModify />
          </>
        }/>
        <Route path="/modifyProcess/reviewStaffAssignments" element={
          <>
          <Navbar />
          <ReviewStaffAssignments />
          </>
        }/>
        <Route path="/modifyProcess/reviewResourceAssignments" element={
          <>
          <Navbar />
          <ReviewResourceAssignments />
          </>
        }/>
        <Route path="/newProcess/processTemplates" element={
          <>
          <Navbar />
          <ProcessTable/>
          </>
        }/>
        <Route path="/newProcess/patientForm" element={
          <>
          <Navbar />
          <PatientInformationForm />
          </>
        }/>
        <Route path="/newProcess/staffAssignments" element={
          <>
          <Navbar />
          <CreateStaffAssignments />
          </>
        }/>
        <Route path="/newProcess/resourceAssignments" element={
          <>
          <Navbar />
          <CreateResourceAssignments />
          </>
        }/>
        <Route path="/newProcess/pendingStaffAssignments" element={
          <>
          <Navbar />
          <PendingNewStaff />
          </>
        }/>
        <Route path="/newProcess/pendingResourceAssignments" element={
          <>
          <Navbar />
          <PendingNewResources />
          </>
        }/>
        <Route path="/newProcess/reviewStaffAssignments" element={
          <>
          <Navbar />
          <CreateReviewStaffAssignments />
          </>
        }/>
        <Route path="/newProcess/reviewResourceAssignments" element={
          <>
          <Navbar />
          <CreateReviewResourceAssignments />
          </>
        }/>
        <Route path="/recordLookup" element={
          <>
          <Navbar />
          <CompletedProcessRecords />
          </>
        }/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
