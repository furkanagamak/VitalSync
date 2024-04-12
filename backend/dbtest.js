const mongoose = require("mongoose");

// Import all the models
const Account = require("./models/account.js");
const Patient = require("./models/patient.js");
const ResourceInstance = require("./models/resourceInstance.js");
const ResourceTemplate = require("./models/resourceTemplate.js");
const Role = require("./models/role.js");
const ProcedureTemplate = require("./models/procedureTemplate.js");
const ProcedureInstance = require("./models/procedureInstance.js");
const ProcessTemplate = require("./models/processTemplate.js");
const ProcessInstance = require("./models/processInstance.js");
const SectionTemplate = require("./models/sectionTemplate.js");
const SectionInstance = require("./models/sectionInstance.js");
const bcrypt = require("bcrypt");

async function addInstances() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://127.0.0.1:27017/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Add one instance of each model
    const accountData = {
      firstName: "John",
      lastName: "Doe",
      password: "password123",
      email: "john.doe@example.com",
      accountType: "system admin",
      position: "Doctor",
      department: "Cardiology",
      degree: "MD",
      phoneNumber: "1234567890",
      officePhoneNumber: "0987654321",
      officeLocation: "Room 101",
    };
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(accountData.password, salt);
    accountData.password = hashedPassword;
    const newAccount = new Account(accountData);
    const savedAccount = await newAccount.save();
    console.log("Account saved:", savedAccount);

    const patientData = {
      fullName: "Alice Smith",
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: 12345,
      dob: new Date("1990-01-01"),
      sex: "female",
      emergencyContacts: [
        {
          name: "Bob Smith",
          relation: "Spouse",
          phone: "9876543210",
        },
      ],
      knownConditions: ["Hypertension", "Diabetes"],
      allergies: ["Peanuts", "Penicillin"],
    };
    const newPatient = new Patient(patientData);
    const savedPatient = await newPatient.save();
    console.log("Patient saved:", savedPatient);

    // Add one instance of ResourceInstance
    const resourceInstanceData = {
      type: "Type",
      name: "Name",
      location: "Location",
      description: "Description",
      uniqueIdentifier: "UniqueIdentifier",
      status: "Status",
      unavailableTimes: [],
    };
    const newResourceInstance = new ResourceInstance(resourceInstanceData);
    const savedResourceInstance = await newResourceInstance.save();
    console.log("ResourceInstance saved:", savedResourceInstance);

    // Add one instance of ResourceTemplate
    const resourceTemplateData = {
      type: "Type",
      name: "Name",
      description: "Description",
    };
    const newResourceTemplate = new ResourceTemplate(resourceTemplateData);
    const savedResourceTemplate = await newResourceTemplate.save();
    console.log("ResourceTemplate saved:", savedResourceTemplate);

    // Add one instance of Role
    const roleData = {
      name: "Name",
      description: "Description",
      uniqueIdentifier: "UniqueIdentifier",
    };
    const newRole = new Role(roleData);
    const savedRole = await newRole.save();
    console.log("Role saved:", savedRole);

    // Add one instance of ProcedureTemplate
    const procedureTemplateData = {
      procedureName: "ProcedureName",
      description: "Description",
      requiredResources: [],
      roles: [],
      estimatedTime: 60, // in minutes
      specialNotes: "SpecialNotes",
    };
    const newProcedureTemplate = new ProcedureTemplate(procedureTemplateData);
    const savedProcedureTemplate = await newProcedureTemplate.save();
    console.log("ProcedureTemplate saved:", savedProcedureTemplate);

    // Add one instance of ProcedureInstance
    const procedureInstanceData = {
      procedureName: "ProcedureName",
      description: "Description",
      requiredResources: [],
      assignedResources: [],
      rolesAssignedPeople: [],
      numOfPeopleCompleted: 0,
      timeStart: new Date(),
      timeEnd: new Date(),
      processID: null,
      sectionID: null,
    };
    const newProcedureInstance = new ProcedureInstance(procedureInstanceData);
    const savedProcedureInstance = await newProcedureInstance.save();
    console.log("ProcedureInstance saved:", savedProcedureInstance);

    // Add one instance of ProcessTemplate
    const processTemplateData = {
      processName: "ProcessName",
      description: "Description",
      sectionTemplates: [],
    };
    const newProcessTemplate = new ProcessTemplate(processTemplateData);
    const savedProcessTemplate = await newProcessTemplate.save();
    console.log("ProcessTemplate saved:", savedProcessTemplate);

    // Add one instance of ProcessInstance
    const processInstanceData = {
      processID: "ProcessID",
      processName: "ProcessName",
      description: "Description",
      sectionInstances: [],
      patient: null,
    };
    const newProcessInstance = new ProcessInstance(processInstanceData);
    const savedProcessInstance = await newProcessInstance.save();
    console.log("ProcessInstance saved:", savedProcessInstance);

    // Add one instance of SectionTemplate
    const sectionTemplateData = {
      sectionName: "SectionName",
      description: "Description",
      procedureTemplates: [],
    };
    const newSectionTemplate = new SectionTemplate(sectionTemplateData);
    const savedSectionTemplate = await newSectionTemplate.save();
    console.log("SectionTemplate saved:", savedSectionTemplate);

    // Add one instance of SectionInstance
    const sectionInstanceData = {
      name: "Name",
      description: "Description",
      procedureInstances: [],
      processID: null,
    };
    const newSectionInstance = new SectionInstance(sectionInstanceData);
    const savedSectionInstance = await newSectionInstance.save();
    console.log("SectionInstance saved:", savedSectionInstance);

    /*await Promise.all([
      Account.deleteMany({}),
      Patient.deleteMany({}),
      ResourceInstance.deleteMany({}),
      ResourceTemplate.deleteMany({}),
      Role.deleteMany({}),
      ProcedureTemplate.deleteMany({}),
      ProcedureInstance.deleteMany({}),
      ProcessTemplate.deleteMany({}),
      ProcessInstance.deleteMany({}),
      SectionTemplate.deleteMany({}),
      SectionInstance.deleteMany({}),
    ]);
    console.log("Database cleared.");*/
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Disconnect from MongoDB after operations are done
    mongoose.disconnect();
  }
}

// Call the async function to add instances
addInstances();
