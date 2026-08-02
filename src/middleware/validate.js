const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const message = Object.entries(errors)
      .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
      .join("; ");
    return res.status(400).json({ message });
  }

  req.validated = result.data;
  next();
};

module.exports = validate;
