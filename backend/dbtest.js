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

    // Add one instance of Role
    const roleData = {
      name: "Name",
      description: "Description",
      uniqueIdentifier: "UniqueIdentifier",
    };
    const newRole = new Role(roleData);

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
      eligibleRoles: [newRole._id],
      assignedProcedures: [],
    };
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(accountData.password, salt);
    accountData.password = hashedPassword;
    const newAccount = new Account(accountData);

    const dummyAccount = {
      firstName: "James",
      lastName: "test",
      password: "password123",
      email: "dummy@example.com",
      accountType: "system admin",
      position: "Doctor",
      department: "Cardiology",
      degree: "MD",
      phoneNumber: "111-111-1111",
      officePhoneNumber: "111-111-1111",
      officeLocation: "Room 102",
      eligibleRoles: [newRole._id],
      assignedProcedures: [],
    };
    const salt1 = await bcrypt.genSalt(10);
    const hashedPassword1 = await bcrypt.hash(dummyAccount.password, salt);
    dummyAccount.password = hashedPassword;
    const newAccount1 = new Account(dummyAccount);

    const patientData = {
      fullName: "Alice Smith",
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: 12345,
      dob: new Date("1990-01-01"),
      phone: "1234567890",
      sex: "female",
      emergencyContacts: [
        {
          name: "Bob Smith",
          relation: "Spouse",
          phone: "9876543210",
        },
      ],
      knownConditions: "Hypertension, Diabetes",
      allergies: "Peanuts, Penicillin",
    };
    const newPatient = new Patient(patientData);

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

    // Add one instance of ResourceTemplate
    const resourceTemplateData = {
      type: "Type",
      name: "Name",
      description: "Description",
    };
    const newResourceTemplate = new ResourceTemplate(resourceTemplateData);

    const testRoomTemplate = new ResourceTemplate({
      type: "spaces",
      name: "test room",
    });

    const testRoom = new ResourceInstance({
      type: "spaces",
      name: "test room",
      location: "TRoom 102",
      uniqueIdentifier: "TR-102",
    });

    const processID = "TPID-123";

    // Add one instance of SectionTemplate
    const sectionTemplateData = {
      sectionName: "SectionName",
      description: "Description",
      procedureTemplates: [],
    };
    const newSectionTemplate = new SectionTemplate(sectionTemplateData);

    // Add one instance of SectionInstance
    const sectionInstanceData = {
      name: "Name",
      description: "Description",
      procedureInstances: [],
      processID: processID,
    };
    const newSectionInstance = new SectionInstance(sectionInstanceData);

    // Add one instance of ProcedureTemplate
    const procedureTemplateData = {
      procedureName: "ProcedureName",
      description: "Description",
      requiredResources: [
        {
          resource: testRoomTemplate._id,
          quantity: 1,
        },
      ],
      roles: [
        {
          role: newRole._id,
          quantity: 1,
        },
      ],
      estimatedTime: 60, // in minutes
      specialNotes: "SpecialNotes",
    };
    const newProcedureTemplate = new ProcedureTemplate(procedureTemplateData);

    // Add one instance of ProcedureInstance
    const procedureInstanceData = {
      procedureName: "ProcedureName",
      description: "Description",
      requiredResources: [testRoomTemplate._id],
      assignedResources: [testRoom._id],
      rolesAssignedPeople: [
        {
          role: newRole._id,
          accounts: [newAccount._id],
        },
      ],
      peopleMarkAsCompleted: [],
      timeStart: new Date(),
      timeEnd: new Date(),
      processID: processID,
      sectionID: sectionInstanceData._id,
    };
    const newProcedureInstance = new ProcedureInstance(procedureInstanceData);
    newSectionInstance.procedureInstances.push(newProcedureInstance._id);
    newAccount.assignedProcedures.push(newProcedureInstance._id);

    // Add one instance of ProcessTemplate
    const processTemplateData = {
      processName: "ProcessName",
      description: "Description",
      sectionTemplates: [],
    };
    const newProcessTemplate = new ProcessTemplate(processTemplateData);

    // Add one instance of ProcessInstance
    const processInstanceData = {
      processID: processID,
      processName: "ProcessName",
      description: "Description",
      sectionInstances: [newSectionInstance._id],
      currentProcedure: newProcedureInstance._id,
      patient: newPatient._id,
    };
    const newProcessInstance = new ProcessInstance(processInstanceData);

    await testRoomTemplate.save();
    await testRoom.save();
    const savedRole = await newRole.save();
    console.log("Role saved:", savedRole);
    const savedAccount = await newAccount.save();
    console.log("Account saved:", savedAccount);
    const savedAccount1 = await newAccount1.save();
    console.log("Account saved:", savedAccount1);
    const savedPatient = await newPatient.save();
    console.log("Patient saved:", savedPatient);
    const savedResourceInstance = await newResourceInstance.save();
    console.log("ResourceInstance saved:", savedResourceInstance);
    const savedResourceTemplate = await newResourceTemplate.save();
    console.log("ResourceTemplate saved:", savedResourceTemplate);
    const savedSectionTemplate = await newSectionTemplate.save();
    console.log("SectionTemplate saved:", savedSectionTemplate);
    const savedProcedureTemplate = await newProcedureTemplate.save();
    console.log("ProcedureTemplate saved:", savedProcedureTemplate);
    const savedProcedureInstance = await newProcedureInstance.save();
    console.log("ProcedureInstance saved:", savedProcedureInstance);
    const savedSectionInstance = await newSectionInstance.save();
    console.log("SectionInstance saved:", savedSectionInstance);
    const savedProcessTemplate = await newProcessTemplate.save();
    console.log("ProcessTemplate saved:", savedProcessTemplate);
    const savedProcessInstance = await newProcessInstance.save();
    console.log("ProcessInstance saved:", savedProcessInstance);

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
