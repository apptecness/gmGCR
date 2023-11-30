const createError = require("http-errors");
const authTaker = require("./authTaker");
const jwt = require("jsonwebtoken");
const util = require("util");
module.exports = {
  authorizeUser: () => {
    return async (req, res, next) => {
      console.log("I m here authorize user");
      // console.log(role);
      //(1) getting token and check if its there
      let token;

      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
      }
      // console.log(token);

      if (!token) {
        return next(createError(400, "you are not loggedIn please login to access"));
      }

      //(2) varify token

      try {
        await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
      } catch (e) {
        console.log(e);
        return next(createError(400, "token is not valid"));
      }

      //(3) check if user still exists
      const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
      console.log("i m here authorization");
      // console.log(decoded.user);
      req.user = decoded.user;
      next();
      // console.log(req.employee);
    };
  },

  authorizeViaHost: () => {
    return async (req, res, next) => {
      console.log(req.headers);
      const headers = req.headers;

      if (headers.authorization == "!@#$%^&*()(*&^%$#@!") {
        console.log("it is authorized");
        next();
      } else {
        return next(createError(400, "Authorize via host Server Error"));
      }
    };
  },
  restrictedToRole: (role) => {
    return (req, res, next) => {
      // console.log(role);
      // console.log(req.user.role);
      if (req.user.role != "creator") {
        if (!role.includes(req.user.role)) {
          return next(createError(400, "you do not have permission to perform this action"));
        }
      }
      // console.log(role.includes(req.user.role));
      next();
    };
  },
};
