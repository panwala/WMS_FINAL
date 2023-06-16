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
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"vehicles"
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

let modelName = "vehicleshistory";
let vehicleshistorySchema = Schema(schema, schemaOption);

let vehicleshistoryModel = model(modelName, vehicleshistorySchema);
let vehicleshistory = new SchemaModel(vehicleshistoryModel);

export default vehicleshistory;
