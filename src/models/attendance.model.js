const mongoose = require("mongoose");
import { Schema, model } from "mongoose";
import SchemaModel from "../config/database/mongoDBOperation";

const schema = {
  workinghours: {
    type: Number,
  },
  loggedintime:{
    type:String,
  },
  loggeouttime:{
    type:String,
  },
  loggedindatetime:{
    type:Date,
  },
  loggedoutdatetime:{
    type:Date,
  },
  nagarpalikaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NagarPalikas",
  },
  wardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wards",
  },
  sanitarymemeberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  registrationmemeberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
};

let schemaOption = {
  timestamps: true,
  versionKey: false,
};

let modelName = "attendance";
let attendanceSchema = Schema(schema, schemaOption);

let attendanceModel = model(modelName, attendanceSchema);
let attendance = new SchemaModel(attendanceModel);

export default attendance;
