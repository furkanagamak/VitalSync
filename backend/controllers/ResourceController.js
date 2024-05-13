const Account = require("../models/account.js");
const Role = require("../models/role.js");
const ResourceTemplate = require("../models/resourceTemplate.js");
const ResourceInstance = require("../models/resourceInstance.js");
const ProcedureTemplate = require("../models/procedureTemplate.js");
const ProcedureInstance = require("../models/procedureInstance.js");
const ProcessInstance = require("../models/processInstance.js");

function generateRandomString(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    randomString += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return randomString;
}

function generateUniqueID(inputString) {
  const firstLetters = inputString
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
  const randomString = generateRandomString(6);
  return `${firstLetters}-${randomString}`.toUpperCase();
}

async function checkLoginNAdminPermission(req, action) {
  const accountId = req.cookies.accountId;
  if (!accountId) {
    return {
      permCheckStat: false,
      permCheckCode: 401,
      permCheckMsg: "User not logged in",
    };
  }

  // Check admin permission
  const currUser = await Account.findOne({ _id: accountId });
  if (!currUser)
    return {
      permCheckStat: false,
      permCheckCode: 404,
      permCheckMsg:
        "User does not exist! Malformed session, please login again!",
    };

  if (currUser.accountType === "staff")
    return {
      permCheckStat: false,
      permCheckCode: 403,
      permCheckMsg: `Only admins may ${action} resources!`,
    };

  return { permCheckStat: true };
}

async function createResource(req, res) {
  try {
    const { permCheckStat, permCheckCode, permCheckMsg } =
      await checkLoginNAdminPermission(req, "create");
    if (!permCheckStat) return res.status(permCheckCode).send(permCheckMsg);

    const name = req.body.name.trim().toLowerCase();
    const type = req.body.type.trim().toLowerCase();
    const location = req.body.location.trim();
    const description = req.body.description.trim();

    // Parameter checks
    if (!name || !type)
      return res
        .status(400)
        .send("Please insert a name and type for the resource!");
    if (type !== "equipment" && type !== "spaces" && type !== "roles")
      return res
        .status(400)
        .send("Type can only be equipment, spaces, or roles!");
    if (type !== "roles" && (!location || !description))
      return res
        .status(400)
        .send(
          "For non-roles resources, a location and description must be defined!"
        );

    // Handles role addition
    if (type === "roles") {
      // Ensure that role does not already exist
      const findRole = await Role.findOne({ name: name });
      if (findRole)
        return res
          .status(400)
          .send("A role with the requested name already exists!");

      const newRole = new Role({
        name,
        description,
        uniqueIdentifier: name.replace(" ", "_").toLowerCase(),
      });
      await newRole.save();
      return res.status(201).send("The newly requested role is created!");
    }

    // Add resource template if not already exists
    let findResTemplates = await ResourceTemplate.findOne({ name: name });
    if (!findResTemplates) {
      const newResTemplate = new ResourceTemplate({
        type,
        name,
        description: description ? description : "",
      });
      await newResTemplate.save();
    }

    // Generate unique id
    let uniqueIdentifier;
    let findRes;
    do {
      uniqueIdentifier = generateUniqueID(name);
      findRes = await ResourceInstance.findOne({
        uniqueIdentifier: uniqueIdentifier,
      });
    } while (findRes);

    // Add resource instance
    const newResInstance = new ResourceInstance({
      type,
      name,
      location,
      description,
      uniqueIdentifier,
      status: "Available",
    });

    await newResInstance.save();
    return res.status(201).send("The resource has been successfully created!");
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).send("An error occurred in the server");
  }
}

async function findResourceNType(uniqueIdentifier) {
  // Find target resource
  let type;
  let targetResource = await ResourceInstance.findOne({
    uniqueIdentifier: uniqueIdentifier,
  });
  if (!targetResource) {
    targetResource = await Role.findOne({
      uniqueIdentifier: uniqueIdentifier,
    });
    if (!targetResource)
      return {
        findRNTStat: false,
      };
    type = "roles";
  } else {
    type = targetResource.type;
  }

  return {
    findRNTStat: true,
    findRNTBody: {
      type,
      targetResource,
    },
  };
}

