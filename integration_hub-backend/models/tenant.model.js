import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tenant name is required"],
      trim: true,
      minLength: [1, "Tenant name must not be empty"],
      maxLength: [255, "Tenant name must be less than 255 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [1000, "Description must be less than 1000 characters"],
      default: "",
    },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["owner", "admin", "viewer"],
          required: true,
          default: "viewer",
        },
        _id: false, // Don't create a separate _id for each member
      },
    ],
  },
  { timestamps: true }
);

// Index for quick lookup of tenants by userId in members
tenantSchema.index({ "members.userId": 1 });

const Tenant = mongoose.model("Tenant", tenantSchema);

export default Tenant;
