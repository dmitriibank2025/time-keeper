import 'express-async-errors';
import express from 'express'
import morgan from "morgan";
import * as fs from "node:fs";
import {errorHandler} from "./errorHandler/errorHandler.js";
import dotenv from 'dotenv'
import {configuration} from "./config/appConfig.js";
import {empRouter} from "./routes/empRouter.js";
import {workTimeRouter} from "./routes/workTimeRouter.js";
import {authorize} from "./middleware/authorization.js";
import {Roles} from "./utils/appTypes.js";
import {authentication} from "./middleware/authentication.js";
import {accountServiceImplMongo} from "./services/AccountServiceImplMongo.js";
import swaggerUi from "swagger-ui-express"
import swaggerDoc from "../docs/openapi.json" with {type: "json"};

export const launchServer = () => {
    dotenv.config();
    console.log(process.env)
    const app = express()
    app.use(morgan("dev"))
    const logStream = fs.createWriteStream('access.log', {flags: 'a'})
    app.use(morgan('combined', {stream: logStream}))
   //===============Middleware============
    app.use(authentication(accountServiceImplMongo));
    // app.use(skipRoutes(configuration.skipRoutes))
    app.use(authorize(configuration.pathRoles as Record<string, Roles[]>))
    app.use(express.json());
    // app.use(checkAccountById(configuration.checkIdRoutes))

    //==============Swagger Docs==========
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

    //===============Router================
    app.use('/crew', empRouter)
    app.use('/work', workTimeRouter)
    app.get('/', (_, res) => res.send('API is running'));


    app.use((req, res) => {
            res.status(404).send("Page not found")
        }
    )

//=============Error===========
    const errorStream = fs.createWriteStream('error.log', {flags: 'a'})
    app.use(morgan('combined', {stream: errorStream}))

    app.use(errorHandler)

    app.listen(configuration.port, () => console.log(`Server runs at http://localhost:${configuration.port}`))
}
