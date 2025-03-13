import { validationResult } from "express-validator";

export function validationCheck(req, res, next) {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const errors = validation.errors.map((error) => {
      try {
        return typeof error.msg === "string"
          ? JSON.parse(error.msg)
          : error.msg;
      } catch {
        return { msg: error.msg, type: "validation" };
      }
    });

    const statusMap = {
      server_error: 500,
      not_found: 404,
      auth_error: 401,
      validation: 400,
    };

    const status = errors.reduce((acc, error) => {
      return Math.max(acc, statusMap[error.type] || 400);
    }, 400);

    return res.status(status).json({ errors });
  }

  return next();
}
