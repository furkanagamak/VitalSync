import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useProcessCreation } from '../../providers/ProcessCreationProvider';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box
} from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'




function PatientInformationForm() {
  const { setPatientInformation } = useProcessCreation();
  const [patientInfo, setPatientInfo] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    dob: '',
    sex: '',
    phone: '',
    emergencyContact1Name: '',
    emergencyContact1Relation: '',
    emergencyContact1Phone: '',
    emergencyContact2Name: '',
    emergencyContact2Relation: '',
    emergencyContact2Phone: '',
    knownConditions: '',
    allergies: '',
    insuranceProvider: '',
    insuranceGroup: '',
    insurancePolicy: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    handleProceed();
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleProceed = () => {
    setPatientInformation(patientInfo);
    navigate("/processManagement/newProcess/startTime");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
  
    if (['zip', 'insuranceGroup', 'insurancePolicy'].includes(name)) {
      if (!/^\d*$/.test(value)) {
        return;
      }
    }
  
    if (['phone', 'emergencyContact1Phone', 'emergencyContact2Phone'].includes(name)) {
      if (!/^(\d{0,3}-?)?(\d{0,3}-?)?\d{0,4}$/.test(value) && value !== '') {
        return;
      }
    }
  
    setPatientInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value, field) => {
    setPatientInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const theme = createTheme({
    typography: {
      fontSize: 14,
      button: {
        textTransform: "none",
      },
    },
    palette: {
      primary: {
        main: "#8E0000",
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#8E0000",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#8E0000",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#8E0000",
            },
            backgroundColor: "white",
          },
          input: {
            "&.MuiOutlinedInput-inputMultiline": {
              backgroundColor: "white",
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          iconOutlined: {
            color: "#8E0000",
          },
          select: {
            color: "#8E0000",
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: "#8E0000",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: "#8E0000",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <Button
            startIcon={<FaArrowLeft />}
            onClick={handleGoBack}
            style={{ backgroundColor: '#8E0000', color: 'white', maxWidth: '30%' }}
          >
            Go Back
          </Button>
          <Typography variant="h4" component="h2" color="primary.main" fontWeight="bold">
            Patient Information
          </Typography>
          <div></div>
        </div>
        
        <Paper style={{ padding: "20px", marginBottom: "20px" }} elevation={4}>
        <p className="text-sm italic text-gray-600 mb-4">All fields are required.</p>
        <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box mb={2}>
                <TextField label="First Name" variant="outlined" name="firstName" value={patientInfo.firstName} onChange={handleChange} fullWidth required />
              </Box>
              <Box mb={2}>
                <TextField label="Last Name" variant="outlined" name="lastName" value={patientInfo.lastName} onChange={handleChange} fullWidth required />
              </Box>
              <Box mb={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date of Birth"
                      value={patientInfo.dob}
                      onChange={(newValue) => setPatientInfo(prev => ({ ...prev, dob: newValue }))}
                      renderInput={(params) => <TextField {...params} fullWidth required />}
                    />
                  </LocalizationProvider>
                  </Box>
              <Box mb={2}>
                <TextField label="Sex" variant="outlined" name="sex" value={patientInfo.sex} onChange={handleChange} fullWidth required />
              </Box>
              <Box mb={2}>
              <Typography variant="h6" >Phone #</Typography>
              <PhoneInput
              country={'us'}
              value={patientInfo.phone}
              onChange={(phone ) => handlePhoneChange(phone , 'phone')}
              />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box mb={2}>
                <TextField label="Street Address" variant="outlined" name="street" value={patientInfo.street} onChange={handleChange} fullWidth required />
              </Box>
              <Box mb={2}>
                <TextField label="City" variant="outlined" name="city" value={patientInfo.city} onChange={handleChange} fullWidth required />
              </Box>
              <Box mb={2}>
                <TextField label="State" variant="outlined" name="state" value={patientInfo.state} onChange={handleChange} fullWidth required />
              </Box>
              <Box mb={2}>
                <TextField label="ZIP" variant="outlined" name="zip" value={patientInfo.zip} onChange={handleChange} fullWidth required />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Emergency Contact 1</Typography>
              <Box mb={2} mt={1}>
                <TextField label="Name" variant="outlined" name="emergencyContact1Name" value={patientInfo.emergencyContact1Name} onChange={handleChange}  fullWidth required />
              </Box>
              <Box mb={2}>
                <TextField label="Relation" variant="outlined" name="emergencyContact1Relation" value={patientInfo.emergencyContact1Relation} onChange={handleChange} fullWidth required />
              </Box>
              <Box mb={2}>
              <Typography variant="h6" >Phone #</Typography>
              <PhoneInput
              country={'us'}
              onChange={(phone ) => handlePhoneChange(phone , 'emergencyContact1Phone')}/>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Emergency Contact 2</Typography>
              <Box mb={2} mt={1}>
                <TextField label="Name" variant="outlined" name="emergencyContact2Name" value={patientInfo.emergencyContact2Name} onChange={handleChange} fullWidth required />
              </Box>
              <Box mb={2}>
                <TextField label="Relation" variant="outlined" name="emergencyContact2Relation" value={patientInfo.emergencyContact2Relation} onChange={handleChange} fullWidth required />
              </Box>
              <Box mb={2}>
              <Typography variant="h6" >Phone #</Typography>
              <PhoneInput
              country={'us'}
              onChange={(phone ) => handlePhoneChange(phone , 'emergencyContact2Phone')}/>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Insurance Information</Typography>
              <Box mb={2} mt={1}>
                <TextField label="Insurance Provider" variant="outlined" name="insuranceProvider" value={patientInfo.insuranceProvider} onChange={handleChange} fullWidth required />
              </Box>
              <Box mb={2}> <TextField label="Group #" variant="outlined" name="insuranceGroup" value={patientInfo.insuranceGroup} onChange={handleChange} fullWidth required />
              </Box>
              <Box mb={2}><TextField label="Policy #" variant="outlined" name="insurancePolicy" value={patientInfo.insurancePolicy} onChange={handleChange} fullWidth required />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box mb={2}>
                <TextField label="Known Conditions" variant="outlined" name="knownConditions" value={patientInfo.knownConditions} onChange={handleChange} fullWidth  required/>
              </Box>
              <Box mb={2}>
                <TextField label="Allergies" variant="outlined" name="allergies" onChange={handleChange} value={patientInfo.allergies} fullWidth required/>
              </Box>
            </Grid>
            <Grid item xs={12}>
            <button
              type="submit"
              className="bg-highlightGreen text-white mx-auto text-2xl py-4 px-16 rounded-3xl"
            >
              Proceed
            </button>
            </Grid>
          </Grid>
          </form>
        </Paper>
      </div>
    </ThemeProvider>
  );
}

export default PatientInformationForm;