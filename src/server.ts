import 'express-async-errors';
import express from 'express'
import {errorHandler} from "./errorHandler/errorHandler.js";
import morgan from "morgan";
import * as fs from "node:fs";
import dotenv from 'dotenv'
import {configuration} from "./config/appConfig.js";
import {empRouter} from "./routes/empRouter.js";
import {authorize} from "./middleware/authorization.js";
import {Roles} from "./utils/appTypes.js";
import {authentication, skipRoutes} from "./middleware/authentication.js";
import {accountServiceImplMongo} from "./services/AccountServiceImplMongo.js";

export const launchServer = () => {
    dotenv.config();
    console.log(process.env)
    const app = express()
    app.use(morgan("dev"))
    const logStream = fs.createWriteStream('access.log', {flags: 'a'})
    app.use(morgan('combined', {stream: logStream}))

//===============Middleware============
    app.use(authentication(accountServiceImplMongo));
    app.use(skipRoutes(configuration.skipRoutes))
    app.use(authorize(configuration.pathRoles as Record<string, Roles[]>))
    app.use(express.json());

    //===============Router================
    app.use('/crew', empRouter)
    app.get('/', (_, res) => res.send('API is running'));


    app.use((req, res) => {
            res.status(404).send("Page not found")
        }
    )

//=============Error===========
    app.use(errorHandler)

    app.listen(configuration.port, () => console.log(`Server runs at http://localhost:${configuration.port}`))
}
