import tmpAssignedProcesses from "../../tmp/data/assignedProcesses";
import { useState, useEffect } from "react";
import { calculateTimeUntilDate } from "../../utils/helperFunctions";
import { Link } from "react-router-dom";

const AssignedProcesses = () => {
  const [assignedProcesses, setAssignedProcesses] = useState(null);
  const [displayingProcesses, setDisplayingProcesses] = useState(null);
  const [tablePage, setTablePage] = useState(0);

  useEffect(() => {
    const fetchAssignedProcesses = async () => {
      setAssignedProcesses(tmpAssignedProcesses);
    };
    fetchAssignedProcesses();
  }, []);

  useEffect(() => {
    if (assignedProcesses) {
      const startIndex = tablePage * 3;
      const endIndex = Math.min(startIndex + 3, assignedProcesses.length);
      setDisplayingProcesses(assignedProcesses.slice(startIndex, endIndex));
    }
  }, [assignedProcesses, tablePage]);

  const handleNextPage = () => {
    setTablePage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setTablePage((prevPage) => Math.max(prevPage - 1, 0));
  };

  if (!displayingProcesses) return <div>Loading ...</div>;
  return (
    <div className="w-11/12 mx-auto">
      <div className="bg-secondary mt-4 p-8 rounded-xl">
        <h1 className="text-primary underline text-3xl font-bold text-center">
          My Process Dashboard
        </h1>
        <div className="space-y-8 mb-4 mt-8">
          {displayingProcesses.map((process) => (
            <Process key={process.processID} process={process} />
          ))}
        </div>
      </div>
      <div className="w-full mx-auto flex justify-center space-x-4 mt-4 mb-16 relative">
        <span className="absolute left-0">
          Page{" "}
          <strong>
            {tablePage + 1} of {Math.ceil(assignedProcesses.length / 3)}
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

const Process = ({ process }) => {
  const myProcedure = process.myProcedure;
  const myProcedureStartDate = new Date(myProcedure.timeStart);

  return (
    <div className="bg-primary text-white p-4 rounded-3xl flex flex-col md:grid grid-cols-10 space-x-4 drop-shadow-lg">
      <section className="col-start-1 col-end-3 text-center md:space-y-4 border-b-2 md:border-r-2 md:border-b-0 border-white">
        <Link to="/boardProcess" className="text-2xl hover:underline">
          {myProcedure.procedureName}
        </Link>
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
      </section>
      <section className="mt-2 md:mt-0 col-start-3 col-end-8 flex flex-col justify-center md:space-y-8 text-2xl">
        <div className="flex">
          <h1 className="underline mr-4">Patient:</h1>
          <p>{process.patientName}</p>
        </div>
        <div className="flex ">
          <h1 className="underline mr-2">Process:</h1>
          <p>{process.processName}</p>
        </div>
      </section>
      <section className="col-start-8 col-end-11 flex flex-col justify-evenly md:items-center mt-2 md:mt-0 text-xl">
        <div>
          <h1 className="underline">Current Procedure:</h1>
          <p>{process.currentProcedure}</p>
        </div>
        <h1>
          {process.procedureAhead === 0 ? (
            <span className="text-green-500">Your Turn!</span>
          ) : (
            <span>{`${process.procedureAhead} more procedures ahead`}</span>
          )}
        </h1>
      </section>
    </div>
  );
};

export default AssignedProcesses;
