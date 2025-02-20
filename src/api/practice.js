import { addPageMetadata } from "../lib/addPageMetadata.js";
import { pagedQuery, query } from "../lib/db.js";

export async function listPractice(req, res) {
	const { limit = 5, offset = 0 } = req.query;

	const listPracticeSQL = `SELECT * FROM practice`;
	const result = await pagedQuery(
		listPracticeSQL,
		[], 
		{ limit, offset }
	);

	const resultWithPaging = addPageMetadata(
		result,
		req.path,
		{ offset, limit, total: result.total }
	);

	return res.json(resultWithPaging);
}

export async function addPractice(req, res) {
	const { date, duration, ages, capacity } = req.body;

	const insertSQL = `
	  INSERT INTO practice (date, duration, ages, capacity) VALUES ($1, $2, $3, $4) RETURNING *`;

	const result = await query(insertSQL, [date, duration, ages, capacity]);

	if (!result) {
		return res.status(500).json({ error: 'Something went wrong' });
	}

	return res.status(201).json(result);
}

export async function listPracticeSingular(req, res) {
	const { id } = req.params;
	
	const result = await findById(id);

	if (!result) {
		return res.status(404).json({ error: 'Not found' });
	}

	return res.json(result);
}

export async function findById(id) {
	const findPracticeSQL = `SELECT * FROM practice WHERE id = $1`;

	try {
		const result = await query(findPracticeSQL, [id]);

		if (result.rowCount === 1) {
			return result.rows[0];
		}
	} catch (err) {
		console.error('Could not query for practice by id', err);
	}

	return null;
}

export async function signToPractice(req, res) {
	const user = req.user;
	const { id } = req.params;

	const findResult = await findById(id);

	if (!findResult) {
		return res.status(404).json({ error: 'Not found' });
	}

	const signSQL = `
	  INSERT INTO practice_signups (user_id, practice_id) VALUES ($1, $2) RETURNING *`;

	const result = await query(signSQL, [user.id, id]);

	if (!result) {
		return res.status(500).json({ error: 'Something went wrong' });
	}

	return res.status(201).json(result);
}
