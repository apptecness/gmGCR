const express = require("express");
const router = express.Router();
const enrolledDeviceController = require("./enrolled_devices_controller");
const authorization = require("../utils/authorization");

router.post("/enrollment", enrolledDeviceController.enrollmentProcedure);
router.get("/fetchEnDevices", authorization.authorizeUser(), authorization.restrictedToRole("creator"), enrolledDeviceController.fetchEnDevices);
router.patch("/updateEnDevice/:id", authorization.authorizeUser(), authorization.restrictedToRole("creator"), enrolledDeviceController.updateEnDevice);
router.get("/fetchGCID", authorization.authorizeUser(), enrolledDeviceController.fetchGCID);
router.patch("/fetchAllDevices", authorization.authorizeViaHost(), enrolledDeviceController.fetchAllEnrolledDevices);

module.exports = router;
