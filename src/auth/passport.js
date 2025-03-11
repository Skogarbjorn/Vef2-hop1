import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import process from "node:process";
import { findById } from "./users.js";

async function strategy(jwt_payload, next) {
  try {
    const user = await findById(jwt_payload.id);
    if (!user) {
      return next(null, false);
    }
    return next(null, user);
  } catch (err) {
    return next(err, false);
  }
}

export function requireAuth(req, res, next) {
  return passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      const error =
        info.name === "TokenExpiredError" ? "expired token" : "invalid token";

      return res.status(401).json({ error });
    }

    req.user = user;
    return next();
  })(req, res, next);
}

export function requireAdmin(req, res, next) {
  return passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      const error =
        info.name === "TokenExpiredError" ? "expired token" : "invalid token";

      return res.status(401).json({ error });
    }

    if (!user.admin) {
      const error = "insufficient authorization";
      return res.status(401).json({ error });
    }

    req.user = user;
    return next();
  })(req, res, next);
}

const { JWT_SECRET: jwtSecret, TOKEN_LIFETIME: tokenLifetime = 3600 } =
  process.env;

export const tokenOptions = { expiresIn: parseInt(tokenLifetime, 10) };
export const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

passport.use(new Strategy(jwtOptions, strategy));

export default passport;
