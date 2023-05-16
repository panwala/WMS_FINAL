import QrHouses from "../../models/qrhouse.model";
// import Tabs from "../../models/tabs.model";
// import NagarPalikaspermission from "../../models/NagarPalikas_permission.model";
import { handleResponse } from "../../helpers/utility";
import moment from "moment";
const mongoose = require("mongoose");
import {
  BadRequestError,
  InternalServerError,
  // handleError,
} from "../../helpers/errors/custom-error";
import { logger, level } from "../../config/logger/logger";

export const addQrhouses = async (req, res, next) => {
  logger.log(level.info, `✔ Controller addQrhouses()`);
  try {
    let nagarpalikaData = await QrHouses.createData(req.body);
    let dataObject = { message: "House registered  succesfully" };
    return handleResponse(res, dataObject, 201);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
export const generateQrcodes = async (req, res, next) => {
    logger.log(level.info, `✔ Controller generateQrcodes()`);
    try {
      var nagarpalikaData;
      let finalArray=[]
        for(let i=0;i<req.body.qrcount;i++)
        {
             nagarpalikaData = await QrHouses.createData(
              {
                housetype:req.body.housetype,
                nagarpalikaId:req.body.nagarpalikaId,
                date: new Date().toLocaleString("en-US", {
                  timeZone: "Asia/calcutta",
                })
              });
              finalArray.push(nagarpalikaData)
        }
      let dataObject = { message: "Qr codes created  succesfully", data:finalArray };
      return handleResponse(res, dataObject, 201);
    } catch (e) {
      if (e && e.message) return next(new BadRequestError(e.message));
      logger.log(level.error, `Error: ${JSON.stringify(e)}`);
      return next(new InternalServerError());
    }
  };
  export const listdummyQrcodes = async (req, res, next) => {
    logger.log(level.info, `✔ Controller listdummyQrcodes()`);
    try {
      const qrhouseDatacount=await QrHouses.fetchCount()
      let qrhouseData = await QrHouses.aggregate([{
        '$skip': req.query.skip ? parseInt(req.query.skip) : 0
        },
        {
        '$limit': req.query.limit ? parseInt(req.query.limit) : qrhouseDatacount
        }]);
        
      let dataObject = { 
        data:qrhouseData,
        message: "Qr codes fetched  succesfully",
        count:qrhouseDatacount
       };
      return handleResponse(res, dataObject, 200);
    } catch (e) {
      if (e && e.message) return next(new BadRequestError(e.message));
      logger.log(level.error, `Error: ${JSON.stringify(e)}`);
      return next(new InternalServerError());
    }
  };
  export const listparticularnagarpalikaQrcodes = async (req, res, next) => {
    logger.log(level.info, `✔ Controller listparticularnagarpalikaQrcodes()`);
    try {
      const qrhouseDatacount=await QrHouses.fetchCount({
        'nagarpalikaId':mongoose.Types.ObjectId(req.body.nagarpalikaId), 
      })
      let qrhouseData = await QrHouses.aggregate([
        {
          '$match': {
            'nagarpalikaId':mongoose.Types.ObjectId(req.body.nagarpalikaId), 
          }
        }, {
          '$lookup': {
            'from': 'nagarpalikas', 
            'localField': 'nagarpalikaId', 
            'foreignField': '_id', 
            'as': 'nagarpalikadata'
          }
        },
        {
          '$lookup': {
            'from': 'wards', 
            'localField': 'wardId', 
            'foreignField': '_id', 
            'as': 'warddata'
          }
        }, 
        {
          '$unwind': {
            'path': '$nagarpalikadata', 
            'preserveNullAndEmptyArrays': true
          }
        }, 
        {
          '$unwind': {
            'path': '$warddata', 
            'preserveNullAndEmptyArrays': true
          }
        },
        {
          '$skip': req.query.skip ? parseInt(req.query.skip) : 0
          },
          {
          '$limit': req.query.limit ? parseInt(req.query.limit) : qrhouseDatacount
          }
      ]);
      let dataObject = { data:qrhouseData,message: "Qr codes fetched  succesfully" ,count:qrhouseDatacount };
      return handleResponse(res, dataObject, 200);
    } catch (e) {
      if (e && e.message) return next(new BadRequestError(e.message));
      logger.log(level.error, `Error: ${JSON.stringify(e)}`);
      return next(new InternalServerError());
    }
  };
export const checkqrhouseregisteredornot = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller checkqrhouseregisteredornot()`);
    const qrhouseData = await QrHouses.findData({_id:mongoose.Types.ObjectId(req.body.qrId)});
    console.log("qrhouseData",qrhouseData)
    console.log("qrhouseData",qrhouseData[0].houseaddress)
    console.log(qrhouseData[0].houseaddress == undefined)
    if(qrhouseData[0].houseaddress != undefined)
    {
        throw  new Error("This qr code is already registered")
    }
    let dataObject = {
      message: "QrHouses is available",
      data: qrhouseData,
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
    const NagarpalikaData = await QrHouses.findOneDocument({
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

export const updateSingleQrhouse = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller updateSingleQrhouse()`);
    let { housetype,
        houseno,
        houseaddress,
        city,
        zipcode,
        wastecollectionvalue,
        reason,
        username,
        propertyType,
        mobile_no,
        lat,
        long,
        nagarpalikaId,
        wardId,
        registrationmemberId
     } = req.body;
    let updateDeviceObject = {
        housetype,
        houseno,
        houseaddress,
        city,
        zipcode,
        wastecollectionvalue,
        reason,
        username,
        mobile_no,
        lat,
        long,
        nagarpalikaId,
        wardId,
        registrationmemberId,
        propertyType,
        date: new Date().toLocaleString("en-US", {
          timeZone: "Asia/calcutta",
        })
    };
    let QrhouseData = await QrHouses.updateData(
      { _id: mongoose.Types.ObjectId(req.body.qrId) },
      updateDeviceObject
    );
    let qrhouseData = await QrHouses.aggregate([
      {
        '$match': {
          '_id':mongoose.Types.ObjectId(req.body.qrId), 
        }
      }, {
        '$lookup': {
          'from': 'nagarpalikas', 
          'localField': 'nagarpalikaId', 
          'foreignField': '_id', 
          'as': 'nagarpalikadata'
        }
      },
      {
        '$lookup': {
          'from': 'wards', 
          'localField': 'wardId', 
          'foreignField': '_id', 
          'as': 'warddata'
        }
      }, 
      {
        '$unwind': {
          'path': '$nagarpalikadata', 
          'preserveNullAndEmptyArrays': true
        }
      }, 
      {
        '$unwind': {
          'path': '$warddata', 
          'preserveNullAndEmptyArrays': true
        }
      },
    ]);
    let dataObject = {
      message: "qrhouse details updated successfully.",
      data: qrhouseData,
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
    /*let removedData =*/ await QrHouses.deleteData(query);
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




export const listonlyregisteredQrcodes = async (req, res, next) => {
  logger.log(level.info, `✔ Controller listonlyregisteredQrcodes()`);
  try {
    let answer1 = req.body.nagarpalikaId
    ? mongoose.Types.ObjectId(req.body.nagarpalikaId)
    : {
        $nin: [],
      };
      let answer2 = req.body.wardId
      ? mongoose.Types.ObjectId(req.body.wardId)
      : {
          $nin: [],
        };
       var qrhouseDatacount;
        if(req.body.search)
        {
          let demo=await QrHouses.aggregate([
            {
              '$match': {
                'nagarpalikaId': answer1, 
                'wardId': answer2
              }
            }, {
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
            }, {
              '$addFields': {
                'warddataexist': {
                  '$ifNull': [
                    '$warddata', null
                  ]
                }
              }
            }, {
              '$match': {
                'warddataexist': {
                  '$ne': null
                }
              }
            },
            {
              '$match': {
                '$or': [
                  {
                    'username':req.body.search ? {
                      '$regex': req.body.search ?  req.body.search :"",
                      '$options': 'i'
                    }:{
                      '$nin': []
                    }
                  }, {
                    'mobile_no': req.body.search ? {
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
          ]);
          qrhouseDatacount=demo.length == 0 ? 10 : demo.length;
        }
        else
        {
           qrhouseDatacount=await QrHouses.fetchCount({
            'nagarpalikaId': answer1, 
            'wardId': answer2
          })
          qrhouseDatacount=qrhouseDatacount == 0 ? 10 : qrhouseDatacount
        }
    let qrhouseData = await QrHouses.aggregate([
      {
        '$match': {
          'nagarpalikaId': answer1, 
          'wardId': answer2
        }
      }, {
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
      }, {
        '$addFields': {
          'warddataexist': {
            '$ifNull': [
              '$warddata', null
            ]
          }
        }
      }, {
        '$match': {
          'warddataexist': {
            '$ne': null
          }
        }
      },
      {
        '$match': {
          '$or': [
            {
              'username': req.body.search ? {
                '$regex': req.body.search ?  req.body.search :"",
                '$options': 'i'
              }:{
                '$nin': []
              }
            }, {
              'mobile_no': req.body.search ?{
                '$regex': req.body.search ?  req.body.search :"",
                '$options': 'i'
              }:{
                '$nin': []
              }
            }, {
              'nagarpalikadata.nagarpalikaname':req.body.search ? {
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
        '$limit': req.query.limit ? parseInt(req.query.limit) : qrhouseDatacount
        }
    ]);
    let dataObject = { data:qrhouseData,message: "Qr codes fetched  succesfully",count:qrhouseDatacount };
    return handleResponse(res, dataObject, 200);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const removemultipleqrcodes = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller removemultipleqrcodes()`);

    const query = { _id: req.params.nagarpalikaId };
    /*let removedData =*/ await QrHouses.deleteMultipleData({_id:req.body.qrid});
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


export const listonlyregisteredQrcodesbyparticularregistrationworker = async (req, res, next) => {
  logger.log(level.info, `✔ Controller listonlyregisteredQrcodesbyparticularregistrationworker()`);
  try {
    let answer1 = req.body.nagarpalikaId
    ? mongoose.Types.ObjectId(req.body.nagarpalikaId)
    : {
        $nin: [],
      };
      let answer2 = req.body.wardId
      ? mongoose.Types.ObjectId(req.body.wardId)
      : {
          $nin: [],
        };
        let answer3 = req.body.registrationmemberId
        ? mongoose.Types.ObjectId(req.body.registrationmemberId)
        : {
            $nin: [],
          };
        const qrhouseDatacount=await QrHouses.fetchCount({
          'nagarpalikaId': answer1, 
          'wardId': answer2,
          'registrationmemberId':answer3
        })
        
    let qrhouseData = await QrHouses.aggregate([
      {
        '$match': {
          'nagarpalikaId': answer1, 
          'wardId': answer2,
          'registrationmemberId':answer3
      }
      }, {
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
      }, {
        '$addFields': {
          'warddataexist': {
            '$ifNull': [
              '$warddata', null
            ]
          }
        }
      }, {
        '$match': {
          'warddataexist': {
            '$ne': null
          }
        }
      },
      {
        '$skip': req.query.skip ? parseInt(req.query.skip) : 0
        },
        {
        '$limit': req.query.limit ? parseInt(req.query.limit) : qrhouseDatacount
        }
    ]);
    let dataObject = { data:qrhouseData,message: "Qr codes fetched  succesfully",count:qrhouseDatacount };
    return handleResponse(res, dataObject, 200);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};