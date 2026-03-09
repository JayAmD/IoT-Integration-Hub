import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
      minLength: [1, "Group name must not be empty"],
      maxLength: [255, "Group name must be less than 255 characters long"],
    },
  },
  {
    timestamps: true,
  },
);

const Group = mongoose.model("Group", groupSchema);

export default Group;