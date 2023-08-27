const express = require('express');
const multer = require('multer');
const app = express();
const port = 3001;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory where uploaded files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original filename
    },
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    // File has been uploaded and saved on the server
    res.status(200).json({ message: 'File uploaded successfully!' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});