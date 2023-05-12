const mongoose = require("mongoose");
import { Schema, model } from "mongoose";
import SchemaModel from "../config/database/mongoDBOperation";

const schema = {
  nagarpalikaname: {
    type: String,
    trim: true,
  },
};

let schemaOption = {
  timestamps: true,
  versionKey: false,
};

let modelName = "NagarPalika";
let nagarpalikaSchema = Schema(schema, schemaOption);
nagarpalikaSchema.index({ nagarpalikaname: -1 });
let nagarpalikaModel = model(modelName, nagarpalikaSchema);
let NagarPalikas = new SchemaModel(nagarpalikaModel);

export default NagarPalikas;
