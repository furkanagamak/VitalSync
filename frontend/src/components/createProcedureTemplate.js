import React, { useState, useEffect } from "react";
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
import "./TemplateStyles.css";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

const CreateTemplateButton = ({ onCreate }) => {
  const handleCreateClick = async () => {
    await onCreate();
  };

  return (
    <button
      onClick={handleCreateClick}
      className="flex items-center text-xl justify-center px-4 py-2 bg-[#F5F5DC] text-[#8E0000] border-2 border-[#8E0000] rounded-full hover:bg-[#ede9d4]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        fill="#8E0000"
        className="bi bi-clipboard-plus mr-2"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7"
        />
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
      </svg>
      Save Template
    </button>
  );
};

const GoBackButton = () => {
  const navigate = useNavigate();

  const handleGoBackClick = () => {
    navigate("/ProcedureTemplateManagement");
  };

  return (
    <button
      onClick={handleGoBackClick}
      className="flex items-center text-xl justify-center px-4 py-2 bg-[#F5F5DC] text-[#8E0000] border-2 border-[#8E0000] rounded-full hover:bg-[#ede9d4]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
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

const ProcedureForm = ({
  procedure,
  setProcedure,
  resources,
  setResources,
  roles,
  setRoles,
  createTemplate,
}) => {
  const [newResource, setNewResource] = useState({
    type: "",
    name: "",
    quantity: 1,
  });
  const [newRole, setNewRole] = useState({ name: "", quantity: 1 });
  const [resourceTypes, setResourceTypes] = useState([]);
  const [roleNames, setRoleNames] = useState([]);
  const [resourceNames, setResourceNames] = useState({});

  useEffect(() => {
    const fetchResourceTemplates = async () => {
      try {
        const response = await axios.get("/resourceTemplates");
        const typesToNames = {};
        response.data.forEach((template) => {
          if (!typesToNames[template.type]) {
            typesToNames[template.type] = [];
          }
          typesToNames[template.type].push(template.name);
        });
        // Iterate through each property of typesToNames and sort the array
        Object.keys(typesToNames).forEach((type) => {
          typesToNames[type].sort();
        });
        setResourceNames(typesToNames);
        setResourceTypes(Object.keys(typesToNames));
      } catch (error) {
        console.error("Error fetching resource templates:", error);
      }
    };

    const fetchRoles = async () => {
      const response = await axios.get("/roles");
      const names = response.data.map((role) => role.name);
      names.sort();
      setRoleNames(names);
    };

    fetchResourceTemplates();
    fetchRoles();
  }, []);

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
      toast.error("Resource type is required.");
      return;
    }
    if (!newResource.name) {
      toast.error("Resource name is required.");
      return;
    }
    if (newResource.quantity < 1) {
      toast.error("Quantity cannot be less than 1.");
      return;
    }

    const spaceResourceExists = resources.some(resource => resource.type === "spaces");
    if (newResource.type === "spaces") {
      if (spaceResourceExists) {
        toast.error("You can only select one space resource.");
        return;
      }
      if (newResource.quantity > 1) {
        toast.error("The quantity of a space resource cannot be more than 1.");
        return;
      }
    }

    for (let i = 0; i < resources.length; i++) {
      if (resources[i].name === newResource.name) {
        toast.error("Resource already exists in selected resources.");
        return;
      }
    }

    setResources([...resources, newResource]);
    setNewResource({ type: "", name: "", quantity: 1 });
  };

  const addRole = () => {
    if (!newRole.name) {
      toast.error("Role name is required.");
      return;
    }
    if (newRole.quantity < 1) {
      toast.error("Quantity cannot be less than 1.");
      return;
    }

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === newRole.name) {
        toast.error("Role already exists in selected roles.");
        return;
      }
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
          marginBottom: "30px",
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
          id="name"
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
          id="description"
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
          id="estimatedTime"
          InputLabelProps={{ style: { color: "#8E0000" } }}
          inputProps={{
            style: { color: "#8E0000" },
            min: 1,
            type: "number",
            onKeyDown: (e) => {
              if (
                e.key === "-" ||
                e.key === "+" ||
                e.key === "." ||
                e.key === "e"
              ) {
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
          id="specialInstructions"
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
          <div style={{ display: "flex", flexGrow: 2, gap: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="resourcetype" style={{ color: "#8E0000" }}>
                Resource Type
              </InputLabel>
              <Select
                labelId="resourcetype"
                label="Resource Type"
                className="capitalize"
                value={newResource.type}
                name="type"
                onChange={handleResourceChange}
                style={{ color: "#8E0000" }}
              >
                {resourceTypes.map((type, index) => (
                  <MenuItem className="capitalize" key={index} value={type}>
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
                className="capitalize"
              >
                {newResource.type &&
                  resourceNames[newResource.type]?.map((name, index) => (
                    <MenuItem className="capitalize" key={index} value={name}>
                      {name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          <TextField
            label="Quantity"
            type="number"
            name="quantity"
            value={newResource.quantity}
            onChange={handleResourceChange}
            inputProps={{
              min: 1,
              style: { color: "#8E0000" },
              onKeyDown: (e) => {
                if (
                  e.key === "-" ||
                  e.key === "+" ||
                  e.key === "." ||
                  e.key === "e"
                ) {
                  e.preventDefault();
                }
              },
            }}
            InputLabelProps={{ style: { color: "#8E0000" } }}
          />
          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon style={{ color: "#8E0000" }} />}
            style={{
              color: "#8E0000",
              backgroundColor: "white",
              borderColor: "#8E0000",
              minWidth: "175px",
              fontSize: "1rem",
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
                  className="capitalize"
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
          <div style={{ display: "flex", flexGrow: 2, gap: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="rolename" style={{ color: "#8E0000" }}>
                Role Name
              </InputLabel>
              <Select
                labelId="rolename"
                className="capitalize"
                label="Role Name"
                value={newRole.name}
                name="name"
                onChange={handleRoleChange}
                style={{ color: "#8E0000" }}
              >
                {roleNames.map((name, index) => (
                  <MenuItem className="capitalize" key={index} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <TextField
            label="Quantity"
            type="number"
            name="quantity"
            value={newRole.quantity}
            onChange={handleRoleChange}
            inputProps={{
              min: 1,
              style: { color: "#8E0000" },
              onKeyDown: (e) => {
                if (
                  e.key === "-" ||
                  e.key === "+" ||
                  e.key === "." ||
                  e.key === "e"
                ) {
                  e.preventDefault();
                }
              },
            }}
            InputLabelProps={{ style: { color: "#8E0000" } }}
          />
          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon style={{ color: "#8E0000" }} />}
            style={{
              color: "#8E0000",
              backgroundColor: "white",
              borderColor: "#8E0000",
              minWidth: "175px",
              fontSize: "1rem",
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
                  className="capitalize"
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
    </ThemeProvider>
  );
};

const CreateProcedureTemplateForm = () => {
  const [procedure, setProcedure] = useState({
    name: "",
    description: "",
    estimatedTime: "",
    specialInstructions: "",
  });
  const [resources, setResources] = useState([]);
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  const createTemplate = async () => {
    const resourceData = resources.map((resource) => ({
      resourceName: resource.name,
      quantity: resource.quantity,
    }));

    const roleData = roles.map((role) => ({
      roleName: role.name,
      quantity: role.quantity,
    }));

    if (!procedure.name) {
      toast.error("Procedure name is required.");
      return;
    }

    if (!procedure.estimatedTime) {
      toast.error("Estimated time is required.");
      return;
    }

    if (procedure.estimatedTime < 1) {
      toast.error("Estimated time cannot be less than 1 minute.");
      return;
    }

    if (resourceData.length === 0) {
      toast.error("At least one resource is required.");
      return;
    }

    if (roleData.length === 0) {
      toast.error("At least one role is required.");
      return;
    }

    const templateData = {
      procedureName: procedure.name,
      description: procedure.description,
      estimatedTime: procedure.estimatedTime,
      specialNotes: procedure.specialInstructions,
      requiredResources: resourceData,
      roles: roleData,
    };

    try {
      const response = await axios.post("/procedureTemplates", templateData);
      console.log("Template Created:", response.data);
      navigate("/ProcedureTemplateManagement");
      toast.success("Procedure Template Created Successfully!");
    } catch (error) {
      console.error("Error creating procedure template:", error);
      toast.error(
        "Failed to create procedure template: " + error.response.data.error
      );
    }
  };

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
        <div style={{ position: "absolute", right: "2rem" }}>
          <CreateTemplateButton onCreate={createTemplate} />
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
          Create New Procedure Template
        </h1>
      </div>
      <ProcedureForm
        procedure={procedure}
        setProcedure={setProcedure}
        resources={resources}
        setResources={setResources}
        roles={roles}
        setRoles={setRoles}
        createTemplate={createTemplate}
      />
    </div>
  );
};

export default CreateProcedureTemplateForm;
