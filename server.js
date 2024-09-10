const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const port = 5000;

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/run-automatic-mode', (req, res) => {
    const { width, rows, columns, gaps } = req.body;
    const command = `python3 raspberry/main.py ${width} ${rows} ${columns} ${gaps}`;
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Server error');
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.status(500).send('Server error');
        }
        console.log(`Stdout: ${stdout}`);
        res.send('Automatic mode executed');
    });
});

app.listen(port, () => {
    console.log(`Server running on http://127.0.0.1:${port}`);
});