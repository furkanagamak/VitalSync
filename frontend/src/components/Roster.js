import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Table component 
function Table({ rows, onRowClick }) {
  return (
    <table className="w-full">
      <thead>
        <tr style={{ backgroundColor: "#8E0000", color: "white" }}>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Department</th>
          <th className="px-4 py-2">Position</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr
            key={index} // Ideally, use a unique ID from the database if available
            onClick={() => onRowClick(row)}
            style={{ backgroundColor: index % 2 === 0 ? "#F5F5DC" : "transparent" }}
          >
            <td className="px-4 py-2 h-12" style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row[0]}</td> 
            <td className="px-4 py-2 h-12" style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row[1]}</td> 
            <td className="px-4 py-2 h-12" style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row[2]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const ROWS_PER_PAGE = 10;

function MyComponent() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [users, setUsers] = useState([]);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users"); 
        const formattedUsers = response.data.map((user) => [
          `${user.firstName} ${user.lastName}`,
          user.department,
          user.position,
          user._id
        ]);

        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
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
  filteredRows = filteredRows.slice(currentPage * ROWS_PER_PAGE, (currentPage + 1) * ROWS_PER_PAGE);

  // Handle click on a user row
  const handleRowClick = (row) => {
    const userId = row[3]; // Access the user ID
    navigate(`/Profile/${userId}`); // Navigate to the profile route
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {/* Filters */}
      <div style={{ width: "90%" }} className="w-full flex justify-end items-center">
        <select
          className="px-3 py-2 border rounded mr-2"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        >
          <option value="">Select Category</option>
          <optgroup label="Department">
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Pediatrics">Pediatrics</option>
          </optgroup>
          <optgroup label="Position">
            <option value="Senior Consultant">Senior Consultant</option>
            <option value="Head of Department">Head of Department</option>
            <option value="Attending Physician">Attending Physician</option>
          </optgroup>
        </select>
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Roster Table */}
      <div style={{ width: "90%", height: "80%" }} className="flex flex-col justify-start items-center">
        <div className="w-full overflow-auto">
          <Table rows={filteredRows} onRowClick={handleRowClick} />
        </div>    

       {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`px-4 py-2 mx-1 ${index === currentPage ? "bg-gray-300" : "bg-white"} border rounded`}
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
