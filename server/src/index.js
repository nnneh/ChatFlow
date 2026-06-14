import express from 'express'
import connect from './db/connect.js'
import dotenv from 'dotenv'
import cors from 'cors'
import userRouter from './routes/userRoute.js'
import chatRouter from './routes/IndividualChatRoute.js'
import friendRequestRouter from './routes/addFriendRoute.js'
import groupRouter from './routes/groupRoutes.js'

const app = express();
dotenv.config()
const port = process.env.PORT

connect()
app.use(cors())
app.use(express.json()) 


app.use(userRouter)
app.use(chatRouter)
app.use(friendRequestRouter)
app.use(groupRouter)


app.listen(port, () => {
  console.log(`ChatFlow app listening on port ${port}`)
})