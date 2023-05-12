import { Router } from "express";
const qrhouse = require("../../controller/qrhouse/qrhouse.controller");
import * as ErrorMiddleware from "../../middleware/validatorError";
import { validate as RoleValidate } from "../../validator/role/role.validator";
import { CONSTANTS as ROLE_CONSTANTS } from "../../constants/role/role";
const routes = new Router();
const PATH = {
  ROOT: "/",
  GENERATE_QR_CODES:"/generateqrcodes",
  CHECK_QR_REGISTERED_OR_NOT:"/checkqrcoderegisteredornot",
  UPDATE_QR_HOUSE_DETAILS:"/updateqrhousedetails",
  LIST_QR_CODES:"/listqrcodes",
  LIST_QR_CODES_BY_NAGARPALIKA:"/listqrcodebynagarpalika",
  LIST_ONLY_REGISTERED_QR_CODES:"/listonlyregisteredqrcodes",
  LIST_ONLY_REGISTERED_QR_CODES_BY_REGISTRATION_WORKER:"/listonlyregisteredqrcodesbyregistrationworker",
  DELETE_MULTIPLE_QR_CODES:"/deletemultipleqrcodes"
//   ROLEID: "/:roleId",
};
routes
  .route(PATH.ROOT)
  .post(
    // [
    //   RoleValidate(ROLE_CONSTANTS.CREATE_ROLE),
    //   ErrorMiddleware.ExpressValidatorError,
    // ],
    qrhouse.addQrhouses
  )
  routes.route(PATH.LIST_QR_CODES_BY_NAGARPALIKA).post(qrhouse.listparticularnagarpalikaQrcodes)
  routes.route(PATH.GENERATE_QR_CODES).post(qrhouse.generateQrcodes)
  routes.route(PATH.CHECK_QR_REGISTERED_OR_NOT).post(qrhouse.checkqrhouseregisteredornot)
  routes.route(PATH.UPDATE_QR_HOUSE_DETAILS).post(qrhouse.updateSingleQrhouse)
  routes.route(PATH.LIST_QR_CODES).get(qrhouse.listdummyQrcodes)
  routes.route(PATH.LIST_ONLY_REGISTERED_QR_CODES_BY_REGISTRATION_WORKER).post(qrhouse.listonlyregisteredQrcodesbyparticularregistrationworker)

  routes.route(PATH.LIST_ONLY_REGISTERED_QR_CODES).post(qrhouse.listonlyregisteredQrcodes)
  routes.route(PATH.DELETE_MULTIPLE_QR_CODES).delete(qrhouse.removemultipleqrcodes)
//   .get(rolesCtrl.viewRole);
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
