const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const Student = require("./models/Student");
const app = express();
app.use(cors());
app.use(express.json());

mongoose
 .connect(process.env.MONGO_URI)
 .then(() => {
   console.log("Connected to MongoDB");
 })
 .catch((error) => {
   console.log("MongoDB connection error:", error);
 });
app.get("/", (req, res) => {
 res.send("Server is running!");
});

app.get("/students", async (req, res) => {
 try {
   const students = await Student.find();
   res.json(students);
 } catch (error) {
   res.status(500).json({ error: error.message });
 }
});

app.post("/students", async (req, res) => {
 try {
   const { name, course, age } = req.body;
   const newStudent = new Student({ name, course, age });
   await newStudent.save();
   res.status(201).json(newStudent);
 } catch (error) {
   res.status(400).json({ error: error.message });
 }
});

app.put("/students/:id", async (req, res) => {
 try {
   const updatedStudent = await Student.findByIdAndUpdate(
req.params.id,
     req.body,
     { new: true }
   );
   res.json(updatedStudent);
 } catch (error) {
   res.status(400).json({ error: error.message });
 }
});

app.delete("/students/:id", async (req, res) => {
 try {
   await Student.findByIdAndDelete(req.params.id);
   res.json({ message: "Student deleted successfully" });
 } catch (error) {
   res.status(400).json({ error: error.message });
 }
});
app.listen(5000, () => {
 console.log("Server running on port 5000");
});
module.exports = app;