import toast, { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import Login from "./components/Login.js";
import RecoveryPage from "./components/RecoveryPage.js";
import Roster from "./components/Roster.js";
import Profile from "./components/Profile.js";
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
import Resources from "./components/resources/Resources";
import AssignedProcesses from "./components/mainmenu/AssignedProcesses";
import BoardProcessView from "./components/mainmenu/BoardProcessView";
import ProcessDetails from "./components/ProcessDetails";
import AdminActions from "./components/AdminActions";
import CreateAccount from "./components/CreateAccount";
import ResourceCreate from "./components/resources/ResourceCreate";
import NotificationBox from "./components/notifications/NotificationBox";

import ProcedureTemplateManagement from "./components/processManagement/procedureTemplates.js";
import ProcessTemplateManagementq from "./components/processManagement/processTemplates.js";
import CreateProcedureTemplateForm from "./components/processManagement/createProcedureTemplate.js";
import CreateProcessTemplateForm from "./components/processManagement/createProcessTemplate.js";
import AddSectionForm from "./components/processManagement/createSection.js";
import ModifyProcedureTemplateForm from "./components/processManagement/modifyProcedureTemplate.js";
import ModifyProcessTemplateForm from "./components/processManagement/modifyProcessTemplate.js";
import ModifySectionForm from "./components/processManagement/modifySection.js";
const notify = () => toast("Here is your toast.");

function App() {
  return (
    <>
      <Toaster />
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
                <Resources />
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

          <Route
            path="/modifyProcess/landing"
            element={
              <>
                <Navbar />
                <ModifyProcessLanding />
              </>
            }
          />
          <Route
            path="/modifyProcess/addSection"
            element={
              <>
                <Navbar />
                <ContainedNewSection />
              </>
            }
          />
          <Route
            path="/modifyProcess/addProcedure"
            element={
              <>
                <Navbar />
                <ContainedNewProcedureList />
              </>
            }
          />
          <Route
            path="/modifyProcess/modifyProcedure"
            element={
              <>
                <Navbar />
                <ContainedNewProcedure />
              </>
            }
          />
          <Route
            path="/modifyProcess/staffAssignments"
            element={
              <>
                <Navbar />
                <ModifyStaffAssignments />
              </>
            }
          />
          <Route
            path="/modifyProcess/resourceAssignments"
            element={
              <>
                <Navbar />
                <ModifyResourceAssignments />
              </>
            }
          />
          <Route
            path="/modifyProcess/pendingStaffAssignments"
            element={
              <>
                <Navbar />
                <PendingStaffModify />
              </>
            }
          />
          <Route
            path="/modifyProcess/pendingResourceAssignments"
            element={
              <>
                <Navbar />
                <PendingResourceModify />
              </>
            }
          />
          <Route
            path="/modifyProcess/reviewStaffAssignments"
            element={
              <>
                <Navbar />
                <ReviewStaffAssignments />
              </>
            }
          />
          <Route
            path="/modifyProcess/reviewResourceAssignments"
            element={
              <>
                <Navbar />
                <ReviewResourceAssignments />
              </>
            }
          />
          <Route
            path="/newProcess/processTemplates"
            element={
              <>
                <Navbar />
                <ProcessTable />
              </>
            }
          />
          <Route
            path="/newProcess/patientForm"
            element={
              <>
                <Navbar />
                <PatientInformationForm />
              </>
            }
          />
          <Route
            path="/newProcess/staffAssignments"
            element={
              <>
                <Navbar />
                <CreateStaffAssignments />
              </>
            }
          />
          <Route
            path="/newProcess/resourceAssignments"
            element={
              <>
                <Navbar />
                <CreateResourceAssignments />
              </>
            }
          />
          <Route
            path="/newProcess/pendingStaffAssignments"
            element={
              <>
                <Navbar />
                <PendingNewStaff />
              </>
            }
          />
          <Route
            path="/newProcess/pendingResourceAssignments"
            element={
              <>
                <Navbar />
                <PendingNewResources />
              </>
            }
          />
          <Route
            path="/newProcess/reviewStaffAssignments"
            element={
              <>
                <Navbar />
                <CreateReviewStaffAssignments />
              </>
            }
          />
          <Route
            path="/newProcess/reviewResourceAssignments"
            element={
              <>
                <Navbar />
                <CreateReviewResourceAssignments />
              </>
            }
          />
          <Route
            path="/recordLookup"
            element={
              <>
                <Navbar />
                <CompletedProcessRecords />
              </>
            }
          />
          <Route
            path="/ProcedureTemplateManagement"
            element={
              <>
                <Toaster />
                <Navbar />
                <ProcedureTemplateManagement />
              </>
            }
          />
          <Route
            path="/ProcessTemplateManagement"
            element={
              <>
                <Toaster />
                <Navbar />
                <ProcessTemplateManagementq />
              </>
            }
          />
          <Route
            path="/CreateProcedureTemplateForm"
            element={
              <>
                <Toaster />
                <Navbar />
                <CreateProcedureTemplateForm />
              </>
            }
          />
          <Route
            path="/CreateProcessTemplateForm"
            element={
              <>
                <Toaster />
                <Navbar />
                <CreateProcessTemplateForm />
              </>
            }
          />
          <Route
            path="/AddSectionForm"
            element={
              <>
                <Toaster />
                <Navbar />
                <AddSectionForm />
              </>
            }
          />
          <Route
            path="/ModifyProcedureTemplateForm"
            element={
              <>
                <Toaster />
                <Navbar />
                <ModifyProcedureTemplateForm />
              </>
            }
          />
          <Route
            path="/ModifyProcessTemplateForm"
            element={
              <>
                <Toaster />
                <Navbar />
                <ModifyProcessTemplateForm />
              </>
            }
          />
          <Route
            path="/ModifySectionForm"
            element={
              <>
                <Toaster />
                <Navbar />
                <ModifySectionForm />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
