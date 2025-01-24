const mongoose = require('mongoose');

const mongoURI = 'mongodb://127.0.0.1:27017/GDGCAMUAPPSEV/USERSS';
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

async function connectToDatabase() {
    try {
        const connection = await mongoose.connect(mongoURI, options);
        console.log('MongoDB connected');
        return connection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);  }
}

connectToDatabase();

module.exports = mongoose;
