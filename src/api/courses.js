import { addPageMetadata } from "../lib/addPageMetadata.js";
import { pagedQuery, query } from "../lib/db.js";

export async function listCourses(req, res) {
	const { limit = 5, offset = 0 } = req.query;

	const listCoursesSQL = `SELECT * FROM courses`;
	const result = await pagedQuery(
		listCoursesSQL,
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

export async function listCourse(req, res) {
	const { id } = req.params;
	const { offset = 0, limit = 10 } = req.query;
	
	const result = await findById(id);
	if (!result) {
		return res.status(404).json({ error: 'Course not found' });
	}

	const signedSQL = `
	  SELECT * FROM course_signups WHERE course_id = $1`;

	const signedResult = await pagedQuery(signedSQL, [id], { offset, limit});

	if (!signedResult) {
		return res.status(500).json({ error: 'Something went wrong while getting signed users' });
	}

	const signedResultWithPaging = addPageMetadata(
		signedResult,
		req.path,
		{ offset, limit, total: signedResult.total }
	);

	const resultWithSignups = {
		...result,
		signups: signedResultWithPaging
	}

	return res.json(resultWithSignups);
}

export async function addCourse(req, res) {
	const { name, description, level, start_date, end_date } = req.body;

	const insertSQL = `
	  INSERT INTO courses (name, description, level, start_date, end_date)
	  VALUES ($1, $2, $3, $4, $5) RETURNING *
	`;

	const result = await query(insertSQL, [
		xss(name), 
		xss(description),
		xss(level), 
		xss(start_date),
		xss(end_date)
	]);

	if (!result) {
		return res.status(500).json({ error: 'Unable to add course' });
	}

	return res.status(201).json(result.rows);
}

export async function signToCourse(req, res) {
	const user = req.user;
	const { id } = req.params;

	const findResult = await findById(id);

	if (!findResult) {
		return res.status(404).json({ error: 'Course not found' });
	}

	const signSQL = `
	  INSERT INTO course_signups (user_id, course_id) VALUES ($1, $2) RETURNING *`;

	const result = await query(signSQL, [user.id, id]);

	if (!result) {
		return res.status(500).json({ error: 'Could not sign user to course' });
	}

	return res.status(201).json(result.rows);
}

export async function deleteCourse(req, res) {
	const { id } = req.params;

	const deleteSQL = `DELETE FROM courses WHERE id = $1`;

	const deleteResult = await query(deleteSQL, [id]);

	if (!deleteResult) {
		return res.status(500).json({ error: 'Something went wrong while deleting the course' });
	}

	return res.status(204).send();
}

export async function findById(id) {
	const findCourseSQL = `SELECT * FROM courses WHERE id = $1`;

	try {
		const result = await query(findCourseSQL, [id]);

		if (result.rowCount === 1) {
			return result.rows[0];
		}
	} catch (err) {
		console.error('Could not query for course by id', err);
	}

	return null;
}
