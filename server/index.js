require('dotenv').config();
const express = require('express');
//const mongoose = require('mongoose');

const authRouter = require('./authRouter');
const PORT = process.env.PORT || 5000;
const cors = require('cors');
//const URL =
//('mongodb+srv://admin:1@cluster0.kivb8.mongodb.net/auth_roles?retryWrites=true&w=majority');

const app = express();

app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000',
        //origin: process.env.CLIENT_URL,
    })
);
app.use('/auth', authRouter);

const start = async () => {
    try {
        //await mongoose.connect(URL);
        app.listen(PORT, () => {
            console.log(`Server started on PORT ${PORT}`);
        });
    } catch (error) {
        console.log();
    }
};

start();
