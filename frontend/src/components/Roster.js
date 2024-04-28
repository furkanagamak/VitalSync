import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Table component 
function Table({ rows, onRowClick }) {
  return (
    <div style={{
      margin: "auto",
      overflowX: "auto",
      display: "flex",
      justifyContent: "center",
    }}>
      <table className="w-full" style={{
        width: "100%",
        height: "100%",
        tableLayout: "fixed",
        borderCollapse: "separate",
        borderSpacing: "0 1px",
        fontSize: "1.32rem",
        textAlign: "center",
      }}>
        <thead>
          <tr style={{ color: "#8E0000" }}>
            <th className="px-4 py-2" style={{
              borderBottom: "1px solid #8E0000",
              padding: "10px",
              backgroundColor: "rgb(245, 245, 220)"
            }}>Name</th>
            <th className="px-4 py-2" style={{
              borderBottom: "1px solid #8E0000",
              padding: "10px"
            }}>Department</th>
            <th className="px-4 py-2" style={{
              borderBottom: "1px solid #8E0000",
              padding: "10px",
              backgroundColor: "rgb(245, 245, 220)"
            }}>Position</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <tr key={index} onClick={() => onRowClick(row)}>
                <td className="px-4 py-2" style={{ verticalAlign: 'middle', backgroundColor: "#F5F5DC", textAlign: 'center', borderBottom: "1px solid #8E0000" }}>{row[0]}</td>
                <td className="px-4 py-2" style={{ verticalAlign: 'middle', textAlign: 'center', borderBottom: "1px solid #8E0000" }}>{row[1]}</td>
                <td className="px-4 py-2" style={{ verticalAlign: 'middle', backgroundColor: "#F5F5DC", textAlign: 'center', borderBottom: "1px solid #8E0000" }}>{row[2]}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>No results found</td>
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

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users"); 
        const formattedUsers = response.data
          .filter(user => !user.isTerminated)  
          .map((user) => [
            `${user.firstName} ${user.lastName}`,
            user.department,
            user.position,
            user._id,
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
      <h1 className="text-4xl text-[#8E0000] text-center underline font-bold">
        Roster
      </h1>
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

      <div style={{ width: "90%", height: "80%" }} className="flex flex-col justify-start items-center">
        <div className="w-full overflow-auto">
          <Table rows={filteredRows} onRowClick={handleRowClick} />
        </div>    

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
