import React, { useEffect, useState, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { TbLayoutGridAdd } from "react-icons/tb";
import "./TemplateStyles.css";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const notify = () => toast.success("Process Template Deleted!");

const SearchBar = ({ inputValue, setInputValue }) => {
  const handleClearInput = () => setInputValue("");

  return (
    <div
      className="inline-flex items-center rounded-full 
    text-xl border-2 border-[#8E0000] bg-[#F5F5DC] 
    p-2 min-width relative"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#8E0000]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="search"
        placeholder="Search for process records"
        className="bg-transparent border-none outline-none placeholder-[#8E0000] text-[#8E0000] pl-2"
        style={{ minWidth: "275px" }}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {inputValue && (
        <button
          onClick={handleClearInput}
          className="absolute right-4 text-[#8E0000]"
          style={{ outline: "none" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

const ProcessTable = ({ searchText, processes, isLoading }) => {
  const filteredProcesses = useMemo(() => {
    return processes.filter(
      (process) =>
        process.id.toLowerCase().includes(searchText) ||
        process.patient.toLowerCase().includes(searchText) ||
        process.description.toLowerCase().includes(searchText) ||
        process.name.toLowerCase().includes(searchText) ||
        process.procedures.toLowerCase().includes(searchText)
    );
  }, [processes, searchText]);

  const data = useMemo(() => filteredProcesses, [filteredProcesses]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Patient Name",
        accessor: "patient",
        tooltip: "Sort by Patient Name",
        style: { backgroundColor: "#F5F5DC" },
      },
      {
        Header: "Process ID",
        accessor: "id",
        tooltip: "Sort by Process ID",
      },
      {
        Header: "Process Name",
        accessor: "name",
        tooltip: "Sort by Process Name",
        style: { backgroundColor: "#F5F5DC" },
      },
      {
        Header: "Description",
        accessor: "description",
        tooltip: "Sort by Description",
      },
      {
        Header: "Procedures",
        accessor: "procedures",
        tooltip: "Sort by Procedures",
        style: { backgroundColor: "#F5F5DC" },
      },
      {
        Header: "Actions",
        id: "actions",
        tooltip: "",
        Cell: ({ row }) => {
          const navigate = useNavigate();
          const handleEditClick = () => {
            navigate(`/processDetails/${row.values.id}`);
          };

          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                title="View Process Details"
                onClick={handleEditClick}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="#8E0000"
                  className="bi bi-pencil"
                  viewBox="0 0 576 512"
                >
                  <path d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z" />
                </svg>
              </button>
            </div>
          );
        },
        disableSortBy: true,
        style: { backgroundColor: "#F5F5DC" },
      },
    ],
    []
  );

  const tableInstance = useTable(
    { columns, data: filteredProcesses },
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    pageOptions,
    state: { pageIndex },
  } = useTable(
    { columns, data, initialState: { pageSize: 3 } },
    useSortBy,
    usePagination
  );

  return (
    <>
      <div
        className="custom-scrollbar-table w-full"
        style={{
          maxWidth: "95%",
          margin: "auto",
          overflowX: "auto",
        }}
      >
        <table
          className="w-full h-full text-center text-lg table-auto lg:table-fixed  border-separate"
          {...getTableProps()}
          style={{
            borderSpacing: "0 1px",
            fontSize: "1.32rem",
            textAlign: "center",
          }}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    className={`text-sm xl:text-xl border-b px-2 py-1 min-w-[${column.minWidth}px] text-red-800 border-red-800`}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    title={column.tooltip}
                    style={{
                      ...column.style,
                      color: "#8E0000",
                      borderBottom: "1px solid #8E0000",
                      padding: "10px",
                      minWidth: column.minWidth,
                      cursor: column.id !== "actions" ? "pointer" : "default",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        whiteSpace: "normal",
                      }}
                    >
                      {column.render("Header")}
                      <span style={{ marginLeft: "3px", textAlign: "center" }}>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="22"
                              fill="#8E0000"
                              className="bi bi-caret-down-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="22"
                              fill="#8E0000"
                              className="bi bi-caret-up-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                            </svg>
                          )
                        ) : (
                          ""
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.length > 0 ? (
              page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          className={`text-xxs md:text-xl border-b border-red-800 py-2 px-4 align-middle whitespace-normal ${
                            cell.column.className || ""
                          }`}
                          style={{
                            ...cell.column.style,
                            borderBottom: "1px solid #8E0000",
                            padding: "10px",
                            verticalAlign: "middle",
                          }}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{ textAlign: "center", padding: "10px" }}
                >
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className={`flex items-center justify-center text-xl px-4 py-2 bg-[#F5F5DC] text-[#8E0000] border-2 border-[#8E0000] rounded-full hover:bg-[#ede9d4] mr-2 ${
            !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Previous Page
        </button>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className={`flex items-center justify-center text-xl px-4 py-2 bg-[#F5F5DC] text-[#8E0000] border-2 border-[#8E0000] rounded-full hover:bg-[#ede9d4] ${
            !canNextPage ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next Page
        </button>
      </div>
    </>
  );
};

const ProcessTemplateManagement = () => {
  const [searchInput, setSearchInput] = useState("");
  const [processes, setProcesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProcesses = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/processInstances");
        setProcesses(
          response.data.map((process) => ({
            id: process.processID,
            patient: process.patientFullName,
            description: process.description,
            name: process.processName,
            procedures: process.procedures.join(", "),
          }))
        );
      } catch (error) {
        console.error("Failed to fetch processes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcesses();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={150} color={"#8E0000"} />
      </div>
    );
  }

  return (
    <div className="flex flex-col  space-y-4 relative">
      <h1 className="text-4xl items-center text-[#8E0000] text-center underline font-bold mt-5">
        Completed Process Records
      </h1>
      <div className="w-full flex justify-center">
        <SearchBar inputValue={searchInput} setInputValue={setSearchInput} />
      </div>
      <div>
        <ProcessTable
          searchText={searchInput}
          processes={processes}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ProcessTemplateManagement;
