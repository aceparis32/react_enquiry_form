const transporter = require('./config');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const express = require('express'); // Add express library
const app = express(); // Create express App to handle API Requests

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.json()); // Set JSON parser to handle form data
app.use(express.static(buildPath)); // Telling express to serve all the files from the build folder.

// Create POST request handler for /send endpoint
// app.post('/send', (req, res) => {
//     console.log(req.body);
//     res.send(req.body);
// });
app.post('/send', (req, res) => {
    try {
        const mailOptions = {
            from: req.body.email, // sender email
            to: process.env.email, // list of receivers
            subject: req.body.subject, // subject line
            html: `
            <p>You have a new contact request.</p>
            <h3>Contact Details</h3>
            <ul>
                <li>Name: ${req.body.name}</li>
                <li>Email: ${req.body.email}</li>
                <li>Subject: ${req.body.subject}</li>
                <li>Message: ${req.body.message}</li>
            </ul>
            `
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if(err){
                res.status(500).send({
                    success: false,
                    message: 'Something went wrong. Try again later.'
                });
            }else{
                res.send({
                    success: true,
                    message: 'Thanks for contacting us. We will get back to you shortly'
                });
            }
        });
    }catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong. Try again later'
        });
    }
});

// Start express server to listen on port 3030
app.listen(3030, () => {
    console.log('Server start on port 3030');
});