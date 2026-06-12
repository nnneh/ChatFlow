import express from 'express'
import connect from './db/connect.js'
import dotenv from 'dotenv'
import cors from 'cors'
import userRouter from './routes/userRoute.js'

const app = express();
dotenv.config()
const port = process.env.PORT

connect()
app.use(cors())
app.use(express.json()) 


app.use(userRouter)


app.listen(port, () => {
  console.log(`ChatFlow app listening on port ${port}`)
})