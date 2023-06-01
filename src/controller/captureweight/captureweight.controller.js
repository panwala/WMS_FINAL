import NagarPalikas from "../../models/nagarpalika.model";
import Complain from "../../models/complain.model";
import captureWeight from "../../models/captureweight.model";
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

export const addCaptureweight = async (req, res, next) => {
  logger.log(level.info, `✔ Controller addCaptureweight()`);
  try {
    req.body.date= new Date().toLocaleString("en-US", {
        timeZone: "Asia/calcutta",
      });
    let weightData = await captureWeight.createData(req.body);
    let dataObject = { message: "weight captured succesfully" };
    return handleResponse(res, dataObject, 201);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const viewAllcaptureweight = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller viewAllcaptureweight()`);
    var complaindatacount;
    var answer1=req.body.nagarpalikaId ?  mongoose.Types.ObjectId(req.body.nagarpalikaId) :{
        '$nin': [],
      }
      var answer2=req.body.wardId ? mongoose.Types.ObjectId(req.body.wardId) :{
        '$nin': [],
      }
      var answer3=req.body.sanitarymemeberId ?  mongoose.Types.ObjectId(req.body.sanitarymemeberId) :{
        '$nin': [],
      }
      var answer4=req.body.cosanitarymemeberId ?  mongoose.Types.ObjectId(req.body.cosanitarymemeberId) :{
        '$nin': [],
      }
    
     var complaindata=await captureWeight.aggregate([
        {
          $match: {
                  'nagarpalikaId': answer1,
                  'wardId':answer2,
                  'sanitarymemeberId':answer3,
                  'cosanitarymemeberId':answer4
          },
        },
        {
          '$lookup': {
            'from': 'nagarpalikas', 
            'localField': 'nagarpalikaId', 
            'foreignField': '_id', 
            'as': 'nagarpalikadata'
          }
        }, {
          '$lookup': {
            'from': 'wards', 
            'localField': 'wardId', 
            'foreignField': '_id', 
            'as': 'warddata'
          }
        }, {
          '$lookup': {
            'from': 'users', 
            'localField': 'sanitarymemeberId', 
            'foreignField': '_id', 
            'as': 'sanitaryuserdata'
          }
        }, {
          '$lookup': {
            'from': 'users', 
            'localField': 'cosanitarymemeberId', 
            'foreignField': '_id', 
            'as': 'cosanitaryuserdata'
          }
        }, {
          '$unwind': {
            'path': '$nagarpalikadata', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$unwind': {
            'path': '$warddata', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$unwind': {
            'path': '$sanitaryuserdata', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$unwind': {
            'path': '$cosanitaryuserdata', 
            'preserveNullAndEmptyArrays': true
          }
        },
        {
          '$match': {
            '$or': [
               {
                'warddata.wardno': req.body.search ? {
                  '$regex': req.body.search ?  req.body.search :"",
                  '$options': 'i'
                }:{
                  '$nin': []
                }
              }, {
                'nagarpalikadata.nagarpalikaname': req.body.search ? {
                  '$regex': req.body.search ?  req.body.search :"",
                  '$options': 'i'
                }:{
                  '$nin': []
                }
              }
            ]
          }
        },
      ])
      console.log("complaindata.length",complaindata.length)
        complaindatacount=complaindata.length;
     complaindatacount=complaindatacount == 0 ? 10 : complaindatacount
    const complainData = await captureWeight.aggregate([
        {
            $match: {
                    'nagarpalikaId': answer1,
                    'wardId':answer2,
                    'sanitarymemeberId':answer3,
                    'cosanitarymemeberId':answer4
            },
          },
          {
            '$lookup': {
              'from': 'nagarpalikas', 
              'localField': 'nagarpalikaId', 
              'foreignField': '_id', 
              'as': 'nagarpalikadata'
            }
          }, {
            '$lookup': {
              'from': 'wards', 
              'localField': 'wardId', 
              'foreignField': '_id', 
              'as': 'warddata'
            }
          }, {
            '$lookup': {
              'from': 'users', 
              'localField': 'sanitarymemeberId', 
              'foreignField': '_id', 
              'as': 'sanitaryuserdata'
            }
          }, {
            '$lookup': {
              'from': 'users', 
              'localField': 'cosanitarymemeberId', 
              'foreignField': '_id', 
              'as': 'cosanitaryuserdata'
            }
          }, {
            '$unwind': {
              'path': '$nagarpalikadata', 
              'preserveNullAndEmptyArrays': true
            }
          }, {
            '$unwind': {
              'path': '$warddata', 
              'preserveNullAndEmptyArrays': true
            }
          }, {
            '$unwind': {
              'path': '$sanitaryuserdata', 
              'preserveNullAndEmptyArrays': true
            }
          }, {
            '$unwind': {
              'path': '$cosanitaryuserdata', 
              'preserveNullAndEmptyArrays': true
            }
          },
          {
            '$match': {
              '$or': [
                 {
                  'warddata.wardno': req.body.search ? {
                    '$regex': req.body.search ?  req.body.search :"",
                    '$options': 'i'
                  }:{
                    '$nin': []
                  }
                }, {
                  'nagarpalikadata.nagarpalikaname': req.body.search ? {
                    '$regex': req.body.search ?  req.body.search :"",
                    '$options': 'i'
                  }:{
                    '$nin': []
                  }
                }
              ]
            }
          },
            {
            '$skip': req.query.skip ? parseInt(req.query.skip) : 0
            },
            {
            '$limit': req.query.limit ? parseInt(req.query.limit) : complaindatacount
      }
    ]);
    let dataObject = {
      count: complaindata.length,
      message: "weight details fetched successfully.",
      data: complainData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const viewSingleCaptureweight = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller viewSingleCaptureweight()`);
    const NagarpalikaData = await captureWeight.findOneDocument({
      _id: mongoose.Types.ObjectId(req.params.weightId),
    });
    let dataObject = {
      message: "weight details fetched successfully.",
      data: NagarpalikaData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const updateSingleCaptureweight = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller updateSingleCaptureweight()`);
    let { weightImages,
        weight,
        nagarpalikaId,
        wardId,
        sanitarymemeberId,
        cosanitarymemeberId
            } = req.body;
    let updateDeviceObject = {
        weightImages,
        weight,
        nagarpalikaId,
        wardId,
        sanitarymemeberId,
        cosanitarymemeberId
    };
    let complainData = await  captureWeight.updateData(
      { _id: mongoose.Types.ObjectId(req.params.weightId) },
      updateDeviceObject
    );
    let dataObject = {
      message: "weight details updated successfully.",
      data: complainData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
export const removeSingleCaptureweight = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller removeSingleCaptureweight()`);

    const query = { _id: req.params.weightId };
    /*let removedData =*/ await captureWeight.deleteData(query);
    let dataObject = {
      message: "weight details deleted successfully.",
      // data: removedData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
