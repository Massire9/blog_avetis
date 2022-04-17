import express from "express"
import knex from "knex"
import { Model } from "objection"
import dotenv from "dotenv"
import pino from "pino"
import cors from "cors"
import knexfile from "./knexfile.js"
import UserRoute from "./src/routes/UserRoute.js" //user route
import PostRoute from "./src/routes/PostRoute.js"
import SessionRoute from "./src/routes/SessionRoute.js"
import CommentRoute from "./src/routes/CommentRoute.js"
const app = express()
const db = knex(knexfile)

dotenv.config()

const logger = pino({
    transport: {
        target: "pino-pretty", options: {
            colorize: true,
        }
    }
})

Model.knex(db)
app.use(express.json())
app.use(cors())
SessionRoute({app})
UserRoute({app})
PostRoute({app})
CommentRoute({app})
app.listen(process.env.port, () =>
  logger.info(`listening on port ${process.env.port}`)
)
