import { launchServer } from "./server.js";
import mongoose from "mongoose";
import { configuration } from "./config/appConfig.js";
mongoose.connect(configuration.mongoUri)
    .then(() => {
    console.log('Connected with MongoDB');
    launchServer();
})
    .catch(() => {
    console.error('MongoDB connection error');
});
