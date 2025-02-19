import pg from 'pg';
import dotenv from 'dotenv';
import process from 'node:process';

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

export async function end() {
	await pool.end();
}
