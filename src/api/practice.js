import { addPageMetadata } from "../lib/addPageMetadata.js";
import { pagedQuery, query } from "../lib/db.js";
import xss from "xss";
export async function listPractice(req, res) {
  const { limit = 5, offset = 0 } = req.query;

  const listPracticeSQL = `SELECT * FROM practice`;
  const result = await pagedQuery(listPracticeSQL, [], { limit, offset });

  const resultWithPaging = addPageMetadata(result, req.path, {
    offset,
    limit,
    total: result.total,
  });

  return res.json(resultWithPaging);
}

export async function addPractice(req, res) {
  const { date, duration, ages, capacity } = req.body;
  const dateISO = new Date(date).toISOString();

  const insertSQL = `
	  INSERT INTO practice (date, duration, ages, capacity) VALUES ($1, $2, $3, $4) RETURNING *`;

  const result = await query(insertSQL, [
    xss(dateISO),
    xss(duration),
    xss(ages),
    xss(capacity),
  ]);

  if (!result) {
    return res.status(500).json({ error: "Something went wrong" });
  }

  return res.status(201).json(result.rows);
}

export async function listPracticeSingular(req, res) {
  const { id } = req.params;
  const { offset = 0, limit = 10 } = req.query;

  const result = await findById(id);

  if (!result) {
    return res.status(404).json({ error: "Not found" });
  }

  const signedSQL = `
	  SELECT * FROM practice_signups WHERE practice_id = $1`;

  const signedResult = await pagedQuery(signedSQL, [id], { offset, limit });

  const signedResultWithPaging = addPageMetadata(signedResult, req.path, {
    offset,
    limit,
    total: signedResult.total,
  });

  const resultWithSignups = {
    ...result,
    signups: signedResultWithPaging,
  };

  return res.json(resultWithSignups);
}

export async function findById(id) {
  const findPracticeSQL = `SELECT * FROM practice WHERE id = $1`;

  try {
    const result = await query(findPracticeSQL, [id]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (err) {
    console.error("Could not query for practice by id", err);
  }

  return null;
}

export async function signToPractice(req, res) {
  const user = req.user;
  const { id } = req.params;

  const findResult = await findById(id);

  if (!findResult) {
    return res.status(404).json({ error: "Not found" });
  }

  const signSQL = `
	  INSERT INTO practice_signups (user_id, practice_id) VALUES ($1, $2) RETURNING *`;

  const result = await query(signSQL, [user.id, id]);

  if (!result) {
    return res.status(500).json({ error: "Something went wrong" });
  }

  return res.status(201).json(result.rows);
}

export async function updatePractice(req, res) {
	const { id } = req.params;
	const { date, duration, ages, capacity } = req.body;

	const params = [
		date instanceof Date ? date : null,
		duration instanceof Date ? xss(duration) : null,
		typeof ages === 'string' ? xss(ages) : null,
		typeof capacity === 'number' ? xss(capacity) : null,
	];

	const fields = [
		date instanceof Date ? 'date' : null,
		duration instanceof Date ? 'duration' : null,
		typeof ages === 'string' ? 'ages' : null,
		typeof capacity === 'number' ? 'capacity' : null,
	];

	const result = await partialUpdate('practice', id, fields, params);

	if (!result) {
		return res.status(500).json({ error: 'Something went wrong updating the move' });
	}

	return res.status(200).json(result.rows);
}


export async function deletePractice(req, res) {
  const { id } = req.params;

  const findResult = await findById(id);

  if (!findResult) {
    return res.status(404).json({ error: "Not found" });
  }

  const deleteSQL = `DELETE FROM practice WHERE id = $1 RETURNING *`;

  const result = await query(deleteSQL, [id]);

  if (!result) {
    return res.status(500).json({ error: "Something went wrong" });
  }

  return res.status(204).send();
}

export async function updatePractice(req, res) {
  const { id } = req.params;
  const { date, duration, ages, capacity } = req.body;
  const dateISO = new Date(date).toISOString();

  const updateSQL = `
	  UPDATE practice SET date = $1, duration = $2, ages = $3, capacity = $4 WHERE id = $5 RETURNING *`;

  const result = await query(updateSQL, [
    xss(dateISO),
    xss(duration),
    xss(ages),
    xss(capacity),
    id,
  ]);

  if (!result) {
    return res.status(500).json({ error: "Something went wrong" });
  }

  return res.status(200).json(result.rows);
}
