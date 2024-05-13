import ResourceDeleteModal from "./ResourceDeleteModal";
import { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { AiOutlineSearch } from "react-icons/ai";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";

//change layout when md breakpoint

const ResourceView = ({ resources, setResources, navToEditResource }) => {
  // all resources
  const [equipment, setEquipment] = useState(null);
  const [roles, setRoles] = useState(null);

  // filters
  const [tabFilter, setTabFilter] = useState("All");
  const [textFilter, setTextFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // all resources displayed inside the table
  const [displayingResources, setDisplayingResources] = useState([]);

  const removeResourceById = (uniqueIdentifier) => {
    if (tabFilter === "Personnel") {
      setRoles((currentRoles) =>
        currentRoles.filter(role => role.uniqueIdentifier !== uniqueIdentifier)
      );
    } 
    if (resources)
      setResources((resources) =>
        resources.filter(
          (resource) => resource.uniqueIdentifier !== uniqueIdentifier
        )
      );
  };

  // initial fetch
  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const resPromise = axios.get("/resources");
        const rolePromise = axios.get("/roles");
        const [resResponse, roleResponse] = await Promise.all([
          resPromise,
          rolePromise,
        ]);

        // Setting state for each category
        setEquipment(resResponse.data);
        setRoles(roleResponse.data);

        // Combining both arrays and setting the combined array to resources
        const combinedResources = [...resResponse.data, ...roleResponse.data];
        setResources(combinedResources);

        console.log("Combined Resources:", combinedResources);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  // updates the display resources whenever a filter is updated
  useEffect(() => {
    let filteredDataByType;
    if (!resources) return;

    if (tabFilter === "All") {
      filteredDataByType = resources; // Show all resources when "All" is selected
    } else if (tabFilter === "Personnel") {
      filteredDataByType = roles; // Show only roles when "Personnel" is selected
    } else if (tabFilter === "Equipments") {
      filteredDataByType = resources.filter(
        (resource) => resource.type === "equipment"
      ); // Show only roles when "Personnel" is selected
    } else {
      filteredDataByType = resources.filter(
        (resource) => resource.type === tabFilter.toLowerCase()
      );
    }

    const filteredResources =
      textFilter === ""
        ? filteredDataByType
        : filteredDataByType.filter((resource) => {
            const searchText = textFilter.toLowerCase();
            return (
              resource.name.toLowerCase().includes(searchText) ||
              resource.description.toLowerCase().includes(searchText) ||
              (resource.location &&
                resource.location.toLowerCase().includes(searchText)) ||
              resource.uniqueIdentifier.toLowerCase().includes(searchText)
            );
          });
    setDisplayingResources(filteredResources);
  }, [tabFilter, textFilter, resources]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={150} color={"#8E0000"} />
      </div>
    );
  }
  return (
    <div>
      <section className="flex flex-col md:flex-row items-center space-y-4 mt-8 mb-4 w-full">
        <div className="sm:w-1/4 inline-block md:text-center text-primary text-3xl font-semibold">
          Resources
        </div>
        <Searchbar setTextFilter={setTextFilter} />
        <CreateNewButton />
      </section>
      <section className="flex flex-col xl:flex-row w-full">
        <div className="flex justify-center">
          <Filters tabFilter={tabFilter} setTabFilter={setTabFilter} />
        </div>
        <div className="flex-1">
          <Table
            resources={displayingResources}
            navToEditResource={navToEditResource}
            removeResourceById={removeResourceById}
          />
        </div>
      </section>
    </div>
  );
};

const Searchbar = ({ setTextFilter }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (newSearchText) => {
    setTextFilter(newSearchText);
  };

  return (
    <div className="relative w-1/2 h-12">
      <input
        id="resourceSearchInpElem"
        type="text"
        placeholder="Search for the resource here ..."
        className="border rounded-full h-12 py-2 pl-4 pr-12 w-full bg-secondary text-sm md:text-base"
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      <button
        className="absolute right-0 top-0 bottom-0 h-12 rounded-r-md pr-4"
        style={{ pointerEvents: "none" }}
      >
        <AiOutlineSearch className="text-highlightRed h-8 w-8" />
      </button>
    </div>
  );
};

const CreateNewButton = () => {
  return (
    <Link
      to="/resources/create"
      className="md:w-32 md:ml-12 flex justify-center"
      id="createNewResourceBtn"
    >
      <button
        title="Click to Create a New Resource"
        className="px-2 md:px-0 bg-primary text-white text-lg font-semibold rounded-md py-2"
      >
        Create New Resources
      </button>
    </Link>
  );
};

const Filters = ({ tabFilter, setTabFilter }) => {
  const allFilters = ["All", "Equipments", "Spaces", "Personnel"];

  return (
    <div
      className="flex xl:flex-col items-center bg-secondary h-fit mx-4 py-4 px-2 mb-4 xl:mb-0"
      id="filterContainerElem"
    >
      {allFilters.map((filter) => (
        <button
          key={filter}
          className={`text-lg font-medium mb-2 flex flex-col items-center mx-4 xl:mx-0 ${
            tabFilter === filter ? "text-red-600" : "text-black"
          }`}
          onClick={() => setTabFilter(filter)}
          id={`${filter}Filter`}
          title={`Filter by ${filter}`}
        >
          {filter}
          {tabFilter === filter && (
            <div className="h-1 w-6 bg-red-600 mt-1"></div>
          )}
        </button>
      ))}
    </div>
  );
};

const Table = ({ resources, navToEditResource, removeResourceById }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        tooltip: "Sort by Name",
        Cell: ({ value }) => <div className="capitalize">{value}</div>,
      },
      {
        Header: "Description",
        accessor: "description",
        tooltip: "Sort by Description",
      },
      {
        Header: "Location",
        accessor: "location",
        tooltip: "Sort by Location",
        Cell: ({ value }) => <div className="capitalize">{value}</div>,
      },
      {
        Header: "Unique ID",
        accessor: "uniqueIdentifier",
        tooltip: "Sort by Unique ID",
      },
      {
        Header: "Actions",
        accessor: "actions",
        id: "actions",
        tooltip: "",
        disableSortBy: true,
        Cell: ({ row }) => (
          <div className="flex justify-evenly flex-col xl:flex-row items-center">
            <FaPen
              onClick={() => navToEditResource(row.original)}
              className="cursor-pointer text-primary my-2 xl:my-0"
              id={`editResource-${row.original.uniqueIdentifier}`}
              title="Edit Resource"
            />
            <FaTrashAlt
              onClick={() => {
                setShowDeleteModal(true);
                setResourceToDelete(row.original);
              }}
              className="cursor-pointer text-primary"
              id={`deleteResource-${row.original.uniqueIdentifier}`}
              title="Delete Resource"
            />
          </div>
        ),
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
    { columns, data: resources, initialState: { pageIndex: 0, pageSize: 5 } },
    useSortBy,
    usePagination
  );

  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  const handleDelete = () => {
    console.log("Deleting resource:", resourceToDelete);
    removeResourceById(resourceToDelete.uniqueIdentifier);
    setShowDeleteModal(false);
    setResourceToDelete(null);
  };

  const handleCancel = () => {
    setShowDeleteModal(false);
    setResourceToDelete(null);
  };

  return (
    <>
      {showDeleteModal && (
        <ResourceDeleteModal
          resource={resourceToDelete}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      )}
      <div className="w-full overflow-x-auto">
        <table {...getTableProps()} className="w-full min-w-xs table-auto">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, i) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={`border-b-2 border-[#aa0000] py-2 px-0 xl:px-4 text-left text-highlightRed ${
                      i % 2 === 0 ? "bg-secondary" : ""
                    }`}
                    title={column.tooltip}
                    style={{
                      whiteSpace: "normal",
                      minWidth: column.minWidth,
                      cursor: column.id !== "actions" ? "pointer" : "default",
                    }}
                  >
                    <div className="flex text-center flex-col xl:flex-row">
                      {column.render("Header")}
                      {column.id !== "actions" && (
                        <span className="flex items-center">
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <MdArrowDropDown className="w-8 h-8" />
                            ) : (
                              <MdArrowDropUp className="w-8 h-8" />
                            )
                          ) : (
                            <MdArrowDropDown className="w-8 h-8" />
                          )}
                        </span>
                      )}
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
                  <tr
                    {...row.getRowProps()}
                    className="border-b-2 border-[#aa0000]"
                  >
                    {row.cells.map((cell, i) => (
                      <td
                        {...cell.getCellProps()}
                        className={`py-6 px-4 ${
                          i % 2 === 0 ? "bg-secondary" : ""
                        }`}
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6"
                  style={{
                    borderBottom: "none",
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="w-full mx-auto flex justify-center space-x-4 mt-4 mb-16 relative">
          <span className="absolute left-0">
            Page{" "}
            <strong>
              {pageIndex + 1} of{" "}
              {pageOptions.length === 0 ? 1 : pageOptions.length}
            </strong>
          </span>
          <div></div>
          <button
            onClick={previousPage}
            disabled={!canPreviousPage}
            id="resourceTablePrevBtn"
            className={`${
              canPreviousPage ? "bg-secondary" : "bg-gray-300"
            } border-2 border-primary p-2 rounded-full`}
          >
            Previous
          </button>
          <button
            onClick={nextPage}
            disabled={!canNextPage}
            id="resourceTableNextBtn"
            className={`${
              canNextPage ? "bg-secondary" : "bg-gray-300"
            }  border-2 border-primary py-2 px-4 rounded-full`}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default ResourceView;
