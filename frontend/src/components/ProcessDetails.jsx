import tmpProcessDetails from "../tmp/data/processDetails";
import ProcessChat from "./ProcessChat";
import { useState, useEffect } from "react";
const ProcessDetails = ({ id }) => {
  const [process, setProcess] = useState(null);

  useEffect(() => {
    const fetchProcessDetail = async () => {
      setProcess(tmpProcessDetails);
    };
    fetchProcessDetail();
  }, []);

  if (!process) return <div>Loading ...</div>;
  return (
    <div className="w-11/12 mx-auto">
      <section className="flex justify-between text-primary text-3xl my-4">
        <h1 className="font-semibold">Process Details</h1>
        <p>PROCESS ID: {process.processId}</p>
      </section>
      <section className="bg-secondary rounded-2xl p-8 space-y-8">
        <section className="flex justify-between">
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
              <p>{process.completedProcedures}</p>
            </div>
            <div className="flex space-x-2">
              <h1 className="underline underline-offset-4">
                Total Procedures:
              </h1>
              <p>{process.totalProcedures}</p>
            </div>
          </section>
          <section className="w-1/2">
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
        {section.isCompleted ? (
          <p className="text-highlightGreen">COMPLETED</p>
        ) : (
          <p className="text-highlightRed">INCOMPLETE</p>
        )}
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
    procedure.peopleAssigned.length === procedure.peopleCompleted.length;

  return (
    <div
      className={`bg-primary rounded-3xl text-white flex text-xl ${
        userInPeopleAssigned ? "border-8 border-green-500" : ""
      } ${isCompleted ? "opacity-35" : ""}`}
    >
      <section className="border-r-2 border-white p-8 space-y-2 w-1/2">
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
        {userInPeopleCompleted && (
          <p className="text-highlightGreen">You have completed this task!</p>
        )}
        {!userInPeopleCompleted && userInPeopleAssigned && (
          <button className="text-highlightGreen">Mark as Completed</button>
        )}
      </section>
      <section className="grid grid-cols-3 w-1/2">
        <section className="col-start-1 col-end-2 p-4 border-r-2 flex flex-col items-center">
          <h1 className="underline">People Involved:</h1>
          <ul className="list-disc">
            {procedure.resources.personnel.map((name) => (
              <li>{name}</li>
            ))}
          </ul>
        </section>
        <section className="col-start-2 col-end-3 p-4 border-r-2 flex flex-col items-center">
          <h1 className="underline">Equipments Used</h1>
          <ul className="list-disc">
            {procedure.resources.equipments.map((equipment) => (
              <li>{equipment}</li>
            ))}
          </ul>
        </section>
        <section className="col-start-3 col-end-4 p-4 flex flex-col items-center">
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

export default ProcessDetails;
