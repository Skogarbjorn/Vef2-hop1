import bcrypt from "bcrypt";
import process from "node:process";
import { query } from "../lib/db.js";
import xss from "xss";

const { BCRYPT_ROUNDS: bcryptRounds = 1 } = process.env;

export async function createUser(username, email, password) {
  const password_hashed = await bcrypt.hash(
    password,
    parseInt(bcryptRounds, 10),
  );

  const insertSQL = `
	  INSERT INTO users (username, email, password)
	  VALUES ($1, $2, $3)
	  RETURNING *`;
  const params = [xss(username), xss(email), password_hashed];

  const result = await query(insertSQL, params);

  return result.rows[0];
}

export async function verifyPassword(user, password) {
  return await bcrypt.compare(password, user.password);
}

export async function findByUsername(username) {
  const findUserSQL = `SELECT * FROM users WHERE username = $1`;

  try {
    const result = await query(findUserSQL, [username]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (err) {
    console.error("Could not query for user by username", err);
  }

  return null;
}

export async function findByEmail(email) {
  const findUserSQL = `SELECT * FROM users WHERE email = $1`;

  try {
    const result = await query(findUserSQL, [email]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (err) {
    console.error("Could not query for user by email", err);
  }

  return null;
}

export async function findById(id) {
  const findUserSQL = `SELECT * FROM users WHERE id = $1`;

  try {
    const result = await query(findUserSQL, [id]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (err) {
    console.error("Could not query for user by id", err);
  }

  return null;
}

export async function findByEmailOrUsername(identifier) {
  const isEmail = identifier.includes("@");
  if (isEmail) {
    return await findByEmail(identifier);
  } else {
    return await findByUsername(identifier);
  }
}

export async function deleteById(id) {
  const deleteUserSQL = `DELETE FROM users WHERE id = $1 RETURNING *`;

  try {
    const result = await query(deleteUserSQL, [id]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (err) {
    console.error("Could not delete user by id", err);
  }

  return null;
}
