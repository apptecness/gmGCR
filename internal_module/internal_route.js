const express = require("express");
const router = express.Router();
const internalController = require("./internal_controller");
const enrolledDevicesController = require("../enrolled_device_module/enrolled_devices_controller");
const authorization = require("../utils/authorization");

router.get("/fetchGCID", authorization.authorizeUser(), internalController.fetchGCID);
// router.patch("/fetchAllEnrolledDevices", enrolledDevicesController.fetchAllEnrolledDevices);
router.patch("/changer", authorization.authorizeUser(), authorization.restrictedToRole("creator"), internalController.changer);

module.exports = router;
