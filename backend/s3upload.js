const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require("@aws-sdk/client-s3");

// Configure AWS SDK
const s3 = new S3Client({
  region: process.env.AWS_REGION, // e.g., 'us-east-1'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET, // e.g., 'carmandi'
    acl: "public-read", // Allow public access to files
    contentType: multerS3.AUTO_CONTENT_TYPE, // Ensures correct MIME type
    key: function (req, file, cb) {
      let fileExtension = file.mimetype.split("/")[1] || "jpg"; // Default to JPG
      cb(null, `uploads/${Date.now()}_${file.originalname}.${fileExtension}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter(req, file, cb) {
    //console.log("Received file:", file);
    //console.log("MIME type:", file.mimetype);

    if (!file.mimetype.match(/^image\/(jpeg|jpg|png)$/)) {
      return cb(new Error("Only image files (JPG, PNG) are allowed!"));
    }
    cb(null, true);
  },
});

module.exports = upload;
