const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const dbConnect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log(`Database successfully connected to ${dbConnect.connection.name}`)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

module.exports = connectDb;