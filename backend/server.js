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
  .then(() => console.log("MongoDB Connected."))
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
      return res.status(400).send({ message: "User not logged in" });
    }

    const currUser = await Account.findOne({ _id: accountId });
    if (!currUser) return res.status(404).send("User does not exist!");

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

    res.status(200).send(
      JSON.stringify({
        message: "Your profile image has been updated!",
        url: url,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get("/user/profilePicture/url/:id", async (req, res) => {
  try {
    if (!req.params.id) return res.status(404).send("No profile pic");
    const user = await Account.findOne({ _id: req.params.id });
    if (!user) return res.status(404).send("User not found");

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

app.post("/createAccount", async (req, res) => {
  try {
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

    // Check if an account with the given email already exists
    const accountExists = await Account.findOne({ email: email });
    if (accountExists) {
      return res
        .status(400)
        .send({ message: "An account with this email already exists." });
    }

    // Generate a random password
    const password = crypto.randomBytes(8).toString("hex");

    // Hash the password
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Error hashing password", error: err });
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
          return res
            .status(500)
            .send({ message: "Error sending email", error });
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
            eligibleRoles,
          });

          await newAccount.save();
          res.status(201).send({
            message: "Account created successfully",
            accountId: newAccount._id,
          });
        }
      });
    });
  } catch (error) {
    res.status(400).send({ message: "Error creating account", error });
  }
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
  try {
    const { email, password } = req.body;

    // Check if an account with the given email exists
    const account = await Account.findOne({ email: email });
    if (!account) {
      return res.status(400).send({ message: "Account not found" });
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
        res.status(400).send({ message: "Incorrect password" });
      }
    });
  } catch (error) {
    console.log(error);
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
        message: "OTP code verified successfully. You can now reset your password.",
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
