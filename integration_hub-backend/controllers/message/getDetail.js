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
      const error = new Error("Message not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: message });
  } catch (e) {
    next(e);
  }
};

export default getMessageDetail;
