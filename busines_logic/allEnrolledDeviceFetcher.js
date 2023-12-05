const unirest = require("unirest");

const allEnrolledDevicesFetcher = async (options) => {
  console.log(" all device fetcher");
  // console.log(options);
  const enterpriseId = options.enterpriseId;
  const gToken = options.gToken;
  const req = unirest("GET", `https://androidmanagement.googleapis.com/v1/enterprises/${enterpriseId}/devices?pageSize=${process.env.NOOFDEVICES}`);

  req.headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${gToken}`,
  });
  // let data = JSON.stringify({
  //   policyName: "enterprises/LC01rz5l9l/policies/Initial Policy",
  //   oneTimeOnly: true,
  //   duration: "315360000s",
  // });

  req.send();

  return req;
};

module.exports = allEnrolledDevicesFetcher;