async function updateResource(req, res) {
  try {
    const { permCheckStat, permCheckCode, permCheckMsg } =
      await checkLoginNAdminPermission(req, "update");
    if (!permCheckStat) return res.status(permCheckCode).send(permCheckMsg);

    const name = req.body.name.trim().toLowerCase();
    const uniqueIdentifier = req.body.uniqueIdentifier;
    const location = req.body.location.trim();
    const description = req.body.description.trim();

    // Parameter checks
    if (!name)
      return res.status(400).send("Please insert a name for the resource!");
    if (!uniqueIdentifier)
      return res
        .status(400)
        .send("Please insert the uniqueIdentifier for the target resource!");

    // Find target resource
    const { findRNTStat, findRNTBody } = await findResourceNType(
      uniqueIdentifier
    );
    if (!findRNTStat)
      return res
        .status(400)
        .send(
          "There does not exist a resource with the provided uniqueIdentifier!"
        );
    const { type, targetResource } = findRNTBody;

    if (type !== "roles" && (!location || !description))
      return res
        .status(400)
        .send(
          "For non-roles resources, a location and description must be defined!"
        );

    // Handles role addition
    if (type === "roles") {
      targetResource.description = description;
      await targetResource.save();
      return res.status(200).send("The role has been updated!");
    }

    // Add resource template if not already exists
    let findResTemplates = await ResourceTemplate.findOne({ name: name });
    if (!findResTemplates) {
      const newResTemplate = new ResourceTemplate({
        type,
        name,
        description: description ? description : "",
      });
      await newResTemplate.save();
    }

    // Add resource instance
    targetResource.name = name;
    targetResource.location = location;
    targetResource.description = description;
    await targetResource.save();
    return res.status(200).send("The resource has been updated!");
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).send("An error occurred in the server");
  }
}

async function deleteResource(req, res) {
  //permission checks
  const { permCheckStat, permCheckCode, permCheckMsg } =
    await checkLoginNAdminPermission(req, "delete");
  if (!permCheckStat) return res.status(permCheckCode).send(permCheckMsg);

  const uniqueIdentifier = req.body.uniqueIdentifier;
  if (!uniqueIdentifier)
    return res
      .status(400)
      .send(
        "Please insert the uniqueIdentifier of the resource that you are trying to delete!"
      );

  // Find target resource
  const { findRNTStat, findRNTBody } = await findResourceNType(
    uniqueIdentifier
  );
  if (!findRNTStat)
    return res
      .status(400)
      .send(
        "There does not exists an resource with the provided uniqueIdentifier!"
      );
  const { type, targetResource } = findRNTBody;

  // handle role resource deletion checks
  if (type === "roles") {
    const roleInstance = await Role.findOne({
      uniqueIdentifier: uniqueIdentifier,
    });
    const account = await Account.findOne({
      eligibleRoles: roleInstance._id,
      isTerminated: false,
    });
    if (account)
      return res
        .status(409)
        .send(
          "The role you are trying to delete is assigned to one or more accounts!"
        );

    // Check if resource is used in any procedureTemplate
    const procedureTemplateAssigned = await ProcedureTemplate.findOne({
      roles: {
        $elemMatch: { role: targetResource._id },
      },
    });
    if (procedureTemplateAssigned)
      return res
        .status(409)
        .send(
          "The role you are trying to delete is assigned to one or more procedure templates!"
        );
    await Role.deleteOne({ uniqueIdentifier: uniqueIdentifier });
    return res.status(200).send("The role has been deleted!");
  }

  // non-role resources

  // check if occupied
  if (targetResource.unavailableTimes.length > 0)
    return res
      .status(409)
      .send(
        "The resource you are trying to delete is occupied to one or more process instance!"
      );

  // Check if resource is used in any procedureTemplate
  const resourceTemplate = await ResourceTemplate.findOne({
    name: targetResource.name,
  });
  const procedureTemplateAssigned = await ProcedureTemplate.findOne({
    requiredResources: {
      $elemMatch: { resource: resourceTemplate._id },
    },
  });
  if (procedureTemplateAssigned)
    return res
      .status(409)
      .send(
        "The resource you are trying to delete is assigned to one or more procedure templates!"
      );

  const procedureInstancesAssigned = await ProcedureInstance.find({
    assignedResources: { $in: [targetResource._id] },
  });
  const assignedToProcInstance = await Promise.all(
    procedureInstancesAssigned.map(async (proce) => {
      const respectiveProcess = await ProcessInstance.findOne({
        processID: proce.processID,
      });
      return respectiveProcess.currentProcedure !== null;
    })
  );
  if (assignedToProcInstance.some((proce) => proce))
    return res
      .status(409)
      .send(
        "The resource you are trying to delete is assigned to one or more procedure instances!"
      );

  // delete resource
  await ResourceInstance.deleteOne({ uniqueIdentifier: uniqueIdentifier });

  // remove resource template if needed
  const otherResWithSameTemplate = await ResourceInstance.findOne({
    name: targetResource.name,
  });
  if (!otherResWithSameTemplate) {
    await ResourceTemplate.deleteOne({ name: targetResource.name });
  }

  return res.status(200).send("The resource has been deleted!");
}

module.exports = { createResource, updateResource, deleteResource };
