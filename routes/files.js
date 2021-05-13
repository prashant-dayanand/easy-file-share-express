const router = require("express").Router();
const multer = require("multer"); //Used for multipart Data form esp. for Uploading files
const File = require("../models/file");
const { v4: uuid4 } = require("uuid"); //Geting Unique ID
const path = require("path");

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage,
  limit: {
    fileSize: 1000000 * 100,
  },
}).single("myfile");

router.post("/api/files", (req, res) => {
  //Store files
  upload(req, res, async (err) => {
    //validate request
    if (!req.file) {
      return res.json({ error: "All field are required" });
    }

    if (err) {
      return res.json({ error: err.message });
    }

    let file = new File({
      filename: req.file.filename,
      size: req.file.size,
      path: req.file.path,
      uuid: uuid4(),
    });

    const response = await file.save();
    return res.json({ file: `${process.env.APP_URL}/files/${response.uuid}` });
  });

  //response ====> LINKS
});

router.post("/api/files/send", async (req, res) => {
  const { uuid, emailto, emailfrom, expireIn } = req.body;

  if (!uuid || !emailto || !emailfrom) {
    return res
      .status(422)
      .send({ error: "All fields are required except expiry." });
  }

  try {
    const file = await File.findOne({ uuid: uuid });
    if (file.sender) {
      return res.status(422).send({ error: "Email already sent once." });
    }
    file.sender = emailfrom;
    file.receiver = emailto;
    const response = await file.save();
    // send mail
    const sendMail = require("../services/emailService");
    sendMail({
      from: emailfrom,
      to: emailto,
      subject: "EasyShare file sharing",
      text: `${emailfrom} shared a file with you.`,
      html: require("../services/emailTemplate")({
        emailfrom,
        download: `${process.env.APP_URL}/files/${file.uuid}?source=email`,
        size: parseInt(file.size / 1000) + " KB",
        expires: "24 hours",
      }),
    })
      .then(() => {
        return res.json({ success: true });
      })
      .catch((err) => {
        return res.status(500).json({ error: "Error in email sending." });
      });
  } catch (err) {
    return res.status(500).send({ error: "Something went wrong." });
  }
});

module.exports = router;
