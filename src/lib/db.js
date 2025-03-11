import pg from 'pg';
import dotenv from 'dotenv';
import process from 'node:process';
import { toPositiveNumberOrDefault } from './lib.js';

dotenv.config();

const ssl = process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false;
const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({
	connectionString,
	ssl
});

export async function query(text, params = []) {
	let client;
	try {
		client = await pool.connect();
	} catch (err) {
		console.error("Could not get client from pool", err);
		return null;
	}

	try {
		const result = await client.query(text, params);
		return result;
	} catch (err) {
		console.error("Unable to execute query", err);
		return null;
	} finally {
		client.release();
	}
}

export async function pagedQuery(text, params = [], { limit = 10, offset = 0 }) {
	limit = toPositiveNumberOrDefault(limit, 10);
	offset = toPositiveNumberOrDefault(offset, 0);

	const limitOffset = params.length + 1;
	const offsetOffset = params.length + 2;
	const querySQL = `${text} LIMIT $${limitOffset} OFFSET $${offsetOffset}`;

  const data = await query(querySQL, [...params, limit, offset]);

	const countSQL = `SELECT COUNT(*) AS total FROM (${text.replace(/ORDER BY .*/i, '')}) AS subquery`;
	const countResult = await query(countSQL, params);
	const total = parseInt(countResult.rows[0].total, 10);

	return {
		data: data.rows,
		offset,
		limit,
		total,
	};
}

export async function partialUpdate(table, id, fields, params) {
	const fieldsFiltered = fields.filter(field => field);
	const paramsFiltered = params.filter(param => param);

	if (fieldsFiltered.length === 0) {
		return null;
	}

	if (fieldsFiltered.length !== paramsFiltered.length) {
		throw new Error('fields and params must be equal in length');
	}

	const updates = fieldsFiltered.map((field, index) =>
		`${field} = $${index+2}`
	);

	const updateSQL = `
	  UPDATE ${table}
	  SET ${updates.join(', ')}
	  WHERE id = $1 
	  RETURNING *`;

	const result = await query(updateSQL, [id, ...paramsFiltered]);

	return result;
}

export async function end() {
	await pool.end();
}
