import tmpBoardProcess from "../../tmp/data/boardProcess";
import { useState, useEffect } from "react";
import { GoChecklist } from "react-icons/go";
import { BsChatLeftText } from "react-icons/bs";
import { MdOutlineInfo } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { calculateTimeUntilDate } from "../../utils/helperFunctions";
import ProcessChat from "../ProcessChat";
import { Link } from "react-router-dom";

const BoardProcessView = ({ id, navToDashboard }) => {
  const [process, setProcess] = useState(null);
  const [boardProcessPage, setBoardProcessPage] = useState("procedures");

  const navToProcedures = () => {
    setBoardProcessPage("procedures");
  };
  const navToChat = () => {
    setBoardProcessPage("chat");
  };

  useEffect(() => {
    const fetchBoardProcess = async () => {
      setProcess(tmpBoardProcess);
      console.log(tmpBoardProcess);
    };
    fetchBoardProcess();
  }, []);

  if (!process) return <div>Loading ...</div>;
  return (
    <div className="bg-secondary w-11/12 mx-auto my-8 rounded-3xl">
      <BoardProcessHeader
        navToProcedures={navToProcedures}
        navToChat={navToChat}
        processId={process.processId}
        navToDashboard={navToDashboard}
        processName={process.processName}
        patientName={process.patientName}
        boardProcessPage={boardProcessPage}
      />
      {boardProcessPage === "procedures" && (
        <BoardProcessProcedures procedures={process.proceduresLeft} />
      )}
      {boardProcessPage === "chat" && <BoardProcessChat />}
    </div>
  );
};

const BoardProcessHeader = ({
  navToProcedures,
  navToChat,
  processId,
  navToDashboard,
  processName,
  patientName,
  boardProcessPage,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between p-4 border-b-2 border-black space-y-4">
      <section className="flex flex-col space-y-2 justify-center items-center relative">
        <p className="text-sm">Back to Dashboard</p>
        <Link to="/home">
          <FaArrowLeft className="w-8 h-8" />
        </Link>
      </section>
      <section className="text-2xl">
        <div className="flex">
          <h1 className="text-primary underline mr-2">Process:</h1>
          <p>{processName}</p>
        </div>
        <div className="flex">
          <h1 className="text-primary underline mr-4">Patient:</h1>
          <p>{patientName}</p>
        </div>
      </section>
      <section className="flex flex-col justify-between space-y-4">
        <div className="text-sm md:ml-auto">
          <p>PROCESS ID: {processId}</p>
        </div>
        <div className="flex space-x-2 my-2 justify-center">
          <button
            className={`border-r-2 border-black ${
              boardProcessPage === "procedures" ? "text-red-500" : ""
            }`}
            onClick={navToProcedures}
          >
            <GoChecklist className="w-8 h-8" />
          </button>
          <button
            className={boardProcessPage === "chat" ? "text-red-500" : ""}
            onClick={navToChat}
          >
            <BsChatLeftText className="w-8 h-8" />
          </button>
          <Link to="/processDetails" className="border-l-2 border-black">
            <MdOutlineInfo className="w-8 h-8" />
          </Link>
        </div>
      </section>
    </div>
  );
};

const BoardProcessProcedures = ({ procedures }) => {
  const currUser = "001";
  return (
    <div className="p-8">
      <section className="text-2xl mb-4">
        <h1 className="flex">
          Procedures to complete:{" "}
          <p className="ml-2 text-primary">{procedures.length}</p>
        </h1>
      </section>
      <section className="flex flex-col space-y-8">
        {procedures.map((procedure) => {
          return <Procedure procedure={procedure} currUser={currUser} />;
        })}
      </section>
    </div>
  );
};

const Procedure = ({ procedure, currUser }) => {
  const procedureStartDate = new Date(procedure.timeStart);

  return (
    <div className="bg-primary text-white p-4 rounded-3xl flex flex-col md:grid grid-cols-10 space-y-4 space-x-4 drop-shadow-lg">
      <section className="col-start-1 col-end-3 text-center space-y-4 md:border-r-2 border-white flex flex-col justify-evenly">
        <h1 className="text-2xl">{procedure.procedureName}</h1>
        <div>
          <h1 className="text-lg">
            {calculateTimeUntilDate(procedureStartDate)}
          </h1>
          <div className="flex justify-center items-center space-x-2 text-lg">
            <p>{`${procedureStartDate.getHours()}:${procedureStartDate
              .getMinutes()
              .toString()
              .padStart(2, "0")}`}</p>
            <div className="font-bold">|</div>
            <p>{procedure.location}</p>
          </div>
        </div>
      </section>
      <section className="col-start-3 col-end-8 flex flex-col justify-center space-y-8 text-2xl">
        <div className="flex flex-col">
          <h1 className="underline mr-4">Special Instructions:</h1>
          <p>{procedure.specialInstructions}</p>
        </div>
        <div className="flex flex-col">
          <h1 className="underline mr-2">Description:</h1>
          <p>{procedure.description}</p>
        </div>
      </section>
      <section className="col-start-8 col-end-11 flex flex-col justify-evenly md:items-center space-y-2 md:space-y-0 text-center text-xl">
        <div className="flex space-x-4">
          <h1 className="underline">People Assigned:</h1>
          <p>{procedure.peopleAssigned.length}</p>
        </div>
        <div className="flex space-x-4">
          <h1 className="underline">People Completed:</h1>
          <p>{procedure.peopleCompleted.length}</p>
        </div>
        {procedure.peopleCompleted.includes(currUser) && (
          <div className="text-highlightGreen underline">
            You have completed the task!
          </div>
        )}
        {!procedure.peopleCompleted.includes(currUser) &&
          procedure.peopleAssigned.includes(currUser) && (
            <button className="text-highlightGreen underline">
              Mark as completed
            </button>
          )}
      </section>
    </div>
  );
};

const BoardProcessChat = () => {
  return (
    <div className="p-8 w-3/4 mx-auto">
      <ProcessChat />
    </div>
  );
};

export default BoardProcessView;
