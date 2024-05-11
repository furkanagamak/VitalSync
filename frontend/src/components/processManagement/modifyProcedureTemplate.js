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
import { useParams } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

const ModifyTemplateButton = ({ onModify }) => {
  const handleModifyClick = async () => {
    await onModify();
  };

  return (
    <button
      onClick={handleModifyClick}
      className="flex items-center text-xl justify-center px-4 py-2 bg-[#F5F5DC] text-[#8E0000] border-2 border-[#8E0000] rounded-full hover:bg-[#ede9d4]"
      title="Save Your Changes and Modify the Template"
    >
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
  const navigate = useNavigate();

  const handleGoBackClick = () => {
    navigate("/ProcedureTemplateManagement");
  };

  return (
    <button
      onClick={handleGoBackClick}
      className="flex items-center text-xl justify-center px-4 py-2 bg-[#F5F5DC] text-[#8E0000] border-2 border-[#8E0000] rounded-full hover:bg-[#ede9d4]"
      title="Go Back to Procedure Template Management"
    >
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

const ProcedureForm = ({
  procedure,
  setProcedure,
  resources,
  setResources,
  roles,
  setRoles,
  createTemplate,
}) => {
  const { templateId } = useParams();
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
    const fetchProcedureTemplate = async () => {
      try {
        const response = await axios.get(`/procedureTemplates/${templateId}`);
        const template = response.data;
        setProcedure({
          name: template.procedureName,
          description: template.description,
          estimatedTime: template.estimatedTime.toString(),
          specialInstructions: template.specialNotes,
        });
        setResources(
          template.requiredResources.map((res) => ({
            type: res.resource.type,
            name: res.resource.name,
            quantity: res.quantity,
          }))
        );

        setRoles(
          template.roles.map((role) => ({
            name: role.role.name,
            quantity: role.quantity,
          }))
        );
      } catch (error) {
        console.error("Error fetching procedure template:", error);
      }
    };

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

    fetchProcedureTemplate();
    fetchResourceTemplates();
    fetchRoles();
  }, [templateId]);

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

    const spaceResourceExists = resources.some(
      (resource) => resource.type === "spaces"
    );
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
        <div className="flex lg:flex-row gap-2.5 mt-5 mb-5 flex-col">
          <div style={{ display: "flex", flexGrow: 2, gap: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="resourcetype" style={{ color: "#8E0000" }}>
                Resource Type
              </InputLabel>
              <Select
                id="selectType"
                labelId="resourcetype"
                label="Resource Type"
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
                id="selectName"
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
            title="Add Resource to Selected Resources"
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
              className="custom-scrollbar-table"
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
                        title="Decrease Quantity"
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                      <IconButton
                        style={{ color: "#8E0000" }}
                        edge="end"
                        aria-label="add"
                        onClick={() => updateResourceQuantity(index, 1)}
                        title="Increase Quantity"
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                      <IconButton
                        style={{ color: "#8E0000" }}
                        edge="end"
                        aria-label="delete"
                        id="deleteResource"
                        onClick={() => deleteResource(index)}
                        title="Delete Resource"
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

        <div className="flex lg:flex-row gap-2.5 mt-5 mb-5 flex-col">
          <div style={{ display: "flex", flexGrow: 2, gap: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="rolename" style={{ color: "#8E0000" }}>
                Role Name
              </InputLabel>
              <Select
                id="selectRole"
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
            title="Add Role to Selected Roles"
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
              className="custom-scrollbar-table"
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
                        title="Decrease Quantity"
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                      <IconButton
                        style={{ color: "#8E0000" }}
                        edge="end"
                        aria-label="add"
                        onClick={() => updateRoleQuantity(index, 1)}
                        title="Increase Quantity"
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                      <IconButton
                        style={{ color: "#8E0000" }}
                        edge="end"
                        aria-label="delete"
                        onClick={() => deleteRole(index)}
                        title="Delete Role"
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

const ModifyProcedureTemplateForm = () => {
  const [procedure, setProcedure] = useState({
    name: "",
    description: "",
    estimatedTime: "",
    specialInstructions: "",
  });
  const [resources, setResources] = useState([]);
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();
  const { templateId } = useParams();

  const modifyTemplate = async () => {
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
      const response = await axios.put(
        `/procedureTemplates/${templateId}`,
        templateData
      );
      console.log("Template Modified:", response.data);
      navigate("/ProcedureTemplateManagement");
      toast.success("Procedure Template Modified Successfully!");
    } catch (error) {
      console.error("Error modifying procedure template:", error);
      toast.error(
        "Failed to modify procedure template: " + error.response.data.error
      );
    }
  };

  return (
    <div>
      <div className="relative mt-6 mb-8 flex flex-col lg:flex-row items-center justify-center">
        <h1 className="text-4xl leading-10 text-center underline text-red-800">
          Modify Procedure Template
        </h1>
        <div className="flex flex-row mt-4 lg:mt-0 lg:flex-row lg:absolute lg:inset-y-0 lg:left-0 lg:right-0 justify-between w-full px-4">
          <div>
            <GoBackButton />
          </div>
          <div>
            <ModifyTemplateButton onModify={modifyTemplate} />
          </div>
        </div>
      </div>
      <ProcedureForm
        procedure={procedure}
        setProcedure={setProcedure}
        resources={resources}
        setResources={setResources}
        roles={roles}
        setRoles={setRoles}
        modifyTemplate={modifyTemplate}
      />
    </div>
  );
};

export default ModifyProcedureTemplateForm;
