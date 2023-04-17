import Wards from "../../models/ward.model";
// import Tabs from "../../models/tabs.model";
// import Wardspermission from "../../models/Wards_permission.model";
import { handleResponse } from "../../helpers/utility";
const mongoose = require("mongoose");
import {
  BadRequestError,
  InternalServerError,
  // handleError,
} from "../../helpers/errors/custom-error";
import { logger, level } from "../../config/logger/logger";

export const addWard = async (req, res, next) => {
  logger.log(level.info, `✔ Controller addWard()`);
  try {
    let wardsData = await Wards.createData(req.body);
    let dataObject = { message: "Wards created succesfully" };
    return handleResponse(res, dataObject, 201);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const viewWard = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller viewWard()`);
    const WardData = await Wards.findData();
    let dataObject = {
      count: WardData.length,
      message: "Wards fetched successfully.",
      data: WardData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const viewSingleWard = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller viewSingleWard()`);
    const WardData = await Wards.findOneDocument({
      _id: mongoose.Types.ObjectId(req.params.wardId),
    });
    let dataObject = {
      message: "Wards fetched successfully.",
      data: WardData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const updateSingleWard = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller updateSingleWard()`);
    let { wardno,nagarpalikaId } = req.body;
    let updateDeviceObject = {
        wardno,nagarpalikaId
    };
    let WardData = await Wards.updateData(
      { _id: mongoose.Types.ObjectId(req.params.wardId) },
      updateDeviceObject
    );
    let dataObject = {
      message: "Wards details updated successfully.",
      data: WardData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
export const removeSingleWard = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller removeSingleWard()`);

    const query = { _id: req.params.wardId };
    /*let removedData =*/ await Wards.deleteData(query);
    let dataObject = {
      message: "Wards deleted successfully.",
      // data: removedData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
