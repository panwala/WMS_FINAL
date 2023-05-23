import { Router } from "express";
const complainCtrl = require("../../controller/complain/complain.controller");
import * as ErrorMiddleware from "../../middleware/validatorError";
import { validate as RoleValidate } from "../../validator/role/role.validator";
import { CONSTANTS as ROLE_CONSTANTS } from "../../constants/role/role";
const   routes = new Router();
const PATH = {
  ROOT: "/",
  COMPLAINID: "/complainoperation/:complainId",
  VIEW_ALL_COMPLAINT:"/viewallcomplaint",
  VIEW_ALL_COMPLAINT_BY_SANITARY_WORKER:"/viewallcomplaintbysanitaryworker"
};
routes
  .route(PATH.ROOT)
  .post(
    complainCtrl.addCompaint
  )
  routes.route(PATH.VIEW_ALL_COMPLAINT)
  .post(complainCtrl.viewAllcomplaint);
  routes.route(PATH.VIEW_ALL_COMPLAINT_BY_SANITARY_WORKER).post(complainCtrl.viewAllcomplaintbysanitaryworker)
routes
  .route(PATH.COMPLAINID)
//   .get(
//     [
//       RoleValidate(ROLE_CONSTANTS.GET_SINGLE_ROLE),
//       ErrorMiddleware.ExpressValidatorError,
//     ],
//     rolesCtrl.viewSingleRole
//   )
  .patch(complainCtrl.updateSingleComplaint)
//   .delete(rolesCtrl.removeSingleRole);

export default routes;
