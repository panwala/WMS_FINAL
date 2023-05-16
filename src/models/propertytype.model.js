const mongoose = require("mongoose");
import { Schema, model } from "mongoose";
import SchemaModel from "../config/database/mongoDBOperation";

const schema = {
  typeName: {
    type: String,
    trim: true,
  },
};

let schemaOption = {
  timestamps: true,
  versionKey: false,
};

let modelName = "propertyType";
let propertyTypeSchema = Schema(schema, schemaOption);

let propertyTypeModel = model(modelName, propertyTypeSchema);
let propertyType = new SchemaModel(propertyTypeModel);

export default propertyType;
