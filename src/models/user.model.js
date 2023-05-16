import { Schema, model } from "mongoose";
const mongoose = require("mongoose");
import SchemaModel from "../config/database/mongoDBOperation";
const schema = {
  name: String,
  email:String,
  adharno:String,
  drivinglicenseno:String,
  username:String,
  password: {
    type: String,
  },
  mobile_no: String,
  gender: String,
  DOB: Date,
  nagarpalikaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NagarPalikas",
  },
  wardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wards",
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Roles",
  },
  is_registered:{
    type:Boolean,
    default:false
  },
  designation:String
};

let schemaOption = {
  timestamps: true,
  versionKey: false,
};

let modelName = "User";
let userSchema = Schema(schema, schemaOption);

let userModel = model(modelName, userSchema);
let Users = new SchemaModel(userModel);

export default Users;
