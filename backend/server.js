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

dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;

const s3 = new S3Client({
  credentials: fromEnv(),
  region: bucketRegion,
});

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
      { name: "other", uniqueIdentifier: "other" },
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

const server = http.createServer(app);
/* const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
}); */

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
    accountType: account.accountType === "staff" ? "staff" : "admin",
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
          maxAge: 10000000,
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

app.put("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  try {
    const updatedUser = await Account.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Profile updated successfully", user: updatedUser });
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
    const procedureTemplates = await ProcedureTemplate.find();
    res.json(procedureTemplates);
  } catch (error) {
    console.error("Error fetching procedure templates:", error);
    res
      .status(500)
      .json({
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
    res
      .status(500)
      .json({
        message: "Error fetching resource templates",
        error: error.message,
      });
  }
});

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
    const newProcedureTemplate = new ProcedureTemplate({
      procedureName: req.body.procedureName,
      description: req.body.description,
      requiredResources: req.body.requiredResources,
      roles: req.body.roles,
      estimatedTime: req.body.estimatedTime,
      specialNotes: req.body.specialNotes,
    });

    const savedProcedureTemplate = await newProcedureTemplate.save();

    res.status(201).json(savedProcedureTemplate);
  } catch (error) {
    console.error("Failed to create procedure template:", error);
    res
      .status(400)
      .json({
        message: "Failed to create procedure template",
        error: error.message,
      });
  }
});

module.exports = {
  app,
  initializePredefinedAccounts,
  removePredefinedAccounts,
};
