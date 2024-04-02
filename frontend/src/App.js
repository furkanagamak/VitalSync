import toast, { Toaster } from "react-hot-toast";
import Navbar from "./components/navbar.jsx";
import ProcedureTemplateManagement from "./procedureTemplates.js";
import CreateProcedureTemplateForm from "./createProcedureTemplate.js";
import ModifyProcedureTemplateForm from "./modifyProcedureTemplate.js";
const notify = () => toast("Here is your toast.");

function App() {
  return (
    <>
      <Toaster />
      <Navbar />
      <ModifyProcedureTemplateForm />
    </>
  );
}

export default App;
