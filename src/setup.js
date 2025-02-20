import { readFile } from "node:fs/promises";
import { query, end } from "./lib/db.js";

const SCHEMA_FILE = './sql/schema.sql';
const DROP_FILE = './sql/drop.sql';
const INSERT_FILE = './sql/insert.sql';

async function createTables(schema_file = SCHEMA_FILE) {
	const data = await readFile(schema_file);

	return await query(data.toString('utf-8'));
}

async function dropTables(drop_file = DROP_FILE) {
	const data = await readFile(drop_file);

	return await query(data.toString('utf-8'));
}

async function insertTables(insert_file = INSERT_FILE) {
	const data = await readFile(insert_file);

	return await query(data.toString('utf-8'));
}

async function setup() {
	const drop_result = await dropTables();

	if (drop_result) {
		console.info('dropped tables');
	} else {
		console.info('tables not dropped');
	}

	const create_result = await createTables();

	if (create_result) {
		console.info('created schema');
	} else {
		console.info('schema not created');
	}

	const insert_result = await insertTables();

	if (insert_result) {
		console.info('inserted data');
	} else {
		console.info('data not inserted');
	}

	end();
}

setup().catch(error => {
	console.error("Failed running setup", error);
});
