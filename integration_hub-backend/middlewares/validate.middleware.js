/**
 * Zod validation middleware.
 * This middleware validates the request body, params, and query against a schema.
 */
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    next();
  } catch (error) {
    // If validation fails, Zod throws. We pass it to the error handler.
    next(error);
  }
};

export default validate;
