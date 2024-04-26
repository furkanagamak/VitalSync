import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useProcessCreation } from '../../providers/ProcessCreationProvider';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { TextField, Button, Paper, Typography } from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';

function ProcessStartTime() {
  const { setStartTime } = useProcessCreation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleProceed = () => {
    const combinedDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    );
    setStartTime(combinedDateTime.toISOString()); 
    navigate("/processManagement/newProcess/pendingStaffAssignments");
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
    
        <button className="bg-primary text-white rounded-full px-5 py-2 text-xl flex items-center" onClick={handleGoBack}>
                <FaArrowLeft className="mr-2" />
                Go Back
            </button>
      </div>
      <div className="flex justify-center items-center mb-6 mx-auto">
        <Typography variant="h4" component="h2" color="#8E0000" fontWeight="bold">
          Process Start Time
        </Typography>
      </div>
      <Paper style={{ padding: "7rem", marginBottom: "20px" }} elevation={10}>
        <div className="flex flex-col items-center">
          <Typography variant="h6" gutterBottom>
            Select a start date and time for the process:
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="my-5">
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={setSelectedDate}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </div>
            <div className="my-5">
              <TimePicker
                label="Select Time"
                value={selectedTime}
                onChange={setSelectedTime}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </div>
          </LocalizationProvider>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleProceed}
            className="bg-highlightGreen text-white mx-auto text-2xl py-4 px-16 rounded-3xl"
          >
            Proceed
          </button>
        </div>
      </Paper>
    </div>
  );
}

export default ProcessStartTime;