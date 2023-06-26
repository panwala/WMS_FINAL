import { scheduleJob } from "node-schedule";
import { logger, level } from "../config/logger/logger";
import moment from "moment";
// import Devices from "../models/device.model";
import Users from "../models/user.model";
import attendance from "../models/attendance.model";
// import deviceHistory from "../models/deviceHistory.model";
// import * as DeviceSrv from "../services/device/device.service";
const JOB_TIME = "* * * * *";   //"30 17 * * *"
const MIN = 15; // this minute ago data should be update

scheduleJob(JOB_TIME, async (fireDate) => {
  logger.log(
    level.info,
    "hi cron job run succesfully"
  );
  try {
        console.log("check cron job run succesfully")
  } catch (error) {
    logger.log(level.error, `>> Device state JOB error ${error}`);
  }

  logger.log(
    level.info,
    `>> Device state JOB executed successfully at ${moment().format()}`
  );
});

