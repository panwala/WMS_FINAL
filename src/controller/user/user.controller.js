import Users from "../../models/user.model";
import QrHouses from "../../models/qrhouse.model";
import attendance from "../../models/attendance.model";
import Roles from "../../models/role.model";
import moment from "moment-timezone";
// import Vehicles from "../../models/vechicle.model";
// import Rolespermission from "../../models/roles_permission.model";
// const client = require("twilio")(
//   "AC3456b4c0c25aa698404ac6e6305d90f0",
//   "d207acd630da1d97d14561c9846ad729"
// );
const client = require("twilio")(
  "ACcb836729333f607e0f276c5aaca57011",
  "5cc6ff3b5dc1dc08af5c9f98b3ef0375" 
);
const { encode, decode } = require("../../middleware/crypt");
// const crypto = require("crypto");
import nodemailer from "nodemailer";
import { handleResponse, encrypt, decrypt } from "../../helpers/utility";
import {
  BadRequestError,
  InternalServerError,
  // handleError,
  UnauthorizationError,
} from "../../helpers/errors/custom-error";
// var otpGenerator = require("otp-generator");
const mongoose = require("mongoose");
import { logger, level } from "../../config/logger/logger";

export const  register = async (req, res, next) => {
  logger.log(level.info, `✔ Controller register()`);
  try {
    const hashPwd = await encrypt(req.body.password);
    let userData = {
      ...req.body,
      password: hashPwd,
    };
    console.log("userData", userData);
    let ans = await Users.createData(userData);
    console.log("ans", ans);
    let dataObject = { message: "User created succesfully" };
    return handleResponse(res, dataObject, 201);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

// export const login = async (req, res, next) => {
//   logger.log(level.info, `✔ Controller login()`);
//   function AddMinutesToDate(date, minutes) {
//     return new Date(date.getTime() + minutes * 60000);
//   }
//   try {
//     const { email, type } = req.body;
//     if (type === "email") {
//       let userData = await Users.findOneDocument({ email });
//       if (!userData) {
//         throw new Error("You dont have account registerd with us");
//       }
//       const otp = Math.floor(100000 + Math.random() * 900000);
//       const now = new Date();
//       const expiration_time = AddMinutesToDate(now, 10);
//       let startDate = JSON.stringify(userData.last_otp_time); //.split("T");
//       let endDate = JSON.stringify(new Date()); //.split();
//       startDate = startDate.split("T");
//       endDate = endDate.split("T");
//       console.log("startDate", startDate);
//       console.log("endDate", endDate);
//       let start = startDate[1].split(":");
//       let end = endDate[1].split(":");
//       console.log("start", start, end);
//       var startDates = new Date(0, 0, 0, start[0], start[1], 0);
//       var endDates = new Date(0, 0, 0, end[0], end[1], 0);
//       var diff = endDates.getTime() - startDates.getTime();
//       var hours = Math.floor(diff / 1000 / 60 / 60);
//       diff -= hours * 1000 * 60 * 60;
//       var minutes = Math.floor(diff / 1000 / 60);
//       console.log("minutes", minutes);
//       // let dateDifference=
//       if (userData.otp_counter === 3 && minutes < 3) {
//         throw new Error(
//           "You have reached maximum limit.Please try again after some time"
//         );
//       }
//       if (minutes < 3) {
//         let newTotal = Number(userData.otp_counter) + Number(1);
//         await Users.updateData(
//           { email },
//           { last_otp_time: new Date(), otp_counter: newTotal }
//         );
//       } else {
//         await Users.updateData({ email }, { last_otp_time: new Date() });
//       }
//       const otp_instance = await OTPS.createData({
//         otp: otp,
//         expiration_time: expiration_time,
//       });
//       var details = {
//         timestamp: now,
//         check: email,
//         success: true,
//         message: "OTP sent to user",
//         otp_id: otp_instance._id,
//       };
//       const encoded = await encode(JSON.stringify(details));
//       let transporter = nodemailer.createTransport({
//         service: "gmail",
//         port: 25,
//         secure: true,
//         auth: {
//           user: "sensietech12@gmail.com",
//           pass: "xhyyfztrknrptrfi",
//         },
//       });

//       const mailOptions = {
//         from: '"sensietech12@gmail.com" <your@email.com>',
//         to: `${email}`,
//         subject: "Verification Email",
//         text: `Your OTP is ${otp}`,
//       };

//       await transporter.verify();

//       //Send Email
//       await transporter.sendMail(mailOptions, (err /*response*/) => {
//         if (err) {
//           throw new Error("Fail to Send OTP");
//         } else {
//           let dataObject = {
//             message: "OTP sent successfully.",
//             data: encoded,
//           };
//           return handleResponse(res, dataObject);
//         }
//       });
//     } else if (type === "sms") {
//       const { phone_number } = req.body;
//       let userData = await Users.findOneDocument({ mobile_no: phone_number });
//       if (!userData) {
//         throw new Error("You dont have account registerd with us");
//       }
//       const otp = Math.floor(100000 + Math.random() * 900000);
//       const now = new Date();
//       const expiration_time = AddMinutesToDate(now, 10);
//       let startDate = JSON.stringify(userData.last_otp_time); //.split("T");
//       let endDate = JSON.stringify(new Date()); //.split();
//       startDate = startDate.split("T");
//       endDate = endDate.split("T");
//       console.log("startDate", startDate);
//       console.log("endDate", endDate);
//       let start = startDate[1].split(":");
//       let end = endDate[1].split(":");
//       console.log("start", start, end);
//       startDates = new Date(0, 0, 0, start[0], start[1], 0);
//       endDates = new Date(0, 0, 0, end[0], end[1], 0);
//       diff = endDates.getTime() - startDates.getTime();
//       hours = Math.floor(diff / 1000 / 60 / 60);
//       diff -= hours * 1000 * 60 * 60;
//       minutes = Math.floor(diff / 1000 / 60);
//       console.log("minutes", minutes);
//       // let dateDifference=
//       if (userData.otp_counter === 3 && minutes < 3) {
//         throw new Error(
//           "You have reached maximum limit.Please try again after some time"
//         );
//       }
//       if (minutes < 3) {
//         let newTotal = Number(userData.otp_counter) + Number(1);
//         await Users.updateData(
//           { mobile_no: phone_number },
//           { last_otp_time: new Date(), otp_counter: newTotal }
//         );
//       } else {
//         await Users.updateData(
//           { mobile_no: phone_number },
//           { last_otp_time: new Date() }
//         );
//       }
//       //Create OTP instance in DB
//       const otp_instance = await OTPS.createData({
//         otp: otp,
//         expiration_time: expiration_time,
//       });
//       // Create details object containing the phone number and otp id
//       var details1 = {
//         timestamp: now,
//         check: phone_number,
//         success: true,
//         message: "OTP sent to user",
//         otp_id: otp_instance._id,
//       };
//       const encoded = await encode(JSON.stringify(details1));
//       console.log("REached Here1");
//       let demo = "OTP IS " + otp;
//       let demo1=await client.messages
//       .create({
//          body: demo,
//          from: '+19854418589',
//          to: `$+91${phone_number}`
//        })
//        console.log("twillio",demo1)
//        let dataObject = {
//               message: "OTP sent successfully.",
//               data: encoded,
//             };
//             return handleResponse(res, dataObject);
//       // client.messages
//       //   .create({
//       //     body: demo,
//       //     messagingServiceSid: "MGcec6fa78524ee55215739a5a9b5c600a",
//       //     to: `$91${phone_number}`,
//       //   })
//       //   .then((message) => {
//       //     console.log("message", message);
//       //     console.log(message.sid);
//       //     let dataObject = {
//       //       message: "OTP sent successfully.",
//       //       data: encoded,
//       //     };
//       //     return handleResponse(res, dataObject);
//       //   })
//       //   .done();
//     }
//   } catch (e) {
//     if (e && e.message) return next(new BadRequestError(e.message));
//     logger.log(level.error, `Error: ${JSON.stringify(e)}`);
//     return next(new InternalServerError());
//   }
// };
// var dates = {
//   convert: function (d) {
//     // Converts the date in d to a date-object. The input can be:
//     //   a date object: returned without modification
//     //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
//     //   a number     : Interpreted as number of milliseconds
//     //                  since 1 Jan 1970 (a timestamp)
//     //   a string     : Any format supported by the javascript engine, like
//     //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
//     //  an object     : Interpreted as an object with year, month and date
//     //                  attributes.  **NOTE** month is 0-11.
//     return d.constructor === Date
//       ? d
//       : d.constructor === Array
//       ? new Date(d[0], d[1], d[2])
//       : d.constructor === Number
//       ? new Date(d)
//       : d.constructor === String
//       ? new Date(d)
//       : typeof d === "object"
//       ? new Date(d.year, d.month, d.date)
//       : NaN;
//   },
//   compare: function (a, b) {
//     // Compare two dates (could be of any type supported by the convert
//     // function above) and returns:
//     //  -1 : if a < b
//     //   0 : if a = b
//     //   1 : if a > b
//     // NaN : if a or b is an illegal date
//     return isFinite((a = this.convert(a).valueOf())) &&
//       isFinite((b = this.convert(b).valueOf()))
//       ? (a > b) - (a < b)
//       : NaN;
//   },
//   inRange: function (d, start, end) {
//     // Checks if date in d is between dates in start and end.
//     // Returns a boolean or NaN:
//     //    true  : if d is between start and end (inclusive)
//     //    false : if d is before start or after end
//     //    NaN   : if one or more of the dates is illegal.
//     return isFinite((d = this.convert(d).valueOf())) &&
//       isFinite((start = this.convert(start).valueOf())) &&
//       isFinite((end = this.convert(end).valueOf()))
//       ? start <= d && d <= end
//       : NaN;
//   },
// };
// export const verifyOTP = async (req, res, next) => {
//   try {
//     logger.log(level.info, `✔ Controller verifyOTP()`);

//     var currentdate = new Date();
//     const { verification_key, otp, check } = req.body;

//     if (!verification_key) {
//       throw new Error("Verification Key not provided");
//     }
//     if (!otp) {
//       throw new Error("OTP not Provided");
//     }
//     if (!check) {
//       throw new Error("Check not Provided");
//     }

//     let decoded;

//     //Check if verification key is altered or not and store it in variable decoded after decryption
//     try {
//       decoded = await decode(verification_key);
//     } catch (err) {
//       throw new Error("Bad Request");
//     }

//     var obj = JSON.parse(decoded);
//     const check_obj = obj.check;

//     // Check if the OTP was meant for the same email or phone number for which it is being verified
//     if (check_obj != check) {
//       throw new Error(
//         "OTP was not sent to this particular email or phone number"
//       );
//     }
//     console.log("obj", obj);
//     const checkOTPDatainDB = await OTPS.findData(
//       {
//         _id: obj.otp_id,
//         verified: { $ne: true },
//       },
//       { createdAt: 0 },
//       { sort: { createdAt: -1 }, limit: 1 }
//     );
//     console.log("checkOTPDatainDB", checkOTPDatainDB);
//     if (!checkOTPDatainDB && checkOTPDatainDB.length > 0) {
//       throw new Error("Bad Request");
//     }
//     let otp_instance = checkOTPDatainDB[0];
//     console.log("otp_instance", otp_instance);
//     //Check if OTP is available in the DB
//     if (otp_instance != null) {
//       //Check if OTP is already used or not
//       if (otp_instance.verified != true) {
//         console.log(otp_instance.expiration_time);
//         console.log(currentdate);
//         //Check if OTP is expired or not
//         if (dates.compare(otp_instance.expiration_time, currentdate) == 1) {
//           //Check if OTP is equal to the OTP in the DB
//           if (otp === otp_instance.otp) {
//             // Mark OTP as verified or used
//             await OTPS.updateData(
//               { _id: otp_instance._id },
//               { verified: true }
//             );
//             console.log("Number", typeof obj.check);
//             console.log("answer", typeof obj.check === "string");
//             //string
//             let query = { mobile_no:parseInt(obj.check) };
//             await Users.updateData(query, {
//               last_otp_time: new Date(),
//               otp_counter: 0,
//             });
//             // let userData = await Users.findOneDocument(query);
//             const userData = await Users.aggregate([
//               {
//                 $match: {
//                   mobile_no:parseInt(obj.check) ,
//                 },
//               },
//               {
//                 $lookup: {
//                   from: "roles",
//                   localField: "roleId",
//                   foreignField: "_id",
//                   as: "demo",
//                 },
//               },
//               {
//                 $unwind: "$demo",
//               },
//               {
//                 $replaceRoot: {
//                   newRoot: {
//                     userId: {
//                       $concat: [{ $toString: "$_id" }],
//                     },
//                     Name: {
//                       $concat: ["$Name"],
//                     },
//                     licenseno: {
//                       $concat: ["$licenseno"],
//                     },
//                     userName: {
//                       $concat: ["$userName"],
//                     },
//                     password: {
//                       $concat: ["$password"],
//                     },
//                     mobile_no: {
//                       $toLong: ["$mobile_no"],
//                     },
//                     Address: {
//                       $concat: ["$Address"],
//                     },
//                     adharcard: {
//                       $concat: ["$adharcard"],
//                     },
//                     gender: {
//                       $concat: ["$gender"],
//                     },
//                     DOB: {
//                       $toDate: ["$DOB"],
//                     },
//                     roleId: {
//                       $concat: [{ $toString: "$roleId" }],
//                     },
//                     wardId: {
//                       $concat: [{ $toString: "$wardId" }],
//                     },
//                     nagarparlikaId: {
//                       $concat: [{ $toString: "$nagarparlikaId" }],
//                     },
//                     role: {
//                       $concat: ["$demo.title"],
//                     },
//                   },
//                 },
//               },
//             ])
//             console.log("userData", userData);
//             console.log("userData", userData._id);
//             // let customerVechicleData = await Vehicles.aggregate([
//             //   {
//             //     $match: {
//             //       customerId: { $in: [userData._id] },
//             //     },
//             //   },
//             // ]);
//             // let vechicleData = await Vehicles.aggregate([
//             //   {
//             //     $match: {
//             //       $or: [
//             //         {
//             //           customerId: {
//             //             $in: [userData._id],
//             //           },
//             //         },
//             //         {
//             //           subCustomerId: {
//             //             $in: [userData._id],
//             //           },
//             //         },
//             //       ],
//             //     },
//             //   },
//             // ]);
//             // console.log("vehicleData", vechicleData);
//             let dataObject = {
//               message: "OTP verified successfully.",
//               data: {
//                 userData: userData,
//                 // vechicleData: vechicleData,
//                 // is_owner: customerVechicleData.length > 0 ? true : false,
//               },
//             };
//             return handleResponse(res, dataObject);
//           } else {
//             throw new Error("OTP NOT Matched");
//           }
//         } else {
//           throw new Error("OTP Expired");
//         }
//       } else {
//         throw new Error("OTP Already Used");
//       }
//     } else {
//       throw new Error("Bad Request");
//     }
//   } catch (e) {
//     if (e && e.message) return next(new BadRequestError(e.message));
//     logger.log(level.error, `Error: ${JSON.stringify(e)}`);
//     return next(new InternalServerError());
//   }
// };
// export const removeSingleUser = async (req, res, next) => {
//   try {
//     logger.log(level.info, `✔ Controller removeSingleUser()`);

//     const query = { _id: req.params.userId };
//     /*let removedData =*/ await Users.deleteData(query);
//     let dataObject = {
//       message: "user deleted successfully.",
//       // data: removedData,
//     };
//     return handleResponse(res, dataObject);
//   } catch (e) {
//     if (e && e.message) return next(new BadRequestError(e.message));
//     logger.log(level.error, `Error: ${JSON.stringify(e)}`);
//     return next(new InternalServerError());
//   }
// };
// export const getAllUser = async (req, res, next) => {
//   try {
//     logger.log(level.info, `✔ Controller getAllUser()`);
//     const userData = await Users.aggregate([
//       {
//         $lookup: {
//           from: "roles",
//           localField: "roleId",
//           foreignField: "_id",
//           as: "demo",
//         },
//       },
//       {
//         $unwind: {
//           path: "$demo",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $replaceRoot: {
//           newRoot: {
//             userId: {
//               $concat: [
//                 {
//                   $toString: "$_id",
//                 },
//               ],
//             },
//             first_Name: {
//               $concat: ["$first_Name"],
//             },
//             licenseno: {
//               $concat: ["$licenseno"],
//             },
//             last_Name: {
//               $concat: ["$last_Name"],
//             },
//             email: {
//               $concat: ["$email"],
//             },
//             Address: {
//               $concat: ["$Address"],
//             },
//             password: {
//               $concat: ["$password"],
//             },
//             adharcard: {
//               $concat: ["$adharcard"],
//             },
//             gender: {
//               $concat: ["$gender"],
//             },
//             DOB: {
//               $toDate: ["$DOB"],
//             },
//             mobile_no: {
//               $toLong: ["$mobile_no"],
//             },
//             GSTNO: {
//               $concat: ["$GSTNO"],
//             },
//             roleId: {
//               $concat: [
//                 {
//                   $toString: "$roleId",
//                 },
//               ],
//             },
//             role: {
//               $concat: ["$demo.title"],
//             },
//           },
//         },
//       },
//     ]);
//     let dataObject = {
//       message: "user details fetched successfully.",
//       data: userData,
//       count: userData.length,
//     };
//     return handleResponse(res, dataObject);
//   } catch (e) {
//     if (e && e.message) return next(new BadRequestError(e.message));
//     logger.log(level.error, `Error: ${JSON.stringify(e)}`);
//     return next(new InternalServerError());
//   }
// };
export const getSingleUser = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller getSingleUser()`);
    const userData = await Users.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.userId),
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "roleId",
          foreignField: "_id",
          as: "demo",
        },
      },
      {
        $unwind: {
          path: "$demo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            userId: {
              $concat: [
                {
                  $toString: "$_id",
                },
              ],
            },
            first_Name: {
              $concat: ["$first_Name"],
            },
            licenseno: {
              $concat: ["$licenseno"],
            },
            last_Name: {
              $concat: ["$last_Name"],
            },
            email: {
              $concat: ["$email"],
            },
            Address: {
              $concat: ["$Address"],
            },
            password: {
              $concat: ["$password"],
            },
            GSTNO: {
              $concat: ["$GSTNO"],
            },
            adharcard: {
              $concat: ["$adharcard"],
            },
            gender: {
              $concat: ["$gender"],
            },
            DOB: {
              $toDate: ["$DOB"],
            },
            mobile_no: {
              $toLong: ["$mobile_no"],
            },
            roleId: {
              $concat: [
                {
                  $toString: "$roleId",
                },
              ],
            },
            role: {
              $concat: ["$demo.title"],
            },
          },
        },
      },
    ]);
    let dataObject = {
      message: "user details fetched successfully.",
      data: userData,
      // count: userData.length,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const updateSingleUser = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller updateSingleUser()`);
    let {
      name,
      adharno,
      drivinglicenseno,
      email,
      password,
      mobile_no,
      username,
      gender,
      DOB,
      nagarpalikaId,
      wardId,
      roleId,
      is_registered,
      cosanitarymemeberId,
      designation
    } = req.body;
    let updateDeviceObject = {
      name,
      adharno,
      drivinglicenseno,
      email,
      password,
      mobile_no,
      username,
      gender,
      DOB,
      nagarpalikaId,
      wardId,
      roleId,
      is_registered,
      cosanitarymemeberId,
      designation
    };
    if (password) {
      password = await encrypt(password);
      updateDeviceObject = {
        ...updateDeviceObject,
        password,
      };
    }
    let userData = await Users.updateData(
      { _id: mongoose.Types.ObjectId(req.params.userId) },
      updateDeviceObject
    );
    let dataObject = {
      message: "user details updated successfully.",
      data: userData,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

// export const setPasswordResetLink = async (req, res, next) => {
//   try {
//     logger.log(level.info, `✔ Controller setPasswordResetLink()`);
//     const { email } = req.body;
//     const user = await Users.findOneDocument({ email });
//     if (!user) {
//       throw new Error("User does not exist");
//     }
//     let token = await Tokens.findOneDocument({ userId: user._id });
//     if (token) await token.deleteOne();
//     let resetToken = crypto.randomBytes(32).toString("hex");
//     const hash = await encrypt(resetToken);
//     await Tokens.createData({
//       userId: user._id,
//       token: hash,
//       createdAt: Date.now(),
//     });
//     const link = `http://161.97.183.206/reset-password/${resetToken}/${user._id}`;
//     let transporter = nodemailer.createTransport({
//       service: "gmail",
//       port: 25,
//       secure: true,
//       auth: {
//         user: "digi5technologies@gmail.com",
//         pass: "osuvgltfiefskdcm",
//       },
//     });
//     let mailOptions = {
//       from: '"digi5technologies@gmail.com" <your@email.com>', // sender address
//       to: `${email}`, // list of receivers
//       subject: "Password Reset Request", // Subject line
//       text: "Hello world?", // plain text body
//       html: link, // html body
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log("error in sending", error);
//       } else {
//         console.log("no error");
//       }
//     });
//     let dataObject = {
//       message: "Reset password link  sent successfully.Kindly check your email",
//       // data: userData,
//     };
//     return handleResponse(res, dataObject);
//   } catch (e) {
//     if (e && e.message) return next(new BadRequestError(e.message));
//     logger.log(level.error, `Error: ${JSON.stringify(e)}`);
//     return next(new InternalServerError());
//   }
// };
// export const resetPassword = async (req, res, next) => {
//   try {
//     logger.log(level.info, `✔ Controller resetPassword ()`);
//     const { userId, token, password } = req.body;
//     console.log(req.body);
//     let passwordResetToken = await Tokens.findOneDocument({ userId });
//     if (!passwordResetToken) {
//       throw new Error("Invalid or expired password reset token");
//     }
//     const isValid = await decrypt(token, passwordResetToken.token);
//     console.log("result", isValid);
//     if (!isValid) {
//       throw new Error("Invalid or expired password reset token");
//     }
//     const hash = await encrypt(password);
//     console.log("hashpassword", hash);
//     await Users.updateData({ _id: userId }, { $set: { password: hash } });
//     const user = await Users.findOneDocument({ _id: userId });
//     let transporter = nodemailer.createTransport({
//       service: "gmail",
//       port: 25,
//       secure: true,
//       auth: {
//         user: "digi5technologies@gmail.com",
//         pass: "osuvgltfiefskdcm",
//       },
//     });
//     const output = `
//     <h2>Hello</h2>
//     <h3>The Request for password change for account has been successully executed. If not done by you kindly contact</h3>
//     <h4>Regards, <h4>
//    <h4>Bacancy Systems</h4>`;
//     let mailOptions = {
//       from: '"digi5technologies@gmail.com" <your@email.com>', // sender address
//       to: `${user.email}`, // list of receivers
//       subject: "Account Password Changed ", // Subject line
//       text: "Hello world?", // plain text body
//       html: output, // html body
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log("error in sending", error);
//       } else {
//         console.log("no error");
//       }
//     });
//     await passwordResetToken.deleteOne();
//     let dataObject = {
//       message: "Password Changed Successfully",
//       // data: userData,
//     };
//     return handleResponse(res, dataObject);
//   } catch (e) {
//     if (e && e.message) return next(new BadRequestError(e.message));
//     logger.log(level.error, `Error: ${JSON.stringify(e)}`);
//     return next(new InternalServerError());
//   }
// };

export const Registrationworkerlogin = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controllerr Registrationworkerlogin()`);
    const { mobile_no, password } = req.body;
    let data = await Users.aggregate([
      {
        $match: {
          mobile_no,
        },
      },
      {
        '$lookup': {
          'from': 'nagarpalikas', 
          'localField': 'nagarpalikaId', 
          'foreignField': '_id', 
          'as': 'nagarpalikadata'
        }
      }, {
        '$unwind': {
          'path': '$nagarpalikadata', 
          'preserveNullAndEmptyArrays': true
          }
        },
        {
          '$lookup': {
            'from': 'wards', 
            'localField': 'wardId', 
            'foreignField': '_id', 
            'as': 'warddata'
          }
        }, {
          '$unwind': {
            'path': '$warddata', 
            'preserveNullAndEmptyArrays': true
            }
          },
          {
            '$lookup': {
              'from': 'roles', 
              'localField': 'roleId', 
              'foreignField': '_id', 
              'as': 'roledata'
            }
          }, {
            '$unwind': {
              'path': '$roledata', 
              'preserveNullAndEmptyArrays': true
              }
            },
            {
              '$lookup': {
                'from': 'qrhouses', 
                'localField': '_id', 
                'foreignField': 'registrationmemberId', 
                'as': 'registeredqrhousedata'
              }
            },
            {
              '$project': {
                "_id":1,
                'count': {
                  '$size': '$registeredqrhousedata'
                },
                "name":1,
                "adharno":1,
                "drivinglicenseno":1,
                "username":1,
                "email":1,
                'mobile_no': 1,
                "gender":1,
                "DOB":1,
                "roledata":1,
                "warddata":1,
                "nagarpalikadata":1,
                "password":1,
                "is_registered":1,
                "designation":1
              }
            }
    ]);
    // console.log(data)
    if(data.length>0)
    {
      console.log("userData", data[0]);
      const validateUserData = await decrypt(password, data[0].password);
      if (validateUserData) {
        data=data[0]
        console.log("data",data)
        let registeredHouseCount= await QrHouses.aggregate([
          {
            '$match': {
              'registrationmemberId': mongoose.Types.ObjectId(data._id)
            }
          }, {
            $group: {
              _id: { housetype: "$housetype" },
              Devicecount: { $sum: 1 },
            },
          },
        ])
        var dates223 = new Date(
          moment().tz("Asia/calcutta").format("YYYY-MM-DD")
        );
        let todayregisteredHouseCount= await QrHouses.aggregate([
          {
            '$match': {
              'registrationmemberId': mongoose.Types.ObjectId(data._id),
              'updatedAt': {
                $gte:  new Date (dates223),
                $lte: new Date (new Date(dates223).setHours(23, 59, 59)),
              },
            }
          }
        ])
        data["registeredqrhousetoday"]=todayregisteredHouseCount.length
        console.log("dates223", new Date(new Date(dates223)));
        console.log("dates223", new Date (new Date(dates223).setHours(23, 59, 59)));
        console.log("todayregisteredHouseCount",todayregisteredHouseCount)
        data["residentialqrcodescount"]=0;
        data["commercialqrcodescount"]=0;
        for(let i=0;i<registeredHouseCount.length;i++)
        {
              if(registeredHouseCount[i]["_id"]["housetype"] == "0")
              {
                data["residentialqrcodescount"]=registeredHouseCount[i]["Devicecount"]
              }
              else if(registeredHouseCount[i]["_id"]["housetype"] == "1")
              {
                data["commercialqrcodescount"]=registeredHouseCount[i]["Devicecount"]
              }
        }
          // data.count=1
          // console.log("userData", data);
          // console.log("hi",registeredHouseCount[0]["_id"])
      // console.log("registeredHouseCount",registeredHouseCount)
        let dataObject = {
          message: "User login successfully.",
          // count:registeredHouseCount,
          data
        };
        return handleResponse(res, dataObject);
      }
  }
    return next(new UnauthorizationError());
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const Adminlogin = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controllerr Adminlogin()`);
    const { email, password } = req.body;
    let data = await Users.aggregate([
      {
        $match: {
          email,
        },
      },  {
            '$lookup': {
              'from': 'roles', 
              'localField': 'roleId', 
              'foreignField': '_id', 
              'as': 'roledata'
            }
          }, {
            '$unwind': {
              'path': '$roledata', 
              'preserveNullAndEmptyArrays': true
              }
            },
            {
              '$project': {
                "_id":1,
                "name":1,
                "adharno":1,
                "drivinglicenseno":1,
                "username":1,
                "email":1,
                'mobile_no': 1,
                "gender":1,
                "DOB":1,
                "roledata":1,
                "warddata":1,
                "nagarpalikadata":1,
                "password":1,
                "is_registered":1,
                "designation":1
              }
            }
    ]);
    // console.log(data)
    if(data.length>0)
    {
      console.log("userData", data[0]);
      const validateUserData = await decrypt(password, data[0].password);
      if (validateUserData) {
        data=data[0]
      console.log("userData", data);
        let dataObject = {
          message: "Admin login successfully.",
          data
        };
        return handleResponse(res, dataObject);
      }
  }
    return next(new UnauthorizationError());
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};
export const getAllUserRoleWise = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controller getAllUserRoleWise()`);
    var userDatacount;
    let answer1 = req.body.nagarpalikaId
    ? mongoose.Types.ObjectId(req.body.nagarpalikaId)
    : {
        $nin: [],
      };
      let answer2 = req.body.wardId
      ? mongoose.Types.ObjectId(req.body.wardId)
      : {
          $nin: [],
        };
        let answer3 = req.body.roleId
      ? mongoose.Types.ObjectId(req.body.roleId)
      : {
          $nin: [],
        };
        if(req.body.search)
        {
          let demo=await Users.aggregate([
            {
              $match: {
                  'roleId': answer3,
                  'nagarpalikaId': answer1, 
                  'wardId': answer2
              },
            },
            {
              $lookup: {
                from: "roles",
                localField: "roleId",
                foreignField: "_id",
                as: "demo",
              },
            },
            {
              $unwind: {
                path: "$demo",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
            '$lookup': {
              'from': 'nagarpalikas', 
              'localField': 'nagarpalikaId', 
              'foreignField': '_id', 
              'as': 'nagarpalikadata'
            }
          }, {
            '$lookup': {
              'from': 'wards', 
              'localField': 'wardId', 
              'foreignField': '_id', 
              'as': 'warddata'
            }
          }, {
            '$unwind': {
              'path': '$nagarpalikadata', 
              'preserveNullAndEmptyArrays': true
            }
          }, {
            '$unwind': {
              'path': '$warddata', 
              'preserveNullAndEmptyArrays': true
            }
          },
          {
      '$match': {
        '$or': [
          {
            'name':req.body.search ?  {
              '$regex': req.body.search ?  req.body.search :"",
              '$options': 'i'
            } :{
              '$nin': []
            }
          }, {
            'nagarpalikadata.nagarpalikaname': req.body.search ? {
              '$regex': req.body.search ?  req.body.search :"",
              '$options': 'i'
            }:{
              '$nin': []
            }
          }, {
            'warddata.wardno':req.body.search ? {
              '$regex': req.body.search ?  req.body.search :"",
              '$options': 'i'
            }:{
              '$nin': []
            }
          }
        ]
      }
    }])
          console.log("demo.length",demo.length)
          userDatacount=demo.length == 0 ? 10 : demo.length
          console.log("userDatacount",userDatacount)
        }
        else
        {
             userDatacount=await Users.fetchCount({
              'roleId': answer3,
              'nagarpalikaId': answer1, 
              'wardId': answer2
          })
          userDatacount=userDatacount == 0 ? 10 : userDatacount
        }
        console.log("userDatacount",userDatacount)
    const userData = await Users.aggregate([
      {
        $match: {
            'roleId': answer3,
            'nagarpalikaId': answer1, 
            'wardId': answer2
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "roleId",
          foreignField: "_id",
          as: "demo",
        },
      },
      {
        $unwind: {
          path: "$demo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
      '$lookup': {
        'from': 'nagarpalikas', 
        'localField': 'nagarpalikaId', 
        'foreignField': '_id', 
        'as': 'nagarpalikadata'
      }
    }, {
      '$lookup': {
        'from': 'wards', 
        'localField': 'wardId', 
        'foreignField': '_id', 
        'as': 'warddata'
      }
    }, {
      '$unwind': {
        'path': '$nagarpalikadata', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$unwind': {
        'path': '$warddata', 
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      '$match': {
        '$or': [
          {
            'name':req.body.search ?  {
              '$regex': req.body.search ?  req.body.search :"",
              '$options': 'i'
            } :{
              '$nin': []
            }
          }, {
            'nagarpalikadata.nagarpalikaname': req.body.search ? {
              '$regex': req.body.search ?  req.body.search :"",
              '$options': 'i'
            }:{
              '$nin': []
            }
          }, {
            'warddata.wardno':req.body.search ? {
              '$regex': req.body.search ?  req.body.search :"",
              '$options': 'i'
            }:{
              '$nin': []
            }
          }
        ]
      }
    },
    {
      '$skip': req.query.skip ? parseInt(req.query.skip) : 0
      },
      {
      '$limit': req.query.limit ? parseInt(req.query.limit) : userDatacount
      }
    ]);
    let dataObject = {
      message: "Details fetched successfully.",
      data: userData,
      count: userDatacount,
    };
    return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

export const fetchregisteredqrcodescountofregisrationworker = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controllerr fetchregisteredqrcodescountofregisrationworker()`);
    const { registrationmemberId } = req.body;
    var data={}
        let registeredHouseCount= await QrHouses.aggregate([
          {
            '$match': {
              'registrationmemberId': mongoose.Types.ObjectId(registrationmemberId)
            }
          }, {
            $group: {
              _id: { housetype: "$housetype" },
              Devicecount: { $sum: 1 },
            },
          }
        ])
        var dates223 = new Date(
          moment().tz("Asia/calcutta").format("YYYY-MM-DD")
        );
        let todayregisteredHouseCount= await QrHouses.aggregate([
          {
            '$match': {
              'registrationmemberId': mongoose.Types.ObjectId(registrationmemberId),
              'updatedAt': {
                $gte:  new Date (dates223),
                $lte: new Date (new Date(dates223).setHours(23, 59, 59)),
              },
            }
          }
        ])
        data["registeredqrhousetoday"]=todayregisteredHouseCount.length
        console.log("dates223", new Date(new Date(dates223)));
        console.log("dates223", new Date (new Date(dates223).setHours(23, 59, 59)));
        console.log("todayregisteredHouseCount",todayregisteredHouseCount)
        data["residentialqrcodescount"]=0;
        data["commercialqrcodescount"]=0;
        for(let i=0;i<registeredHouseCount.length;i++)
        {
              if(registeredHouseCount[i]["_id"]["housetype"] == "0")
              {
                data["residentialqrcodescount"]=registeredHouseCount[i]["Devicecount"]
              }
              else if(registeredHouseCount[i]["_id"]["housetype"] == "1")
              {
                data["commercialqrcodescount"]=registeredHouseCount[i]["Devicecount"]
              }
              console.log("i",i)
        }
        data["count"]=parseInt(data["residentialqrcodescount"])
        +
        parseInt(data["commercialqrcodescount"])
      console.log("data", data);
      console.log("registeredHouseCount",registeredHouseCount)
        let dataObject = {
          message: "Count fetched succesfully.",
          data
          // data
        };
        return handleResponse(res, dataObject);
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};


