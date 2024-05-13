import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useProcessCreation } from '../../providers/ProcessCreationProvider';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { TextField, Button, Paper, Typography } from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import toast from 'react-hot-toast';


function ProcessStartTime() {
  const { setStartTime, setFetchedSections, patientInformation } = useProcessCreation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 3600000);
  const [selectedTime, setSelectedTime] = useState(oneHourLater);

  useEffect(() => {
    if (!(patientInformation.firstName)) {
      navigate("/processManagement/newProcess/processTemplates", { replace: true });    }
  }, []);


  const handleGoBack = () => {
    navigate('/processManagement/newProcess/patientForm');
  };

  const handleProceed = () => {
    const combinedDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    );
    if (combinedDateTime < new Date()) {
      toast.error("Invalid Start Time.");
      return;
    }
    setFetchedSections([]);
    setStartTime(combinedDateTime.toISOString()); 
    navigate("/processManagement/newProcess/pendingStaffAssignments");
  };

  const disablePastTime = (timeValue, timeType) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selected = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    if (timeType === 'hours' && selected.getTime() === today.getTime()) {
      return timeValue < now.getHours();
    }
    if (timeType === 'minutes' && selected.getHours() === now.getHours()) {
      return timeValue < now.getMinutes();
    }
    return false;
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
                minDate={new Date()}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </div>
            <div className="my-5">
              <TimePicker
                label="Select Time"
                value={selectedTime}
                onChange={setSelectedTime}
                shouldDisableTime={disablePastTime}
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