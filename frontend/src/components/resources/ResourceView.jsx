import ResourceDeleteModal from "./ResourceDeleteModal";
import { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { AiOutlineSearch } from "react-icons/ai";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";

const ResourceView = ({ resources, setResources, navToEditResource }) => {
  // all resources
  const [equipment, setEquipment] = useState(null);
  const [roles, setRoles] = useState(null);

  // filters
  const [tabFilter, setTabFilter] = useState("All");
  const [textFilter, setTextFilter] = useState("");

  // all resources displayed inside the table
  const [displayingResources, setDisplayingResources] = useState([]);

  const removeResourceById = (uniqueIdentifier) => {
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
                resource.location.toLowerCase().includes(searchText))
            );
          });
    setDisplayingResources(filteredResources);
  }, [tabFilter, textFilter, resources]);

  if (displayingResources === null) return <div>Loading Resources ...</div>;
  return (
    <div>
      <section className="flex flex-col md:flex-row items-center space-y-4 my-8 w-full">
        <div className="w-1/4 text-center text-primary text-3xl font-semibold">
          Resources
        </div>
        <Searchbar setTextFilter={setTextFilter} />
        <CreateNewButton />
      </section>
      <section className="flex">
        <Filters tabFilter={tabFilter} setTabFilter={setTabFilter} />
        <Table
          resources={displayingResources}
          navToEditResource={navToEditResource}
          removeResourceById={removeResourceById}
        />
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
        type="text"
        placeholder="Search for the resource here ..."
        className="border rounded-full h-12 py-2 pl-4 pr-12 w-full bg-secondary"
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          handleSearch(e.target.value);
        }}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            handleSearch(searchText);
          }
        }}
      />
      <button
        className="absolute right-0 top-0 bottom-0 h-12 rounded-r-md pr-4"
        onClick={() => handleSearch(searchText)}
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
      className="w-1/6 flex justify-center"
      id="createNewResourceBtn"
    >
      <button className="bg-primary text-white text-lg font-semibold rounded-md w-32 py-2">
        Create New Resources
      </button>
    </Link>
  );
};

const Filters = ({ tabFilter, setTabFilter }) => {
  const allFilters = ["All", "Equipments", "Spaces", "Personnel"];

  return (
    <div className="flex flex-col items-center bg-secondary h-fit mx-4 py-4 px-2">
      {allFilters.map((filter) => (
        <button
          key={filter}
          className={`text-lg font-medium mb-2 flex flex-col items-center ${
            tabFilter === filter ? "text-red-600" : "text-black"
          }`}
          onClick={() => setTabFilter(filter)}
          id={`${filter}Filter`}
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
  // define all columns and their accessors
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ value }) => <div className="capitalize">{value}</div>,
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Location",
        accessor: "location",
        Cell: ({ value }) => <div className="capitalize">{value}</div>,
      },
      {
        Header: "Unique ID",
        accessor: "uniqueIdentifier",
      },
      {
        Header: "Actions",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }) => (
          <div className="flex justify-evenly">
            <FaPen
              onClick={() => navToEditResource(row.original)}
              className="cursor-pointer text-primary"
            />
            <FaTrashAlt
              onClick={() => {
                setShowDeleteModal(true);
                setResourceToDelete(row.original);
              }}
              className="cursor-pointer text-primary"
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

  // delete modal necessities
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  // actions for delete modal
  const handleDelete = () => {
    // Perform deletion logic here
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
      <div className="w-full mx-12">
        <table {...getTableProps()} className="w-full">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, i) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={`border-b-2 border-[#aa0000] py-2 px-4 text-left text-highlightRed ${
                      i % 2 === 0 ? "bg-secondary" : ""
                    }`}
                  >
                    <div className="flex text-center">
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
                    {row.cells.map((cell, i) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          className={`py-6 px-4 ${
                            i % 2 === 0 ? "bg-secondary" : ""
                          }`}
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
                  className="text-center py-6"
                  style={{ borderBottom: "none" }}
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
              {pageOptions.length === 0 ? 1 : Math.ceil(pageOptions.length / 3)}
            </strong>
          </span>
          <div></div>
          <button
            onClick={previousPage}
            disabled={!canPreviousPage}
            className={`${
              canPreviousPage ? "bg-secondary" : "bg-gray-300"
            } border-2 border-primary p-2 rounded-full`}
          >
            Previous
          </button>
          <button
            onClick={nextPage}
            disabled={!canNextPage}
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
