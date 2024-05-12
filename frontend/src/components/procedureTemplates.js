import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import "./TemplateStyles.css";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmationModal from "./templateConfirmationModal";
import { ClipLoader } from "react-spinners";

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

const notify = () => toast.success("Procedure Template Deleted!");

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
        placeholder="Search for procedure templates"
        className="bg-transparent border-none outline-none placeholder-[#8E0000] text-[#8E0000] pl-2"
        style={{ minWidth: "300px" }}
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

const CreateTemplateButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/CreateProcedureTemplateForm");
  };

  return (
    <button
      className="flex items-center text-xl justify-center px-4 py-2 bg-[#F5F5DC] text-[#8E0000] border-2 border-[#8E0000] rounded-full hover:bg-[#ede9d4]"
      onClick={handleClick}
      title="Click to Create a New Procedure Template"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        fill="#8E0000"
        className="bi bi-clipboard-plus mr-2"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7"
        />
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
      </svg>
      Create New Template
    </button>
  );
};

const ProcedureTable = ({ filter, data, setData, isLoading }) => {
  const filteredData = useMemo(() => {
    if (!filter) return data;
    return data.filter(
      (template) =>
        template.name.toLowerCase().includes(filter.toLowerCase()) ||
        template.description.toLowerCase().includes(filter.toLowerCase()) ||
        template.resources.toLowerCase().includes(filter.toLowerCase()) ||
        template.roles.toLowerCase().includes(filter.toLowerCase()) ||
        template.notes.toLowerCase().includes(filter.toLowerCase()) ||
        template.time.toString().includes(filter)
    );
  }, [data, filter]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        tooltip: "Sort by Name",
        style: { backgroundColor: "#F5F5DC" },
      },
      {
        Header: "Description",
        accessor: "description",
        tooltip: "Sort by Description",
      },
      {
        Header: "Resources",
        accessor: "resources",
        tooltip: "Sort by Resources",
        style: { backgroundColor: "#F5F5DC" },
      },
      {
        Header: "Roles",
        accessor: "roles",
        tooltip: "Sort by Roles",
      },
      {
        Header: "Estimated Time",
        accessor: "time",
        tooltip: "Sort by Estimated Time",
        style: { backgroundColor: "#F5F5DC" },
      },
      {
        Header: "Special Notes",
        accessor: "notes",
        tooltip: "Sort by Special Notes",
      },
      {
        Header: "Actions",
        id: "actions",
        tooltip: "",
        Cell: ({ row }) => {
          const navigate = useNavigate();

          const handleEditClick = (templateId) => {
            navigate(`/ModifyProcedureTemplateForm/${templateId}`);
          };

          return (
            <div
              className="flex sm:flex-row flex-col items-center justify-center"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => handleEditClick(row.original.id)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0",
                  cursor: "pointer",
                  marginBottom: "10px", // Space between buttons
                }}
                title="Edit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="#8E0000"
                  className="bi bi-pencil"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                </svg>
              </button>
              <button
                onClick={() => promptDelete(row.original)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0",
                  cursor: "pointer",
                  marginBottom: "10px", // Space between buttons
                }}
                title="Delete"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="#8E0000"
                  className="bi bi-trash3"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
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
    { columns, data: filteredData, initialState: { pageSize: 3 } },
    useSortBy,
    usePagination
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);

  const deleteProcedureTemplate = async (templateId) => {
    setIsModalOpen(false);
    try {
      const response = await axios.delete(`/procedureTemplates/${templateId}`);
      if (response.status === 200) {
        setData((prevData) =>
          prevData.filter((template) => template.id !== templateId)
        );
        toast.success("Procedure template deleted successfully.");
      }
    } catch (error) {
      console.error("Failed to delete procedure template:", error);
      toast.error(error.response.data.message);
    }
  };

  const promptDelete = (template) => {
    setCurrentTemplate(template);
    setIsModalOpen(true);
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => deleteProcedureTemplate(currentTemplate.id)}
        templateName={currentTemplate?.name}
      />
      <div
        className="custom-scrollbar-table w-full"
        style={{
          maxWidth: "95%",
          margin: "auto",
          overflowX: "auto",
        }}
      >
        <table
          {...getTableProps()}
          className="w-full h-full text-center text-lg table-auto lg:table-fixed  border-separate"
          style={{
            borderSpacing: "0 1px",
          }}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    className="text-sm lg:text-lg py-1"
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    title={column.tooltip}
                    style={{
                      ...column.style,
                      color: "#8E0000",
                      borderBottom: "1px solid #8E0000",
                      padding: "10px",
                      whiteSpace: "normal",
                      minWidth: column.minWidth,
                      cursor: column.id !== "actions" ? "pointer" : "default",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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
                          className="text-sm lg:text-lg"
                          {...cell.getCellProps()}
                          style={{
                            ...cell.column.style,
                            borderBottom: "1px solid #8E0000",
                            padding: "10px",
                            verticalAlign: "middle",
                            whiteSpace: "normal",
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
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    borderBottom: "none",
                  }}
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
          marginTop: "20px",
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

const ProcedureTemplateManagement = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  function capitalizeWords(string) {
    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/procedureTemplates");
        setData(
          response.data.map((template) => ({
            id: template._id,
            name: template.procedureName,
            description: template.description || "",
            resources: template.requiredResources
              .map((resource) => {
                const name = resource.resource?.name;
                return name ? capitalizeWords(name) : null;
              })
              .filter((name) => name)
              .join(", "),
            roles: template.roles
              .map((role) => {
                const name = role.role?.name;
                return name ? capitalizeWords(name) : null;
              })
              .filter((name) => name)
              .join(", "),
            time: template.estimatedTime + " minutes",
            notes: template.specialNotes || "",
          }))
        );
      } catch (error) {
        console.error("Failed to fetch procedure templates:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={150} color={"#8E0000"} />
      </div>
    );
  }

  return (
    <div className="flex flex-col relative space-y-4">
      <div className="w-full flex flex-col xl:flex-row justify-center items-center">
        <h1 className="text-4xl text-[#8E0000] underline font-bold mt-5 text-center">
          Procedure Template Management
        </h1>
        <div className="flex-none hidden xl:block absolute right-8 mt-4">
          <CreateTemplateButton />
        </div>
        <div className="block xl:hidden mt-4">
          <CreateTemplateButton />
        </div>
      </div>
      <div className="w-full flex justify-center">
        <SearchBar inputValue={searchInput} setInputValue={setSearchInput} />
      </div>
      <div>
        <ProcedureTable
          filter={searchInput}
          data={data}
          setData={setData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ProcedureTemplateManagement;
