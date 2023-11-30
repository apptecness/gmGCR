const unirest = require("unirest");
const EnrolledDevices = require("../enrolled_device_module/enrolled_devices_model");

const checkIfDeviceExists = async (options) => {
  // const deviceId = options.deviceId;
  console.log("i m here check If Device Exists");
  // const dataMap = options.dataMap;
  // console.log(options);
  var isDeviceExists = await EnrolledDevices.find({ name: options.name });
  // console.log(isDeviceExists);
  if (isDeviceExists.length == 0) {
    const dataMap = {
      name: options.name,
      managementMode: options.managementMode,
      enrollmentTime: options.enrollmentTime,
      state: options.state,
      brand: options.hardwareInfo.brand,
      model: options.hardwareInfo.model,
      serialNumber: options.hardwareInfo.serialNumber,
      policyName: options.policyName,
      userName: options.userName,
      enrollmentTokenName: options.enrollmentTokenName,
    };
    console.log(dataMap);
    const enrolledDevice = EnrolledDevices(dataMap);
    await enrolledDevice.save();
  }

  return;
};

module.exports = checkIfDeviceExists;
