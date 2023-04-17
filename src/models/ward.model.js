const mongoose = require("mongoose");
import { Schema, model } from "mongoose";
import SchemaModel from "../config/database/mongoDBOperation";

const schema = {
  wardno: {
    type: String,
    trim: true,
  },
  nagarpalikaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NagarPalikas",
  },
};

let schemaOption = {
  timestamps: true,
  versionKey: false,
};

let modelName = "Wards";
let wardSchema = Schema(schema, schemaOption);

let wardModel = model(modelName, wardSchema);
let Wards = new SchemaModel(wardModel);

export default Wards;
