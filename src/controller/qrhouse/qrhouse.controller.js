import QrHouses from "../../models/qrhouse.model";
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
        for(let i=0;i<req.body.qrcount;i++)
        {
            let nagarpalikaData = await QrHouses.createData(
              {
                housetype:req.body.housetype,
                nagarpalikaId:req.body.nagarpalikaId
              });
        }
      let dataObject = { message: "Qr codes created  succesfully" };
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
       
      let qrhouseData = await QrHouses.findData();
      let dataObject = { data:qrhouseData,message: "Qr codes fetched  succesfully" };
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
       
      let qrhouseData = await QrHouses.findData({nagarpalikaId:req.body.nagarpalikaId});
      let dataObject = { data:qrhouseData,message: "Qr codes fetched  succesfully" };
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
        propertyType
    };
    let QrhouseData = await QrHouses.updateData(
      { _id: mongoose.Types.ObjectId(req.body.qrId) },
      updateDeviceObject
    );
    let dataObject = {
      message: "qrhouse details updated successfully.",
      data: QrhouseData,
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
