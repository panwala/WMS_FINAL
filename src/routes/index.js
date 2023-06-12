import { Router } from "express";
import { handleResponse } from "../helpers/utility";
import RoleRoutes from "./role";
import UserRoutes from "./user";
import WardRoutes from "./ward";
import NagarpalikaRoutes from "./nagarpalika";
import QrRoutes from "./qrhouse";
import propertytypeRoutes from "./propertyType";
import captureWeightRoutes from "./captureweight";
import complainRoutes from "./complain";
import deviceRoutes from "./Devices";
import {AuthMiddleware} from "../middleware/authMiddleware"

const routes = new Router();
const PATH = {
  ROOT: "/",
  USER: "/users",
  ROLES: "/roles",
  WARDS:"/wards",
  NAGARPALIKA:"/nagarpalika",
  QR:"/qrs",
  PROPERTYTYPE:"/propertytpe",
  COMPLAIN:"/complain",
  CAPTURE_WEIGHT:"/captureweight",
  DEVICES:"/devices"
};

routes.get("/healthCheck", AuthMiddleware,(req, res) => {
  let dataObject = {
    message: "Server is running fine",
  };
  return handleResponse(res, dataObject);
});

routes.use(PATH.USER, UserRoutes);
routes.use(PATH.ROLES, RoleRoutes);
routes.use(PATH.WARDS, WardRoutes);
routes.use(PATH.NAGARPALIKA, NagarpalikaRoutes);
routes.use(PATH.QR, QrRoutes);
routes.use(PATH.COMPLAIN,complainRoutes)
routes.use(PATH.PROPERTYTYPE, propertytypeRoutes);
routes.use(PATH.CAPTURE_WEIGHT, captureWeightRoutes);
routes.use(PATH.DEVICES, deviceRoutes);
export default routes;
