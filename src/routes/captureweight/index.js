import { Router } from "express";
const complainCtrl = require("../../controller/complain/complain.controller");
const weightCtrl = require("../../controller/captureweight/captureweight.controller");
import * as ErrorMiddleware from "../../middleware/validatorError";
import { validate as RoleValidate } from "../../validator/role/role.validator";
import { CONSTANTS as ROLE_CONSTANTS } from "../../constants/role/role";
const   routes = new Router();
const PATH = {
  ROOT: "/",
  WEIGTHID: "/weightoperation/:weightId",
  VIEW_ALL_CAPTUREWEIGTH:"/viewallcaptureweight",
};
routes
  .route(PATH.ROOT)
  .post(
    weightCtrl.addCaptureweight
  )
  routes.route(PATH.VIEW_ALL_CAPTUREWEIGTH)
  .post(weightCtrl.viewAllcaptureweight);
routes
  .route(PATH.WEIGTHID)
  .get(
    weightCtrl.viewSingleCaptureweight
  )
  .patch(weightCtrl.updateSingleCaptureweight)
  .delete(weightCtrl.removeSingleCaptureweight);

export default routes;
