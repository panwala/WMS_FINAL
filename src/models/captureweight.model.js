const mongoose = require("mongoose");
import { Schema, model } from "mongoose";
import SchemaModel from "../config/database/mongoDBOperation";

const schema = {
  weightImages: {
    type: [String],
    trim: true,
  },
  weight:{
    type:String,  
    default:"0"   
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
  cosanitarymemeberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  date:
  {
    type:Date
  }
};

let schemaOption = {
  timestamps: true,
  versionKey: false,
};

let modelName = "captureWeight";
let captureWeightSchema = Schema(schema, schemaOption);

let captureWeightModel = model(modelName, captureWeightSchema);
let captureWeight = new SchemaModel(captureWeightModel);

export default captureWeight;
