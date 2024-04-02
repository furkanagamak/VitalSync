import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import "./App.css";

const ModifyTemplateButton = () => {
  return (
    <button className="flex items-center text-xl justify-center px-4 py-2 bg-[#F5F5DC] text-[#8E0000] border-2 border-[#8E0000] rounded-full hover:bg-[#ede9d4]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        fill="#8E0000"
        className="bi bi-pencil mr-2"
        viewBox="0 0 16 16"
      >
        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
      </svg>
      Modify Template
    </button>
  );
};

const GoBackButton = () => {
  return (
    <button className="flex items-center text-xl justify-center px-4 py-2 bg-[#F5F5DC] text-[#8E0000] border-2 border-[#8E0000] rounded-full hover:bg-[#ede9d4]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="35"
        height="35"
        fill="currentColor"
        class="bi bi-arrow-left mr-2"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
        />
      </svg>
      Go Back
    </button>
  );
};

const ProcedureForm = () => {
  const [procedure, setProcedure] = useState({
    name: "General Anesthesia",
    description:
      "A state of controlled unconsciousness during which a patient is asleep and unaware of their surroundings.",
    estimatedTime: "45",
    specialInstructions:
      "NPO (nothing by mouth) for 8 hours before the procedure.",
  });
  const [resources, setResources] = useState([
    { type: "Equipment", name: "Anesthesia Machine", quantity: 1 },
    { type: "Equipment", name: "Monitoring System", quantity: 1 },
    { type: "Equipment", name: "Propofol", quantity: 1 },
    { type: "Equipment", name: "Suction Device", quantity: 1 },
  ]);
  const [roles, setRoles] = useState([
    { name: "Anesthesiologist", quantity: 1 },
    { name: "Anesthesia Technician", quantity: 1 },
    { name: "Nurse Anesthetist", quantity: 2 },
  ]);
  const [newResource, setNewResource] = useState({
    type: "",
    name: "",
    quantity: 1,
  });
  const [newRole, setNewRole] = useState({ name: "", quantity: 1 });

  // Hardcoded data for the dropdowns
  const resourceTypes = ["Equipment", "Space"];
  const resourceNames = ["Projector", "Room", "Laptop"];
  const roleNames = ["Technician", "Manager", "Coordinator"];

  const theme = createTheme({
    typography: {
      fontSize: 10,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProcedure({ ...procedure, [name]: value });
  };

  const handleResourceChange = (e) => {
    const { name, value } = e.target;
    setNewResource({ ...newResource, [name]: value });
  };

  const handleRoleChange = (e) => {
    const { name, value } = e.target;
    setNewRole({ ...newRole, [name]: value });
  };

  const addResource = () => {
    if (!newResource.type) {
      alert("Resource type is required.");
      return;
    }
    if (!newResource.name) {
      alert("Resource name is required.");
      return;
    }
    if (newResource.quantity < 1) {
      alert("Quantity cannot be less than 1.");
      return;
    }
    setResources([...resources, newResource]);
    setNewResource({ type: "", name: "", quantity: 1 });
  };

  const addRole = () => {
    if (!newRole.name) {
      alert("Role name is required.");
      return;
    }
    if (newRole.quantity < 1) {
      alert("Quantity cannot be less than 1.");
      return;
    }
    setRoles([...roles, newRole]);
    setNewRole({ name: "", quantity: 1 });
  };

  const updateResourceQuantity = (index, delta) => {
    const newResources = [...resources];
    const updatedQuantity =
      Number(newResources[index].quantity) + Number(delta);
    if (updatedQuantity < 1) {
      return;
    }
    newResources[index].quantity = updatedQuantity;
    setResources(newResources);
  };

  const updateRoleQuantity = (index, delta) => {
    const newRoles = [...roles];
    const updatedQuantity = Number(newRoles[index].quantity) + Number(delta);
    if (updatedQuantity < 1) {
      return;
    }
    newRoles[index].quantity = updatedQuantity;
    setRoles(newRoles);
  };

  const deleteResource = (index) => {
    const newResources = [...resources];
    newResources.splice(index, 1);
    setResources(newResources);
  };

  const deleteRole = (index) => {
    const newRoles = [...roles];
    newRoles.splice(index, 1);
    setRoles(newRoles);
  };

  const modifyTemplate = () => {
    console.log({ procedure, resources, roles });
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          maxWidth: "90%",
          margin: "auto",
          backgroundColor: "#F5F5DC",
          border: "2px solid #8E0000",
          borderRadius: "5px",
          padding: "20px",
          marginTop: "10px",
        }}
      >
        <Typography
          variant="h5"
          style={{ color: "#8E0000", marginBottom: "5px" }}
        >
          Procedure Template Details
        </Typography>
        <TextField
          fullWidth
          label="Procedure Name"
          name="name"
          value={procedure.name}
          onChange={handleInputChange}
          margin="normal"
          InputLabelProps={{ style: { color: "#8E0000" } }}
          inputProps={{ style: { color: "#8E0000" } }}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description"
          name="description"
          value={procedure.description}
          onChange={handleInputChange}
          margin="normal"
          InputLabelProps={{ style: { color: "#8E0000" } }}
          inputProps={{ style: { color: "#8E0000" } }}
        />
        <TextField
          fullWidth
          label="Estimated Time (in minutes)"
          name="estimatedTime"
          value={procedure.estimatedTime}
          onChange={handleInputChange}
          margin="normal"
          InputLabelProps={{ style: { color: "#8E0000" } }}
          inputProps={{
            style: { color: "#8E0000" },
            min: 1,
            type: "number",
            onKeyDown: (e) => {
              if (e.key === "-" || e.key === "+" || e.key === ".") {
                e.preventDefault();
              }
            },
          }}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Special Instructions"
          name="specialInstructions"
          value={procedure.specialInstructions}
          onChange={handleInputChange}
          margin="normal"
          InputLabelProps={{ style: { color: "#8E0000" } }}
          inputProps={{ style: { color: "#8E0000" } }}
        />
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="resourcetype" style={{ color: "#8E0000" }}>
              Resource Type
            </InputLabel>
            <Select
              labelId="resourcetype"
              label="Resource Type"
              value={newResource.type}
              name="type"
              onChange={handleResourceChange}
              style={{ color: "#8E0000" }}
            >
              {resourceTypes.map((type, index) => (
                <MenuItem key={index} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="resourcename" style={{ color: "#8E0000" }}>
              Resource Name
            </InputLabel>
            <Select
              labelId="resourcename"
              label="Resource Name"
              value={newResource.name}
              name="name"
              onChange={handleResourceChange}
              style={{ color: "#8E0000" }}
            >
              {resourceNames.map((name, index) => (
                <MenuItem key={index} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Quantity"
            type="number"
            name="quantity"
            value={newResource.quantity}
            onChange={handleResourceChange}
            inputProps={{ min: 1, style: { color: "#8E0000" } }}
            InputLabelProps={{ style: { color: "#8E0000" } }}
            style={{ width: "345px" }}
          />
          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon style={{ color: "#8E0000" }} />}
            style={{
              color: "#8E0000",
              backgroundColor: "white",
              borderColor: "#8E0000",
              minWidth: "150px",
            }}
            onClick={addResource}
          >
            Add Resource
          </Button>
        </div>
        {resources.length > 0 && (
          <>
            <Typography
              variant="h6"
              style={{
                color: "#8E0000",
                marginTop: "20px",
                marginBottom: "10px",
              }}
            >
              Selected Resources
            </Typography>
            <List
              className="custom-scrollbar"
              style={{
                maxHeight: "125px",
                overflowY: "auto",
                backgroundColor: "white",
                border: "1px solid #8E0000",
                borderRadius: "5px",
                padding: "4px",
                marginBottom: "40px",
              }}
            >
              {resources.map((resource, index) => (
                <ListItem
                  style={{ color: "#8E0000" }}
                  key={index}
                  secondaryAction={
                    <>
                      <IconButton
                        style={{ color: "#8E0000" }}
                        edge="end"
                        aria-label="delete"
                        onClick={() => updateResourceQuantity(index, -1)}
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                      <IconButton
                        style={{ color: "#8E0000" }}
                        edge="end"
                        aria-label="add"
                        onClick={() => updateResourceQuantity(index, 1)}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                      <IconButton
                        style={{ color: "#8E0000" }}
                        edge="end"
                        aria-label="delete"
                        onClick={() => deleteResource(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={`${resource.name} - ${resource.quantity}`}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <FormControl fullWidth>
            <InputLabel id="rolename" style={{ color: "#8E0000" }}>
              Role Name
            </InputLabel>
            <Select
              labelId="rolename"
              label="Role Name"
              value={newRole.name}
              name="name"
              onChange={handleRoleChange}
              style={{ color: "#8E0000" }}
            >
              {roleNames.map((name, index) => (
                <MenuItem key={index} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Quantity"
            type="number"
            name="quantity"
            value={newRole.quantity}
            onChange={handleRoleChange}
            inputProps={{ min: 1, style: { color: "#8E0000" } }}
            InputLabelProps={{ style: { color: "#8E0000" } }}
          />
          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon style={{ color: "#8E0000" }} />}
            style={{
              color: "#8E0000",
              backgroundColor: "white",
              borderColor: "#8E0000",
              minWidth: "150px",
            }}
            onClick={addRole}
          >
            Add Role
          </Button>
        </div>
        {roles.length > 0 && (
          <>
            <Typography
              variant="h6"
              style={{
                color: "#8E0000",
                marginTop: "20px",
                marginBottom: "10px",
              }}
            >
              Selected Roles
            </Typography>
            <List
              className="custom-scrollbar"
              style={{
                maxHeight: "125px",
                overflowY: "auto",
                backgroundColor: "white",
                border: "1px solid #8E0000",
                borderRadius: "5px",
                padding: "4px",
                marginBottom: "20px",
              }}
            >
              {roles.map((role, index) => (
                <ListItem
                  style={{ color: "#8E0000" }}
                  key={index}
                  secondaryAction={
                    <>
                      <IconButton
                        style={{ color: "#8E0000" }}
                        edge="end"
                        aria-label="delete"
                        onClick={() => updateRoleQuantity(index, -1)}
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                      <IconButton
                        style={{ color: "#8E0000" }}
                        edge="end"
                        aria-label="add"
                        onClick={() => updateRoleQuantity(index, 1)}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                      <IconButton
                        style={{ color: "#8E0000" }}
                        edge="end"
                        aria-label="delete"
                        onClick={() => deleteRole(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText primary={`${role.name} - ${role.quantity}`} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <ModifyTemplateButton />
      </div>
    </ThemeProvider>
  );
};

const ModifyProcedureTemplateForm = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          marginTop: "1.2rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ position: "absolute", left: "2rem" }}>
          <GoBackButton />
        </div>
        <h1
          style={{
            fontSize: "2.25rem",
            lineHeight: "2.5rem",
            textAlign: "center",
            textDecoration: "underline",
            color: "#8E0000",
          }}
        >
          Modify Procedure Template
        </h1>
      </div>
      <ProcedureForm />
    </div>
  );
};

export default ModifyProcedureTemplateForm;
