require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express()

//using middleware--
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
    session({
        secret: "my secret key",
        saveUninitialized: true,
        resave: false,
    })
);

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});
//middleware
app.use(express.static('uploads'))

//set temple engin
app.set("view engine", "ejs");

const router = require("./routes/routes");
app.use("/", router);

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

async function connectToDatabase() {
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to MongoDB!");
        app.listen(PORT, () => {
            console.log(`Server Connected at Port:${PORT}`);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectToDatabase();
