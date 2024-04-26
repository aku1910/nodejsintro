import express from "express";
import mongoose from "mongoose";

import User from "./User.js"; 

import { MONGODBURL } from "./config.js";

const app = express();
export const PORT = 8000;

app.use(express.json());

app.get("/users", async (req, res) => {
    try {
        const users = await User.find(); 
        res.status(200).json(users);
    } catch (error) {
        console.error("error", error);
        res.status(500).send("internal error");
    }
});

app.post("/users", async (req, res) => {
    try {
        const newUser = new User({ 
            username: req.body.username,
            lastname: req.body.lastname,
            age: req.body.age,
            email: req.body.email,
            password: req.body.password
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error("error", error);
        res.status(500).send("internal error");
    }
});

app.put("/users/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("error", error);
        res.status(500).send("internal error");
    }
});

app.delete("/users/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).send("not found");
        }
        res.status(200).json(deletedUser);
    } catch (error) {
        console.error("delete error", error);
        res.status(500).send("internal error");
    }
});

mongoose.connect(MONGODBURL)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });
