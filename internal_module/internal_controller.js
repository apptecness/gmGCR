const util = require("util");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const EnrolledDevices = require("../enrolled_device_module/enrolled_devices_model");
module.exports = {
  fetchGCID: async (req, res, next) => {
    try {
      console.log("i m here fetch GCID locally");
      // console.log(req.params.enrollmentTokenName);
      const enrollmentToken = req.query.enrollmentToken;
      // console.log(enrollmentToken);
      const ress = await EnrolledDevices.find({ enrollmentTokenName: enrollmentToken });
      console.log(ress);
      if (ress.length == 0) {
        return next(createError(400, "Token Does Not Exists So we can not find GCID"));
      } else {
        const gcId = ress[0].name.split("/")[3];
        // console.log(gcId);
        res.status(200).json({ gcId });
      }
    } catch (error) {
      console.log(error.message);
      return next(createError(400, "Internal Server Error"));
      // next(error);
    }
  },

  changer: async (req, res, next) => {
    // console.log("i m here");
    // console.log(req.headers);
    console.log("i m here Changer");
    const allEnrolledDevices = await EnrolledDevices.find();
    for (let i = 0; i < allEnrolledDevices.length; i++) {
      const element = allEnrolledDevices[i];
      await EnrolledDevices.findByIdAndUpdate(element.id, { deviceAddedLocally: true }, { new: true });
    }
    res.status(200).json({ status: "success" });
    try {
    } catch (error) {
      console.log(error.message);
      return next(createError(400, "Internal Server Error"));
    }
  },
  // fetchLocation: async (req, res, next) => {
  //   try {
  //     // console.log(req.query);
  //     const enrollmentToken = req.query.token;
  //     const ress = await EnrolledDevices.find({ enrollmentTokenName: `enterprises/LC01rz5l9l/enrollmentTokens/${enrollmentToken}` });
  //     const deviceIdString = ress[0].name;
  //     const deviceId = deviceIdString.split("/")[3];
  //     const results = await Location.find({ deviceId: deviceId });
  //     res.status(200).json({
  //       results,
  //     });
  //   } catch (error) {
  //     console.log(error.message);
  //     return next(createError(400, "Internal Server Error"));
  //     // next(error);
  //   }
  // },
};
