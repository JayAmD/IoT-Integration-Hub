import Credential from "../../models/credential.model.js";

const listCredentials = async (req, res, next) => {
  try {
    const credentials = await Credential.find({ tenantId: req.currentTenant._id });
    res.status(200).json({ success: true, data: credentials });
  } catch (e) {
    next(e);
  }
};

export default listCredentials;
