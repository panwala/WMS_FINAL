import Roles from "../../models/role.model";
import propertyType from "../../models/propertytype.model";
// import Tabs from "../../models/tabs.model";
// import Rolespermission from "../../models/roles_permission.model";
import { handleResponse } from "../../helpers/utility";
const mongoose = require("mongoose");
import {
  BadRequestError,
  InternalServerError,
  // handleError,
} from "../../helpers/errors/custom-error";
import { logger, level } from "../../config/logger/logger";

export const addPropertyType = async (req, res, next) => {
  logger.log(level.info, `✔ Controller addPropertyType()`);
  try {
    let propertyTypedata=await propertyType.findOneDocument({typeName:req.body.typeName})
    if(!propertyTypedata)
    {
         await propertyType.createData(req.body);
    }
    let dataObject = { message: "propertyType created succesfully" };
    return handleResponse(res, dataObject, 201);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const viewPropertyType = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller viewPropertyType()`);
    // const query = { _id: req.body.id };
    const roleData = await propertyType.findData();
    let dataObject = {
      count: roleData.length,
      message: "roles fetched successfully.",
      data: roleData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const viewSinglePropertyType = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller viewSinglePropertyType()`);
    const roleData = await propertyType.findOneDocument({
      _id: mongoose.Types.ObjectId(req.params.propertytypeId),
    });
    let dataObject = {
      message: "role fetched successfully.",
      data: roleData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const updateSinglePropertyType = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller updateSinglePropertyType()`);
    let { typeName } = req.body;
    var propertytypeData
    let updateDeviceObject = {
        typeName
    };
    let propertyTypedata=await propertyType.findOneDocument({typeName:typeName})
    if(!propertyTypedata)
    {
        propertytypeData = await propertyType.updateData(
        { _id: mongoose.Types.ObjectId(req.params.propertytypeId) },
        updateDeviceObject
        );
    }
    let dataObject = {
      message: "propertytype details updated successfully.",
      data: propertytypeData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
export const removeSinglePropertyType = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller removeSinglePropertyType()`);

    const query = { _id: req.params.propertytypeId };
    /*let removedData =*/ await propertyType.deleteData(query);
    let dataObject = {
      message: "propertyType deleted successfully.",
      // data: removedData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
