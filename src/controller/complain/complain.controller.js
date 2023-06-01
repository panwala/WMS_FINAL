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
import captureWeight from "../../models/captureweight.model";

export const addCompaint = async (req, res, next) => {
  logger.log(level.info, `✔ Controller addCompaint()`);
  try {
    req.body.date= new Date().toLocaleString("en-US", {
        timeZone: "Asia/calcutta",
      });
    let complainData = await Complain.createData(req.body);
    let dataObject = { message: "Complain created succesfully" };
    return handleResponse(res, dataObject, 201);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const viewAllcomplaint = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller viewAllcomplaint()`);
    var complaindatacount;
    var answer1=req.body.nagarpalikaId ?  mongoose.Types.ObjectId(req.body.nagarpalikaId) :{
        '$nin': [],
      }
      var answer2=req.body.wardId ? mongoose.Types.ObjectId(req.body.wardId) :{
        '$nin': [],
      }
      var answer3=req.body.complainuserId ?  mongoose.Types.ObjectId(req.body.complainuserId) :{
        '$nin': [],
      }
    
     var complaindata=await Complain.aggregate([
        {
          $match: {
                  'nagarpalikaId': answer1,
                  'wardId':answer2,
                  'complainuserId':answer3
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
      console.log("complaindata.length",complaindata.length)
        complaindatacount=complaindata.length;
     complaindatacount=complaindatacount == 0 ? 10 : complaindatacount
    const complainData = await Complain.aggregate([
      {
        $match: {
                'nagarpalikaId': answer1,
                'wardId':answer2,
                'complainuserId':answer3
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

export const updateSingleComplaint = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller updateSingleComplaint()`);
    let { complainImages,
        complainDescription,
        complainstatus,
        notcompletedreason,
        nagarpalikaId,
        wardId,
        complainuserId,
        assingnedsanitarymemeberId
            } = req.body;
    let updateDeviceObject = {
        complainImages,
        complainDescription,
        complainstatus,
        notcompletedreason,
        nagarpalikaId,
        wardId,
        complainuserId,
        assingnedsanitarymemeberId
    };
    let complainData = await  captureWeight.updateData(
      { _id: mongoose.Types.ObjectId(req.params.complainId) },
      updateDeviceObject
    );
    let dataObject = {
      message: "Complain details updated successfully.",
      data: complainData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
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
    
     var complaindata=await Complain.aggregate([
        {
          $match: 
               {
                'nagarpalikaId': answer1,
                'wardId':answer2,
                'assingnedsanitarymemeberId':answer3,
                'complainstatus':req.body.complainstatus ? req.body.complainstatus : "0"
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
              'complainstatus':req.body.complainstatus ? req.body.complainstatus : "0"
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