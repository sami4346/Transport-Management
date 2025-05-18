const express = require('express'); // Import the Express framework for building web applications
const mongoose = require('mongoose'); // Import Mongoose for MongoDB object modeling
const bodyParser = require('body-parser'); // Import body-parser to parse incoming request bodies
const path = require('path'); // Import path module for handling file and directory paths
const cors = require('cors'); // Import CORS middleware to enable Cross-Origin Resource Sharing
const app = express(); // Create an instance of an Express application
app.use(bodyParser.json()); // Middleware to parse JSON request bodies
app.use(cors()); // Enable CORS for all routes
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/iiucTransport', { // Connect to MongoDB database
    useNewUrlParser: true, // Use the new URL parser
    useUnifiedTopology: true, // Use the new topology engine
});
const db = mongoose.connection; // Get the connection object
db.on('error', console.error.bind(console, 'Connection error:')); // Log connection errors
db.once('open', () => console.log('Connected to MongoDB')); // Log successful connection

// Mongoose Schema
const busSchema = new mongoose.Schema({ // Define a Mongoose schema for the Bus model
    busNumber: String, // Field for bus number
    busRoute: String, // Field for bus route
    arrivalTime: String, // Field for arrival time
    departureTime: String, // Field for departure time
    driverPhone: String, // Field for driver's phone number
});
const Bus = mongoose.model('Bus', busSchema); // Create a Mongoose model for the Bus schema

// API Routes
app.get('/api/buses', async (req, res) => { // Define a GET route for fetching buses
    console.log('GET /api/buses'); // Log incoming request
    try {
        const buses = await Bus.find(); // Fetch all buses from the database
        res.json(buses); // Send the buses as a JSON response
    } catch (error) {
        console.error('Error fetching buses:', error); // Log error
        res.status(500).send('Error fetching buses'); // Send error response
    }
});
app.post('/api/buses', async (req, res) => { // Define a POST route for adding a new bus
    console.log('POST /api/buses', req.body); // Log incoming request with body
    const { busNumber, busRoute, arrivalTime, departureTime, driverPhone } = req.body; // Destructure request body
    try {
        const newBus = new Bus({ busNumber, busRoute, arrivalTime, departureTime, driverPhone }); // Create a new Bus instance
        await newBus.save(); // Save the new bus to the database
        res.status(201).send('Bus added successfully'); // Send success response
    } catch (error) {
        console.error('Error adding bus:', error); // Log error
        res.status(500).send('Error adding bus'); // Send error response
    }
});
// Start the Server
app.listen(3000, () => console.log('Server running at http://localhost:3000')); // Start the server and listen on port 3000
