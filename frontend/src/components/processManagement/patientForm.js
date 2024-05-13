import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useProcessCreation } from '../../providers/ProcessCreationProvider';
import { useProcessModificationContext } from '../../providers/ProcessModificationProvider';
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



const states = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", 
  "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];


function PatientInformationForm() {
  const { patientInformation, setPatientInformation, processTemplate } = useProcessCreation();
  const { processInstance, editedPatient, updateProcessPatient } = useProcessModificationContext();
  const location = useLocation();
  const shouldRedirect = ((!(patientInformation.firstName) )&& (!location.state));

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

  const transformAndSetPatient = (editedPatient) => {
    const {
      _id, fullName, street, city, state, zip, dob, sex, phone, 
      emergencyContacts, knownConditions, allergies,insuranceProvider,
      insuranceGroup,
      insurancePolicy,
    } = editedPatient;
  
    const names = fullName.split(' ');
    const firstName = names[0];
    const lastName = names.slice(1).join(' ');
  
    const emergencyContact1 = emergencyContacts[0] || {};
    const emergencyContact2 = emergencyContacts[1] || {};

    const transformedDOB = new Date(dob)
    console.log(transformedDOB)
  
    const transformedPatient = {
      firstName: firstName || '',
      lastName: lastName || '',
      street: street || '',
      city: city || '',
      state: state || '',
      zip: zip || '',
      dob: transformedDOB || '',
      sex: sex || '',
      phone: phone || '',
      emergencyContact1Name: emergencyContact1.name || '',
      emergencyContact1Relation: emergencyContact1.relation || '',
      emergencyContact1Phone: emergencyContact1.phone || '',
      emergencyContact2Name: emergencyContact2.name || '',
      emergencyContact2Relation: emergencyContact2.relation || '',
      emergencyContact2Phone: emergencyContact2.phone || '',
      knownConditions: knownConditions || '',
      allergies: allergies || '',
      insuranceProvider: insuranceProvider || '', 
      insuranceGroup: insuranceGroup || '', 
      insurancePolicy: insurancePolicy || ''
    };
  
    return transformedPatient;
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (shouldRedirect) {
      navigate("/processManagement/modifyProcess/activeProcesses", { replace: true });
    }
  }, [navigate, shouldRedirect]);

  useEffect(() => {
    if (shouldRedirect) {
    return;
    }
    console.log(editedPatient);
    if(location.pathname.includes("modify")){
      if(Object.keys(editedPatient).length > 0){
        console.log(editedPatient);
        const transformedPatient = transformAndSetPatient(editedPatient);
        console.log(transformedPatient);

        setPatientInfo(transformedPatient);      }
      else if(Object.keys(processInstance.patient).length > 0){
        setPatientInfo(processInstance.patient);
      }
    }
    else{
    if (patientInformation && Object.keys(patientInformation).length > 0) {
      setPatientInfo(patientInformation);
    }}
  }, []);

  const handleGoBack = () => {
    navigate(-1, { state: { fromPatient: '/patientForm' } });
  };

  const restructurePatientInfoForContext = (patientInfo) => {

    const {
        firstName,
        lastName,
        street,
        city,
        state,
        zip,
        dob,
        sex,
        phone,
        emergencyContact1Name,
        emergencyContact1Relation,
        emergencyContact1Phone,
        emergencyContact2Name,
        emergencyContact2Relation,
        emergencyContact2Phone,
        knownConditions,
        allergies,
        insuranceProvider, 
        insuranceGroup, 
        insurancePolicy

    } = patientInfo;
    

    return {
        fullName: `${firstName} ${lastName}`,
        street,
        city,
        state,
        zip,
        dob,
        sex,
        phone,
        emergencyContacts: [
            { name: emergencyContact1Name, relation: emergencyContact1Relation, phone: emergencyContact1Phone },
            { name: emergencyContact2Name, relation: emergencyContact2Relation, phone: emergencyContact2Phone }
        ],
        knownConditions,
        allergies,
        insuranceProvider, 
        insuranceGroup, 
        insurancePolicy
    };
};


  const handleProceed = () => {
    if(location.pathname.includes("modify")){
      const transformedPatient = restructurePatientInfoForContext(patientInfo);
      console.log("saving patient");
      updateProcessPatient(transformedPatient);
      navigate(-1);
    }
    setPatientInformation(patientInfo);
    console.log(patientInfo);
    navigate("/processManagement/newProcess/startTime");
  };

  const handleChange = (event) => {

    const { name, value } = event.target;
    console.log(name,value);
  
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
      <button className="bg-primary text-white rounded-full px-5 py-2 text-xl flex " onClick={handleGoBack}>
                <FaArrowLeft className="mr-2" />
                Go Back
            </button>
        <div className="flex  mb-6"> 
            <div className="mx-auto">
          <Typography variant="h4" component="h2" color="primary.main" fontWeight="bold">
            Patient Information
          </Typography></div>
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
              className="phoneInput1"
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
                  <FormControl variant="outlined" fullWidth required>
                    <InputLabel htmlFor="state-select">State</InputLabel>
                    <Select
                      id="state-selection"
                      labelId="state-select"
                      label="State"
                      variant="outlined"
                      name="state"
                      value={patientInfo.state}
                      onChange={handleChange}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                          },
                        },
                      }}
                    >
                      {states.map((state) => (
                        <MenuItem key={state} value={state}>
                          {state}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
              className="phoneInput2"
              value={patientInfo.emergencyContact1Phone}

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
              className="phoneInput3"
              value={patientInfo.emergencyContact2Phone}

              onChange={(phone ) => handlePhoneChange(phone , 'emergencyContact2Phone')}/>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Insurance Information</Typography>
              <Box mb={2} mt={1}>
                <TextField label="Insurance Provider" variant="outlined" name="insuranceProvider" value={patientInfo.insuranceProvider} onChange={handleChange} fullWidth required />
              </Box>
              <Box mb={2}> <TextField label="Group #" variant="outlined" name="insuranceGroup" value={patientInfo.insuranceGroup} onChange={handleChange} fullWidth required />
              </Box>
              <Box mb={2}><TextField label="Policy #" variant="outlined" name="insurancePolicy" value={patientInfo.insurancePolicy} onChange={handleChange} fullWidth required />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
            <Typography variant="h6">Health Information</Typography>
              <Box mb={2} mt={1}>
                <TextField multiline
                  rows={2}
                label="Known Conditions" variant="outlined" name="knownConditions" value={patientInfo.knownConditions} onChange={handleChange} fullWidth  required/>
              </Box>
              <Box mb={2}>
                <TextField multiline
                  rows={2}
                label="Allergies" variant="outlined" name="allergies" onChange={handleChange} value={patientInfo.allergies} fullWidth required/>
              </Box>
            </Grid>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="submit"
                className="hover:bg-green-600 bg-highlightGreen text-white mx-auto text-2xl py-4 px-16 rounded-3xl mt-10 mb-5"
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