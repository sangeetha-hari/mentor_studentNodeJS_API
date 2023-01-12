// const express= require("express");
// const {MongoClient}= require("mongodb");

import express from "express";
import { MongoClient } from "mongodb";
// import {MONGO_URL} from 
import * as dotenv from 'dotenv';

dotenv.config();
console.log(process.env);
const PORT = 9000;
const app = express();
const MONGO_URL="mongodb://127.0.0.1";



async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  console.log("Mongo is connected");
  await client.connect();
  return client;
}

const client = await createConnection();

//REST end points
app.get("/", async (req, res) => {
  console.log("Welcome to mentor- mentee");
  const students = await client
    .db("mentor_student")
    .collection("mentor")
    .find({})
    .toArray();
  res.send(students);
});
//search student by id
app.get("/student/:stu_id", async (req, res) => {
  const { stu_id } = req.params;
  console.log(req.params);
  const student = await client
    .db("mentor_student")
    .collection("student")
    .findOne({ studentID: stu_id });
  student // If the array is empty
    ? res.send(student)
    : res.status(404).send({ message: "NO Student FOUND with this ID" });
});

//search student with query parameters
app.get("/student", async (req, res) => {
  console.log(req.query);
  const student = await client
    .db("mentor_student")
    .collection("student")
    .find(req.query)
    .toArray();
  res.send(student);
});

// Write API to show all students for a particular mentor
app.get("/mentor", async (req, res) => {
  console.log(req.query);
  const student = await client
    .db("mentor_student")
    .collection("mentor")
    .find(req.query)
    .toArray();
  res.send(student);
});
// Write API to create Mentor
app.post("/mentor", express.json(), async (req, res) => {
  const newMentor = req.body;
  console.log(newMentor);
  //db.student.insertMany(newStudent)
  const result = await client
    .db("mentor_student")
    .collection("mentor")
    .insertMany(newMentor);
  res.send(result);
});

// Write API to create Student
app.post("/student", express.json(), async (req, res) => {
    const newStudent = req.body;
    console.log(newStudent);
    //db.student.insertMany(newStudent)
    const result = await client
      .db("mentor_student")
      .collection("student")
      .insertMany(newStudent);
    res.send(result);
});
// Write API to Assign a student to Mentor
app.put("/student", express.json(),(req,res)=>{


})


// Write API to Assign or Change Mentor for particular Student

//Start the server
app.listen(PORT, () => console.log("server started on port:", PORT));


//Function to check unique student
async function studentisUnique(newStudent) {
  console.log(newStudent[0].studentID);
  const exist = await client
    .db("mentor_student")
    .collection("student")
    .findOne({ studentID: newStudent[0].studentID });
  if (exist) {
    return true;
  }
  return false;
}
