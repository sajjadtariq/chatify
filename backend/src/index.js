import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import friendRoutes from './routes/friend.route.js'
import requestRoutes from './routes/request.route.js'
import { connect } from './lib/db.js';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { app, server } from './lib/socket.js';

dotenv.config()
const Port = process.env.PORT

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/friends', friendRoutes)
app.use('/api/request', requestRoutes)

server.listen(Port, () => {
    console.log('server running on port: ' + Port);
    connect();
})