const createError = require("http-errors");
const EnrolledDevices = require("./enrolled_devices_model");
const APIFeatures = require("../utils/apifeatures");
const jwt = require("jsonwebtoken");
const allEnrolledDevicesFetcher = require("../busines_logic/allEnrolledDeviceFetcher");
const allEnrolledDeviceFetcherWithPageToken = require("../busines_logic/allEnrolledDeviceFetcherWithPageToken");
const addDeviceLocally = require("../busines_logic/addDeviceLocally");
const checkIfDeviceExists = require("../busines_logic/checkIfDeviceExists");

module.exports = {
  fetchAllEnrolledDevices: async (req, res, next) => {
    try {
      // const gToken = await gTokenCreator();
      console.log("i m here fetch all devices and save");
      // console.log(req.body);
      const values = req.body;
      const gToken = values.token;
      const enterprises = values.enterprises;
      for (let i = 0; i < enterprises.length; i++) {
        const element = enterprises[i];
        console.log(element);

        const response = await allEnrolledDevicesFetcher({
          enterpriseId: element,
          gToken: gToken,
        });
        const devices = response.body.devices;
        console.log(devices.length);
        for (let i = 0; i < devices.length; i++) {
          const element = devices[i];
          await checkIfDeviceExists(element);
        }

        // console.log(response.body.devices);
        console.log(response.body.nextPageToken);
        if (response.body.nextPageToken != undefined) {
          console.log("i m hhhheeeee");
        }
      }

      res.status(200).json({ status: "success" });
    } catch (error) {
      // console.log(error.message);
      return next(createError(400, "Internal Server Error"));
    }
  },

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

  fetchEnDevices: async (req, res, next) => {
    try {
      // console.log("I m here fetch All enrolled devices");
      // const userId = req.user.id;
      var results = await EnrolledDevices.find({ deviceAddedLocally: false });

      res.status(200).json({ results });
    } catch (error) {
      // console.log(error.message);
      return next(createError(400, "Internal Server Error"));
    }
  },
  updateEnDevice: async (req, res, next) => {
    try {
      // console.log("I m here fetch All enrolled devices");
      // const userId = req.user.id;
      const id = req.params.id;
      const data = req.body;
      var results = await EnrolledDevices.findByIdAndUpdate(id, data, { new: true });

      res.status(200).json({ results });
    } catch (error) {
      // console.log(error.message);
      return next(createError(400, "Internal Server Error"));
    }
  },

  enrollmentProcedure: async (req, res, next) => {
    console.log("i m here enrollment Procedure");
    // res.status(200).json({ status: "Success" });
    // console.log(req.headers);
    // console.log(req.body);

    const mainHeader = req.headers;
    const body = req.body;

    let token;

    if (mainHeader.authorization && mainHeader.authorization.startsWith("Bearer")) {
      token = mainHeader.authorization.split(" ")[1];
    }

    if (!token) {
      return next(createError(400, "Invalid request"));
    }
    console.log(token);
    const decoded = jwt.decode(token);
    console.log(decoded);
    const aud = decoded.aud;
    const email = decoded.email;
    const emailVerified = decoded.email_verified;
    console.log(aud);
    console.log(email);
    // console.log(emailVerified);
    // res.status(200).json({ status: "Success" });
    if (emailVerified != true) {
      console.log("i m here 1");
      return next(createError(400, "Invalid request"));
    }
    if (aud != process.env.AUD) {
      console.log("i m here 2");
      return next(createError(400, "Invalid request"));
    }
    if (email != process.env.EMAIL) {
      console.log("i m here 3");
      return next(createError(400, "Invalid request"));
    }

    // const subscription = req.body.subscription;
    if (body.message.attributes == null) {
      console.log("i m here 3a");
      res.status(200).json({ status: "Success" });
    }
    const notificationType = body.message.attributes.notificationType;
    //notificationTypes = ENROLLMENT or USAGE_LOGS
    // console.log(notificationType);

    //Get decoded final data
    const base64stringData = body.message.data; // it is base64 encoded data
    // const base64stringData = "";
    let bufferObj = Buffer.from(base64stringData, "base64");
    let str = bufferObj.toString("utf8");
    const finalData = JSON.parse(str);
    // console.log(finalData);
    try {
      if (notificationType == "ENROLLMENT") {
        const dataMap = {
          name: finalData.name,
          managementMode: finalData.managementMode,
          enrollmentTime: finalData.enrollmentTime,
          state: finalData.state,
          brand: finalData.hardwareInfo.brand,
          model: finalData.hardwareInfo.model,
          serialNumber: finalData.hardwareInfo.serialNumber,
          policyName: finalData.policyName,
          userName: finalData.userName,
          enrollmentTokenName: finalData.enrollmentTokenName,
        };
        console.log(dataMap);
        const enrolledDevice = EnrolledDevices(dataMap);
        await enrolledDevice.save();
        res.status(200).json({ status: "Success" });
      }
      //
      //
      if (notificationType == "USAGE_LOGS") {
        console.log(finalData);
        console.log(finalData["usageLogEvents"][0]["eventType"]);
        if (finalData["usageLogEvents"][0]["eventType"] == "ENROLLMENT_COMPLETE") {
          // console.log("emrollment complete");
          const deviceName = finalData["device"];
          const rsrs = await EnrolledDevices.find({ name: deviceName });
          const enrlDevice = rsrs[0];
          const enrlDeviceId = enrlDevice.id;
          // console.log(rsrs);
          const dataMap = {
            name: enrlDevice.name,
            managementMode: enrlDevice.managementMode,
            enrollmentTime: enrlDevice.enrollmentTime,
            state: enrlDevice.state,
            brand: enrlDevice.brand,
            model: enrlDevice.model,
            serialNumber: enrlDevice.serialNumber,
            policyName: enrlDevice.policyName,
            userName: enrlDevice.userName,
            enrollmentTokenName: enrlDevice.enrollmentTokenName,
          };
          console.log(dataMap);
          var response = await addDeviceLocally({ dataMap });
          console.log(response.status);
          if (response.status == 200) {
            await EnrolledDevices.findByIdAndUpdate(enrlDeviceId, { deviceAddedLocally: true });
            res.status(200).json({ status: "Success" });
          } else {
            res.status(200).json({ status: "Success" });
          }
        } else if (finalData["usageLogEvents"][0]["eventType"] == "STOP_LOST_MODE_USER_ATTEMPT") {
          console.log(finalData);
          console.log(finalData["usageLogEvents"][0]["stopLostModeUserAttemptEvent"]);
          if (finalData["usageLogEvents"][0]["stopLostModeUserAttemptEvent"]["status"] == "ATTEMPT_SUCCEEDED") {
            res.status(200).json({ status: "Success" });
          }
        } else {
          res.status(200).json({ status: "Success" });
        }
      }
    } catch (error) {
      console.log(error.message);
      return next(createError(400, "Internal Server Error"));
    }
  },
};
