const getMe = async (req, res, next) => {
  try {
    // req.currentUser is already populated by authMiddleware
    const { _id, email } = req.currentUser;
    
    res.status(200).json({
      success: true,
      data: { _id, email }
    });
  } catch (error) {
    next(error);
  }
};

export default getMe;
