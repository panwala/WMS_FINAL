import { scheduleJob } from "node-schedule";
import { logger, level } from "../config/logger/logger";
import moment from "moment";
// import Devices from "../models/device.model";
import QrHouses from "../models/qrhouse.model";
// import deviceHistory from "../models/deviceHistory.model";
// import * as DeviceSrv from "../services/device/device.service";
const JOB_TIME = "30 10 * * *";   //"30 17 * * *"
const MIN = 15; // this minute ago data should be update

scheduleJob(JOB_TIME, async (fireDate) => {
  logger.log(
    level.info,
    `>> Device state supposed to run at ${moment(
      fireDate
    ).format()} , but actually ran at ${moment().format()}`
  );

  try {
    await QrHouses.updateMany(
        {},
        { is_wastecollected: "2" }
      )
  } catch (error) {
    logger.log(level.error, `>> Device state JOB error ${error}`);
  }

  logger.log(
    level.info,
    `>> Device state JOB executed successfully at ${moment().format()}`
  );
});

