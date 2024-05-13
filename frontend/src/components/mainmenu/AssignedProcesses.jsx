import tmpAssignedProcesses from "../../tmp/data/assignedProcesses";
import { useState, useEffect } from "react";
import { calculateTimeUntilDate } from "../../utils/helperFunctions";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useSocketContext } from "../../providers/SocketProvider";
import { useAuth } from "../../providers/authProvider";
import { ClipLoader } from "react-spinners";

const AssignedProcesses = () => {
  const { user } = useAuth();
  const [assignedProcesses, setAssignedProcesses] = useState(null);
  const [displayingProcesses, setDisplayingProcesses] = useState(null);
  const [tablePage, setTablePage] = useState(0);
  const { socket } = useSocketContext();
  const [refreshTick, setRefreshTick] = useState(false);

  const triggerRefresh = () => {
    setRefreshTick((refreshTick) => !refreshTick);
  };

  const fetchAssignedProcesses = async () => {
    console.log("fetching for new assigned processes");
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/assignedProcesses`,
      {
        credentials: "include",
      }
    );
    if (!res.ok) {
      console.log("assigned processes fetch failed");
      console.log(await res.text());
    } else {
      const data = await res.json();
      console.log("Received process");
      console.log(data);
      setAssignedProcesses(data);
    }
  };

  // fetches assigned processes
  useEffect(() => {
    fetchAssignedProcesses();
  }, [refreshTick]);

  // pagination updates
  useEffect(() => {
    if (assignedProcesses) {
      const startIndex = tablePage * 3;
      const endIndex = Math.min(startIndex + 3, assignedProcesses.length);
      setDisplayingProcesses(assignedProcesses.slice(startIndex, endIndex));
    }
  }, [assignedProcesses, tablePage]);

  // socket events
  useEffect(() => {
    if (!socket) return;

    socket.on("procedure complete - refresh", fetchAssignedProcesses);

    const processNewRefreshCb = (involvedUser) => {
      console.log("involved users", involvedUser);
      console.log("current user");
      if (user && involvedUser.includes(user.id)) {
        triggerRefresh();
        toast("A new process has been assigned to you!", {
          icon: "⚠️",
        });
      }
    };
    socket.on("new process - refresh", processNewRefreshCb);

    const processDeleteRedirectCb = () => {
      triggerRefresh();
      toast("A process that you are assigned to has been deleted!", {
        icon: "⚠️",
      });
    };
    socket.on("process deleted - refresh", processDeleteRedirectCb);

    const processModifyRedirectCb = () => {
      triggerRefresh();
      toast("A process that you are assigned to has been modified!", {
        icon: "⚠️",
      });
    };
    socket.on("process modify - refresh", processModifyRedirectCb);

    return () => {
      socket.off("procedure complete - refresh", fetchAssignedProcesses);
      socket.off("new process - refresh", processNewRefreshCb);
      socket.off("process deleted - refresh", processDeleteRedirectCb);
      socket.off("process modify - refresh", processModifyRedirectCb);
    };
  }, [user, socket]);

  const handleNextPage = () => {
    setTablePage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setTablePage((prevPage) => Math.max(prevPage - 1, 0));
  };

  if (!displayingProcesses || !user)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={150} color={"#8E0000"} />
      </div>
    );
  return (
    <div className="w-11/12 mx-auto">
      <div className="bg-secondary mt-4 p-8 rounded-xl">
        <h1 className="text-primary underline text-3xl font-bold text-center">
          My Process Dashboard
        </h1>
        <p className="text-center text-xl mt-4">
          Hello, {user.firstName} {user.lastName}, you have{" "}
          {assignedProcesses?.length || "no"}{" "}
          {assignedProcesses?.length === 1 ? "process" : "processes"} assigned.
        </p>
        <div className="space-y-8 mb-4 mt-8">
          {displayingProcesses.map((process) => (
            <Process
              key={process.processID}
              process={process}
              socket={socket}
            />
          ))}
        </div>
      </div>
      <div className="w-full mx-auto flex justify-center space-x-4 mt-4 mb-16 relative">
        <span className="absolute left-0">
          Page{" "}
          <strong>
            {tablePage + 1} of{" "}
            {assignedProcesses.length === 0
              ? 1
              : Math.ceil(assignedProcesses.length / 3)}
          </strong>
        </span>
        <div></div>
        <button
          onClick={handlePrevPage}
          disabled={tablePage === 0}
          className="bg-secondary border-2 border-primary py-2 px-4 rounded-full disabled:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={tablePage >= Math.ceil(assignedProcesses.length / 3) - 1}
          className="bg-secondary border-2 border-primary py-2 px-4 rounded-full disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const Process = ({ process, socket }) => {
  const myProcedure = process.myProcedure;
  const myProcedureStartDate = myProcedure
    ? new Date(myProcedure.timeStart)
    : null;

  let displayMyProcedure;
  console.log(myProcedure);

  if (myProcedure) {
    displayMyProcedure = (
      <>
        <h1 className="text-2xl">{myProcedure.procedureName} </h1>
        <h1 className="text-lg">
          {calculateTimeUntilDate(myProcedureStartDate)}
        </h1>
        <div className="flex justify-center items-center space-x-2 text-lg">
          <p>{`${myProcedureStartDate.getHours()}:${myProcedureStartDate
            .getMinutes()
            .toString()
            .padStart(2, "0")}`}</p>
          <div className="font-bold">|</div>
          <p>{myProcedure.location}</p>
        </div>
      </>
    );
  } else {
    displayMyProcedure = (
      <div className="h-full flex justify-center items-center">
        You have completed all of the procedures assigned to you in this
        process!
      </div>
    );
  }

  return (
    <Link
      to={`/boardProcess/${process.processID}`}
      title={`View Your Assigned Process '${process.processName}'`}
      className="bg-primary text-white p-4 rounded-3xl flex flex-col md:grid grid-cols-10 space-x-4 drop-shadow-lg"
    >
      <section className="col-start-1 col-end-3 text-center md:space-y-4 border-b-2 md:border-r-2 md:border-b-0 border-white">
        {displayMyProcedure}
      </section>
      <section className="mt-2 md:mt-0 col-start-3 col-end-8 flex flex-col justify-center md:space-y-8 text-2xl">
        <div className="flex">
          <h1 className="underline mr-4">Patient:</h1>
          <p>{process.patientName}</p>
        </div>
        <div className="flex mt-2 lg:mt-0">
          <h1 className="underline mr-2">Process:</h1>
          <p>{process.processName}</p>
        </div>
      </section>
      <section className="col-start-8 col-end-11 flex flex-col justify-evenly md:items-center mt-2 md:mt-0 text-xl">
        <div>
          <h1 className="underline">Current Procedure:</h1>
          <p>{process.currentProcedure.procedureName}</p>
        </div>
        {myProcedure && (
          <h1>
            {process.procedureAhead === 0 ? (
              <span className="text-green-500">Your Turn!</span>
            ) : (
              <span>{`${process.procedureAhead} more procedures ahead`}</span>
            )}
          </h1>
        )}
      </section>{" "}
    </Link>
  );
};

export default AssignedProcesses;