export const sanitaryworkerlogin = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controllerr sanitaryworkerlogin()`);
    const { mobile_no, password ,designation } = req.body;
    let finalArray=[]
    var data = await Users.aggregate([
      {
        $match: {
          mobile_no,
          designation,
        },
      },
      {
        '$lookup': {
          'from': 'nagarpalikas', 
          'localField': 'nagarpalikaId', 
          'foreignField': '_id', 
          'as': 'nagarpalikadata'
        }
      }, {
        '$unwind': {
          'path': '$nagarpalikadata', 
          'preserveNullAndEmptyArrays': true
          }
        },
        {
          '$lookup': {
            'from': 'wards', 
            'localField': 'wardId', 
            'foreignField': '_id', 
            'as': 'warddata'
          }
        }, {
          '$unwind': {
            'path': '$warddata', 
            'preserveNullAndEmptyArrays': true
            }
          },
          {
            '$lookup': {
              'from': 'roles', 
              'localField': 'roleId', 
              'foreignField': '_id', 
              'as': 'roledata'
            }
          }, {
            '$unwind': {
              'path': '$roledata', 
              'preserveNullAndEmptyArrays': true
              }
            },
            {
              '$lookup': {
                'from': 'qrhouses', 
                'localField': '_id', 
                'foreignField': 'registrationmemberId', 
                'as': 'registeredqrhousedata'
              }
            },
            {
              '$project': {
                "_id":1,
                "name":1,
                "adharno":1,
                "drivinglicenseno":1,
                "username":1,
                "email":1,
                'mobile_no': 1,
                "gender":1,
                "DOB":1,
                "roledata":1,
                "warddata":1,
                "nagarpalikadata":1,
                "password":1,
                "is_registered":1,
                "designation":1
              }
            }
    ]);
    console.log(data)
    if(data.length>0)
    {
      console.log("userData", data[0]);
      const validateUserData = await decrypt(password, data[0].password);
      console.log("new Date().toLocaleString(",new Date().toLocaleString("en-US", {
        timeZone: "Asia/calcutta",
      }))
      await attendance.createData({
        nagarpalikaId:data[0].nagarpalikaId,
        wardId:data[0].wardId,
        sanitarymemeberId:data[0]._id,
        loggedindatetime:new Date().toLocaleString("en-US", {
          timeZone: "Asia/calcutta",
        }),
        loggedintime:moment
        .tz(moment().format(), "Asia/calcutta")
        .format("hh:mm:ss"),
      })
      if (validateUserData) {
        var coworkerdata = await Users.aggregate([
          {
            $match: {
              // nagarpalikaId:data[0].nagarpalikadata._id ? data[0].nagarpalikadata._id :"NA",
              // wardId:data[0].warddata._id ? data[0].warddata._id : "NA", 
              cosanitarymemeberId:data[0].cosanitarymemeberId ? data[0].cosanitarymemeberId : "NA",
              designation:req.body.designation == "0" ? "1" :"0",
            },
          },
          {
            '$lookup': {
              'from': 'nagarpalikas', 
              'localField': 'nagarpalikaId', 
              'foreignField': '_id', 
              'as': 'nagarpalikadata'
            }
          }, {
            '$unwind': {
              'path': '$nagarpalikadata', 
              'preserveNullAndEmptyArrays': true
              }
            },
            {
              '$lookup': {
                'from': 'wards', 
                'localField': 'wardId', 
                'foreignField': '_id', 
                'as': 'warddata'
              }
            }, {
              '$unwind': {
                'path': '$warddata', 
                'preserveNullAndEmptyArrays': true
                }
              },
              {
                '$lookup': {
                  'from': 'roles', 
                  'localField': 'roleId', 
                  'foreignField': '_id', 
                  'as': 'roledata'
                }
              }, {
                '$unwind': {
                  'path': '$roledata', 
                  'preserveNullAndEmptyArrays': true
                  }
                },
                {
                  '$lookup': {
                    'from': 'qrhouses', 
                    'localField': '_id', 
                    'foreignField': 'registrationmemberId', 
                    'as': 'registeredqrhousedata'
                  }
                },
                {
                  '$project': {
                    "_id":1,
                    "name":1,
                    "adharno":1,
                    "drivinglicenseno":1,
                    "username":1,
                    "email":1,
                    'mobile_no': 1,
                    "gender":1,
                    "DOB":1,
                    "roledata":1,
                    "warddata":1,
                    "nagarpalikadata":1,
                    "password":1,
                    "is_registered":1,
                    "designation":1
                  }
                }
        ])
        finalArray.push({"logindata":data})
        finalArray.push({"coworkerdata":coworkerdata})
        let dataObject = {
          message: "User login successfully.",
          data:finalArray
        };
        return handleResponse(res, dataObject);
      }
  }
    return next(new UnauthorizationError());
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};


export const checkcosanitaryworkerexist = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controllerr checkcosanitaryworkerexist()`);
    const { cosanitarymemeberId } = req.body;
    let cosanitaryworkerexistcount=await Users.fetchCount({cosanitarymemeberId})
    console.log("cosanitaryworkerexistcount",cosanitaryworkerexistcount)
    if(cosanitaryworkerexistcount>0)
    { 
        throw new Error("This sanitary worker is already assigned")   
    }
    let dataObject = {
      message: "Cosanitary worker is available.",
    };
    return handleResponse(res, dataObject); 
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};



