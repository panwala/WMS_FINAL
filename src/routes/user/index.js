import { Router } from "express";
const usersCtrl = require("../../controller/user/user.controller");
import * as ErrorMiddleware from "../../middleware/validatorError";
import { validate as UserValidate } from "../../validator/user/user.validator";
import { CONSTANTS as USER_CONSTANTS } from "../../constants/user/user";
const routes = new Router();
const PATH = {
  ROOT: "/",
  ADMIN_LOGIN: "/adminlogin",
  SIGNUP: "/signup",
  VERIFY_OTP: "/verifyOTP",
  FETCH_USER_ROLE_WISE: "/fetchuserrolewise",
  REGISTRATION_WORKER_LOGIN: "/registrationworkerLogin",
  UPDATE_USER: "/updateuser/:userId",
  OPERATION_USER: "/useroperation/:userId",
  SANITARY_WORKER_LOGIN:"/sanitaryworkerlogin",
  END_USER_LOGIN:"/enduserlogin",
  SANITARY_WORKER_LOGOUT:"/sanitaryworkerlogout",
  REGISTRATION_WORKER_LOGOUT:"/registrationworkerlogout",
  CHECK_COSANITARY_WORKER_EXIST:"/checkcosanitaryworkerexist",
  DELETE_COSANITARY_WORKER_EXIST:"/deletecosanitaryworkerexist",
  FETCH_SANITARY_WORKER_LIST:"/fetchsanitaryworkerlist",
  ADD_VEHILCE:"/addVehicle",
  EDIT_VEHILCE:"/updateVehicle",
  REMOVE_VEHILCE:"/deleteVehicle", 
  VIEW_ALL_VEHILCE:"/viewallVehicle",
  VIEW_ALL_TODAY_ASSIGNED_VEHICLES:"/viewalltodayassignedvehicles",
  ASSING_VEHICLE_TO_SANITARY_WORKER:"/assignvehicletosanitaryworker",
  FETCH_SANITARY_WORKER_ATTENDANCE:"/fetchsanitaryworkerattendance",
  CHECK_VEHICLE_ALREADY_ASSIGNED_TO_SANITARY_WORKER:"/checkvehiclealreadyassignedtosanitaryworker",
  REGENRATE_REGISTERED_HOUSE_QR_CODE:"/regenerateregisteredhouseqrcode",
  CHECK_MOBILE_NUMBER_ALREADY_REGISTERED_FOR_QR_HOUSE:"/checkmobilenumberalreadyregisteredforhouse",
  FETCH_REGISTERED_QR_CODES_COUNT_OF_REGISTRATION_WORKER:"/fetchregisteredqrcodescountofregistrationworker"
};
// routes.route(PATH.ROOT).get(usersCtrl.getAllUser);
  routes.route(PATH.FETCH_USER_ROLE_WISE).post(usersCtrl.getAllUserRoleWise);
  routes.route(PATH.FETCH_REGISTERED_QR_CODES_COUNT_OF_REGISTRATION_WORKER).post(usersCtrl.fetchregisteredqrcodescountofregisrationworker)
  routes.route(PATH.SANITARY_WORKER_LOGIN).post(usersCtrl.sanitaryworkerlogin)
  routes.route(PATH.CHECK_COSANITARY_WORKER_EXIST).post(usersCtrl.checkcosanitaryworkerexist)
  routes.route(PATH.DELETE_COSANITARY_WORKER_EXIST).post(usersCtrl.deletecosanitaryworkerexist)
  routes.route(PATH.FETCH_SANITARY_WORKER_LIST).post(usersCtrl.fetchsanitaryworkerlist)
  routes.route(PATH.FETCH_SANITARY_WORKER_ATTENDANCE).post(usersCtrl.fetchsanitaryworkerattendance)
  routes.route(PATH.END_USER_LOGIN).post(usersCtrl.enduserlogin)
  routes.route(PATH.REGENRATE_REGISTERED_HOUSE_QR_CODE).post(usersCtrl.changeQrcodeofregisteredHouse)
  routes.route(PATH.CHECK_MOBILE_NUMBER_ALREADY_REGISTERED_FOR_QR_HOUSE).post(usersCtrl.checkmobilenumberalreadyregisteredforhouse)
  routes.route(PATH.ADD_VEHILCE).post(usersCtrl.addVehicles)
  routes.route(PATH.REGISTRATION_WORKER_LOGOUT).post(usersCtrl.Registrationworkerlogout)
  routes.route(PATH.EDIT_VEHILCE).post(usersCtrl.updateSingleVehicle)
  routes.route(PATH.REMOVE_VEHILCE).post(usersCtrl.removemultiplevehicles)
  routes.route(PATH.VIEW_ALL_VEHILCE).post(usersCtrl.viewAllVehicles)
  routes.route(PATH.VIEW_ALL_TODAY_ASSIGNED_VEHICLES).post(usersCtrl.viewAlltodayassignedvehicles)
  routes.route(PATH.ASSING_VEHICLE_TO_SANITARY_WORKER).post(usersCtrl.assingVehiclestosanitaryworker)
  routes.route(PATH.CHECK_VEHICLE_ALREADY_ASSIGNED_TO_SANITARY_WORKER).post(usersCtrl.checkvehiclealreadyassignedtosanitarworker)
// routes
//   .route(PATH.FORGOT_PASSWORD)
//   .post(
//     [
//       UserValidate(USER_CONSTANTS.FORGOT_PASSWORD),
//       ErrorMiddleware.ExpressValidatorError,
//     ],
//     usersCtrl.setPasswordResetLink
//   );
// routes.route(PATH.RESET_PASSWORD).post(usersCtrl.resetPassword);
routes
  .route(PATH.SIGNUP)
  .post(
    // [
    //   UserValidate(USER_CONSTANTS.CREATE_USER),
    //   ErrorMiddleware.ExpressValidatorError,
    // ],
    usersCtrl.register
  );

routes.route(PATH.ADMIN_LOGIN).post(usersCtrl.Adminlogin);
// routes.route(PATH.VERIFY_OTP).post(usersCtrl.verifyOTP);
routes.route(PATH.UPDATE_USER).patch(
  // [
  //   UserValidate(USER_CONSTANTS.UPDATE_SINGLE_USER),
  //   ErrorMiddleware.ExpressValidatorError,
  // ], 
  usersCtrl.updateSingleUser);
routes
  .route(PATH.OPERATION_USER)
  // .delete(
  //   [
  //     UserValidate(USER_CONSTANTS.REMOVE_SINGLE_USER),
  //     ErrorMiddleware.ExpressValidatorError,
  //   ],
  //   usersCtrl.removeSingleUser
  // )
  .get(
    [
      UserValidate(USER_CONSTANTS.GET_SINGLE_USER),
      ErrorMiddleware.ExpressValidatorError,
    ],
    usersCtrl.getSingleUser
  );
//   .put(
//     [
//       UserValidate(USER_CONSTANTS.UPDATE_SINGLE_USER),
//       ErrorMiddleware.ExpressValidatorError,
//     ],
//     usersCtrl.updateSingleUser
//   );
routes.route(PATH.REGISTRATION_WORKER_LOGIN).post(usersCtrl.Registrationworkerlogin);
routes.route(PATH.SANITARY_WORKER_LOGOUT).post(usersCtrl.sanitaryworkerlogout)
export default routes;
