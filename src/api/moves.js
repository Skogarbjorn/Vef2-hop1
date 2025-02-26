import { addPageMetadata } from "../lib/addPageMetadata.js";
import { pagedQuery, partialUpdate, query } from "../lib/db.js";

export async function listMoves(req, res) {
	const { offset = 0, limit = 10 } = req.query;

	const listSQL = `SELECT * FROM moves`;

	const result = await pagedQuery(
		listSQL,
	  [],
	  { offset, limit}
	);

	if (!result) {
		return res.status(404).json({ error: 'Moves not found' });
	}

	const resultWithPaging = addPageMetadata(
		result,
		req.path,
		{ offset, limit, total: result.total }
	);

	if (!resultWithPaging) {
		return res.status(500).json({ error: 'Could not add page metadata' });
	}

	return res.json(resultWithPaging);
}

export async function listMove(req, res) {
	const { id } = req.params;

	const result = await findById(id);

	if (!result) {
		return res.status(404).json({ error: 'Move not found' });
	}

	return res.json(result.rows);
}

export async function addMove(req, res) {
	const { title, description, image, video } = req.body;

	const insertSQL = `
	  INSERT INTO moves (title, description, image, video)
	  VALUES ($1, $2, $3, $4) RETURNING *`;

	const result = await query(insertSQL, [
		xss(title), 
		xss(description), 
		xss(image), 
		xss(video)
	]);

	if (!result) {
		return res.status(500).json({ error: 'Could not add new move' });
	}

	return res.status(201).json(result.rows);
}

export async function updateMove(req, res) {
	const { id } = req.params;
	const { title, description, image, video } = req.body;

	const params = [
		typeof title === 'string' ? xss(title) : null,
		typeof description === 'string' ? xss(description) : null,
		typeof image === 'string' ? xss(image) : null,
		typeof video === 'string' ? xss(video) : null,
	];

	const fields = [
		typeof title === 'string' ? 'title' : null,
		typeof description === 'string' ? 'description' : null,
		typeof image === 'string' ? 'image' : null,
		typeof video === 'string' ? 'video' : null,
	];

	//const result = await partialUpdate('moves', id, 
}

export async function findById(id) {
	const findMoveSQL = `SELECT * FROM moves WHERE id = $1`;

	try {
		const result = await query(findMoveSQL, [id]);

		if (result.rowCount === 1) {
			return result.rows[0];
		}
	} catch (err) {
		console.error('Could not query for move by id', err);
	}

	return null;
}
