import tmpBoardProcess from "../../tmp/data/boardProcess";
import { useState, useEffect } from "react";
import { GoChecklist } from "react-icons/go";
import { BsChatLeftText } from "react-icons/bs";
import { MdOutlineInfo } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { calculateTimeUntilDate } from "../../utils/helperFunctions";
import ProcessChat from "../ProcessChat";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useAuth } from "../../providers/authProvider.js";
import toast from "react-hot-toast";
import axios from "axios";
import { useSocketContext } from "../../providers/SocketProvider";
import { ClipLoader } from "react-spinners";

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

const apiUrl = process.env.REACT_APP_API_BASE_URL;

const BoardProcessView = () => {
  const [process, setProcess] = useState(null);
  const [boardProcessPage, setBoardProcessPage] = useState("procedures");
  const { id } = useParams();
  const { user } = useAuth();
  const { socket } = useSocketContext();
  const [refreshTick, setRefreshTick] = useState(false);
  const navigate = useNavigate();

  const triggerRefresh = () => {
    setRefreshTick((refreshTick) => !refreshTick);
  };

  const navToProcedures = () => {
    setBoardProcessPage("procedures");
  };
  const navToChat = () => {
    setBoardProcessPage("chat");
  };

  const fetchBoardProcess = async () => {
    console.log("refetching BoardProcess");
    const res = await fetch(`${apiUrl}/boardProcess/${id}`, {
      credentials: "include",
    });
    if (!res.ok) {
      console.log("assigned processes fetch failed");
      toast.error(await res.text());
    } else {
      const data = await res.json();
      setProcess(data);
      console.log("Got board process data", data);
    }
  };

  useEffect(() => {
    fetchBoardProcess();
  }, [id, refreshTick]);

  // socket events
  useEffect(() => {
    if (!socket) return;

    const processRefreshCb = () => {
      console.log("procedure completed refresh!");
      fetchBoardProcess();
    };
    socket.on("procedure complete - refresh", processRefreshCb);
    socket.on("procedure complete - refresh", processRefreshCb);

    const processDeleteRedirectCb = (deletedPID) => {
      if (id === deletedPID) {
        toast("This process has just been deleted!", {
          icon: "⚠️",
        });
        navigate("/home");
      }
    };
    socket.on("process deleted - redirect", processDeleteRedirectCb);

    const processModifyRefreshCb = () => {
      triggerRefresh();
      toast(
        "Parts of this process has just been modified and the page has just refreshed",
        {
          icon: "⚠️",
        }
      );
    };
    socket.on("process modify - refresh", processModifyRefreshCb);

    socket.emit("join process event room", id);

    return () => {
      socket.emit("leave process event room", id);
      socket.off("process deleted - redirect", processDeleteRedirectCb);
      socket.off("procedure complete - refresh", triggerRefresh);
      socket.off("process modify - refresh", processModifyRefreshCb);
    };
  }, [id, socket]);

  if (!process)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={150} color={"#8E0000"} />
      </div>
    );
  return (
    <div className="bg-secondary w-11/12 mx-auto my-8 rounded-3xl">
      <BoardProcessHeader
        navToProcedures={navToProcedures}
        navToChat={navToChat}
        processId={process.processID}
        processName={process.processName}
        patientName={process.patientName}
        boardProcessPage={boardProcessPage}
      />
      {boardProcessPage === "procedures" && user && (
        <BoardProcessProcedures
          procedures={process.proceduresLeft}
          currUser={user.id}
          currentProcedure={process.currentProcedure}
        />
      )}
      {boardProcessPage === "chat" && <BoardProcessChat id={id} />}
    </div>
  );
};

const BoardProcessHeader = ({
  navToProcedures,
  navToChat,
  processId,
  processName,
  patientName,
  boardProcessPage,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between p-4 border-b-2 border-black space-y-4">
      <section className="flex flex-col space-y-2 justify-center items-center relative">
        <p className="text-sm">Back to Dashboard</p>
        <Link to="/home" id="homeBtn">
          <FaArrowLeft title="Go Back to Dashboard" className="w-8 h-8" />
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
            title="View Procedures for the Process"
            id="proceduresBtn"
          >
            <GoChecklist className="w-8 h-8" />
          </button>
          <button
            className={boardProcessPage === "chat" ? "text-red-500" : ""}
            onClick={navToChat}
            title="View Live Chat for the Process"
            id="chatBtn"
          >
            <BsChatLeftText className="w-8 h-8" />
          </button>
          <Link
            to={`/processDetails/${processId}`}
            className="border-l-2 border-black"
            title="View Process Details"
            id="processDetailsBtn"
          >
            <MdOutlineInfo className="w-8 h-8" />
          </Link>
        </div>
      </section>
    </div>
  );
};

const BoardProcessProcedures = ({ procedures, currUser, currentProcedure }) => {
  return (
    <div className="p-8" id="boardProcessProcedures">
      <section className="text-2xl mb-4">
        <h1 className="flex">
          Procedures to complete:{" "}
          <p className="ml-2 text-primary" id="proceduresLeftText">
            {procedures.length}
          </p>
        </h1>
      </section>
      <section className="flex flex-col space-y-8">
        {procedures.length === 0 && (
          <div className="text-center">This process is completed!</div>
        )}
        {procedures.map((procedure, i) => {
          return (
            <Procedure
              key={i}
              procedure={procedure}
              currUser={currUser}
              currentProcedure={currentProcedure}
            />
          );
        })}
      </section>
    </div>
  );
};

const Procedure = ({ procedure, currUser, currentProcedure }) => {
  const procedureStartDate = new Date(procedure.timeStart);

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
          <div className="text-green-400">You have completed the task!</div>
        )}
        {!procedure.peopleCompleted.includes(currUser) &&
          procedure.peopleAssigned.includes(currUser) &&
          currentProcedure?._id === procedure?._id && (
            <button
              onClick={markProcedureAsComplete}
              className="text-green-400 underline"
              title="Mark Procedure as Completed"
            >
              Mark as completed ✅
            </button>
          )}
      </section>
    </div>
  );
};

const BoardProcessChat = ({ id }) => {
  return (
    <div className="p-8 lg:w-3/4 mx-auto" id="boardProcessChat">
      <ProcessChat id={id} />
    </div>
  );
};

export default BoardProcessView;
