import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";

// Table component
function Table({ rows, onRowClick }) {
  return (
    <div
      style={{
        margin: "auto",
        overflowX: "auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <table
        className="w-full text-sm lg:text-xl"
        style={{
          width: "100%",
          height: "100%",
          tableLayout: "fixed",
          borderCollapse: "separate",
          borderSpacing: "0 1px",
          textAlign: "center",
        }}
      >
        <thead>
          <tr style={{ color: "#8E0000" }}>
            <th
              className="px-4 py-2"
              style={{
                borderBottom: "1px solid #8E0000",
                padding: "10px",
                backgroundColor: "rgb(245, 245, 220)",
              }}
            >
              Name
            </th>
            <th
              className="px-4 py-2"
              style={{
                borderBottom: "1px solid #8E0000",
                padding: "10px",
              }}
            >
              Department
            </th>
            <th
              className="px-4 py-2"
              style={{
                borderBottom: "1px solid #8E0000",
                padding: "10px",
                backgroundColor: "rgb(245, 245, 220)",
              }}
            >
              Position
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <tr 
                key={index}
                onClick={() => onRowClick(row)}
                style={{ cursor: "pointer" }}
                title={`Click to view ${row[0]}'s profile`}
              >
                <td 
                  className="px-4 py-2"
                  style={{
                    verticalAlign: "middle",
                    backgroundColor: "#F5F5DC",
                    textAlign: "center",
                    borderBottom: "1px solid #8E0000",
                  }}
                >
                  {row[0]}
                </td>
                <td
                  className="px-4 py-2"
                  style={{
                    verticalAlign: "middle",
                    textAlign: "center",
                    borderBottom: "1px solid #8E0000",
                  }}
                >
                  {row[1]}
                </td>
                <td
                  className="px-4 py-2"
                  style={{
                    verticalAlign: "middle",
                    backgroundColor: "#F5F5DC",
                    textAlign: "center",
                    borderBottom: "1px solid #8E0000",
                  }}
                >
                  {row[2]}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const ROWS_PER_PAGE = 10;

function MyComponent() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const usersResponse = await axios.get("/users");
        const positionsResponse = await axios.get("/positions");
        const departmentsResponse = await axios.get("/departments");

        const formattedUsers = usersResponse.data
          .filter((user) => !user.isTerminated)
          .map((user) => [
            `${user.firstName} ${user.lastName}`,
            user.department,
            user.position,
            user._id,
          ]);
        setUsers(formattedUsers);
        setPositions(positionsResponse.data);
        setDepartments(departmentsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and Search Logic
  let filteredRows = users.filter(
    (user) =>
      (!filterValue ||
        user[1].toLowerCase().includes(filterValue.toLowerCase()) ||
        user[2].toLowerCase().includes(filterValue.toLowerCase())) &&
      (searchTerm === "" ||
        user[0].toLowerCase().includes(searchTerm.toLowerCase()) ||
        user[1].toLowerCase().includes(searchTerm.toLowerCase()) ||
        user[2].toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Paginate Users
  const totalPages = Math.ceil(filteredRows.length / ROWS_PER_PAGE);
  filteredRows = filteredRows.slice(
    currentPage * ROWS_PER_PAGE,
    (currentPage + 1) * ROWS_PER_PAGE
  );

  // Handle click on a user row
  const handleRowClick = (row) => {
    const userId = row[3]; // Access the user ID
    navigate(`/Profile/${userId}`); // Navigate to the profile route
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={150} color={"#8E0000"} />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-4xl text-[#8E0000] text-center underline font-bold pb-4">
        Roster
      </h1>
      <div
        style={{ width: "90%" }}
        className="w-full flex justify-end items-center"
      >
        <select
          className=" px-3 py-2  mr-2 w-full sm:w-64  focus:outline-none focus:border-primary 
            inline-flex items-center rounded-full text:sm lg:text-xl placeholder-primary border-2 border-[#8E0000] bg-[#F5F5DC] p-2 min-w-32 relative mb-2"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        >
          <option value="">Filter by Category</option>
          <optgroup label="Department">
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </optgroup>
          <optgroup label="Position">
            {positions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </optgroup>
        </select>
        <input
          type="text"
          placeholder="Search..."
          className=" focus:outline-none focus:border-primary inline-flex items-center rounded-full text-xl placeholder-primary border-2  min-w-32 border-[#8E0000] bg-[#F5F5DC] p-2 mb-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div
        style={{ width: "90%", height: "80%" }}
        className="flex flex-col justify-start items-center"
      >
        <div className="w-full overflow-auto">
          <Table rows={filteredRows} onRowClick={handleRowClick} />
        </div>

        {totalPages > 1 && (
          <div className="flex mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`px-4 py-2 mx-1 ${
                  index === currentPage ? "bg-gray-300" : "bg-white"
                } border rounded`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyComponent;
