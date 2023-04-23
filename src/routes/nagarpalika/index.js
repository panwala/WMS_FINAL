import { Router } from "express";
const nagarpalikaCtrl = require("../../controller/nagarpalika/nagarpalika.controller");
import * as ErrorMiddleware from "../../middleware/validatorError";
import { validate as RoleValidate } from "../../validator/role/role.validator";
import { CONSTANTS as ROLE_CONSTANTS } from "../../constants/role/role";
const routes = new Router();
const PATH = {
  ROOT: "/",
  ROLEID: "/:roleId",
};
routes
  .route(PATH.ROOT)
  .post(
    // [
    //   RoleValidate(ROLE_CONSTANTS.CREATE_ROLE),
    //   ErrorMiddleware.ExpressValidatorError,
    // ],
    nagarpalikaCtrl.addNagarpalika
  )
  .get(nagarpalikaCtrl.viewNagarpalika);
// routes
//   .route(PATH.ROLEID)
//   .get(
//     [
//       RoleValidate(ROLE_CONSTANTS.GET_SINGLE_ROLE),
//       ErrorMiddleware.ExpressValidatorError,
//     ],
//     rolesCtrl.viewSingleRole
//   )
//   .patch(rolesCtrl.updateSingleRole)
//   .delete(rolesCtrl.removeSingleRole);

export default routes;
