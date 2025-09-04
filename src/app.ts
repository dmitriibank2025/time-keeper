import {launchServer} from "./server.js";
import mongoose from "mongoose";
import {configuration} from "./config/appConfig.js";

try {
    await mongoose.connect(configuration.mongoUri);
    console.log('Connected with MongoDB');
    launchServer()
} catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
}