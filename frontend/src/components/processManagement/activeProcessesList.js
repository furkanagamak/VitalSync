
import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FaSearch } from "react-icons/fa";
import { useTheme } from '@mui/material/styles';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8e0000',
    },
    secondary: {
      main: '#f5f5dc',
    },
  },
});

function SearchBar({ onChange }) {
  return (
    <div className="flex justify-center items-center p-5 mb-5 mt-5">
      <div className="relative w-2/5">
        <input
          type="search"
          placeholder="Search by Process ID or Patient Name"
          className="w-full p-3.5 pl-5 pr-10 bg-beige-200 text-primary border-2 border-primary rounded-full text-lg leading-tight focus:outline-none"
          onChange={(e) => onChange(e.target.value)}
        />
        <FaSearch className="absolute right-5 top-1/2 transform -translate-y-1/2 text-primary text-xl" />
      </div>
    </div>
  );
}

function ProcessCell({ process, onModifyClick, onViewClick, pid }) {
  const handleViewClickID = () => {
    navigate(`/processDetails/${process.processID}`);
  };

  const handleModifyClickID = () => {
    navigate(`/processManagement/modifyProcess/landing/${process.processID}`);
  };

  const navigate = useNavigate(); 


  return (
    <div className="flex overflow-hidden bg-primary rounded-2xl p-7 mb-5 text-white text-2xl m-5">
      <div className="flex-[1.5] border-r border-white min-w-0 pr-4">
        <div className="space-y-1">
          <p className="truncate"><span className="underline">Patient:</span> {process.patientFullName}</p>
          <p className="truncate"><span className="underline">Process:</span> {process.processName}</p>
          <p className="truncate"><span className="underline">Process ID:</span> {process.processID}</p>
        </div>
      </div>
      <div className="flex-[2] border-r border-white min-w-0 px-4">
        <div className="space-y-1">
          <p className="truncate"><span className="underline">Current Procedure:</span> {process.currentProcedure}</p>
          <p className="truncate"><span className="underline">Next Procedure:</span> {process.nextProcedure}</p>
        </div>
      </div>
      <div className="flex-[1] pl-4 flex justify-end items-start min-w-0">
        <div className="flex flex-col space-y-2">
          <button className="bg-green-500 hover:bg-green-600 rounded-full px-10 py-1 text-center" onClick={handleViewClickID}>View</button>
          <button className="bg-red-500 hover:bg-red-600 rounded-full px-4 py-1 text-center"
 onClick={handleModifyClickID}>Modify</button>
        </div>
      </div>
    </div>
  );
}

export function ActiveProcessesList() {
  const [processes, setProcesses] = useState([]);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [filteredProcesses, setFilteredProcesses] = useState([]);


  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const response = await axios.get('/processInstancesActive');
        setProcesses(response.data);
        setFilteredProcesses(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Failed to fetch process instances', error);
      }
    };

    fetchProcesses();
  }, []);

  useEffect(() => {
    const filtered = processes.filter(
      p => p.processID.includes(searchInput.trim()) || p.patientFullName.toLowerCase().includes(searchInput.trim().toLowerCase())
    );
    setFilteredProcesses(filtered);
  }, [searchInput, processes]);

  const handleChange = (event, value) => {
      setPage(value);
  };

  const handleModifyClick = (pid) => {
    navigate(`/processManagement/modifyProcess/landing/${pid}`);
  };

  const handleViewClick = () => {
    navigate(`/processDetails/${process.objectID}`);
  };

  const indexOfLastItem = page * 8;
  const indexOfFirstItem = indexOfLastItem - 8;
  const currentItems = filteredProcesses.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <ThemeProvider theme={theme}>
      <SearchBar onChange={setSearchInput} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-10 py-5">
  {currentItems.length > 0 ? (
    currentItems.map((process, index) => (
      <ProcessCell key={index} process={process} onModifyClick={handleModifyClick} onViewClick={handleViewClick} pid={process.processID}/>
    ))
  ) : (
    <div className="col-span-full text-center text-xl text-primary">
      No results found
    </div>
  )}
</div>
      <Stack spacing={2} alignItems="center" className="py-5">
        <Pagination 
          color="primary"
          size="large"
          count={Math.ceil(filteredProcesses.length / 8)} 
          page={page} 
          onChange={handleChange} 
          showFirstButton 
          showLastButton 
          sx={{
            ".MuiPaginationItem-root": {
              color: '#8e0000', 
            },
            ".Mui-selected": {
              backgroundColor: '#8e0000',
              color: 'white',
              '&:hover': {
                backgroundColor: '#8e0000', 
              },
            },
            ".MuiPaginationItem-ellipsis": {
              color: '#8e0000',
            }
          }}/>
      </Stack>
    </ThemeProvider>
  );
}

export default ActiveProcessesList;