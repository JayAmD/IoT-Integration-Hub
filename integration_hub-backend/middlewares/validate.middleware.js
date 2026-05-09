const validate = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    // Overwrite the request objects with the "cleaned" versions from Zod
    req.body = validated.body;
    req.params = validated.params;
    req.query = validated.query;

    next();
  } catch (error) {
    next(error);
  }
};

export default validate;
