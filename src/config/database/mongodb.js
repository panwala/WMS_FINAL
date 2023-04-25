import mongoose from "mongoose";
import { logger, level } from "../../config/logger/logger";
import { defaultUserData } from "../../services/user/user.service";
const URL =process.env.MONGO_URL  || "mongodb+srv://wms:UMZ26MgDUYrwmu2T@wms.1uz19vh.mongodb.net/test?authSource=admin&replicaSet=atlas-3nnelh-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
const OPEN_EVENT = "open";
const ERROR_EVENT = "error";

(async () => {
  try {
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    mongoose.set('debug', true)
  } catch (e) {
    logger.log(level.error, `connection error ${e}`);
  }
})();

const db = mongoose.connection;
// initialize(db);
db.once(OPEN_EVENT, async () => {
  logger.log(level.info, `✔ Successfully connected to mongodb database`);
  
  // await defaultUserData();
});
db.on(ERROR_EVENT, () => {
  logger.log(level.error, `connection error while connection at ${URL}`);
});
