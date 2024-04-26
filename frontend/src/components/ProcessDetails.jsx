import tmpProcessDetails from "../tmp/data/processDetails";
import ProcessChat from "./ProcessChat";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../providers/authProvider.js";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useSocketContext } from "../providers/SocketProvider";

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

const ProcessDetails = () => {
  const { id } = useParams();
  const [process, setProcess] = useState(null);
  const [refreshTick, setRefreshTick] = useState(false);
  const { socket } = useSocketContext();
  const { user } = useAuth();

  const triggerRefresh = () => {
    setRefreshTick((refreshTick) => !refreshTick);
  };

  useEffect(() => {
    const fetchProcessDetail = async () => {
      try {
        const response = await axios.get(`/processInstance/${id}`);
        setProcess(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch process details:", error);
      }
    };

    fetchProcessDetail();
  }, [id, refreshTick]);

  // socket events
  useEffect(() => {
    if (!socket) return;
    socket.on("procedure complete - refresh", () => {
      triggerRefresh();
    });
  }, [socket]);

  if (!process || !user) return <div>Loading ...</div>;
  return (
    <div className="w-11/12 mx-auto">
      <section className="flex justify-between text-primary text-3xl my-4">
        <h1 className="font-semibold">Process Details</h1>
        <p>PROCESS ID: {process.processID}</p>
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
              <p>{process.patient.fullName}</p>
            </div>
            <div className="flex space-x-2">
              <h1 className="underline underline-offset-4">
                Current Procedure:
              </h1>
              <p>
                {process.currentProcedure
                  ? process.currentProcedure.procedureName
                  : "All procedures are completed."}
              </p>
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
          <section className="md:w-1/2">
            <ProcessChat id={id} />
          </section>
        </section>
        <section className="space-y-4">
          <h1 className="text-2xl text-primary underline underline-offset-4">
            Procedures:
          </h1>
          <section className="space-y-12">
            {process.sectionInstances.map((section) => (
              <Section
                key={section._id}
                section={section}
                currentProcedure={process.currentProcedure}
              />
            ))}
          </section>
        </section>
      </section>
    </div>
  );
};

const Section = ({ section, currentProcedure }) => {
  return (
    <section className="space-y-4">
      <div className="bg-white rounded-full p-4 flex justify-between items-center space-x-4">
        <div className="flex flex-col ml-4">
          <h1 className="text-2xl capitalize">{section.name}</h1>
          <p className="text-gray-500">{section.description}</p>
        </div>
        {section.isCompleted ? (
          <p className="text-highlightGreen">COMPLETED</p>
        ) : (
          <p className="text-highlightRed">INCOMPLETE</p>
        )}
      </div>
      <div className="space-y-4">
        {section.procedureInstances.map((procedure) => (
          <Procedure
            key={procedure._id}
            procedure={procedure}
            currentProcedure={currentProcedure}
          />
        ))}
      </div>
    </section>
  );
};

const Procedure = ({ procedure, currentProcedure }) => {
  const { user } = useAuth();
  const userInPeopleAssigned = procedure.rolesAssignedPeople.some((roleInfo) =>
    roleInfo.accounts.some((account) => account._id === user?.id)
  );
  const userInPeopleCompleted = procedure.peopleMarkAsCompleted.some(
    (roleInfo) => roleInfo.accounts.some((account) => account._id === user?.id)
  );
  const isCompleted =
    procedure.rolesAssignedPeople.length ===
    procedure.peopleMarkAsCompleted.length;

  const markProcedureAsComplete = async () => {
    try {
      const response = await axios.put(
        `/markProcedureComplete/${procedure._id}`
      );
      if (response.status === 200) {
        toast.success("Procedure marked as complete!");
      }
    } catch (error) {
      console.error("Error marking procedure as complete:", error);
      toast.error("Failed to mark procedure as complete.");
    }
  };

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
          <p>{procedure.specialNotes}</p>
        </div>
        {userInPeopleCompleted && (
          <p className="text-highlightGreen">You have completed this task!</p>
        )}
        {!userInPeopleCompleted &&
          userInPeopleAssigned &&
          currentProcedure?._id === procedure?._id && (
            <button
              onClick={markProcedureAsComplete}
              className="text-highlightGreen"
            >
              Mark as Completed ✅
            </button>
          )}
      </section>
      <section className="flex flex-col md:grid grid-cols-3 md:w-1/2">
        <section className="col-start-1 col-end-2 p-4 border-b-2 md:border-r-2 md:border-b-0 flex flex-col items-center space-y-2">
          <h1 className="underline">People Involved:</h1>
          <ul className="list-disc capitalize">
            {procedure.rolesAssignedPeople.map((roleInfo) =>
              roleInfo.accounts.map((account) => (
                <li key={account._id}>
                  {account.firstName} {account.lastName} ({roleInfo.role.name})
                </li>
              ))
            )}
          </ul>
        </section>
        <section className="col-start-2 col-end-3 p-4 border-b-2 md:border-r-2 md:border-b-0 flex flex-col items-center space-y-2">
          <h1 className="underline">Equipment Used</h1>
          <ul className="list-disc capitalize">
            {procedure.assignedResources
              .filter((resource) => resource.type === "equipment")
              .map((equipment) => (
                <li key={equipment._id}>
                  {equipment.name} - {equipment.location}
                </li>
              ))}
          </ul>
        </section>
        <section className="col-start-3 col-end-4 p-4 flex flex-col items-center space-y-2">
          <h1 className="underline">Space used</h1>
          <ul className="list-disc">
            {procedure.assignedResources
              .filter((resource) => resource.type === "spaces")
              .map((space) => (
                <li key={space._id}>
                  {space.name} - {space.location}
                </li>
              ))}
          </ul>
        </section>
      </section>
    </div>
  );
};

export default ProcessDetails;
