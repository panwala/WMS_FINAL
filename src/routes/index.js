import { Router } from "express";
import { handleResponse } from "../helpers/utility";
import RoleRoutes from "./role";
import UserRoutes from "./user";
import WardRoutes from "./ward";
import NagarpalikaRoutes from "./nagarpalika";
import QrRoutes from "./qrhouse";
import propertytypeRoutes from "./propertyType";
import {AuthMiddleware} from "../middleware/authMiddleware"

const routes = new Router();
const PATH = {
  ROOT: "/",
  USER: "/users",
  ROLES: "/roles",
  WARDS:"/wards",
  NAGARPALIKA:"/nagarpalika",
  QR:"/qrs",
  PROPERTYTYPE:"/propertytpe"
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
routes.use(PATH.PROPERTYTYPE, propertytypeRoutes);
export default routes;
