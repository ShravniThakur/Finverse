const mongoose = require('mongoose')

const database = process.env.MONGODB_URL

const connectDatabase = async () => {
    try {
        await mongoose.connect(database)
        console.log('Connection Successful')
    }
    catch (err) {
        console.log('Connection Unsuccessful')
    }
}

module.exports = connectDatabase