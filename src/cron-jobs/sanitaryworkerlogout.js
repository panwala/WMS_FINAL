import { scheduleJob } from "node-schedule";
import { logger, level } from "../config/logger/logger";
import moment from "moment";
// import Devices from "../models/device.model";
import QrHouses from "../models/qrhouse.model";
import attendance from "../models/attendance.model";
// import deviceHistory from "../models/deviceHistory.model";
// import * as DeviceSrv from "../services/device/device.service";
const JOB_TIME = "30 08 * * *";   //"30 17 * * *"
const MIN = 15; // this minute ago data should be update

scheduleJob(JOB_TIME, async (fireDate) => {
  logger.log(
    level.info,
    `>> Device state supposed to run at ${moment(
      fireDate
    ).format()} , but actually ran at ${moment().format()}`
  );
    var currentdatetime=new Date().toLocaleString("en-US", {
        timeZone: "Asia/calcutta",
      })
      console.log("currentdatetime",currentdatetime)
  try {
    let isattendancerecordsexist=await attendance.findData({"loggedoutdatetime":{$exists:false}})
    for(let i=0;i<isattendancerecordsexist.length;i++)
    {
        console.log(isattendancerecordsexist[i])

        let dt1=new Date(isattendancerecordsexist[i].loggedindatetime);
        let dt2= new Date(currentdatetime) 
        console.log("dt1",dt1)
        console.log("dt2",dt2)
        var diff =(dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60);
        console.log("diff",Number(diff.toFixed(1)))
        console.log(typeof Number(diff.toFixed(1)))
        console.log(Math.abs(Math.round(diff)));
        
        let updatedRecord= await attendance.updateData({_id:isattendancerecordsexist[i]._id},{
            loggedoutdatetime:dt2,
            loggeouttime:moment
              .tz(moment().format(), "Asia/calcutta")
              .format("HH:MM:SS"),
              workinghours:Number(diff.toFixed(1))
            })
    }
  } catch (error) {
    logger.log(level.error, `>> Device state JOB error ${error}`);
  }

  logger.log(
    level.info,
    `>> Device state JOB executed successfully at ${moment().format()}`
  );
});

