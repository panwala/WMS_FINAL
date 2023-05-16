import { Router } from "express";
const propertytypeCtrl = require("../../controller/propertyType/propertyType.controller");
import * as ErrorMiddleware from "../../middleware/validatorError";
import { CONSTANTS as PROPERTYTYPE_CONSTANTS } from "../../constants/propertyType/propertyType";
const routes = new Router();
const PATH = {
  ROOT: "/",
  PROPERTYTYPEID: "/:propertytypeId",
};
routes
  .route(PATH.ROOT)
  .post(
    propertytypeCtrl.addPropertyType
  )
  .get(propertytypeCtrl.viewPropertyType);
routes
  .route(PATH.PROPERTYTYPEID)
  .get(
    propertytypeCtrl.viewSinglePropertyType
  )
  .patch(propertytypeCtrl.updateSinglePropertyType)
  .delete(propertytypeCtrl.removeSinglePropertyType);

export default routes;
