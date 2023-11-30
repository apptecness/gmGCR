const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");

const Schema = mongoose.Schema;

const EnrolledDevicesSchema = new Schema({
  name: {
    type: String,
  },
  managementMode: {
    type: String,
  },
  enrollmentTime: {
    type: Date,
  },
  state: {
    type: String,
  },
  brand: {
    type: String,
  },
  model: {
    type: String,
  },
  serialNumber: {
    type: String,
  },
  policyName: {
    type: String,
  },
  userName: {
    type: String,
  },
  enrollmentTokenName: {
    type: String,
  },
  deviceAddedLocally: {
    type: Boolean,
    default: false,
  },
});

// DeviceSchema.index({ schoolId: 1, parentEmail: 1 }, { unique: true });

const EnrolledDevices = mongoose.model("enrolleddevices", EnrolledDevicesSchema);
module.exports = EnrolledDevices;
