const Account = require("../models/account.js");
const ProcessInstance = require("../models/processInstance.js");
const Message = require("../models/message.js");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const bucketName = process.env.BUCKET_NAME;
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = new S3Client({ region: process.env.BUCKET_REGION });

const getUserProfileImgUrl = async (uid) => {
  const user = await Account.findOne({ _id: uid });
  if (!user) throw new Error(`user with ${uid} was not found`);

  if (user.profileUrl === "") return "";

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: user.profileUrl,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

  return url;
};

const getChatMessagesByProcess = async (req, res) => {
  if (!req.params.pid) return res.status(400).send("no process id provided!");

  if (!req.cookies.accountId)
    return res
      .status(401)
      .send("You need to be logged in to view these messages!");

  const authorizedUser = await Account({ _id: req.cookies.accountId });
  if (!authorizedUser)
    return res.status(400).send("Malformed credentials! Please login again!");

  const process = await ProcessInstance.findOne({ processID: req.params.pid });
  if (!process)
    return res.status(400).send("requested process does not exist!");

  // populates messageHistory field with actual messages
  await process.populate("messageHistory");

  // parse messages into returning form
  const retMessages = await Promise.all(
    process.messageHistory.map(async (message) => {
      const messageSender = await Account.findOne({ _id: message.userId });
      const userImage = await getUserProfileImgUrl(message.userId);
      return {
        userId: message.userId,
        userName: `${messageSender.firstName} ${messageSender.lastName}`,
        userImage,
        text: message.text,
        timeCreated: message.timeCreated,
      };
    })
  );

  return res.status(200).send(retMessages);
};

module.exports = { getChatMessagesByProcess };
