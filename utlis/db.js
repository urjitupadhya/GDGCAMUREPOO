const mongoose = require('mongoose');


// MongoDB Atlas connection URI
const mongoURI = "mongodb+srv://gm4175urjitupadhyay:<URJIT2024u>@gdgcamuapp.gcluk.mongodb.net/GDGCAMUAPP?retryWrites=true&w=majority";

// Mongoose connection options

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// Function to connect to MongoDB Atlas
async function connectToDatabase() {
    try {
        const connection = await mongoose.connect(mongoURI, options);
        console.log('MongoDB Atlas connected successfully!');
        return connection;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit the process if connection fails
    }
}

// Connect to the database
connectToDatabase();

// Export the mongoose instance for use in other parts of the application
module.exports = mongoose;
