import toast, { Toaster } from "react-hot-toast";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import Login from "./components/Login.js";
import RecoveryPage from "./components/RecoveryPage.js";
import Roster from "./components/Roster.js";
import Profile from "./components/Profile.js";

//note all "contained" components here will be removed and instead routed to the existing version with small variations
//done through useLocation state to pass in url that page was navigated to from
import ContainedNewSection from "./components/processManagement/containedNewSection.js";
import ContainedProcedureTemplateList from "./components/processManagement/containedProcedureList.js";
import ContainedCreateProcedureTemplateForm from "./components/processManagement/containedNewProcedure.js";
import CreateProcessForm from "./components/processManagement/containedProcessForm.js";
import ContainedProcessModify from "./components/processManagement/containedProcessModify.js";
import ProcessTable from "./components/processManagement/processTable.js";

//Starting new processes
import PatientInformationForm from "./components/processManagement/patientForm.js";
import CreateStaffAssignments from "./components/processManagement/createProcessAssignStaff.js";
import CreateResourceAssignments from "./components/processManagement/createProcessAssignResources.js";
import PendingNewResources from "./components/processManagement/createProcessPendingResources.js";
import PendingNewStaff from "./components/processManagement/createProcessPendingStaff.js";
import CreateReviewStaffAssignments from "./components/processManagement/createProcessReviewStaff.js";
import CreateReviewResourceAssignments from "./components/processManagement/createProcessReviewResources.js";
import ProcessDetailsPreview from "./components/processManagement/previewProcess.js";

//Modifying process instances
import  ActiveProcessesList  from "./components/processManagement/activeProcessesList.js";
import { ModifyProcessLanding } from "./components/processManagement/modifyProcessInstanceLanding.js";
import ModifyStaffAssignments from "./components/processManagement/modifyProcessAssignStaff.js";
import ModifyResourceAssignments from "./components/processManagement/modifyProcessAssignResources.js";
import PendingStaffModify from "./components/processManagement/modifyProcessPendingStaff.js";
import PendingResourceModify from "./components/processManagement/modifyProcessPendingResources.js";
import ReviewStaffAssignments from "./components/processManagement/modifyProcessReviewStaff.js";
import ReviewResourceAssignments from "./components/processManagement/modifyProcessReviewResources.js";

import { ProcessManagementContainer } from "./components/processManagement/processManagement.js";

//Records
import CompletedProcessRecords from "./components/completedProcessRecords.js";
import CompletedProcess from "./components/completedProcess.jsx";

import Resources from "./components/resources/Resources";
import AssignedProcesses from "./components/mainmenu/AssignedProcesses";
import BoardProcessView from "./components/mainmenu/BoardProcessView";
import ProcessDetails from "./components/ProcessDetails";
import AdminActions from "./components/AdminActions";
import CreateAccount from "./components/CreateAccount";
import ResourceCreate from "./components/resources/ResourceCreate";
import NotificationBox from "./components/notifications/NotificationBox";

import ProcedureTemplateManagement from "./components/procedureTemplates.js";
import ProcessTemplateManagement from "./components/processTemplates.js";
import CreateProcedureTemplateForm from "./components/createProcedureTemplate.js";
import CreateProcessTemplateForm from "./components/createProcessTemplate.js";
import AddSectionForm from "./components/createSection.js";
import ModifyProcedureTemplateForm from "./components/processManagement/modifyProcedureTemplate.js";
import ModifyProcessTemplateForm from "./components/modifyProcessTemplate.js";
import ModifySectionForm from "./components/modifySection.js";

import { AuthProvider } from "./providers/authProvider.js";

const notify = () => toast("Here is your toast.");

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
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
              path="/Profile/:id"
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
              path="/processManagement"
              element={<ProcessManagementContainer />}
            >
              <Route
                index
                element={
                  <Navigate replace to="modifyProcess/activeProcesses" />
                }
              />
              <Route path="modifyProcess/landing" element={<ModifyProcessLanding />}/>
              <Route path="modifyProcess/addSection" element={<ContainedNewSection />}/>
              <Route path="modifyProcess/addProcedure" element={<ContainedProcedureTemplateList />}/>
              <Route path="modifyProcess/modifyProcedure" element={<ContainedCreateProcedureTemplateForm />}/>
              <Route  path="modifyProcess/staffAssignments" element={<ModifyStaffAssignments />} />
              <Route path="modifyProcess/resourceAssignments"  element={<ModifyResourceAssignments />} />
              <Route path="modifyProcess/pendingStaffAssignments" element={<PendingStaffModify />} />
              <Route path="modifyProcess/pendingResourceAssignments" element={<PendingResourceModify />} />
              <Route path="modifyProcess/reviewStaffAssignments" element={<ReviewStaffAssignments />}/>
              <Route path="modifyProcess/reviewResourceAssignments" element={<ReviewResourceAssignments />}/>
              <Route path="modifyProcess/activeProcesses" element={<ActiveProcessesList />}/>
              <Route path="newProcess/processTemplates" element={<ProcessTable />}/>
              <Route path="newProcess/processTemplateForm" element={<CreateProcessForm />} />
              <Route path="newProcess/processTemplateModifyForm" element={<ContainedProcessModify />}/>
              <Route path="newProcess/addSection" element={<ContainedNewSection />} />
              <Route path="newProcess/patientForm" element={<PatientInformationForm />}/>
              <Route path="newProcess/staffAssignments" element={<CreateStaffAssignments />}/>
              <Route path="newProcess/resourceAssignments" element={<CreateResourceAssignments />}/>
              <Route path="newProcess/pendingStaffAssignments" element={<PendingNewStaff />}/>
              <Route path="newProcess/pendingResourceAssignments" element={<PendingNewResources />}/>
              <Route path="newProcess/reviewStaffAssignments" element={<CreateReviewStaffAssignments />}/>
              <Route path="newProcess/reviewResourceAssignments" element={<CreateReviewResourceAssignments />}/>
              <Route path="newProcess/preview" element={<ProcessDetailsPreview />}/>
            </Route>



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
              path="/recordProcess"
              element={
                <>
                  <Navbar />
                  <CompletedProcess />
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
                  <ProcessTemplateManagement />
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
              path="/ModifyProcedureTemplateForm/:templateId"
              element={
                <>
                  <Toaster />
                  <Navbar />
                  <ModifyProcedureTemplateForm />
                </>
              }
            />
            <Route
              path="/ModifyProcessTemplateForm/:id"
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
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
