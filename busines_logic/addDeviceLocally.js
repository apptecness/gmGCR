const unirest = require("unirest");

const addDeviceLocally = async (options) => {
  // const deviceId = options.deviceId;
  console.log("i m here add device locally");
  const dataMap = options.dataMap;
  // console.log(dataMap);
  const req = unirest("POST", process.env.ADD_DEVICE_URI);

  req.headers({
    "Content-Type": "application/json",
    // Authorization: `Bearer ${options.token}`,
  });
  let data = JSON.stringify(dataMap);

  req.send(data);

  return req;
};

module.exports = addDeviceLocally;
