import tmpProcessDetails from "../tmp/data/processDetails";
import ProcessChat from "./ProcessChat";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa6";


const CompletedProcess = ({ id }) => {
  const [process, setProcess] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProcessDetail = async () => {
      setProcess(tmpProcessDetails);
    };
    fetchProcessDetail();
  }, []);

  const handleGoBack = () => {
    navigate("/recordLookup");
  };

  if (!process) return <div>Loading ...</div>;
  return (
    <div className="w-11/12 mx-auto">
      <section className="flex justify-between text-primary text-3xl my-4">
      <button
        onClick={() => { handleGoBack() }}
        className="mt-15 border-black border-2 ml-5 bg-primary hover:bg-red-700 text-white rounded-full px-5 py-2 text-2xl transition-colors duration-150 flex items-center"
        style={{height: '3.5rem'}}      >
        <FaArrowLeft className="mr-2 text-2xl" /> Go Back
      </button>
        <h1 className="font-semibold">Process Details</h1>
        <p>PROCESS ID: {process.processId}</p>
      </section>
      <section className="bg-secondary rounded-2xl p-8 space-y-8">
        <section className="flex flex-col justify-between space-y-4 md:flex-row">
          <section className="text-primary text-2xl space-y-6 w-1/2">
            <div className="flex space-x-2">
              <h1 className="underline underline-offset-4">Process:</h1>
              <p>{process.processName}</p>
            </div>
            <div className="flex space-x-2">
              <h1 className="underline underline-offset-4">Patient:</h1>
              <p>{process.patientName}</p>
            </div>
            <div className="flex space-x-2">
              <h1 className="underline underline-offset-4">
                Current Procedure:
              </h1>
              <p>{process.currentProcedure}</p>
            </div>
            <div className="flex space-x-2">
              <h1 className="underline underline-offset-4">
                Completed Procedures:
              </h1>
              <p>{"5"}</p>
            </div>
            <div className="flex space-x-2">
              <h1 className="underline underline-offset-4">
                Total Procedures:
              </h1>
              <p>{process.totalProcedures}</p>
            </div>
          </section>
          <section className="md:w-1/2">
            <ProcessChat />
          </section>
        </section>
        <section className="space-y-4">
          <h1 className="text-2xl text-primary underline underline-offset-4">
            Procedures:
          </h1>
          <section className="space-y-12">
            {process.sections.map((section) => (
              <Section section={section} />
            ))}
          </section>
        </section>
      </section>
    </div>
  );
};

const Section = ({ section }) => {
  return (
    <section className="space-y-4">
      <div className="bg-white rounded-full p-4 flex justify-between items-center space-x-4">
        <div className="flex flex-col ml-4">
          <h1 className="text-2xl capitalize">{section.sectionName}</h1>
          <p className="text-gray-500">{section.description}</p>
        </div>
        
          <p className="text-highlightGreen">COMPLETED</p>
       
      </div>
      <div className="space-y-4">
        {section.procedures.map((procedure) => (
          <Procedure procedure={procedure} />
        ))}
      </div>
    </section>
  );
};

const Procedure = ({ procedure }) => {
  const currentUser = "005";
  const userInPeopleCompleted = procedure.peopleCompleted.includes(currentUser);
  const userInPeopleAssigned = procedure.peopleAssigned.includes(currentUser);
  const isCompleted =
    procedure.peopleAssigned.length < 99999;

  return (
    <div
      className={`bg-primary rounded-3xl text-white flex  flex-col md:flex-row text-xl ${
        userInPeopleAssigned ? "border-8 border-green-500" : ""
      } ${isCompleted ? "opacity-35" : ""}`}
    >
      <section className="border-b-2 md:border-r-2 md:border-b-2 p-8 space-y-2 md:w-1/2">
        <div className="flex space-x-2">
          <h1 className="underline underline-offset-4">Name:</h1>
          <p>{procedure.procedureName}</p>
        </div>
        <div>
          <h1 className="underline underline-offset-4">Description:</h1>
          <p>{procedure.description}</p>
        </div>
        <div>
          <h1 className="underline underline-offset-4">
            Special Instructions:
          </h1>
          <p>{procedure.specialInstructions}</p>
        </div>
      </section>
      <section className="flex flex-col md:grid grid-cols-3 md:w-1/2">
        <section className="col-start-1 col-end-2 p-4 border-b-2 md:border-r-2 md:border-b-0 flex flex-col items-center space-y-2">
          <h1 className="underline">People Involved:</h1>
          <ul className="list-disc">
            {procedure.resources.personnel.map((name) => (
              <li>{name}</li>
            ))}
          </ul>
        </section>
        <section className="col-start-2 col-end-3 p-4 border-b-2 md:border-r-2 md:border-b-0 flex flex-col items-center space-y-2">
          <h1 className="underline">Equipments Used</h1>
          <ul className="list-disc">
            {procedure.resources.equipments.map((equipment) => (
              <li>{equipment}</li>
            ))}
          </ul>
        </section>
        <section className="col-start-3 col-end-4 p-4 flex flex-col items-center space-y-2">
          <h1 className="underline">Space used</h1>
          <ul className="list-disc">
            {procedure.resources.spaces.map((space) => (
              <li>{space}</li>
            ))}
          </ul>
        </section>
      </section>
    </div>
  );
};

export default CompletedProcess;
