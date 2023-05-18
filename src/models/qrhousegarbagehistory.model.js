const mongoose = require("mongoose");
import { Schema, model } from "mongoose";
import SchemaModel from "../config/database/mongoDBOperation";

const schema = {
  // qrhouseid:String,

  is_wastecollected:{
    type:String,  
    default:"0"     //0:Not Collected 1:Collected
  },
  reason:String,
  nagarpalikaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NagarPalikas",
  },
  wardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wards",
  },
  registrationmemberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  sanitrationmemberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QrHouses",
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

let modelName = "QrHousesgarbagehistory";
let qrhousesgarbagehistorySchema = Schema(schema, schemaOption);

let qrhousesgarbagehistoryModel = model(modelName, qrhousesgarbagehistorySchema);
let QrHousesgarbagehistory = new SchemaModel(qrhousesgarbagehistoryModel);

export default QrHousesgarbagehistory;
