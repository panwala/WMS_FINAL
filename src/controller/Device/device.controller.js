import NagarPalikas from "../../models/nagarpalika.model";
import Complain from "../../models/complain.model";
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
import devices from "../../models/device.model";

export const addDevice = async (req, res, next) => {
  logger.log(level.info, `✔ Controller addDevice()`);
  try {
    req.body.date= new Date().toLocaleString("en-US", {
        timeZone: "Asia/calcutta",
      });
    let complainData = await devices.createData(req.body);
    let dataObject = { message: "Device added succesfully" };
    return handleResponse(res, dataObject, 201);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const viewAllDevices = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller viewAllDevices()`);
    var devicesdatacount;
    var answer1=req.body.nagarpalikaId ?  mongoose.Types.ObjectId(req.body.nagarpalikaId) :{
        '$nin': [],
      }
      var answer2=req.body.wardId ? mongoose.Types.ObjectId(req.body.wardId) :{
        '$nin': [],
      }
      var answer3=req.body.complainuserId ?  mongoose.Types.ObjectId(req.body.complainuserId) :{
        '$nin': [],
      }
    
     var devicesdata=await devices.aggregate([
        {
          $match: {
                  'nagarpalikaId': answer1,
                  'wardId':answer2,
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
          '$unwind': {
            'path': '$nagarpalikadata', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$unwind': {
            'path': '$warddata', 
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
      console.log("devicesdata.length",devicesdata.length)
      devicesdatacount=devicesdata.length;
      devicesdatacount=devicesdatacount == 0 ? 10 : devicesdatacount
    const devicessData = await devices.aggregate([
        {
            $match: {
                    'nagarpalikaId': answer1,
                    'wardId':answer2,
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
            '$unwind': {
              'path': '$nagarpalikadata', 
              'preserveNullAndEmptyArrays': true
            }
          }, {
            '$unwind': {
              'path': '$warddata', 
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
      count: devicesdata.length,
      message: "Device details fetched successfully.",
      data: devicessData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

// export const viewSingleNagarpalika = async (req, res, next) => {
//   try {
//     logger.log(level.info, `✔ Controller viewSingleNagarpalika()`);
//     const NagarpalikaData = await NagarPalikas.findOneDocument({
//       _id: mongoose.Types.ObjectId(req.params.nagarpalikaId),
//     });
//     let dataObject = {
//       message: "Nagarpalika fetched successfully.",
//       data: NagarpalikaData,
//     };
//     return handleResponse(res, dataObject);
//   } catch (e) {
//     if (e && e.message) return next(new BadRequestError(e.message));
//     logger.log(level.error, `Error: ${JSON.stringify(e)}`);
//     return next(new InternalServerError());
//   }
// };

// export const updateSingleComplaint = async (req, res, next) => {
//   try {
//     logger.log(level.info, `✔ Controller updateSingleComplaint()`);
//     let { complainImages,
//         complainDescription,
//         complainstatus,
//         notcompletedreason,
//         nagarpalikaId,
//         wardId,
//         complainuserId,
//         assingnedsanitarymemeberId
//             } = req.body;
//     let updateDeviceObject = {
//         complainImages,
//         complainDescription,
//         complainstatus,
//         notcompletedreason,
//         nagarpalikaId,
//         wardId,
//         complainuserId,
//         assingnedsanitarymemeberId
//     };
//     let complainData = await  Complain.updateData(
//       { _id: mongoose.Types.ObjectId(req.params.complainId) },
//       updateDeviceObject
//     );
//     let dataObject = {
//       message: "Complain details updated successfully.",
//       data: complainData,
//     };
//     return handleResponse(res, dataObject);
//   } catch (e) {
//     if (e && e.message) return next(new BadRequestError(e.message));
//     logger.log(level.error, `Error: ${JSON.stringify(e)}`);
//     return next(new InternalServerError());
//   }
// };
// export const removeSingleNagarpalika = async (req, res, next) => {
//   try {
//     logger.log(level.info, `✔ Controller removeSingleNagarpalika()`);

//     const query = { _id: req.params.nagarpalikaId };
//     /*let removedData =*/ await NagarPalikas.deleteData(query);
//     let dataObject = {
//       message: "Nagarpalika deleted successfully.",
//       // data: removedData,
//     };
//     return handleResponse(res, dataObject);
//   } catch (e) {
//     if (e && e.message) return next(new BadRequestError(e.message));
//     logger.log(level.error, `Error: ${JSON.stringify(e)}`);
//     return next(new InternalServerError());
//   }
// };


export const viewAllcomplaintbysanitaryworker = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller viewAllcomplaintbysanitaryworker()`);
    var complaindatacount;
     var answer1=req.body.nagarpalikaId ?  mongoose.Types.ObjectId(req.body.nagarpalikaId) :{
        '$nin': [],
      }
      var answer2=req.body.wardId ? mongoose.Types.ObjectId(req.body.wardId) :{
        '$nin': [],
      }
      var answer3=req.body.assingnedsanitarymemeberId ?  mongoose.Types.ObjectId(req.body.assingnedsanitarymemeberId) :{
        '$nin': [],
      }
      var answer4=req.body.complainuserId ?  mongoose.Types.ObjectId(req.body.complainuserId) :{
        '$nin': [],
      }
    
     var complaindata=await Complain.aggregate([
        {
          $match: 
               {
                'nagarpalikaId': answer1,
                'wardId':answer2,
                'assingnedsanitarymemeberId':answer3,
                'complainstatus':req.body.complainstatus ? req.body.complainstatus : "0",
                'complainuserId':answer4
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
            'localField': 'complainuserId', 
            'foreignField': '_id', 
            'as': 'complainuserdata'
          }
        }, {
          '$lookup': {
            'from': 'users', 
            'localField': 'assingnedsanitarymemeberId', 
            'foreignField': '_id', 
            'as': 'assignedsanitarymemberdata'
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
            'path': '$complainuserdata', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$unwind': {
            'path': '$assignedsanitarymemberdata', 
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
        complaindatacount=complaindata.length;
     complaindatacount=complaindatacount == 0 ? 10 : complaindatacount
    const complainData = await Complain.aggregate([
      {
        $match: 
             {
              'nagarpalikaId': answer1,
              'wardId':answer2,
              'assingnedsanitarymemeberId':answer3,
              'complainstatus':req.body.complainstatus ? req.body.complainstatus : "0",
              'complainuserId':answer4
             }
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
          'localField': 'complainuserId', 
          'foreignField': '_id', 
          'as': 'complainuserdata'
        }
      }, {
        '$lookup': {
          'from': 'users', 
          'localField': 'assingnedsanitarymemeberId', 
          'foreignField': '_id', 
          'as': 'assignedsanitarymemberdata'
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
          'path': '$complainuserdata', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$unwind': {
          'path': '$assignedsanitarymemberdata', 
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
      message: "Complain details fetched successfully.",
      data: complainData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};