import toast, { Toaster } from "react-hot-toast";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import Login from "./components/Login.js";
import RecoveryPage from "./components/RecoveryPage.js";
import Roster from "./components/Roster.js";
import Profile from "./components/Profile.js";

//Starting new processes
import PatientInformationForm from "./components/processManagement/patientForm.js";
import PendingNewResources from "./components/processManagement/createProcessPendingResources.js";
import PendingNewStaff from "./components/processManagement/createProcessPendingStaff.js";
import CreateReviewStaffAssignments from "./components/processManagement/createProcessReviewStaff.js";
import CreateReviewResourceAssignments from "./components/processManagement/createProcessReviewResources.js";
import ProcessDetailsPreview from "./components/processManagement/previewProcess.js";
import ProcessStartTime from "./components/processManagement/processStartTime.js";

//Modifying process instances
import ActiveProcessesList from "./components/processManagement/activeProcessesList.js";
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
import NotFoundPage from "./components/NotFoundPage.js";

import { AuthProvider } from "./providers/authProvider.js";
import { SocketContextProvider } from "./providers/SocketProvider";
import { ProcessCreationProvider } from "./providers/ProcessCreationProvider";
import { ProcessModificationProvider } from "./providers/ProcessModificationProvider";
import NotFoundPageLogin from "./components/NotFoundPageLogin.js";

const notify = () => toast("Here is your toast.");

const NavbarLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <>
      <Toaster />
      <SocketContextProvider>
        <BrowserRouter>
          <AuthProvider>
            <ProcessCreationProvider>
              <ProcessModificationProvider>
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/RecoveryPage" element={<RecoveryPage />} />
                  <Route path="*" element={<NotFoundPageLogin />} />

                  <Route element={<NavbarLayout />}>
                    <Route path="/Roster" element={<Roster />} />
                    <Route path="/Profile/:id" element={<Profile />} />
                    <Route path="/home" element={<AssignedProcesses />} />
                    <Route path="/adminActions" element={<AdminActions />} />
                    <Route path="/createAccount" element={<CreateAccount />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route
                      path="/resources/create"
                      element={<ResourceCreate />}
                    />
                    <Route
                      path="/notifications"
                      element={<NotificationBox />}
                    />
                    <Route
                      path="/boardProcess/:id"
                      element={<BoardProcessView />}
                    />
                    <Route
                      path="/processDetails/:id"
                      element={<ProcessDetails />}
                    />

                    <Route
                      path="/processManagement"
                      element={<ProcessManagementContainer />}
                    >
                      <Route
                        index
                        element={
                          <Navigate
                            replace
                            to="modifyProcess/activeProcesses"
                          />
                        }
                      />
                      <Route
                        path="modifyProcess/landing/:processID"
                        element={<ModifyProcessLanding />}
                      />
                      <Route
                        path="modifyProcess/patientForm"
                        element={<PatientInformationForm />}
                      />
                      <Route
                        path="modifyProcess/staffAssignments"
                        element={<ModifyStaffAssignments />}
                      />
                      <Route
                        path="modifyProcess/resourceAssignments"
                        element={<ModifyResourceAssignments />}
                      />
                      <Route
                        path="modifyProcess/pendingStaffAssignments"
                        element={<PendingStaffModify />}
                      />
                      <Route
                        path="modifyProcess/pendingResourceAssignments"
                        element={<PendingResourceModify />}
                      />
                      <Route
                        path="modifyProcess/reviewStaffAssignments"
                        element={<ReviewStaffAssignments />}
                      />
                      <Route
                        path="modifyProcess/reviewResourceAssignments"
                        element={<ReviewResourceAssignments />}
                      />
                      <Route
                        path="modifyProcess/activeProcesses"
                        element={<ActiveProcessesList />}
                      />

                      <Route
                        path="newProcess/processTemplates"
                        element={<ProcessTemplateManagement />}
                      />
                      <Route
                        path="newProcess/patientForm"
                        element={<PatientInformationForm />}
                      />
                      <Route
                        path="newProcess/startTime"
                        element={<ProcessStartTime />}
                      />
                      <Route
                        path="newProcess/pendingStaffAssignments"
                        element={<PendingNewStaff />}
                      />
                      <Route
                        path="newProcess/pendingResourceAssignments"
                        element={<PendingNewResources />}
                      />
                      <Route
                        path="newProcess/reviewStaffAssignments"
                        element={<CreateReviewStaffAssignments />}
                      />
                      <Route
                        path="newProcess/reviewResourceAssignments"
                        element={<CreateReviewResourceAssignments />}
                      />
                      <Route
                        path="newProcess/preview"
                        element={<ProcessDetailsPreview />}
                      />
                    </Route>

                    <Route
                      path="/recordLookup"
                      element={<CompletedProcessRecords />}
                    />

                    <Route
                      path="/recordProcess"
                      element={<CompletedProcess />}
                    />

                    <Route
                      path="/ProcedureTemplateManagement"
                      element={<ProcedureTemplateManagement />}
                    />
                    <Route
                      path="/ProcessTemplateManagement"
                      element={<ProcessTemplateManagement />}
                    />
                    <Route
                      path="/CreateProcedureTemplateForm"
                      element={<CreateProcedureTemplateForm />}
                    />
                    <Route
                      path="/CreateProcessTemplateForm"
                      element={<CreateProcessTemplateForm />}
                    />
                    <Route
                      path="/AddSectionForm"
                      element={<AddSectionForm />}
                    />
                    <Route
                      path="/ModifyProcedureTemplateForm/:templateId"
                      element={<ModifyProcedureTemplateForm />}
                    />
                    <Route
                      path="/ModifyProcessTemplateForm/:id"
                      element={<ModifyProcessTemplateForm />}
                    />
                    <Route
                      path="/ModifySectionForm"
                      element={<ModifySectionForm />}
                    />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </ProcessModificationProvider>
            </ProcessCreationProvider>
          </AuthProvider>
        </BrowserRouter>
      </SocketContextProvider>
    </>
  );
}

export default App;
