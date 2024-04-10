const cookie = require("cookie");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const Account = require("./models/account.js");

dotenv.config();

const { Socket } = require("dgram");

const fs = require("fs").promises;

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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the cookie is already set
    if (req.cookies.accountId) {
      // Send the Account document to the frontend
      const account = await Account.findById(req.cookies.accountId);
      return res.status(200).send({ message: "Already logged in", account });
    }

    // Check if an account with the given email exists
    const account = await Account.findOne({ email: email });
    if (!account) {
      return res.status(400).send({ message: "Account not found" });
    }

    // Compare the password
    bcrypt.compare(password, account.password, (err, result) => {
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
        res.status(200).send({ message: "Login successful", account });
      } else {
        res.status(400).send({ message: "Incorrect password" });
      }
    });
  } catch (error) {
    res.status(400).send({ message: "Error logging in", error });
  }
});

app.post("/logout", (req, res) => {
  // Clear the accountId cookie
  res.clearCookie("accountId", { sameSite: "none", secure: true });

  res.status(200).send({ message: "Logout successful" });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
