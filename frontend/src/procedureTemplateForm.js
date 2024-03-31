import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, List, ListItem, ListItemText, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

const ProcedureForm = () => {
  const [procedure, setProcedure] = useState({
    name: '',
    description: '',
    estimatedTime: '',
    specialInstructions: '',
  });
  const [resources, setResources] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newResource, setNewResource] = useState({ type: 'Equipment', name: '', quantity: 1 });
  const [newRole, setNewRole] = useState({ name: '', quantity: 1 });

  // Hardcoded data for the dropdowns
  const resourceTypes = ['Equipment', 'Space'];
  const resourceNames = ['Projector', 'Room', 'Laptop'];
  const roleNames = ['Technician', 'Manager', 'Coordinator'];

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
    if (!newResource.name) {
        alert("Resource name is required.");
        return;
    }
    if (newResource.quantity < 1) {
        alert("Quantity cannot be less than 1.");
        return; 
    }
    setResources([...resources, newResource]);
    setNewResource({ type: 'Equipment', name: '', quantity: 1 }); // Reset newResource state
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
    setNewRole({ name: '', quantity: 1 }); // Reset newRole state
  };

  const updateResourceQuantity = (index, delta) => {
    const newResources = [...resources];
    newResources[index].quantity += delta;
    setResources(newResources);
  };

  const updateRoleQuantity = (index, delta) => {
    const newRoles = [...roles];
    const newQuantity = newRoles[index].quantity + delta;
    if (newQuantity < 1) {
      return;
    }
    newRoles[index].quantity += delta;
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

  const createTemplate = () => {
    console.log({ procedure, resources, roles });
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <TextField fullWidth label="Procedure Name" name="name" value={procedure.name} onChange={handleInputChange} margin="normal" />
      <TextField fullWidth multiline rows={4} label="Description" name="description" value={procedure.description} onChange={handleInputChange} margin="normal" />
      <TextField fullWidth label="Estimated Time" name="estimatedTime" value={procedure.estimatedTime} onChange={handleInputChange} margin="normal" />
      <TextField fullWidth multiline rows={4} label="Special Instructions" name="specialInstructions" value={procedure.specialInstructions} onChange={handleInputChange} margin="normal" />
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <FormControl fullWidth>
          <InputLabel>Resource Type</InputLabel>
          <Select value={newResource.type} name="type" onChange={handleResourceChange}>
            {resourceTypes.map((type, index) => (
              <MenuItem key={index} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Resource Name</InputLabel>
          <Select value={newResource.name} name="name" onChange={handleResourceChange}>
            {resourceNames.map((name, index) => (
              <MenuItem key={index} value={name}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Quantity" type="number" name="quantity" value={newResource.quantity} onChange={handleResourceChange} inputProps={{ min: 1}} />
        <Button variant="contained" onClick={addResource}>Add Resource</Button>
      </div>
      <List style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {resources.map((resource, index) => (
          <ListItem key={index} secondaryAction={
            <>
              <IconButton style={{ color: 'red' }} edge="end" aria-label="delete" onClick={() => updateResourceQuantity(index, -1)}>
                <RemoveCircleOutlineIcon />
              </IconButton>
              <IconButton style={{ color: 'red' }} edge="end" aria-label="add" onClick={() => updateResourceQuantity(index, 1)}>
                <AddCircleOutlineIcon />
              </IconButton>
              <IconButton style={{ color: 'red' }} edge="end" aria-label="delete" onClick={() => deleteResource(index)}>
                <DeleteIcon />
              </IconButton>
            </>
          }>
            <ListItemText primary={`${resource.name} - ${resource.quantity}`} />
          </ListItem>
        ))}
      </List>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <FormControl fullWidth>
          <InputLabel>Role Name</InputLabel>
          <Select value={newRole.name} name="name" onChange={handleRoleChange}>
            {roleNames.map((name, index) => (
              <MenuItem key={index} value={name}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Quantity" type="number" name="quantity" value={newRole.quantity} onChange={handleRoleChange} inputProps={{ min: 1}} />
        <Button variant="contained" onClick={addRole}>Add Role</Button>
      </div>
      <List style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {roles.map((role, index) => (
          <ListItem key={index} secondaryAction={
            <>
              <IconButton style={{ color: 'red' }} edge="end" aria-label="delete" onClick={() => updateRoleQuantity(index, -1)}>
                <RemoveCircleOutlineIcon />
              </IconButton>
              <IconButton style={{ color: 'red' }} edge="end" aria-label="add" onClick={() => updateRoleQuantity(index, 1)}>
                <AddCircleOutlineIcon />
              </IconButton>
              <IconButton style={{ color: 'red' }} edge="end" aria-label="delete" onClick={() => deleteRole(index)}>
                <DeleteIcon />
              </IconButton>
            </>
          }>
            <ListItemText primary={`${role.name} - ${role.quantity}`} />
          </ListItem>
        ))}
      </List>

      <Button fullWidth variant="contained" onClick={createTemplate}>Create Template</Button>
    </div>
  );
};

export default ProcedureForm;
