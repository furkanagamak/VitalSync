const cookie = require("cookie");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { fromEnv } = require("@aws-sdk/credential-provider-env");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { Socket } = require("dgram");
const fs = require("fs").promises;
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const Account = require("./models/account.js");
const Role = require("./models/role.js");
const ProcedureTemplate = require("./models/procedureTemplate.js");
const ResourceTemplate = require("./models/resourceTemplate.js");
const ResourceInstance = require("./models/resourceInstance.js");
const SectionTemplate = require("./models/sectionTemplate.js");
const ProcessTemplate = require("./models/processTemplate.js");
const ProcessInstance = require("./models/processInstance.js");
const SectionInstance = require("./models/sectionInstance.js");
const ProcedureInstance = require("./models/procedureInstance.js");
const Patient = require("./models/patient.js");
const Notification = require("./models/notification.js");
dotenv.config();
const Message = require("./models/message.js");

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;

const s3 = new S3Client({
  credentials: fromEnv(),
  region: bucketRegion,
});

const resourceController = require("./controllers/ResourceController.js");
const messagesController = require("./controllers/MessagesController.js");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected.");
    console.log("Iniitializing roles");
    const rolesToAdd = [
      { name: "physician", uniqueIdentifier: "physician" },
      { name: "nurse", uniqueIdentifier: "nurse" },
      { name: "surgeon", uniqueIdentifier: "surgeon" },
    ];

    // Function to add roles if they do not exist
    const addRolesIfNeeded = async () => {
      try {
        for (const roleData of rolesToAdd) {
          const existingRole = await Role.findOne({ name: roleData.name });
          if (!existingRole) {
            const newRole = new Role(roleData);
            await newRole.save();
            console.log(`Role '${roleData.name}' added successfully.`);
          } else {
            console.log(`Role '${roleData.name}' already exists.`);
          }
        }
      } catch (error) {
        console.error("Error adding roles:", error);
      }
    };

    // Call the function to add roles
    addRolesIfNeeded();
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });

const app = express();

app.use(express.json());

app.use(cookieParser());
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

// Socket.IO events
io.on("connection", async (socket) => {
  console.log("Socket connected!", socket.id);

  socket.on("login", async (userId) => {
    socket._uid = userId;
    console.log(
      `User login! Associating socket id ${socket.id} with user: ${userId}`
    );
    const currUser = await Account.findOne({ _id: userId });
    if (!currUser) {
      return console.log("Could not find account associated to user", userId);
    }

    const assignedProcesses = await getAssignedProcessesByUser(currUser);
    assignedProcesses.forEach((process) => {
      socket.join(process.processID);
      console.log(`socket ${socket.id} joined room: ${process.processID}`);
    });
  });

  socket.on("join process room", async (processID) => {
    const processInstance = await ProcessInstance.findOne({
      processID: processID,
    });
    if (!processInstance)
      return console.log(
        `user ${socket._uid} attempted to join a room ${processID} that does not exists`
      );

    socket.join(processID);
    console.log(
      `socket asscociated with user ${socket._uid} has joined ${processID}`
    );
  });

  socket.on("join process chat room", async (processID) => {
    // check process instance existence
    const processInstance = await ProcessInstance.findOne({
      processID: processID,
    });
    if (!processInstance)
      return console.log(
        `user ${socket._uid} attempted to join a room ${processID} that does not exists`
      );

    socket.join(`chat-${processID}`);
    console.log(`socket: ${socket.id} has joined chat room: ${processID}`);
  });

  socket.on("leave process chat room", async (processID) => {
    // check process instance existence
    const processInstance = await ProcessInstance.findOne({
      processID: processID,
    });
    if (!processInstance)
      return console.log(
        `user ${socket._uid} attempted to leave a room ${processID} that does not exists`
      );

    socket.leave(`chat-${processID}`);
    console.log(`socket: ${socket.id} has left chat room: ${processID}`);
  });

  socket.on("chatMessage", async (userId, text, processID) => {
    // checks for valid userId and processID
    const messageUser = await Account.findOne({ _id: userId });
    if (!messageUser)
      return console.log(`User ${userId} sending message does not exists`);
    const process = await ProcessInstance.findOne({ processID: processID });
    if (!process) return console.log(`Process ${processID} does not exists`);
    if (process.currentProcedure === null)
      return console.log(
        `User ${messageUser._id} attempted to chat in an completed process`
      );
    // creates new message and add them to message history
    const newMessage = await Message({
      userId: messageUser._id,
      text: text,
      timeCreated: new Date(),
    });
    process.messageHistory.push(newMessage._id);

    await newMessage.save();
    await process.save();

    // Find all unique users associated with this process (excluding the message sender)
    const procedureInstances = await ProcedureInstance.find({
      processID: processID,
    });
    const usersSet = new Set();
    for (let procedure of procedureInstances) {
      for (let roleAssignment of procedure.rolesAssignedPeople) {
        for (let account of roleAssignment.accounts) {
          const accountId = account.toString(); // Convert ObjectId to string
          if (accountId !== userId.toString()) {
            // Compare strings and exclude the sender
            usersSet.add(accountId);
          }
        }
      }
    }

    // Create and send a notification to each user
    usersSet.forEach(async (accountId) => {
      const notification = new Notification({
        userId: accountId,
        type: "Chat Message",
        title: "Chat Message",
        text: `${messageUser.firstName} ${messageUser.lastName} has sent a new message in the process ${process.processName} with the process ID ${processID}.`,
        timeCreated: new Date(),
        processID: processID,
      });
      await notification.save();

      const account = await Account.findById(accountId);
      if (account) {
        account.notificationBox.push(notification._id);
        await account.save();
      }
    });

    io.to(`chat-${processID}`).emit("new chat message - refresh");
    io.to(processID).emit("notification refresh");
  });

  socket.on("join process event room", async (processID) => {
    // check process instance existence
    const processInstance = await ProcessInstance.findOne({
      processID: processID,
    });
    if (!processInstance)
      return console.log(
        `user ${socket._uid} attempted to join a process event room ${processID} that does not exists`
      );

    socket.join(`process-event-${processID}`);
    console.log(
      `socket: ${socket.id} has joined process event room: ${processID}`
    );
  });

  socket.on("leave process event room", async (processID) => {
    // check process instance existence
    const processInstance = await ProcessInstance.findOne({
      processID: processID,
    });
    if (!processInstance)
      return console.log(
        `user ${socket._uid} attempted to leave a room ${processID} that does not exists`
      );

    socket.leave(`process-event-${processID}`);
    console.log(
      `socket: ${socket.id} has left process event room: ${processID}`
    );
  });

  socket.on("test", () => {
    console.log(`This is socket id ${socket.id} with user: ${socket._uid}`);
  });

  socket.on("disconnect", () => {
    console.log(`A user with id ${socket._uid} disconnected`);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.put("/user/profilePicture", upload.single("image"), async (req, res) => {
  try {
    const accountId = req.cookies.accountId;
    if (!accountId) {
      return res.status(400).send("User not logged in");
    }

    const currUser = await Account.findOne({ _id: accountId });
    if (!currUser)
      return res
        .status(404)
        .send("User does not exist! Malformed session, please login again!");

    // puts image into s3
    const profileUrlName =
      currUser.email + "." + req.file.mimetype.split("/")[1];
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: profileUrlName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });
    await s3.send(putCommand);
    currUser.profileUrl = profileUrlName;
    await currUser.save();

    // prepares new url
    const getCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: profileUrlName,
    });
    const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

    res.status(200).json({
      message: "Your profile image has been updated!",
      url: url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get("/user/profilePicture/url/:id", async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(404).send("id field needs to be provided!");

    let user;
    try {
      user = await Account.findById(req.params.id);
    } catch (err) {
      return res.status(404).send("User not found");
    }

    if (!user) return res.status(404).send("User not found");
    if (user.profileUrl === "") return res.status(200).send("");

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: user.profileUrl,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    res.status(200).send(url);
  } catch (error) {
    res.status(500).send(error);
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vitalsync2024@gmail.com",
    pass: "tcyw odek ayjh zrxn",
  },
});

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

app.post("/createAccount", async (req, res) => {
  // try {
  const {
    firstName,
    lastName,
    email,
    accountType,
    position,
    department,
    degree,
    phoneNumber,
    officePhoneNumber,
    officeLocation,
    eligibleRoles,
  } = req.body;

  // permission checks
  const currUID = req.cookies.accountId;
  if (!currUID) {
    return res.status(401).send("You are not authorized to use this feature");
  }
  const currUser = await Account.findOne({ _id: currUID });
  if (!currUser)
    return res
      .status(400)
      .send("Malformed session, please logout and sign in again!");
  if (currUser.accountType === "staff")
    return res.status(401).send("You are not authorized to use this feature!");
  console.log(accountType);
  console.log(currUser.accountType);
  if (
    accountType === "hospital admin" &&
    currUser.accountType !== "system admin"
  )
    return res
      .status(401)
      .send("You need to ask an system admin to create this type of account!");

  // Check if any required field is missing or empty
  if (
    !firstName ||
    !lastName ||
    !email ||
    !accountType ||
    !position ||
    !department ||
    !degree ||
    !phoneNumber ||
    !eligibleRoles
  ) {
    return res
      .status(400)
      .send(
        "All fields except officePhoneNumber and officeLocation are required."
      );
  }

  if (!isValidEmail) {
    return res.status(400).send("invalid email provided");
  }

  // Check if an account with the given email already exists
  const accountExists = await Account.findOne({ email: email });
  if (accountExists) {
    return res.status(400).send("An account with this email already exists.");
  }

  const inpRole = await Role.findOne({ name: eligibleRoles });
  if (!inpRole) return res.status(400).send("queried role doesn't exists");

  // Generate a random password
  const password = crypto.randomBytes(8).toString("hex");

  // Hash the password
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      return res.status(500).send("Error hashing password");
    }

    // Send email with the plain password
    const mailOptions = {
      from: "vitalsync2024@gmail.com",
      to: email,
      subject: "Welcome to VitalSync - Your Account Details",
      html: `
          <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 16px; color: #333;">
            <h2>Welcome to VitalSync!</h2>
            <p>Hello <strong>${firstName} ${lastName}</strong>,</p>
            <p>Your account has been successfully created. Below are your account details:</p>
            <table>
              <tr>
                <td>Email:</td>
                <td>${email}</td>
              </tr>
              <tr>
                <td>Password:</td>
                <td>${password}</td>
              </tr>
            </table>
            <p>Visit our website to log in with your new account: <a href="https://www.vitalsync.top/" target="_blank">VitalSync</a></p>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Thank you for choosing VitalSync!</p>
            <p>Best Regards,</p>
            <p>The VitalSync Team</p>
          </div>
        `,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return res.status(500).send("Error sending email");
      } else {
        // Create and save the new account
        const newAccount = new Account({
          firstName,
          lastName,
          password: hash, // Store the hashed password
          email,
          accountType,
          position,
          department,
          degree,
          phoneNumber,
          officePhoneNumber,
          officeLocation,
          eligibleRoles: inpRole,
        });

        await newAccount.save();
        res.status(201).send({
          message: "Account created successfully",
          accountId: newAccount._id,
        });
      }
    });
  });
  // } catch (error) {
  //   res.status(500).send("Error creating account");
  // }
});

