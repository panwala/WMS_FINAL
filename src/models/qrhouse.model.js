const mongoose = require("mongoose");
import { Schema, model } from "mongoose";
import SchemaModel from "../config/database/mongoDBOperation";

const schema = {
  // qrhouseid:String,
  housetype: {
    type: String,//0:Residential,1:Commercial
    trim: true,
  },
  propertyType:{
    type:String
  },
  houseno:String,
  houseaddress:String,
  city:String,
  zipcode:String,
  wastecollectionvalue:String,
  reason:String,
  username:String,
  mobile_no:String,
  lat:String,
  long:String,
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

};

let schemaOption = {
  timestamps: true,
  versionKey: false,
};

let modelName = "QrHouses";
let qrhousesSchema = Schema(schema, schemaOption);

let qrhousesModel = model(modelName, qrhousesSchema);
let QrHouses = new SchemaModel(qrhousesModel);

export default QrHouses;
