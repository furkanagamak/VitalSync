import toast, { Toaster } from "react-hot-toast";
import Navbar from "./components/navbar.jsx";
import ProcedureTemplateManagement from "./components/procedureTemplates.js";
import CreateProcedureTemplateForm from "./components/createProcedureTemplate.js";
import ModifyProcedureTemplateForm from "./components/modifyProcedureTemplate.js";
import ProcessTemplateManagement from "./components/processTemplates.js";
import CreateProcessTemplateForm from "./components/createProcessTemplate.js";
import ModifyProcessTemplateForm from "./components/modifyProcessTemplate.js";
import AddSectionForm from "./components/createSection.js";
import ModifySectionForm from "./components/modifySection.js";
const notify = () => toast("Here is your toast.");

function App() {
  return (
    <>
      <Toaster />
      <Navbar />
      <ProcessTemplateManagement />
    </>
  );
}

export default App;
