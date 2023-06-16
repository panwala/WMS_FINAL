const mongoose = require("mongoose");
import { Schema, model } from "mongoose";
import SchemaModel from "../config/database/mongoDBOperation";

const schema = {
  vehicleNo: {
    type: String,
    trim: true,
  },
  wardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "wards",
  },
  nagarpalikaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NagarPalikas",
  },
  sanitarymemeberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  date:{
    type:Date
  }
};

let schemaOption = {
  timestamps: true,
  versionKey: false,
};

let modelName = "vehicles";
let vehiclesSchema = Schema(schema, schemaOption);

let vehiclesModel = model(modelName, vehiclesSchema);
let vehicles = new SchemaModel(vehiclesModel);

export default vehicles;
