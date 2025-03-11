import { addPageMetadata } from "../lib/addPageMetadata.js";
import { pagedQuery, query } from "../lib/db.js";
import xss from "xss";

export async function listCourses(req, res) {
  const { limit = 5, offset = 0 } = req.query;

  const listCoursesSQL = `SELECT * FROM courses`;
  const result = await pagedQuery(listCoursesSQL, [], { limit, offset });

  const resultWithPaging = addPageMetadata(result, req.path, {
    offset,
    limit,
    total: result.total,
  });

  return res.json(resultWithPaging);
}

export async function listCourse(req, res) {
  const { id } = req.params;
  const { offset = 0, limit = 10 } = req.query;

  const result = await findById(id);
  if (!result) {
    return res.status(404).json({ error: "Course not found" });
  }

  const signedSQL = `
	  SELECT * FROM course_signups WHERE course_id = $1`;

  const signedResult = await pagedQuery(signedSQL, [id], { offset, limit });

  if (!signedResult) {
    return res.status(500).json({
      error: "Something went wrong while getting signed users",
    });
  }

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

export async function addCourse(req, res) {
  const { name, description, level, start_date, end_date } = req.body;
  const start_dateISO = new Date(start_date).toISOString();
  const end_dateISO = new Date(end_date).toISOString();

  const insertSQL = `
	  INSERT INTO courses (name, description, level, start_date, end_date)
	  VALUES ($1, $2, $3, $4, $5) RETURNING *
	`;

  const result = await query(insertSQL, [
    xss(name),
    xss(description),
    xss(level),
    xss(start_dateISO),
    xss(end_dateISO),
  ]);

  if (!result) {
    return res.status(500).json({ error: "Unable to add course" });
  }

  return res.status(201).json(result.rows);
}

export async function signToCourse(req, res) {
  const user = req.user;
  const { id } = req.params;

  const findResult = await findById(id);

  if (!findResult) {
    return res.status(404).json({ error: "Course not found" });
  }

  const signSQL = `
	  INSERT INTO course_signups (user_id, course_id) VALUES ($1, $2) RETURNING *`;

  const result = await query(signSQL, [user.id, id]);

  if (!result) {
    return res.status(500).json({ error: "Could not sign user to course" });
  }

  return res.status(201).json(result.rows);
}

export async function deleteCourse(req, res) {
  const { id } = req.params;

  const deleteSQL = `DELETE FROM courses WHERE id = $1`;

  const deleteResult = await query(deleteSQL, [id]);

  if (!deleteResult) {
    return res.status(500).json({
      error: "Something went wrong while deleting the course",
    });
  }

  return res.status(204).send();
}

export async function updateCourse(req, res) {
  const { id } = req.params;
  const { name, description, level, start_date, end_date } = req.body;
  const start_dateISO = new Date(start_date).toISOString();
  const end_dateISO = new Date(end_date).toISOString();

  const updateSQL = `
	  UPDATE courses SET name = $1, description = $2, level = $3, start_date = $4, end_date = $5 WHERE id = $6 RETURNING *
	`;

  const result = await query(updateSQL, [
    xss(name),
    xss(description),
    xss(level),
    xss(start_dateISO),
    xss(end_dateISO),
    id,
  ]);

  if (!result) {
    return res.status(500).json({ error: "Something went wrong" });
  }

  return res.status(200).json(result.rows);
}

export async function findById(id) {
  const findCourseSQL = `SELECT * FROM courses WHERE id = $1`;

  try {
    const result = await query(findCourseSQL, [id]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (err) {
    console.error("Could not query for course by id", err);
  }

  return null;
}
