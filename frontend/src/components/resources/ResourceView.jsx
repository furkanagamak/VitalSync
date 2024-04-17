import ResourceDeleteModal from "./ResourceDeleteModal";
import { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { AiOutlineSearch } from "react-icons/ai";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";

const ResourceView = ({ navToEditResource }) => {
  // all resources
  const [resources, setResources] = useState(null);
  const [roles, setRoles] = useState(null);
  // filters
  const [tabFilter, setTabFilter] = useState("All");
  const [textFilter, setTextFilter] = useState("");

  // all resources displayed inside the table
  const [displayingResources, setDisplayingResources] = useState([]);

  // initial fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPromise = axios.get("/resources");
        const rolePromise = axios.get("/roles");
        const [resResponse, roleResponse] = await Promise.all([resPromise, rolePromise]);
        // Enrich resources with role data
        const enrichedResources = resResponse.data.map(resource => {
          // Assuming each resource has a roleId that matches role.id
          const roleDetails = roleResponse.data.find(role => role.id === resource.roleId);
          return { ...resource, role: roleDetails };
        });

        setResources(enrichedResources);

        // Print the combined resources to the console
        console.log("Combined Resources with Roles:", enrichedResources);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!resources || !roles) return;
    
    const filteredDataByType = tabFilter === "All"
      ? resources
      : resources.filter(resource => resource.type === tabFilter.toLowerCase());

    const filteredResources = textFilter === ""
      ? filteredDataByType
      : filteredDataByType.filter(resource => {
          const searchText = textFilter.toLowerCase();
          return (
            resource.name.toLowerCase().includes(searchText) ||
            resource.description.toLowerCase().includes(searchText) ||
            (resource.location && resource.location.toLowerCase().includes(searchText)) ||
            resource.uniqueIdentifier.toLowerCase().includes(searchText) ||
            resource.status.toLowerCase().includes(searchText) ||
            roles.some(role => role.name.toLowerCase().includes(searchText) && role.uniqueIdentifier === resource.roleId) // Hypothetical association
          );
      });
    setDisplayingResources(filteredResources);
  }, [tabFilter, textFilter, resources, roles]);

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
        />
      </section>
    </div>
  );
};

const Searchbar = ({ setTextFilter }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    setTextFilter(searchText);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative w-1/2 h-12 ">
      <input
        type="text"
        placeholder="Search for the resource here ..."
        className="border rounded-full h-12 py-2 pl-4 pr-12 w-full bg-secondary"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button
        className="absolute right-0 top-0 bottom-0 h-12 rounded-r-md pr-4"
        onClick={handleSearch}
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
      className="w-1/4 flex justify-center"
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

const Table = ({ resources, navToEditResource }) => {
  // define all columns and their accessors
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Location",
        accessor: "location",
      },
      {
        Header: "Unique ID",
        accessor: "uniqueIdentifier",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            style={{
              color:
                value === "In-use"
                  ? "#AA0000"
                  : value === "Available"
                  ? "#009020"
                  : "black",
            }}
          >
            {value}
          </span>
        ),
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
            {page.map((row) => {
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
            })}
          </tbody>
        </table>
        <div className="w-full mx-auto flex justify-center space-x-4 mt-4 mb-16 relative">
          <span className="absolute left-0">
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
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
