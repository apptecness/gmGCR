const allEnrolledDeviceFetcherAlsoWithPageToken = require("./allEnrolledDeviceFetcherWithPageToken");

const allEnrolledDevicesFetchHelper = async (options) => {
  const enterpriseId = options.enterpriseId;
  const gToken = options.gToken;
  const response = await allEnrolledDeviceFetcherAlsoWithPageToken({
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

  return req;
};

module.exports = allEnrolledDevicesFetchHelper;
