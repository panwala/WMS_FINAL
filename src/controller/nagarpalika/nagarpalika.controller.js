import NagarPalikas from "../../models/nagarpalika.model";
// import Tabs from "../../models/tabs.model";
// import NagarPalikaspermission from "../../models/NagarPalikas_permission.model";
import { handleResponse } from "../../helpers/utility";
const mongoose = require("mongoose");
import {
  BadRequestError,
  InternalServerError,
  // handleError,
} from "../../helpers/errors/custom-error";
import { logger, level } from "../../config/logger/logger";

export const addNagarpalika = async (req, res, next) => {
  logger.log(level.info, `✔ Controller addNagarpalika()`);
  try {
    let nagarpalikaData = await NagarPalikas.createData(req.body);
    let dataObject = { message: "Nagarpalika created succesfully" };
    return handleResponse(res, dataObject, 201);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const viewNagarpalika = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller viewNagarpalika()`);
    var nagarpalikadatacount;
    if(req.body.search)
    {
      let demo=await NagarPalikas.aggregate([{
        '$match': {
          '$or': [
            {
              'nagarpalikaname':req.body.search ? {
                '$regex': req.body.search ?  req.body.search :"",
                '$options': 'i'
              }:{
                '$nin': []
              }
            }
          ]
        }
      }])
      nagarpalikadatacount=demo.length == 0 ? 10 : demo.length;
    }
    else
    {
      nagarpalikadatacount=await NagarPalikas.fetchCount()
      nagarpalikadatacount=nagarpalikadatacount == 0 ? 10 : nagarpalikadatacount
    }
    const NagarpalikaData = await NagarPalikas.aggregate([
      {
        $match: {
          '$or': [
            {
              'nagarpalikaname':req.body.search ? {
                '$regex': req.body.search ?  req.body.search : "",
                '$options': 'i'
              }:{
                '$nin': []
              }
            }
          ]
        },
      },
      {
        '$lookup': {
          'from': 'wards', 
          'localField': '_id', 
          'foreignField': 'nagarpalikaId', 
          'as': 'wardData'
        }
      },
      {
      '$skip': req.query.skip ? parseInt(req.query.skip) : 0
      },
      {
      '$limit': req.query.limit ? parseInt(req.query.limit) : nagarpalikadatacount
      }
    ]);
    let dataObject = {
      count: nagarpalikadatacount,
      message: "NagarPalikas fetched successfully.",
      data: NagarpalikaData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const viewSingleNagarpalika = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller viewSingleNagarpalika()`);
    const NagarpalikaData = await NagarPalikas.findOneDocument({
      _id: mongoose.Types.ObjectId(req.params.nagarpalikaId),
    });
    let dataObject = {
      message: "Nagarpalika fetched successfully.",
      data: NagarpalikaData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const updateSingleNagarpalika = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller updateSingleNagarpalika()`);
    let { nagarpalikaname } = req.body;
    let updateDeviceObject = {
        nagarpalikaname
    };
    let NagarpalikaData = await NagarPalikas.updateData(
      { _id: mongoose.Types.ObjectId(req.params.roleId) },
      updateDeviceObject
    );
    let dataObject = {
      message: "Nagarpalika details updated successfully.",
      data: NagarpalikaData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
export const removeSingleNagarpalika = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller removeSingleNagarpalika()`);

    const query = { _id: req.params.nagarpalikaId };
    /*let removedData =*/ await NagarPalikas.deleteData(query);
    let dataObject = {
      message: "Nagarpalika deleted successfully.",
      // data: removedData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
