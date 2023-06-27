import QrHouses from "../../models/qrhouse.model";
import QrHousesgarbagehistory from "../../models/qrhousegarbagehistory.model";
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
        is_wastecollected,
        reason,
        username,
        propertyType,
        mobile_no,
        lat,
        long,
        nagarpalikaId,
        wardId,
        registrationmemberId,
        sanitrationmemberId
     } = req.body;
    let updateDeviceObject = {
        housetype,
        houseno,
        houseaddress,
        city,
        zipcode,
        is_wastecollected,
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
        }),
        sanitrationmemberId
    };
    
    let QrhouseData = await QrHouses.updateData(
      { _id: mongoose.Types.ObjectId(req.body.qrId) },
      updateDeviceObject
    );
    if(is_wastecollected)
    {
      console.log("inside")
      // console.log("QrhouseData",QrhouseData)
      var dates223 = new Date(
        moment().tz("Asia/calcutta").format("YYYY-MM-DD")
      );
      let istodayrecordexist= await QrHousesgarbagehistory.aggregate([
        {
          '$match': {
            'sanitrationmemberId': mongoose.Types.ObjectId(sanitrationmemberId),
            'date': {
              $gte:  new Date (dates223),
              $lte: new Date (new Date(dates223).setHours(23, 59, 59)),
            },
          }
        }
      ])
      if(istodayrecordexist.length >0)
      {
        await QrHousesgarbagehistory.updateData({ _id: mongoose.Types.ObjectId(istodayrecordexist[0]._id) },
        {
          is_wastecollected,
          reason,
          nagarpalikaId:QrhouseData.nagarpalikaId,
          wardId:QrhouseData.wardId,
          registrationmemberId:QrhouseData.registrationmemberId,
          sanitrationmemberId:sanitrationmemberId,
          houseId:QrhouseData._id,
          date: new Date().toLocaleString("en-US", {
            timeZone: "Asia/calcutta",
          })
        })
      }
      else
      {
        await QrHousesgarbagehistory.createData({
          is_wastecollected,
          reason,
          nagarpalikaId:QrhouseData.nagarpalikaId,
          wardId:QrhouseData.wardId,
          registrationmemberId:QrhouseData.registrationmemberId,
          sanitrationmemberId:sanitrationmemberId,
          houseId:QrhouseData._id,
          date: new Date().toLocaleString("en-US", {
            timeZone: "Asia/calcutta",
          })
        })
      }
      console.log("istodayrecordexist",istodayrecordexist)
    }
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
           let demo1=await QrHouses.aggregate([
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
          ])
          console.log("demo1.length",demo1.length)
          qrhouseDatacount=demo1.length == 0 ? 10 : demo1.length
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
        var qrhouseDatacount=await QrHouses.fetchCount({
          'nagarpalikaId': answer1, 
          'wardId': answer2,
          'registrationmemberId':answer3
        })
        qrhouseDatacount=qrhouseDatacount == 0 ? 10 : qrhouseDatacount
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


export const fetchdashboardcountforsanitaryworker = async (req, res, next) => {
  logger.log(level.info, `✔ Controller fetchdashboardcountforsanitaryworker()`);
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
        
          let demo=await QrHouses.aggregate([
            {
              '$match': {
                'nagarpalikaId': answer1, 
                'wardId': answer2
              }
            }, {
              $group: {
                _id: { is_wastecollected: "$is_wastecollected" },
                Devicecount: { $sum: 1 },
              },
            },
          ]);
          console.log("demo",demo)
          let finalArray={}
          finalArray["bincollected"]=0
          finalArray["binnotcollected"]=0
          finalArray["binremaining"]=0
          for(let i=0;i<demo.length;i++)
        {
              if(demo[i]["_id"]["is_wastecollected"] == "0")
              {
                //binnotcollected
                finalArray["binnotcollected"]=demo[i]["Devicecount"]
                // data["binnotcollected"]=registeredHouseCount[i]["Devicecount"]
              }
              else if(demo[i]["_id"]["is_wastecollected"] == "1")
              {
                finalArray["bincollected"]=demo[i]["Devicecount"]
                // data["bincollected"]=registeredHouseCount[i]["Devicecount"]
              }
              else if(demo[i]["_id"]["is_wastecollected"] == "2")
              {
                finalArray["binremaining"]=demo[i]["Devicecount"]
                // data["bincollected"]=registeredHouseCount[i]["Devicecount"]
              }
        }
       finalArray["totalbins"]=parseInt(finalArray["binnotcollected"])+parseInt(finalArray["bincollected"])+parseInt(finalArray["binremaining"])
    let dataObject = { data:finalArray,message: "Qr codes fetched  succesfully",};
    return handleResponse(res, dataObject, 200);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};


