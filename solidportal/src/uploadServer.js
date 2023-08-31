const express = require('express');
const multer = require('multer');
const app = express();
const port = 3001;
const cors = require('cors');
const fs = require('fs');

app.use(cors());

const uploadDir = '../../localstorage/user_uploads';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir); // Specify the directory where uploaded files will be saved
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

app.use(express.json());
// Define a route to list files in a folder
app.get('/listfiles', (req, res) => {
    const folderPath = '../../localstorage/customizedskilldefinition'; // Change this to your folder path

    // Read the list of files in the folder
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error listing files:', err);
            return res.status(500).json({ error: 'Error listing files' });
        }

        res.json({ files });
    });
});


// Define a route to read file content
app.get('/readfile/:filename', (req, res) => {
    const filename = '../../localstorage/customizedskilldefinition/' + req.params.filename;

    // Read the file content
    fs.readFile(filename, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Error reading file' });
        }

        res.json({ content: data });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});