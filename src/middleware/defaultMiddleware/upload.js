const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public');
  },
  filename: (req, file, callback) => {
    const splitFileExtension = file.originalname.split('.');
    callback(
      null,
      Date.now() + '.' + splitFileExtension[splitFileExtension.length - 1]
    );
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
