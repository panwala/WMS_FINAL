const mongoose = require("mongoose");
import { Schema, model } from "mongoose";
import SchemaModel from "../config/database/mongoDBOperation";

const schema = {
  complainImages: {
    type: [String],
    trim: true,
  },
  complainDescription:{
    type:String
  },
  complainstatus:{
    type:String,  
    default:"0"     //0:pending, 1:completed,2 :not completed
  },
  notcompletedreason:String,
  nagarpalikaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NagarPalikas",
  },
  wardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wards",
  },
  complainuserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  assingnedsanitarymemeberId: {
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

let modelName = "Complain";
let ComplainSchema = Schema(schema, schemaOption);

let ComplainModel = model(modelName, ComplainSchema);
let Complain = new SchemaModel(ComplainModel);

export default Complain;
