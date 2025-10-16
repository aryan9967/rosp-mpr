import 'dotenv/config'
import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import { AImodel } from "./controllers/geminiAi.js"
import cors from "cors"
import bodyParser from "body-parser"
import { createOrUpdateDocument, fetchAllDocuments, readDocument, searchProductsByExactName, updateDocument } from "./controllers/CRUD.js"
import multer from "multer"
import { db } from "./controllers/firestore.js";
import twilio from 'twilio'
import placesRoute from './routes/places.js'
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import axios from "axios"
import hospitalRoute from "./routes/Hospital.js";
import mongoose from "mongoose"

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Twilio client setup using environment variables
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Routes
app.use('/places', placesRoute)
app.use('/hospital', hospitalRoute)

// Twilio SMS endpoint
app.post('/send-message', (req, res) => {
    const { message = "Donation of 5kg Tomato received from Farm Fresh. Pickup time - 5pm - 7pm. " } = req.body;

    client.messages
        .create({
            body: message,
            from: '+18453779534',
            to: '+919876543210'
        })
        .then(message => {
            console.log('Message sent:', message.sid);
            res.json({ success: true, messageId: message.sid });
        })
        .catch(error => {
            console.error('Error sending message:', error);
            res.status(500).json({ success: false, error: error.message });
        });
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
