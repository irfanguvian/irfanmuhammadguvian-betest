const { createClient } = require("redis")
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

class Connection {
    constructor() {
        this.connectDB();
        const connectRedis = this.connectRedis()
        this.clientRedis = connectRedis
    }

    connectDB() {
        mongoose
        .connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('Database connection successful');
        })
        .catch((error) => {
            console.error('Database connection failed:', error.message);
        });
    }

    connectRedis() {
        const client = createClient(
            {
                password: process.env.REDIS_PASSWORD,
                socket: {
                    host: process.env.REDIS_URL,
                    port: process.env.REDIS_PORT,
                }
            }
        );
        client.connect()
        .then(() => {
            console.log('Database redis connection successful');
        })
        .catch((error) => {
            console.error('Database redis connection failed:', error.message);
        });

        return client
    }

}

module.exports = Connection