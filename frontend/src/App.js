import toast, { Toaster } from "react-hot-toast";
import Navbar from "./components/navbar.jsx";
import ProcedureTemplateManagement from "./procedureTemplates.js";
import CreateProcedureTemplateForm from "./createProcedureTemplate.js";
import ModifyProcedureTemplateForm from "./modifyProcedureTemplate.js";
import ProcessTemplateManagement from "./processTemplates.js";
import CreateProcessTemplateForm from "./createProcessTemplate.js";
import ModifyProcessTemplateForm from "./modifyProcessTemplate.js";
import AddSectionForm from "./addSection.js";
import ModifySectionForm from "./modifySection.js";
const notify = () => toast("Here is your toast.");

function App() {
  return (
    <>
      <Toaster />
      <Navbar />
      <ModifySectionForm />
    </>
  );
}

export default App;
