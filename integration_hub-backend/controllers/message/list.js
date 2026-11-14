import Message from "../../models/message.model.js";
import toMessageResponse from "../../helpers/toMessageResponse.js";

const listMessages = async (req, res, next) => {
  try {
    const { deviceId, serialNumber, status, page = 1, limit = 10 } = req.query;
    
    // Filter by tenant (from authorizeTenant middleware)
    const query = { tenantId: req.currentTenant._id };

    // Optional filters
    if (deviceId) query.deviceId = deviceId;
    if (serialNumber !== undefined && serialNumber !== '') {
      if (typeof serialNumber !== 'string' || !/^\d+$/.test(serialNumber.trim())
        || !Number.isSafeInteger(Number(serialNumber.trim()))) {
        throw Object.assign(new Error('Serial number must be a non-negative integer.'), { statusCode: 400 });
      }
      query.serialNumber = Number(serialNumber.trim());
    }
    if (status) query["dispatches.status"] = status;

    const messages = await Message.find(query)
      .sort({ receivedAt: -1 }) // Newest first
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("deviceId", "name") // Include device name
      .populate("dispatches.endpointId", "name url"); // Include endpoint info

    const total = await Message.countDocuments(query);

    res.status(200).json({ 
      success: true, 
      data: messages.map(toMessageResponse),
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
