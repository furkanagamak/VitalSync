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

dotenv.config();
const Account = require("./models/account.js");

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
  const currUser = await Account.findOne({ email: "john.doe@example.com" });
  if (!currUser) return res.status(404).send("User does not exist!");

  // puts image into s3
  const profileUrlName = currUser.email + "." + req.file.mimetype.split("/")[1];
  const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: profileUrlName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  });
  await s3.send(putCommand);
  currUser.profileUlr = profileUrlName;
  currUser.save();

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
});

app.get("/user/profilePicture/url/:id", async (req, res) => {
  const user = await Account.findOne({ _id: req.params.id });
  if (!user) return res.status(404).send("User not found");

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: user.profileUrl,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

  res.status(200).send(url);
});

const server = http.createServer(app);
/* const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
}); */

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
