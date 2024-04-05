import { Link } from "react-router-dom";

const AdminActions = () => {
  return (
    <div>
      <section className="text-center mt-8 mb-16">
        <h1 className="text-3xl underline underline-offset-8">
          Admin Management
        </h1>
      </section>
      <section className="text-xl font-semibold space-y-8 my-8">
        <section className="grid grid-cols-3">
          <Link
            id="processTemplates"
            to="/ProcessTemplateManagement"
            className="flex flex-col justify-center items-center"
          >
            <img src="/svg/processTemplates.svg" alt="logo" />
            <h1>Process</h1>
            <h1>Templates</h1>
          </Link>
          <Link
            id="procedureTemplates"
            to="/ProcedureTemplateManagement"
            className="flex flex-col justify-center items-center"
          >
            <img src="/svg/procedureTemplates.svg" alt="logo" />
            <h1>Procedure</h1>
            <h1>Templates</h1>
          </Link>
          <Link
            id="processRecords"
            to="/recordLookup"
            className="flex flex-col justify-center items-center"
          >
            <img src="/svg/processRecords.svg" alt="logo" />
            <h1>Process</h1>
            <h1>Records</h1>
          </Link>
        </section>
        <section className="grid grid-cols-3">
          <Link
            id="processManagement"
            to="/modifyProcess/activeProcesses"
            className="flex flex-col justify-center items-center"
          >
            <img src="/svg/processManagement.svg" alt="logo" />
            <h1>Process</h1>
            <h1>Management</h1>
          </Link>
          <Link
            id="resourceManagement"
            to="/resources"
            className="flex flex-col justify-center items-center"
          >
            <img src="/svg/resourceManagement.svg" alt="logo" />
            <h1>Resource</h1>
            <h1>Management</h1>
          </Link>
          <Link
            id="createAccount"
            to="/createAccount"
            className="flex flex-col justify-center items-center"
          >
            <img src="/svg/createAccount.svg" alt="logo" />
            <h1>Create</h1>
            <h1>Account</h1>
          </Link>
        </section>
      </section>
    </div>
  );
};

export default AdminActions;