export const viewLast7daysofactivity = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller viewLast7daysofactivity()`);
    var dates2 = new Date(moment().tz("Asia/calcutta").format("YYYY-MM-DD"));
    dates2.setDate(dates2.getDate() - 1);
    var dates3 = new Date(moment().tz("Asia/calcutta").format("YYYY-MM-DD"));
    dates3.setDate(dates3.getDate() - 8);
    var last7daysofactivitydata = await QrHousesgarbagehistory.aggregate([
      {
        '$match': {
          'houseId': mongoose.Types.ObjectId(req.body.houseId),
          date: {
            $gte: new Date(new Date(dates3)),
            $lte: new Date(new Date(dates2).setHours(23, 59, 59)),
          },
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
          'localField': 'sanitrationmemberId', 
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
          'path': '$assignedsanitarymemberdata', 
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        '$project': {
          'date': 1, 
          'is_wastecollected': '$is_wastecollected',
          'time': {
            '$toString': {
              '$hour': '$date'
            }
          }, 
          'timemin': {
            '$toString': {
              '$minute': '$date'
            }
          }, 
          'timesec': {
            '$toString': {
              '$second': '$date'
            }
          } 
        }
      },
      {
        '$project': {
          'date': 1, 
          'is_wastecollected': 1,
          'finalTime': {
            '$concat': [
              '$time', ':', '$timemin', ':', '$timesec'
            ]
          }
        }
      }
    ])
    console.log("aggregation pipeline result",last7daysofactivitydata)
      let defaultgraphData = generateDefaultPropertiesOfWeek(last7daysofactivitydata);
      let mergeArrayResponse = [...last7daysofactivitydata, ...defaultgraphData];
      last7daysofactivitydata = sortResponsePeriodWise(mergeArrayResponse);
      console.log("merger array", last7daysofactivitydata);
    let dataObject = {
      message: "Details fetched successfully.",
      data: last7daysofactivitydata,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

const sortResponsePeriodWise = (array) => {
  let sortedPeriodWiseArray = array.sort(function (a, b) {
    return Number(new Date(a.date)) - Number(new Date(b.date));
  });
  return sortedPeriodWiseArray;
};
const generateDefaultPropertiesOfWeek = (data) => {
  let dates1 = new Date(moment().tz("Asia/calcutta").format("YYYY-MM-DD"));
  console.log("origin timezone Date", dates1);
  let totalDays = [];
  //dates1.setDate(dates.getDate() + 2);
  dates1.setDate(dates1.getDate() - 9);
  console.log(">>++", dates1);
  for (let i = 0; i <= 7; i++) {
    let ansDate = new Date(
      moment(dates1.setDate(dates1.getDate() + 1))
        .tz("Asia/calcutta")
        .format("YYYY-MM-DD")
    ); //.toDateString();
    totalDays.push(ansDate);
  }
  console.log("list of week days", totalDays);
  totalDays = JSON.parse(JSON.stringify(totalDays));
  let dayIncludedInDBResponse = data.map(
    (day) => new Date(moment(day.date).format("YYYY-MM-DD:HH:MM:SS"))
  );
  dayIncludedInDBResponse = JSON.parse(JSON.stringify(dayIncludedInDBResponse));
  dayIncludedInDBResponse = dayIncludedInDBResponse.map(
    (day) => day.split("T")[0]
  );
  totalDays = totalDays.map((day) => day.split("T")[0]);
  console.log(" After dayincluded", dayIncludedInDBResponse);
  console.log("After  daynotincluded", totalDays);
  let dayNotIncludedInDBResponse = totalDays.filter((x) => {
    console.log(dayIncludedInDBResponse.includes(x));
    return !dayIncludedInDBResponse.includes(x);
  });

  console.log("notinculded", dayNotIncludedInDBResponse);
  let generateNotIncludedDayResponse = dayNotIncludedInDBResponse.map((day) => {
    return defaultBatteryPropertyOfWeek(day);
  });
  // console.log("generated response", generateNotIncludedDayResponse);
  return generateNotIncludedDayResponse;
};
const defaultBatteryPropertyOfWeek = (period) => {
  console.log(period);
  let demoDate = new Date(
    moment(period).tz("Asia/calcutta").format("YYYY-MM-DD")
  );
  let data = {
    _id: demoDate.getDate(),
    date: new Date(
      moment(period).tz("Asia/calcutta").format("YYYY-MM-DD")
    ).toISOString(),
    is_wastecollected: "2",
    finalTime:"NA"
  };
  return data;
};