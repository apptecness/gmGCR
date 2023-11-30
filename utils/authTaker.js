const unirest = require("unirest");

const authTaker = (options) => {
  //  console.log(options.authtype);
  //  console.log(options.token);
  // const authtype = options.authtype;
  // console.log(`${process.env.AUTH_URI}/auth`);
  const req = unirest("POST", `${process.env.AUTH_URI}/auth`);

  req.headers({
    "Content-Type": "application/x-www-form-urlencoded",
  });

  req.send({
    token: options.token,
  });

  return req;
};

module.exports = authTaker;