export const deletecosanitaryworkerexist = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controllerr deletecosanitaryworkerexist()`);
    const { cosanitarymemeberId } = req.body;
    let deletecosanitaryworkerexist=await Users.updateMany
    (
      {cosanitarymemeberId:cosanitarymemeberId},
      { $unset: {"cosanitarymemeberId": "" } }
    )
    let dataObject = {
      message: "Cosanitary worker deleted succesfully.",
    };
    return handleResponse(res, dataObject); 
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};


export const fetchsanitaryworkerlist = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controllerr fetchsanitaryworkerlist()`);
    const { designation } = req.body;
    let fetchsanitaryworkerlist=await Users.findData({designation})
    console.log("fetchsanitaryworkerlist",fetchsanitaryworkerlist)
    let dataObject = {
      message: "sanitary worker  list fetched succesfully",
      data:fetchsanitaryworkerlist
    };
    return handleResponse(res, dataObject); 
  } catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};



export const sanitaryworkerlogout = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controllerr sanitaryworkerlogout()`);
    const { sanitarymemeberId, password ,designation } = req.body;
      let isattendancerecordexist=await attendance.findOneDocument({"sanitarymemeberId":mongoose.Types.ObjectId(sanitarymemeberId),"loggedoutdatetime":{$exists:false}})
      console.log("isattendancerecordexist",isattendancerecordexist)
      if(isattendancerecordexist)
      {
        let dt1=new Date(isattendancerecordexist.loggedindatetime);
        let dt2= new Date(new Date().toLocaleString("en-US", {
          timeZone: "Asia/calcutta",
        })) 
        console.log("dt1",dt1)
        console.log("dt2",dt2)
        var diff =(dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60);
        console.log("diff",Number(diff.toFixed(1)))
        console.log(typeof Number(diff.toFixed(1)))
        console.log(Math.abs(Math.round(diff)));
        
       let updatedRecord= await attendance.updateData({_id:isattendancerecordexist._id},{
          loggedoutdatetime:dt2,
          loggeouttime:moment
            .tz(moment().format(), "Asia/calcutta")
            .format("HH:MM:SS"),
            workinghours:Number(diff.toFixed(1))
          })
        

        let dataObject = {
          message: "User logout successfully.",
          data:updatedRecord
        };
        return handleResponse(res, dataObject);
      }
      return next(new BadRequestError("No logged in entry exist for thi sanitary worker"))
      }
     catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};


export const fetchsanitaryworkerattendance = async (req, res, next) => {
  try {
    logger.log(level.info, `✔ Controllerr fetchsanitaryworkerattendance()`);
    const { sanitarymemeberId } = req.body;
    var dates2 = new Date(moment().tz("Asia/calcutta").format("YYYY-MM-DD"));
      dates2.setDate(dates2.getDate() - 1);
      var dates3 = new Date(moment().tz("Asia/calcutta").format("YYYY-MM-DD"));
      dates3.setDate(dates3.getDate() - 8);
      let attendanceRecord=await attendance.aggregate([
        {
          '$match': {
            'sanitarymemeberId': mongoose.Types.ObjectId(sanitarymemeberId),
            loggedindatetime: {
              $gte: new Date(new Date(dates3)),
              $lte: new Date(new Date(dates2).setHours(23, 59, 59)),
            },
          }
        }, {
          '$sort': {
            'loggedindatetime': -1
          }
        }, {
          '$group': {
            '_id': {
              '$dayOfMonth': '$loggedindatetime'
            }, 
            'date': {
              '$first': '$loggedindatetime'
            }, 
            'total': {
              '$sum': '$workinghours'
            }
          }
        }, {
          '$project': {
            'date': 1, 
            'duration': '$total', 
            'status': {
              '$cond': [
                {
                  '$gte': [
                    '$workinghours', 9
                  ]
                }, 'Present', 'Absent'
              ]
            }
          }
        }
      ])
      console.log("aggregation pipeline result",attendanceRecord)
      let defaultgraphData = generateDefaultPropertiesOfWeek(attendanceRecord);
      let mergeArrayResponse = [...attendanceRecord, ...defaultgraphData];
      attendanceRecord = sortResponsePeriodWise(mergeArrayResponse);
      console.log("merger array", attendanceRecord);
        let dataObject = {
          message: "sanitary worker attendance fetched successfully.",
          data:attendanceRecord
        };
        return handleResponse(res, dataObject);
      }
     catch (e) {
    if (e && e.message) return next(new BadRequestError(e.message));
    logger.log(level.error, `Error: ${JSON.stringify(e)}`);
    return next(new InternalServerError());
  }
};

const sortResponsePeriodWise = (array) => {
  let sortedPeriodWiseArray = array.sort(function (a, b) {
    return Number(new Date(a.date)) - Number(new Date(b.date));
  });
  return sortedPeriodWiseArray;
};
const generateDefaultPropertiesOfWeek = (data) => {
  let dates1 = new Date(moment().tz("Asia/calcutta").format("YYYY-MM-DD"));
  console.log("origin timezone Date", dates1);
  let totalDays = [];
  //dates1.setDate(dates.getDate() + 2);
  dates1.setDate(dates1.getDate() - 9);
  console.log(">>++", dates1);
  for (let i = 0; i <= 7; i++) {
    let ansDate = new Date(
      moment(dates1.setDate(dates1.getDate() + 1))
        .tz("Asia/calcutta")
        .format("YYYY-MM-DD")
    ); //.toDateString();
    totalDays.push(ansDate);
  }
  console.log("list of week days", totalDays);
  totalDays = JSON.parse(JSON.stringify(totalDays));
  let dayIncludedInDBResponse = data.map(
    (day) => new Date(moment(day.date).format("YYYY-MM-DD:HH:MM:SS"))
  );
  dayIncludedInDBResponse = JSON.parse(JSON.stringify(dayIncludedInDBResponse));
  dayIncludedInDBResponse = dayIncludedInDBResponse.map(
    (day) => day.split("T")[0]
  );
  totalDays = totalDays.map((day) => day.split("T")[0]);
  console.log(" After dayincluded", dayIncludedInDBResponse);
  console.log("After  daynotincluded", totalDays);
  let dayNotIncludedInDBResponse = totalDays.filter((x) => {
    console.log(dayIncludedInDBResponse.includes(x));
    return !dayIncludedInDBResponse.includes(x);
  });

  console.log("notinculded", dayNotIncludedInDBResponse);
  let generateNotIncludedDayResponse = dayNotIncludedInDBResponse.map((day) => {
    return defaultBatteryPropertyOfWeek(day);
  });
  // console.log("generated response", generateNotIncludedDayResponse);
  return generateNotIncludedDayResponse;
};
const defaultBatteryPropertyOfWeek = (period) => {
  console.log(period);
  let demoDate = new Date(
    moment(period).tz("Asia/calcutta").format("YYYY-MM-DD")
  );
  let data = {
    _id: demoDate.getDate(),
    date: new Date(
      moment(period).tz("Asia/calcutta").format("YYYY-MM-DD")
    ).toISOString(),
    duration: 0,
    status:"Absent"
  };
  return data;
};