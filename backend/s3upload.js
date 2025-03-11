const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,      // Set in your .env
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Set in your .env
  region: process.env.AWS_REGION,                  // e.g., 'us-east-1'
});

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET, // e.g., 'carmandi'
    acl: '', // Override default ACL to prevent sending x-amz-acl header
    key: function (req, file, cb) {
      // Create a unique key for each file
      cb(null, `uploads/${Date.now().toString()}_${file.originalname}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  },
});

module.exports = upload;