const transformAccount = async (account) => {
  let url = account.profileUrl;
  if (account.profileUrl !== "") {
    const getCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: account.profileUrl,
    });
    url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
  }

  return {
    id: account._id,
    firstName: account.firstName,
    lastName: account.lastName,
    accountType: account.accountType,
    profileUrl: url,
  };
};

app.post("/login", async (req, res) => {
  console.log("Login route hit with body:", req.body);
  try {
    const { email, password } = req.body;

    // Check if an account with the given email exists
    const account = await Account.findOne({ email: email });
    if (!account) {
      return res.status(400).send({ message: "Incorrect email or password." });
    }

    // Compare the password
    bcrypt.compare(password, account.password, async (err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Error comparing passwords", error: err });
      }

      if (result) {
        // Set a cookie with the account ID
        res.cookie("accountId", account._id, {
          maxAge: 28000000000,
          sameSite: "none",
          secure: true,
        });
        // Send the Account document to the frontend
        const resAcc = await transformAccount(account);
        res.status(200).send({ message: "Login successful", account: resAcc });
      } else {
        res.status(400).send({ message: "Incorrect email or password." });
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).send({ message: "Error logging in", error });
  }
});

app.post("/logout", (req, res) => {
  // Clear the accountId cookie
  res.clearCookie("accountId", { sameSite: "none", secure: true });

  res.status(200).send({ message: "Logout successful" });
});

app.get("/checkLogin", async (req, res) => {
  try {
    // Check if the cookie is already set
    if (req.cookies.accountId) {
      // Send the Account document to the frontend
      const account = await Account.findById(req.cookies.accountId);
      const resAcc = await transformAccount(account);
      return res.status(200).send({
        message: "Already logged in",
        account: resAcc,
        isLoggedIn: true,
      });
    } else {
      return res.status(200).send({ isLoggedIn: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
});

app.post("/forgotPassword", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if an account with the given email exists
    const account = await Account.findOne({ email: email });
    if (!account) {
      return res.status(400).send({ message: "Account not found." });
    }

    // Generate a random OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Set OTP expiry time (15 minutes from now)
    const otpExpiry = new Date(new Date().getTime() + 15 * 60000);

    // Update the account with the OTP code and expiry
    await Account.findByIdAndUpdate(account._id, {
      otp: {
        code: otpCode,
        expiry: otpExpiry,
        used: false,
      },
    });

    // Send email with the OTP code
    const mailOptions = {
      from: "vitalsync2024@gmail.com",
      to: email,
      subject: "VitalSync Password Reset",
      html: `
        <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 16px; color: #333;">
          <h2>Password Reset Request</h2>
          <p>Hello <strong>${account.firstName} ${account.lastName}</strong>,</p>
          <p>You have requested to reset your password. Use the following OTP code to proceed:</p>
          <h3>${otpCode}</h3>
          <p>Please note that this code will expire in 15 minutes.</p>
          <p>Visit our website for more information: <a href="https://www.vitalsync.top/" target="_blank">VitalSync</a></p>
          <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
          <p>Best Regards,</p>
          <p>The VitalSync Team</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send({ message: "Error sending email.", error });
      } else {
        res.status(200).send({
          message: "OTP sent to your email.",
        });
      }
    });
  } catch (error) {
    res.status(500).send({ message: "Error processing request.", error });
  }
});

app.post("/verifyOtp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the account by email
    const account = await Account.findOne({ email: email });
    if (!account) {
      return res.status(400).send({ message: "Account not found." });
    }

    // Check if the OTP is provided and matches the one stored, and is not expired
    const currentTime = new Date();
    if (
      account.otp.code === otp &&
      account.otp.expiry > currentTime &&
      !account.otp.used
    ) {
      // Mark OTP as used to prevent reuse
      await Account.findByIdAndUpdate(account._id, {
        "otp.used": true,
      });

      // OTP verification successful
      return res.status(200).send({
        message:
          "OTP code verified successfully. You can now reset your password.",
      });
    } else {
      // OTP invalid or expired
      return res.status(400).send({ message: "Invalid or expired OTP code." });
    }
  } catch (error) {
    res.status(500).send({ message: "Error processing request.", error });
  }
});

app.post("/resetPassword", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find the account by email
    const account = await Account.findOne({ email: email });
    if (!account) {
      return res.status(400).send({ message: "Account not found" });
    }

    // Hash the new password
    bcrypt.hash(newPassword, saltRounds, async (err, hash) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Error hashing new password", error: err });
      }

      // Update the account with the new hashed password
      await Account.findByIdAndUpdate(account._id, {
        password: hash,
        // Clear the otp field to signify the process is complete
        "otp.code": null,
        "otp.expiry": null,
        "otp.used": false,
      });

      res.status(200).send({ message: "Password reset successfully" });
    });
  } catch (error) {
    res.status(500).send({ message: "Error resetting password", error });
  }
});

async function initializePredefinedAccounts() {
  const nurseRole = await Role.findOne({ name: "nurse" });
  const physicianRole = await Role.findOne({ name: "physician" });
  const surgeonRole = await Role.findOne({ name: "surgeon" });
  try {
    const predefinedAccounts = [
      {
        firstName: "Staff",
        lastName: "User",
        email: "staff@example.com",
        accountType: "staff",
        position: "Staff Position",
        department: "Staff Department",
        degree: "Staff Degree",
        phoneNumber: "1234567890",
        password: "staffPassword123", // Password for staff
        eligibleRoles: [nurseRole._id],
        assignedProcedures: [],
        notificationBox: [],
      },
      {
        firstName: "Hospital",
        lastName: "Admin",
        email: "hospitaladmin@example.com",
        accountType: "hospital admin",
        position: "Hospital Admin Position",
        department: "Hospital Admin Department",
        degree: "Hospital Admin Degree",
        phoneNumber: "9876543210",
        password: "hospitalAdminPassword123", // Password for hospital admin
        eligibleRoles: [physicianRole._id],
        assignedProcedures: [],
        notificationBox: [],
      },
      {
        firstName: "System",
        lastName: "Admin",
        email: "systemadmin@example.com",
        accountType: "system admin",
        position: "System Admin Position",
        department: "System Admin Department",
        degree: "System Admin Degree",
        phoneNumber: "5555555555",
        password: "systemAdminPassword123", // Password for system admin
        eligibleRoles: [surgeonRole._id],
        assignedProcedures: [],
        notificationBox: [],
      },
    ];

    const createdAccountIds = []; // Array to store the IDs of the created accounts

    // Loop through predefined accounts and create them if they don't exist
    for (const accountData of predefinedAccounts) {
      // Check if an account with the given email already exists
      const accountExists = await Account.findOne({ email: accountData.email });
      if (!accountExists) {
        // Hash the password (assuming bcrypt is used)
        const hashedPassword = await bcrypt.hash(
          accountData.password,
          saltRounds
        );

        // Create and save the new account
        const newAccount = new Account({
          ...accountData,
          password: hashedPassword,
        });

        // Save the account and store its ID
        const savedAccount = await newAccount.save();
        console.log(`Account '${accountData.email}' created successfully.`);
        createdAccountIds.push(savedAccount._id.toString()); // Push the ID of the created account
      } else {
        console.log(
          `Account with email '${accountData.email}' already exists.`
        );
      }
    }

    // Return the array of created account IDs
    return createdAccountIds;
  } catch (error) {
    console.error("Error initializing predefined accounts:", error);
    throw error; // Propagate the error to the caller
  }
}

// Function to remove predefined accounts
async function removePredefinedAccounts() {
  try {
    const predefinedAccounts = await Account.find({
      email: {
        $in: [
          "staff@example.com",
          "hospitaladmin@example.com",
          "systemadmin@example.com",
        ],
      },
    });

    const deletedAccounts = await Account.deleteMany({
      email: {
        $in: [
          "staff@example.com",
          "hospitaladmin@example.com",
          "systemadmin@example.com",
        ],
      },
    });

    console.log(
      `${deletedAccounts.deletedCount} predefined accounts removed successfully.`
    );

    for (const account of predefinedAccounts) {
      const profileUrlName = account.profileUrl;

      if (!profileUrlName || !profileUrlName.includes("@")) {
        continue;
      }

      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: profileUrlName,
      });

      await s3.send(deleteCommand);
      console.log(`Profile image '${profileUrlName}' deleted successfully.`);
    }
  } catch (error) {
    console.error("Error removing predefined accounts:", error);
  }
}

app.get("/user/:userId", async (req, res) => {
  try {
    const user = await Account.findOne({ _id: req.params.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const response = {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      profileUrl: user.profileUrl,
      userType: user.userType,
      position: user.position,
      department: user.department,
      degree: user.degree,
      specialization: user.specialization,
      phoneNumber: user.phoneNumber,
      officePhoneNumber: user.officePhoneNumber,
      email: user.email,
      officeLocation: user.officeLocation,
      userImg: user.userImg,
      usualHours: user.usualHours,
      profileImage: user.profileImage,
      unavailableTimes: user.unavailableTimes,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching user by _id:", error);
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
});

app.get("/users/accountsByRole/:roleId", async (req, res) => {
  try {
    const { roleId } = req.params;
    const accounts = await Account.find({ eligibleRoles: roleId }).populate(
      "eligibleRoles"
    );
    res.json(accounts);
  } catch (error) {
    console.error("Error fetching accounts by role:", error);
    res
      .status(500)
      .json({ message: "Error fetching accounts", error: error.message });
  }
});

app.put("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const { unavailableTimes, deletedTimes, ...updateData } = req.body;

  try {
    const user = await Account.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (unavailableTimes || deletedTimes) {
      if (deletedTimes && deletedTimes.length > 0) {
        user.unavailableTimes = user.unavailableTimes.filter(
          (time) => !deletedTimes.includes(time._id.toString())
        );
      }

      if (unavailableTimes && unavailableTimes.length > 0) {
        user.unavailableTimes.push(...unavailableTimes);
      }

      const updatedUser = await user.save();
      res.json({ message: "Profile updated successfully", user: updatedUser });
    } else {
      const updatedUser = await Account.findByIdAndUpdate(userId, updateData, {
        new: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "Profile updated successfully", user: updatedUser });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await Account.find(
      {},
      { firstName: 1, lastName: 1, department: 1, position: 1, isTerminated: 1 }
    ); // Select necessary fields
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

app.get("users/accountsByRole/:roleId", async (req, res) => {
  try {
    const { roleId } = req.params;
    const accounts = await Account.find(
      {
        eligibleRoles: { $in: [roleId] },
        isTerminated: false,
      },
      {
        firstName: 1,
        lastName: 1,
        position: 1,
        unavailableTimes: 1,
        assignedProcedures: 1,
      }
    ).populate("eligibleRoles");

    res.json(accounts);
  } catch (error) {
    console.error("Error fetching accounts by role:", error);
    res.status(500).json({
      message: "Error fetching accounts",
      error: error.message,
    });
  }
});

app.put("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const { isTerminated } = req.body;

  console.log("UserID:", userId); // Check the user ID received
  console.log("isTerminated:", isTerminated); // Check the isTerminated flag received

  try {
    const user = await Account.findByIdAndUpdate(
      userId,
      { isTerminated },
      { new: true }
    );
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    console.error("Failed to update user:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/compare-passwords", async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    const user = await Account.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      res.send({
        isSame: true,
        message: "New password must be different from the old password.",
      });
    } else {
      res.send({
        isSame: false,
        message: "Passwords are different, you can proceed.",
      });
    }
  } catch (error) {
    console.error("Error comparing passwords:", error);
    res.status(500).send({ message: "Failed to compare passwords." });
  }
});

app.post("/verify-password", async (req, res) => {
  const { userId, password } = req.body;
  try {
    const user = await Account.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      res.send({ isPasswordCorrect: true });
    } else {
      res.send({ isPasswordCorrect: false });
    }
  } catch (error) {
    console.error("Error verifying password:", error);
    res.status(500).send({ message: "Internal server error." });
  }
});

app.post("/reset-password", async (req, res) => {
  const { userId, newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).send({ message: "Password cannot be empty." });
  }

  try {
    const user = await Account.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    console.log(user);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.send({ message: "Password successfully updated." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send({ message: "Internal server error." });
  }
});

app.get("/procedureTemplates", async (req, res) => {
  try {
    const procedureTemplates = await ProcedureTemplate.find()
      .populate("requiredResources.resource")
      .populate("roles.role");
    res.json(procedureTemplates);
  } catch (error) {
    console.error("Error fetching procedure templates:", error);
    res.status(500).json({
      message: "Error fetching procedure templates",
      error: error.message,
    });
  }
});

app.get("/resourceTemplates", async (req, res) => {
  try {
    const resourceTemplates = await ResourceTemplate.find();
    res.json(resourceTemplates);
  } catch (error) {
    console.error("Error fetching resource templates:", error);
    res.status(500).json({
      message: "Error fetching resource templates",
      error: error.message,
    });
  }
});

app.post("/resources", resourceController.createResource);

app.put("/resources", resourceController.updateResource);

app.delete("/resources", resourceController.deleteResource);

app.get("/roles", async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res
      .status(500)
      .json({ message: "Error fetching roles", error: error.message });
  }
});

app.post("/procedureTemplates", async (req, res) => {
  try {
    // Resolve ResourceTemplate names to IDs
    const resourceIdsWithQuantity = await Promise.all(
      req.body.requiredResources.map(async (item) => {
        const resource = await ResourceTemplate.findOne({
          name: item.resourceName,
        });
        if (!resource) {
          throw new Error(`Resource not found: ${item.resourceName}`);
        }
        return { resource: resource._id, quantity: item.quantity };
      })
    );

    // Resolve Role names to IDs
    const roleIdsWithQuantity = await Promise.all(
      req.body.roles.map(async (item) => {
        const role = await Role.findOne({ name: item.roleName });
        if (!role) {
          throw new Error(`Role not found: ${item.roleName}`);
        }
        return { role: role._id, quantity: item.quantity };
      })
    );

    // Create new ProcedureTemplate with resolved IDs
    const newProcedureTemplate = new ProcedureTemplate({
      procedureName: req.body.procedureName,
      description: req.body.description,
      requiredResources: resourceIdsWithQuantity,
      roles: roleIdsWithQuantity,
      estimatedTime: req.body.estimatedTime,
      specialNotes: req.body.specialNotes,
    });

    const savedProcedureTemplate = await newProcedureTemplate.save();

    res.status(201).json(savedProcedureTemplate);
  } catch (error) {
    console.error("Failed to create procedure template:", error);
    res.status(400).json({
      message: "Failed to create procedure template",
      error: error.message,
    });
  }
});

app.put("/procedureTemplates/:id", async (req, res) => {
  try {
    // Resolve ResourceTemplate names to IDs
    const resourceIdsWithQuantity = await Promise.all(
      req.body.requiredResources.map(async (item) => {
        const resource = await ResourceTemplate.findOne({
          name: item.resourceName,
        });
        if (!resource) {
          throw new Error(`Resource not found: ${item.resourceName}`);
        }
        return { resource: resource._id, quantity: item.quantity };
      })
    );

    // Resolve Role names to IDs
    const roleIdsWithQuantity = await Promise.all(
      req.body.roles.map(async (item) => {
        const role = await Role.findOne({ name: item.roleName });
        if (!role) {
          throw new Error(`Role not found: ${item.roleName}`);
        }
        return { role: role._id, quantity: item.quantity };
      })
    );

    // Update the ProcedureTemplate with the resolved IDs
    const updatedProcedureTemplate = await ProcedureTemplate.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          procedureName: req.body.procedureName,
          description: req.body.description,
          requiredResources: resourceIdsWithQuantity,
          roles: roleIdsWithQuantity,
          estimatedTime: req.body.estimatedTime,
          specialNotes: req.body.specialNotes,
        },
      },
      { new: true }
    );

    if (!updatedProcedureTemplate) {
      throw new Error("Procedure template not found");
    }

    res.status(200).json(updatedProcedureTemplate);
  } catch (error) {
    console.error("Failed to update procedure template:", error);
    res.status(400).json({
      message: "Failed to update procedure template",
      error: error.message,
    });
  }
});

app.get("/procedureTemplates/:id", async (req, res) => {
  try {
    const procedureTemplate = await ProcedureTemplate.findById(req.params.id)
      .populate("requiredResources.resource")
      .populate("roles.role");
    if (!procedureTemplate) {
      return res.status(404).json({ message: "Procedure template not found" });
    }
    res.json(procedureTemplate);
  } catch (error) {
    console.error("Error fetching procedure template by ID:", error);
    res.status(500).json({
      message: "Error fetching procedure template",
      error: error.message,
    });
  }
});

app.delete("/procedureTemplates/:id", async (req, res) => {
  const procedureTemplateId = req.params.id;
  try {
    // Check if any SectionTemplate is using the ProcedureTemplate
    const sectionUsingProcedure = await SectionTemplate.findOne({
      procedureTemplates: new mongoose.Types.ObjectId(procedureTemplateId),
    });

    if (sectionUsingProcedure) {
      // Check if the SectionTemplate is part of any ProcessTemplate
      const isPartOfProcess = await ProcessTemplate.findOne({
        sectionTemplates: sectionUsingProcedure._id,
      });

      // If the ProcedureTemplate is in use and part of a process template, do not delete and send a message
      if (isPartOfProcess) {
        return res.status(403).json({
          message:
            "Cannot delete procedure template because it is in use by a process template.",
        });
      }
    }

    // If the ProcedureTemplate is not in use by a process template, proceed to delete
    await ProcedureTemplate.findByIdAndDelete(procedureTemplateId);

    res.status(200).json({
      message: "Procedure template deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting procedure template",
      error: error.message,
    });
  }
});

app.get("/resources", async (req, res) => {
  try {
    const resources = await ResourceInstance.find();
    res.json(resources);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching resources", error: error.message });
  }
});

app.get("/resources/byName/:name", async (req, res) => {
  try {
    const resourceInstances = await ResourceInstance.find({
      name: req.params.name,
    });
    res.json(resourceInstances);
  } catch (error) {
    console.error("Error fetching resource instances by name:", error);
    res.status(500).json({
      message: "Error fetching resource instances",
      error: error.message,
    });
  }
});

// Fetch a specific resource by ID
app.get("/resources/:id", async (req, res) => {
  try {
    const resource = await ResourceInstance.findById(req.params.id);
    if (!resource)
      return res.status(404).send({ message: "Resource not found" });
    res.json(resource);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching the resource", error: error.message });
  }
});

// Delete a resource
app.delete("/resources/:id", async (req, res) => {
  try {
    const result = await ResourceInstance.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send({ message: "Resource not found" });
    res.send({ message: "Resource deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting the resource", error: error.message });
  }
});

app.get("/processTemplates", async (req, res) => {
  try {
    const templates = await ProcessTemplate.find().populate({
      path: "sectionTemplates",
      populate: {
        path: "procedureTemplates",
        populate: {
          path: "requiredResources.resource roles.role",
        },
      },
    });

    res.status(200).json(templates);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving process templates");
  }
});

app.get("/processTemplates/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const template = await ProcessTemplate.findById(id).populate({
      path: "sectionTemplates",
      populate: {
        path: "procedureTemplates",
        populate: {
          path: "requiredResources.resource roles.role",
        },
      },
    });

    if (!template) {
      return res.status(404).json({ message: "Process template not found" });
    }

    res.status(200).json(template);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving process template",
      error: error.message,
    });
  }
});

app.put("/processTemplates/:id", async (req, res) => {
  try {
    const { processName, description, sections } = req.body;
    const { id } = req.params;

    const sectionIds = await Promise.all(
      sections.map(async (section) => {
        if (
          "_id" in section &&
          mongoose.Types.ObjectId.isValid(section._id.toString())
        ) {
          const updatedSection = await SectionTemplate.findByIdAndUpdate(
            section._id,
            {
              sectionName: section.sectionName,
              description: section.description,
              procedureTemplates: section.procedureTemplates.filter((id) =>
                mongoose.Types.ObjectId.isValid(id)
              ),
            },
            { new: true }
          );
          return updatedSection ? updatedSection._id : null;
        } else {
          // Create new section
          const newSection = new SectionTemplate({
            sectionName: section.sectionName,
            description: section.description,
            procedureTemplates: section.procedureTemplates.filter((id) =>
              mongoose.Types.ObjectId.isValid(id)
            ),
          });
          await newSection.save();
          return newSection._id;
        }
      })
    );

    const filteredSectionIds = sectionIds.filter((id) => id !== null);

    const updatedTemplate = await ProcessTemplate.findByIdAndUpdate(
      id,
      {
        processName,
        description,
        sectionTemplates: filteredSectionIds,
      },
      { new: true }
    ).populate("sectionTemplates");

    if (!updatedTemplate) {
      return res.status(404).json({ message: "Process template not found" });
    }

    res.status(200).json(updatedTemplate);
  } catch (error) {
    console.error("Failed to update process template:", error);
    res.status(400).json({
      message: "Failed to update process template",
      error: error.message,
    });
  }
});

app.delete("/processTemplates/:id", async (req, res) => {
  try {
    const processTemplateId = req.params.id;
    await ProcessTemplate.findByIdAndDelete(processTemplateId);

    res.status(200).json({
      message: "Process template deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting process template",
      error: error.message,
    });
  }
});

app.post("/processTemplates", async (req, res) => {
  try {
    const { processName, description, sections } = req.body;

    const sectionIds = await Promise.all(
      sections.map(async (section) => {
        const newSection = new SectionTemplate({
          sectionName: section.sectionName,
          description: section.description,
          procedureTemplates: section.procedureTemplates,
        });
        await newSection.save();
        return newSection._id;
      })
    );

    const newProcessTemplate = new ProcessTemplate({
      processName,
      description,
      sectionTemplates: sectionIds,
    });

    await newProcessTemplate.save();
    res.status(201).json(newProcessTemplate);
  } catch (error) {
    console.error("Failed to create process template:", error);
    res.status(400).json({
      message: "Failed to create process template",
      error: error.message,
    });
  }
});

const getLocationOfProcedure = async (myProcedure) => {
  await myProcedure.populate("assignedResources");
  const assignedResources = myProcedure.assignedResources;
  let myProcedureLocation = "";
  assignedResources.forEach((resource) => {
    if (resource.type === "spaces") {
      myProcedureLocation = resource.location;
      return;
    }
  });
  if (!myProcedureLocation)
    throw new Error(
      `No space resource type exist in the assigned resources of procedure ${assignedResources._id}`
    );

  return myProcedureLocation;
};

const getIncompleteProcedureInProcess = async (processInstance) => {
  const procedureInstances = [];
  for (const sectionInstanceID of processInstance.sectionInstances) {
    const sectionInstance = await SectionInstance.findById(
      sectionInstanceID
    ).populate("procedureInstances");

    if (!sectionInstance)
      throw new Error("Section ids inside process instances cannot be found");

    // add to procedure instances array if procedure is not completed
    sectionInstance.procedureInstances.forEach((procedureInstance) => {
      if (
        procedureInstance.peopleMarkAsCompleted.length !==
        procedureInstance.rolesAssignedPeople.length
      )
        procedureInstances.push(procedureInstance);
    });
  }

  return procedureInstances;
};

const getUniqueProcessesByUser = async (user) => {
  const assignedProcedures = await user.populate("assignedProcedures");
  const uniqueProcessInstances = new Set();
  assignedProcedures.assignedProcedures.forEach((procedure) => {
    uniqueProcessInstances.add(procedure.processID);
  });

  return uniqueProcessInstances;
};

const getAssignedProcessesByUser = async (user) => {
  // Step 1: Find all unique processInstances related to assignedProcedures
  const uniqueProcessInstances = await getUniqueProcessesByUser(user);

  // Step 2: Iterate through each unique processInstance
  const assignedProcesses = [];
  for (const processID of uniqueProcessInstances) {
    // Step 3: Retrieve process details
    const processInstance = await ProcessInstance.findOne({
      processID: processID,
    })
      .populate("currentProcedure")
      .populate("patient");

    if (!processInstance) {
      console.log(`A process with processID ${processID} does not exists!`);
      continue;
    }
    // skip completed processes
    if (processInstance.currentProcedure === null) continue;

    // Step 4: Resolve incomplete procedureInstances for each sectionInstance
    const procedureInstances = await getIncompleteProcedureInProcess(
      processInstance
    );

    // Step 5: Find the first incomplete procedureInstance assigned to the user
    let procedureAhead = 0;
    let myProcedure = null;
    for (const procedureInstance of procedureInstances) {
      const isAssigned = procedureInstance.rolesAssignedPeople.some(
        (roleAssigned) =>
          roleAssigned.accounts.some((account) => account.equals(user._id))
      );
      const hasCompleted = procedureInstance.peopleMarkAsCompleted.some(
        (roleAssigned) =>
          roleAssigned.accounts.some((account) => account.equals(user._id))
      );

      if (isAssigned && !hasCompleted) {
        myProcedure = procedureInstance;
        break;
      }
      if (
        !isAssigned &&
        procedureInstance.peopleMarkAsCompleted.length !==
          procedureInstance.rolesAssignedPeople.length
      ) {
        procedureAhead++;
      }
    }

    const myProcedureLocation = myProcedure
      ? await getLocationOfProcedure(myProcedure)
      : "";

    let currentProcedure = null;
    if (procedureInstances.length > 0) currentProcedure = procedureInstances[0];

    // Step 6: Create the return object
    const assignedProcess = {
      processID: processInstance.processID,
      processName: processInstance.processName,
      description: processInstance.description,
      myProcedure: myProcedure
        ? {
            // procedureId: myProcedure._id,
            procedureName: myProcedure.procedureName,
            location: myProcedureLocation,
            timeStart: myProcedure.timeStart.toISOString(),
            timeEnd: myProcedure.timeEnd.toISOString(),
          }
        : null,
      currentProcedure: currentProcedure,
      patientName: processInstance.patient
        ? processInstance.patient.fullName
        : null,
      procedureAhead: procedureAhead,
    };

    // Step 7: Push the object to the result array
    assignedProcesses.push(assignedProcess);
  }

  return assignedProcesses;
};

app.get("/assignedProcesses", async (req, res) => {
  try {
    const accountId = req.cookies.accountId;
    if (!accountId) return res.status(401).send("User not logged in");
    const currUser = await Account.findOne({ _id: accountId });
    if (!currUser)
      return res
        .status(404)
        .send("User does not exist! Malformed session, please login again!");

    console.log("Processing assigned process for user: ", currUser._id);
    if (currUser.assignedProcedures.length === 0)
      return res.status(200).json([]);
    const data = await getAssignedProcessesByUser(currUser);
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send("server side error when fetching your assigned processes");
  }
});

app.get("/processInstance/:processID", async (req, res) => {
  try {
    const processInstance = await ProcessInstance.findOne({
      processID: req.params.processID,
    })
      .populate({
        path: "sectionInstances",
        populate: {
          path: "procedureInstances",
          populate: [
            { path: "requiredResources", model: "ResourceTemplate" },
            { path: "assignedResources", model: "ResourceInstance" },
            {
              path: "rolesAssignedPeople",
              populate: {
                path: "role",
                model: "Role",
              },
            },
            {
              path: "rolesAssignedPeople",
              populate: {
                path: "accounts",
                model: "Account",
              },
            },
            {
              path: "peopleMarkAsCompleted",
              populate: {
                path: "role",
                model: "Role",
              },
            },
            {
              path: "peopleMarkAsCompleted",
              populate: {
                path: "accounts",
                model: "Account",
              },
            },
          ],
        },
      })
      .populate({
        path: "currentProcedure",
        populate: [
          { path: "requiredResources", model: "ResourceTemplate" },
          { path: "assignedResources", model: "ResourceInstance" },
          {
            path: "rolesAssignedPeople",
            populate: {
              path: "role",
              model: "Role",
            },
          },
          {
            path: "rolesAssignedPeople",
            populate: {
              path: "accounts",
              model: "Account",
            },
          },
          {
            path: "peopleMarkAsCompleted",
            populate: {
              path: "role",
              model: "Role",
            },
          },
          {
            path: "peopleMarkAsCompleted",
            populate: {
              path: "accounts",
              model: "Account",
            },
          },
        ],
      })
      .populate({
        path: "patient",
        model: "Patient",
      });

    if (!processInstance) {
      return res.status(404).send("Process instance not found");
    }

    const processInstanceObject = processInstance.toObject();
    let totalProcedures = 0;
    let completedProcedures = 0;

    processInstanceObject.sectionInstances.forEach((section) => {
      let allCompleted = true;
      section.procedureInstances.forEach((procedure) => {
        totalProcedures++;
        const assignedCount = procedure.rolesAssignedPeople.length;
        const completedCount = procedure.peopleMarkAsCompleted.length;
        if (assignedCount > 0 && completedCount === assignedCount) {
          completedProcedures++;
        }
        if (completedCount !== assignedCount || assignedCount === 0) {
          allCompleted = false;
        }
      });
      section.isCompleted = allCompleted;
    });

    processInstanceObject.totalProcedures = totalProcedures;
    processInstanceObject.completedProcedures = completedProcedures;

    res.json(processInstanceObject);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put("/markProcedureComplete/:procedureId", async (req, res) => {
  const procedureInstanceId = req.params.procedureId;
  const accountId = req.cookies.accountId;

  console.log(
    "got mark procedure complete for procedure id",
    procedureInstanceId,
    " and user ",
    accountId
  );

  try {
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).send("Account not found");
    }

    const procedure = await ProcedureInstance.findById(procedureInstanceId);
    if (!procedure) {
      return res.status(404).send("Procedure instance not found");
    }

    const eligible = await Role.find({ _id: { $in: account.eligibleRoles } });
    const eligibleRoleIds = eligible.map((role) => role._id.toString());

    const roleAssigned = procedure.rolesAssignedPeople.some((assigned) => {
      return (
        eligibleRoleIds.includes(assigned.role.toString()) &&
        assigned.accounts.includes(account._id)
      );
    });

    if (!roleAssigned) {
      return res
        .status(403)
        .send("You do not have permission to mark this procedure as complete");
    }

    const isAlreadyMarked = procedure.peopleMarkAsCompleted.some((record) =>
      record.accounts.includes(account._id)
    );

    if (!isAlreadyMarked) {
      procedure.peopleMarkAsCompleted.push({
        role: account.eligibleRoles[0],
        accounts: [account._id],
      });
      await procedure.save();
    }

    // remove completed procedure inside user's assigned procedure
    // account.assignedProcedures = account.assignedProcedures.filter(
    //   (assignedProcedure) => {
    //     return !assignedProcedure.equals(procedure._id);
    //   }
    // );
    // await account.save();

    const assignedCount = procedure.rolesAssignedPeople.length;
    const completedCount = procedure.peopleMarkAsCompleted.length;

    const section = await SectionInstance.findOne({
      procedureInstances: procedure._id,
    });
    const process = await ProcessInstance.findOne({
      sectionInstances: section._id,
    });

    if (assignedCount === completedCount) {
      const procedureIndex = section.procedureInstances.indexOf(procedure._id);
      let nextProcedureId = null;

      if (procedureIndex < section.procedureInstances.length - 1) {
        nextProcedureId = section.procedureInstances[procedureIndex + 1];
      } else {
        const sectionIndex = process.sectionInstances.indexOf(section._id);
        if (sectionIndex < process.sectionInstances.length - 1) {
          const nextSection = await SectionInstance.findById(
            process.sectionInstances[sectionIndex + 1]
          );
          nextProcedureId = nextSection.procedureInstances[0];
        }
      }

      process.currentProcedure = nextProcedureId;
      await process.save();

      // Fetch all sections of the process
      const sections = await SectionInstance.find({
        _id: { $in: process.sectionInstances },
      });
      const procedureIds = sections.flatMap(
        (section) => section.procedureInstances
      );

      // Fetch all procedures to gather all roles and accounts involved
      const procedures = await ProcedureInstance.find({
        _id: { $in: procedureIds },
      });
      let userIds = new Set();
      procedures.forEach((proc) => {
        proc.rolesAssignedPeople.forEach((role) => {
          role.accounts.forEach((accountId) => {
            userIds.add(accountId.toString());
          });
        });
      });

      // Calculate the number of procedures left
      const index = procedures.findIndex((p) => p._id.equals(nextProcedureId));
      let remainingProceduresCount = 0;
      if (index !== -1) {
        remainingProceduresCount =
          procedureIds.length -
          procedures.findIndex((p) => p._id.equals(nextProcedureId));
      }

      // Get the name of the next procedure
      const nextProcedure = procedures.find((p) =>
        p._id.equals(nextProcedureId)
      );
      const nextProcedureName = nextProcedure
        ? nextProcedure.procedureName
        : "None";

      let nextProcedureAssignedUserIds = [];
      if (nextProcedure) {
        nextProcedure.rolesAssignedPeople.forEach((role) => {
          role.accounts.forEach((accountId) => {
            nextProcedureAssignedUserIds.push(accountId);
          });
        });
      }

      let notificationText = "";
      if (nextProcedure) {
        notificationText = `A procedure ${procedure.procedureName} has been completed for the process ${process.processName} with the process ID ${process.processID} that you are a part of. The next procedure is ${nextProcedureName}. There are ${remainingProceduresCount} procedures left until the process is fully complete.`;
      } else {
        notificationText = `A procedure ${procedure.procedureName} has been completed for the process ${process.processName} with the process ID ${process.processID} that you are a part of. There are no more procedures left in the process. The process is fully complete.`;
      }

      await Promise.all(
        Array.from(userIds).map(async (userId) => {
          const notification = new Notification({
            userId: userId,
            type: "check",
            title: "Procedure Completion",
            text: notificationText,
            timeCreated: new Date(),
            processID: process.processID,
          });

          await notification.save();

          // Push the notification to the user's notification box
          return Account.findByIdAndUpdate(userId, {
            $push: { notificationBox: notification._id },
          });
        })
      );

      await Promise.all(
        nextProcedureAssignedUserIds.map(async (userId) => {
          const notification = new Notification({
            userId: userId,
            type: "action",
            title: "Your Turn",
            text: `Your assigned procedure ${nextProcedure.procedureName} for the process ${process.processName} with the process ID ${process.processID} is the current procedure to be completed.`,
            timeCreated: new Date(),
            processID: process.processID,
          });

          await notification.save();

          // Push the notification to the user's notification box
          return Account.findByIdAndUpdate(userId, {
            $push: { notificationBox: notification._id },
          });
        })
      );

      // signals to frontend of the current procedure update
      io.to(process.processID).emit("notification refresh");
    }

    // signals to frontend of the current procedure update
    io.to(process.processID).emit("procedure complete - refresh");

    res.send("Procedure marked as complete");
  } catch (error) {
    console.error("Error updating procedure instance:", error);
    res.status(500).send("Internal server error");
  }
});

const getBoardProcessInfo = async (process) => {
  process.populate("patient");
  process.populate("currentProcedure");

  const incompleteProcedures = await getIncompleteProcedureInProcess(process);

  const proceduresLeft = await Promise.all(
    incompleteProcedures.map(async (procedure) => {
      const peopleAssigned = procedure.rolesAssignedPeople.reduce(
        (accum, obj) => accum.concat(obj.accounts),
        []
      );
      const peopleCompleted = procedure.peopleMarkAsCompleted.reduce(
        (accum, obj) => accum.concat(obj.accounts),
        []
      );

      const location = await getLocationOfProcedure(procedure);

      return {
        _id: procedure._id,
        procedureName: procedure.procedureName,
        timeStart: procedure.timeStart,
        location,
        description: procedure.description,
        specialInstructions: procedure.specialNotes,
        peopleAssigned,
        peopleCompleted,
      };
    })
  );

  return {
    processID: process.processID,
    currentProcedure: process.currentProcedure,
    processName: process.processName,
    patientName: process.patient.fullName,
    proceduresLeft,
  };
};

app.get("/boardProcess/:id", async (req, res) => {
  try {
    const processID = req.params.id;
    const accountId = req.cookies.accountId;
    if (!accountId) return res.status(401).send("User not logged in");
    const currUser = await Account.findOne({ _id: accountId });
    if (!currUser)
      return res
        .status(404)
        .send("User does not exist! Malformed session, please login again!");

    // process existence check
    const process = await ProcessInstance.findOne({ processID: processID });
    if (!process)
      return res
        .status(404)
        .send(
          "The provided process ID is not associated with any process instance!"
        );

    const data = await getBoardProcessInfo(process);
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .status("server side error when process board process");
  }
});

app.get("/users/:userId/notifications", async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid User ID");
    }

    const user = await Account.findById(userId).populate({
      path: "notificationBox",
      populate: {
        path: "userId",
        model: "Account",
      },
      options: { sort: { timeCreated: -1 } },
    });

    console.log("user notifications");
    console.log(user);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.json(user.notificationBox);
  } catch (error) {
    res.status(500).send("Server error");
  }
});
app.get("/chatMessages/:pid", messagesController.getChatMessagesByProcess);

app.get("/processInstancesActive", async (req, res) => {
  try {
    const processInstances = await ProcessInstance.find({
      currentProcedure: { $ne: null },
    })
      .populate({
        path: "patient",
        select: "fullName",
      })
      .populate({
        path: "sectionInstances",
        populate: {
          path: "procedureInstances",
          model: "ProcedureInstance",
          populate: [
            { path: "requiredResources", model: "ResourceTemplate" },
            { path: "assignedResources", model: "ResourceInstance" },
            {
              path: "rolesAssignedPeople",
              populate: { path: "role", model: "Role" },
            },
            {
              path: "rolesAssignedPeople",
              populate: { path: "accounts", model: "Account" },
            },
            {
              path: "peopleMarkAsCompleted",
              populate: { path: "role", model: "Role" },
            },
            {
              path: "peopleMarkAsCompleted",
              populate: { path: "accounts", model: "Account" },
            },
          ],
          select: "procedureName timeStart timeEnd",
        },
      })
      .populate({
        path: "currentProcedure",
        select: "procedureName", // Select only the necessary fields
      });

    const allInstances = processInstances.map((pi) => {
      let totalProcedures = 0;
      let completedProcedures = 0;
      let nextProcedure = null;
      let foundCurrent = false;

      for (const section of pi.sectionInstances) {
        for (let i = 0; i < section.procedureInstances.length; i++) {
          const proc = section.procedureInstances[i];
          totalProcedures++;
          const assignedCount = proc.rolesAssignedPeople.length;
          const completedCount = proc.peopleMarkAsCompleted.length;
          if (assignedCount > 0 && completedCount === assignedCount) {
            completedProcedures++;
          }
          // Determine the next procedure after the current one
          if (foundCurrent) {
            nextProcedure = proc;
            break;
          }
          if (pi.currentProcedure && proc._id.equals(pi.currentProcedure._id)) {
            foundCurrent = true;
            // Check if there's another procedure in the same section
            if (i + 1 < section.procedureInstances.length) {
              nextProcedure = section.procedureInstances[i + 1];
              break;
            }
          }
        }
        if (nextProcedure) break; // Break outer loop if next procedure is found
      }

      return {
        objectID: pi._id,
        processID: pi.processID,
        processName: pi.processName,
        description: pi.description,
        patientFullName: pi.patient ? pi.patient.fullName : "No patient",
        procedures: pi.sectionInstances.flatMap((section) =>
          section.procedureInstances.map((proc) => proc.procedureName)
        ),
        totalProcedures: totalProcedures,
        completedProcedures: completedProcedures,
        currentProcedure: pi.currentProcedure
          ? pi.currentProcedure.procedureName
          : "Not Set",
        nextProcedure: nextProcedure ? nextProcedure.procedureName : "None",
      };
    });

    res.json(allInstances);
  } catch (error) {
    console.error("Error fetching process instances:", error);
    res.status(500).send("Internal server error");
  }
});

app.get("/processCompleted/:pid", async (req, res) => {
  if (!req.params.pid) return res.status(400).send("No process id provided!");
  const processInstance = await ProcessInstance.findOne({
    processID: req.params.pid,
  });
  if (!processInstance)
    return res.status(400).send("The provided process ID does not exists");

  const isCompleted = processInstance.currentProcedure === null;
  return res.status(200).send(isCompleted);
});

app.get("/processInstances", async (req, res) => {
  //NOTE this is for records and filters for complete processes
  try {
    const processInstances = await ProcessInstance.find({})
      .populate({
        path: "patient",
        select: "fullName",
      })
      .populate({
        path: "sectionInstances",
        populate: {
          path: "procedureInstances",
          model: "ProcedureInstance",
          populate: [
            { path: "requiredResources", model: "ResourceTemplate" },
            { path: "assignedResources", model: "ResourceInstance" },
            {
              path: "rolesAssignedPeople",
              populate: { path: "role", model: "Role" },
            },
            {
              path: "rolesAssignedPeople",
              populate: { path: "accounts", model: "Account" },
            },
            {
              path: "peopleMarkAsCompleted",
              populate: { path: "role", model: "Role" },
            },
            {
              path: "peopleMarkAsCompleted",
              populate: { path: "accounts", model: "Account" },
            },
          ],
          select: "procedureName timeStart timeEnd",
        },
      });

    const filteredInstances = processInstances
      .map((pi) => {
        let totalProcedures = 0;
        let completedProcedures = 0;
        pi.sectionInstances.forEach((section) => {
          section.procedureInstances.forEach((proc) => {
            totalProcedures++;
            const assignedCount = proc.rolesAssignedPeople.length;
            const completedCount = proc.peopleMarkAsCompleted.length;
            if (assignedCount > 0 && completedCount === assignedCount) {
              completedProcedures++;
            }
          });
        });

        return {
          processID: pi.processID,
          processName: pi.processName,
          description: pi.description,
          patientFullName: pi.patient ? pi.patient.fullName : "No patient",
          procedures: pi.sectionInstances.flatMap((section) =>
            section.procedureInstances.map((proc) => proc.procedureName)
          ),
          totalProcedures: totalProcedures,
          completedProcedures: completedProcedures,
        };
      })
      .filter((pi) => pi.totalProcedures === pi.completedProcedures); // Filter processes where all procedures are completed

    res.json(filteredInstances);
  } catch (error) {
    console.error("Error fetching process instances:", error);
    res.status(500).send("Internal server error");
  }
});

app.post("/processInstances", async (req, res) => {
  try {
    const { nanoid } = await import("nanoid");

    // Create patient
    const patient = new Patient({
      fullName: `${req.body.patientInformation.firstName} ${req.body.patientInformation.lastName}`,
      street: req.body.patientInformation.street,
      city: req.body.patientInformation.city,
      state: req.body.patientInformation.state,
      zip: req.body.patientInformation.zip,
      dob: req.body.patientInformation.dob,
      sex: req.body.patientInformation.sex,
      phone: req.body.patientInformation.phone,
      insuranceProvider: req.body.patientInformation.insuranceProvider,
      insuranceGroup: req.body.patientInformation.insuranceGroup,
      insurancePolicy: req.body.patientInformation.insurancePolicy,
      emergencyContacts: [
        {
          name: req.body.patientInformation.emergencyContact1Name,
          relation: req.body.patientInformation.emergencyContact1Relation,
          phone: req.body.patientInformation.emergencyContact1Phone,
        },
        {
          name: req.body.patientInformation.emergencyContact2Name,
          relation: req.body.patientInformation.emergencyContact2Relation,
          phone: req.body.patientInformation.emergencyContact2Phone,
        },
      ],
      knownConditions: req.body.patientInformation.knownConditions,
      allergies: req.body.patientInformation.allergies,
    });
    await patient.save();

    // Create process instance
    const processInstance = new ProcessInstance({
      processID: nanoid(7), // id of length 7, can adjust later
      processName: req.body.processTemplate.processName,
      description: req.body.processTemplate.description,
      patient: patient._id,
      sectionInstances: [],
      currentProcedure: null,
    });

    const allUserIds = new Set(); // To store unique user IDs

    // Create section and procedure instances
    for (const section of req.body.fetchedSections) {
      const sectionInstance = new SectionInstance({
        name: section.sectionName,
        description: section.description,
        procedureInstances: [],
        processID: processInstance.processID,
      });

      for (const procedure of section.procedureTemplates) {
        const procedureInstance = new ProcedureInstance({
          procedureName: procedure.procedureName,
          description: procedure.description,
          specialNotes: procedure.specialNotes,
          requiredResources: procedure.requiredResources.map(
            (resource) => resource._id
          ),
          assignedResources: procedure.requiredResources.map(
            (resource) => resource.resourceInstance
          ),
          rolesAssignedPeople: procedure.roles.map((role) => ({
            role: role._id,
            accounts: [role.account],
          })),
          peopleMarkAsCompleted: [],
          timeStart: new Date(procedure.startTime),
          timeEnd: new Date(procedure.endTime),
          processID: processInstance.processID,
          sectionID: sectionInstance._id,
        });
        await procedureInstance.save();
        sectionInstance.procedureInstances.push(procedureInstance._id);

        // Collect unique user IDs
        procedure.roles.forEach((role) => {
          allUserIds.add(role.account);
        });
        if (!processInstance.currentProcedure) {
          processInstance.currentProcedure = procedureInstance._id;
        }

        // Update account unavailable times
        await Promise.all(
          procedure.roles.map(async (role) => {
            await Account.updateOne(
              { _id: role.account },
              {
                $push: {
                  assignedProcedures: procedureInstance._id,
                  unavailableTimes: {
                    start: procedure.startTime,
                    end: procedure.endTime,
                    reason: procedureInstance._id,
                  },
                },
              }
            );
          })
        );

        // Update resource unavailable times
        await Promise.all(
          procedure.requiredResources.map(async (resource) => {
            if (resource.resourceInstance) {
              await ResourceInstance.updateOne(
                { _id: resource.resourceInstance },
                {
                  $push: {
                    unavailableTimes: {
                      start: procedure.startTime,
                      end: procedure.endTime,
                      reason: procedureInstance._id,
                    },
                  },
                }
              );
            }
          })
        );
      }

      await sectionInstance.save();
      processInstance.sectionInstances.push(sectionInstance._id);
    }

    await processInstance.save();

    console.log(allUserIds);

    // Send notifications to all unique users
    const notificationDetails = {
      type: "action",
      title: "New Assigned Process",
      text:
        "You have been added to a new process " +
        processInstance.processName +
        " and process ID " +
        processInstance.processID +
        ". Please check your assigned processes for more details.",
      timeCreated: new Date(),
      processID: processInstance.processID,
    };

    await Promise.all(
      Array.from(allUserIds).map(async (userId) => {
        const notification = new Notification({
          userId,
          ...notificationDetails,
        });
        await notification.save();

        // Update user's notification box
        await Account.updateOne(
          { _id: userId },
          {
            $push: { notificationBox: notification._id },
          }
        );
      })
    );

    const arrAUIds = Array.from(allUserIds);

    console.log("sending sockets data: ", arrAUIds);
    io.emit("new process - refresh", arrAUIds);

    io.emit("trigger join process room", arrAUIds, processInstance.processID);

    res.status(201).send(processInstance);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to create process instance",
      error: error.toString(),
    });
  }
});

app.delete("/processInstances/:id", async (req, res) => {
  const { id } = req.params;

  // console.log(`Attempting to delete process instance with ID: ${id}`);

  const allUserIds = new Set(); // To store unique user IDs

  try {
    // Find by processID instead of _id if processID is the intended identifier
    const processInstance = await ProcessInstance.findOne({
      processID: id,
    }).populate("sectionInstances");
    if (!processInstance) {
      //  console.log(`Process instance with ID: ${id} not found.`);
      return res.status(404).send({ message: "Process instance not found." });
    }

    // console.log(`Found process instance with ID: ${id}, proceeding with deletion of related sections and procedure instances.`);

    // Iterate through each section instance to handle their procedure instances
    for (const sectionInstance of processInstance.sectionInstances) {
      const fullSection = await SectionInstance.findById(
        sectionInstance._id
      ).populate("procedureInstances");
      // console.log(`Handling section instance with ID: ${sectionInstance._id}`);

      for (const procedureInstance of fullSection.procedureInstances) {
        // console.log(`Handling procedure instance with ID: ${procedureInstance._id}`);

        // Handle accounts referenced in procedure instances
        for (const roleAssignment of procedureInstance.rolesAssignedPeople) {
          // console.log(`Updating accounts for role assignments in procedure ID: ${procedureInstance._id}`);
          roleAssignment.accounts.forEach((accountId) => {
            allUserIds.add(accountId.toString());
          });
          await Account.updateMany(
            { _id: { $in: roleAssignment.accounts } },
            {
              $pull: {
                assignedProcedures: procedureInstance._id,
                unavailableTimes: { reason: procedureInstance._id.toString() },
              },
            }
          );
        }

        // Handle resource instances referenced in procedure instances
        //console.log(`Updating resource instances for procedure ID: ${procedureInstance._id}`);
        await ResourceInstance.updateMany(
          { _id: { $in: procedureInstance.assignedResources } },
          {
            $pull: {
              unavailableTimes: { reason: procedureInstance._id.toString() },
            },
          }
        );

        // Delete the procedure instance
        //  console.log(`Deleting procedure instance ID: ${procedureInstance._id}`);
        await ProcedureInstance.findByIdAndDelete(procedureInstance._id);
      }

      // Delete the section instance
      // console.log(`Deleting section instance ID: ${sectionInstance._id}`);
      await SectionInstance.findByIdAndDelete(sectionInstance._id);
    }

    // Delete the process instance
    //console.log(`Deleting process instance ID: ${id}`);
    await ProcessInstance.findOneAndDelete({ processID: id });

    console.log(allUserIds);

    // Send notifications to all unique users
    const notificationDetails = {
      type: "alert",
      title: "Process Deleted",
      text:
        "The process " +
        processInstance.processName +
        " with process ID " +
        processInstance.processID +
        " has been deleted. You are freed from any assigned procedures.",
      timeCreated: new Date(),
    };

    await Promise.all(
      Array.from(allUserIds).map(async (userId) => {
        const notification = new Notification({
          userId,
          ...notificationDetails,
        });
        await notification.save();

        // Update user's notification box
        await Account.updateOne(
          { _id: userId },
          {
            $push: { notificationBox: notification._id },
          }
        );
      })
    );

    io.to(processInstance.processID).emit("process deleted - refresh");
    io.to(processInstance.processID).emit(
      "process deleted - redirect",
      processInstance.processID
    );

    console.log(`Process instance ID: ${id} deleted successfully.`);
    res.send({ message: "Process instance deleted successfully." });
  } catch (error) {
    console.error("Error deleting process instance:", error);
    res.status(500).send({
      message: "Failed to delete the process instance",
      error: error.toString(),
    });
  }
});

app.put("/processInstances/:id", async (req, res) => {
  const { id } = req.params;
  const { processName, description, patient, sections, deletedProcedures } =
    req.body;

  try {
    const processInstance = await ProcessInstance.findById(id).populate({
      path: "sectionInstances",
      populate: { path: "procedureInstances" },
    });

    if (!processInstance) {
      return res.status(404).send({ message: "Process instance not found." });
    }

    console.log(processInstance);
    // Update process instance details
    if (processName) processInstance.processName = processName;
    if (description) processInstance.description = description;

    // Update patient details if provided
    if (patient && processInstance.patient) {
      await Patient.findByIdAndUpdate(processInstance.patient._id, patient, {
        new: true,
      });
    }

    // Update sections if provided
    if (sections && sections.length > 0) {
      const updatePromises = sections.map((sectionUpdate) =>
        SectionInstance.findByIdAndUpdate(
          sectionUpdate._id,
          {
            name: sectionUpdate.name,
            description: sectionUpdate.description,
          },
          { new: true }
        )
      );

      const updatedSections = await Promise.all(updatePromises);
      console.log("Updated sections:", updatedSections);
    }

    console.log(deletedProcedures);

    // Handle deletion of procedures if provided
    let currentProcedureUpdated = false;
    if (deletedProcedures && deletedProcedures.length > 0) {
      const allUserIds = new Set();
      await Promise.all(
        deletedProcedures.map(async (procedureId) => {
          const procedureInstance = await ProcedureInstance.findById(
            procedureId
          );
          if (!procedureInstance) return;

          procedureInstance.rolesAssignedPeople.forEach((roleAssignment) => {
            roleAssignment.accounts.forEach((accountId) => {
              allUserIds.add(accountId.toString());
            });
          });

          // Update accounts
          await Account.updateMany(
            {
              _id: {
                $in: procedureInstance.rolesAssignedPeople
                  .map((r) => r.accounts)
                  .flat(),
              },
            },
            {
              $pull: {
                assignedProcedures: procedureId,
                unavailableTimes: { reason: procedureId.toString() },
              },
            }
          );

          // Update resources
          await ResourceInstance.updateMany(
            { _id: { $in: procedureInstance.assignedResources } },
            { $pull: { unavailableTimes: { reason: procedureId.toString() } } }
          );

          await ProcedureInstance.findByIdAndDelete(procedureId);

          console.log(allUserIds);
          // Send notifications to all unique users
          const notificationDetails = {
            type: "alert",
            title: "Procedure Deleted",
            text:
              "The procedure " +
              procedureInstance.procedureName +
              " has been deleted from the process " +
              processInstance.processName +
              " with process ID " +
              processInstance.processID +
              ". You are freed from this assigned procedure.",
            timeCreated: new Date(),
          };

          await Promise.all(
            Array.from(allUserIds).map(async (userId) => {
              const notification = new Notification({
                userId,
                ...notificationDetails,
              });
              await notification.save();

              // Update user's notification box
              await Account.updateOne(
                { _id: userId },
                {
                  $push: { notificationBox: notification._id },
                }
              );
            })
          );

          io.sockets.emit("procedure deleted - refresh");
          console.log("emitted: procedure deleted - refresh ");

          // Check if the current procedure is being deleted
          if (
            processInstance.currentProcedure &&
            processInstance.currentProcedure.toString() === procedureId
          ) {
            currentProcedureUpdated = true;
          }

          // Update accounts and resources
          await Account.updateMany(
            { assignedProcedures: procedureId },
            {
              $pull: {
                assignedProcedures: procedureId,
                unavailableTimes: { reason: procedureId.toString() },
              },
            }
          );

          await ResourceInstance.updateMany(
            { assignedResources: procedureId },
            { $pull: { unavailableTimes: { reason: procedureId.toString() } } }
          );

          await ProcedureInstance.findByIdAndDelete(procedureId);
        })
      );
    }

    if (currentProcedureUpdated) {
      // Select the next available procedure as the current procedure
      const nextProcedure = processInstance.sectionInstances
        .flatMap((section) => section.procedureInstances)
        .find((proc) => {
          return (
            proc.rolesAssignedPeople.length !==
              proc.peopleMarkAsCompleted.length &&
            !deletedProcedures.includes(proc._id.toString())
          );
        });

      processInstance.currentProcedure = nextProcedure
        ? nextProcedure._id
        : null;
    }

    // Save the updated process instance
    await processInstance.save();

    io.to(processInstance.processID).emit("process modify - refresh");
    res.send(processInstance);
  } catch (error) {
    console.error("Error updating process instance:", error);
    res.status(500).send({
      message: "Failed to update the process instance",
      error: error.toString(),
    });
  }
});

app.get("/users/:userId/eligibleRoles", async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user ID format");
    }

    const account = await Account.findById(userId)
      .populate("eligibleRoles")
      .exec();

    if (!account) {
      return res.status(404).send("User not found");
    }

    res.json(account.eligibleRoles);
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
});

app.get("/roles", async (req, res) => {
  try {
    const roles = await Role.find({});
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/updateRoles/:userId", async (req, res) => {
  const { userId } = req.params;
  const { roles } = req.body; // Expect an array of role IDs

  if (!roles) {
    return res.status(400).send("Roles array is required.");
  }

  try {
    // Ensure all provided role IDs are valid MongoDB Object IDs
    if (!roles.every((roleId) => mongoose.Types.ObjectId.isValid(roleId))) {
      return res.status(400).send("Invalid role ID provided.");
    }

    // checks if the user is assigned to any ongoing procedures
    const procedures = await ProcedureInstance.find({
      rolesAssignedPeople: {
        $elemMatch: { accounts: userId },
      },
    });
    const isInOnGoingProcedure = procedures.some((procedure) => {
      return (
        procedure.peopleMarkAsCompleted.length !==
        procedure.rolesAssignedPeople.length
      );
    });

    if (isInOnGoingProcedure)
      return res
        .status(409)
        .send(
          "This user is currently assigned to one or more procedure that has not been completed!"
        );

    const updatedAccount = await Account.findByIdAndUpdate(
      userId,
      { $set: { eligibleRoles: roles } },
      { new: true, runValidators: true }
    ).populate("eligibleRoles");

    if (!updatedAccount) {
      return res.status(404).send("User not found.");
    }

    res.status(200).json(updatedAccount);
  } catch (error) {
    res.status(500).send(`Error updating user roles: ${error.message}`);
  }
});

app.get("/positions", async (req, res) => {
  try {
    // Fetch only positions from accounts where isTerminated is false
    const positions = await Account.find({ isTerminated: false }).distinct(
      "position"
    );
    res.json(positions);
  } catch (error) {
    res.status(500).send("Error fetching positions from the database.");
  }
});

app.get("/departments", async (req, res) => {
  try {
    // Fetch only departments from accounts where isTerminated is false
    const departments = await Account.find({ isTerminated: false }).distinct(
      "department"
    );
    res.json(departments);
  } catch (error) {
    res.status(500).send("Error fetching departments from the database.");
  }
});

module.exports = {
  server,
  initializePredefinedAccounts,
  removePredefinedAccounts,
};
