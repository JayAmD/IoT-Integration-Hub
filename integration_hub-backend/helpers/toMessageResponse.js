// Convert populated database references to objects named for their API representation.
const toMessageResponse = (message) => {
  const { deviceId, dispatches, ...messageData } = message.toObject();

  return {
    ...messageData,
    device: deviceId,
    dispatches: dispatches.map(({ endpointId, ...dispatchData }) => ({
      ...dispatchData,
      endpoint: endpointId,
    })),
  };
};

export default toMessageResponse;
