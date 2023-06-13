const mongoose = require("mongoose");
import { Schema, model } from "mongoose";
import SchemaModel from "../config/database/mongoDBOperation";

const schema = {
  IMEINO: {
    type: Number,
  },
  SIMNO:{
    type:String,
  },
  simCompany:{
    type:String,
  },
  deviceModel:{
    type:String,
  },
  vehicleNumber:{
    type:String,
  },
  nagarpalikaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NagarPalikas",
  },
  wardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wards",
  },
  date:
  {
    type:Date
  }
//   sanitarymemeberId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Users",
//   },
};

let schemaOption = {
  timestamps: true,
  versionKey: false,
};

let modelName = "device";
let deviceSchema = Schema(schema, schemaOption);

let deviceModel = model(modelName, deviceSchema);
let devices = new SchemaModel(deviceModel);

export default devices;
