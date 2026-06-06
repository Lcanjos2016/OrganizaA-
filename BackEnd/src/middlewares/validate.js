function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return res.status(400).json({
        error: {
          message: 'Dados invalidos',
          status: 400,
          details: result.error.flatten(),
        },
      });
    }

    req.validated = result.data;
    return next();
  };
}

module.exports = validate;
