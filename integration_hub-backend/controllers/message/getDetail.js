import Message from "../../models/message.model.js";

const getMessageDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Ensure we only find messages for the current tenant
    const message = await Message.findOne({ 
      _id: id, 
      tenantId: req.currentTenant._id 
    }).populate("deviceId", "name serialNumber");

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    res.status(200).json({ success: true, data: message });
  } catch (e) {
    next(e);
  }
};

export default getMessageDetail;
