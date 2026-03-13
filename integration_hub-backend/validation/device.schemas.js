import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Device name is required"],
      trim: true,
      minLength: [1, "Device name must not be empty"],
      maxLength: [255, "Device name must be less than 255 characters long"],
    },
    serialNumber: {
      type: Number,
      required: [true, "Serial number is required"],
      unique: true,
      trim: true,
    },
    groupIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Group",
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Device = mongoose.model("Device", deviceSchema);

export default Device;
