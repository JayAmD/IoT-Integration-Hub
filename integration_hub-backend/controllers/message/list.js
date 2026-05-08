import Message from "../../models/message.model.js";

const listMessages = async (req, res, next) => {
  try {
    const { deviceId, status, page = 1, limit = 10 } = req.query;
    
    // Filter by tenant (from authorizeTenant middleware)
    const query = { tenantId: req.currentTenant._id };

    // Optional filters
    if (deviceId) query.deviceId = deviceId;
    if (status) query.status = status;

    const messages = await Message.find(query)
      .sort({ receivedAt: -1 }) // Newest first
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("deviceId", "name"); // Include device name

    const total = await Message.countDocuments(query);

    res.status(200).json({ 
      success: true, 
      data: messages,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (e) {
    next(e);
  }
};

export default listMessages;
