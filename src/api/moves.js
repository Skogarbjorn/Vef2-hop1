import { addPageMetadata } from "../lib/addPageMetadata.js";
import { pagedQuery, partialUpdate, query } from "../lib/db.js";
import xss from 'xss';
import { uploadImage } from "../lib/hosting.js";

export async function listMoves(req, res) {
  const { offset = 0, limit = 10 } = req.query;

  const listSQL = `SELECT * FROM moves`;

  const result = await pagedQuery(listSQL, [], { offset, limit });

  if (!result) {
    return res.status(404).json({ error: "Moves not found" });
  }

  const resultWithPaging = addPageMetadata(result, req.path, {
    offset,
    limit,
    total: result.total,
  });

  if (!resultWithPaging) {
    return res.status(500).json({ error: "Could not add page metadata" });
  }

  return res.json(resultWithPaging);
}

export async function listMove(req, res) {
  const { id } = req.params;

  const result = await findById(id);

  if (!result) {
    return res.status(404).json({ error: "Move not found" });
  }

  return res.json(result.rows);
}

export async function addMove(req, res) {
  const { title, description } = req.body;
  const { path: imagePath } = req.file;

  let image;
  try {
    const uploadResult = await uploadImage(imagePath);
    if (!uploadResult || !uploadResult.secure_url) {
      throw new Error('no secure url returned from cloudinary upload');
    }
    image = uploadResult.secure_url;
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }

  const insertSQL = `
	  INSERT INTO moves (title, description, image)
	  VALUES ($1, $2, $3) RETURNING *`;

  const result = await query(insertSQL, [
    xss(title),
    xss(description),
    xss(image)
  ]);

  if (!result) {
    return res.status(500).json({ error: "Could not add new move" });
  }

  return res.status(201).json(result.rows);
}

export async function deleteMove(req, res) {
  const { id } = req.params;

  const deleteSQL = `
	  DELETE FROM moves WHERE id = $1`;

  const deleteResult = await query(deleteSQL, [id]);

  if (!deleteResult) {
    return res.status(500).json({
      error: "Something went wrong while deleting the course",
    });
  }

  return res.status(204).send();
}

export async function updateMove(req, res) {
  const { id } = req.params;
  const { title, description } = req.body;
  const { file: { path: imagePath } = {} } = req

  const params = [
    typeof title === "string" ? xss(title) : null,
    typeof description === "string" ? xss(description) : null
  ];

  const fields = [
    typeof title === "string" ? "title" : null,
    typeof description === "string" ? "description" : null
  ];

  if (imagePath) {
    let image;
    try {
      const uploadResult = await uploadImage(imagePath);
      if (!uploadResult || !uploadResult.secure_url) {
        throw new Error('no secure url returned from cloudinary upload');
      }
      image = uploadResult.secure_url;
    } catch (err) {
      console.error(err);
      return res.status(500).end();
    }

    params.push(image);
    fields.push("image");
  }

  const result = await partialUpdate('moves', id, fields, params);

  if (!result) {
    return res.status(500).json({
      error: "Something went wrong updating the move",
    });
  }

  return res.status(200).json(result.rows);
}

export async function findById(id) {
  const findMoveSQL = `SELECT * FROM moves WHERE id = $1`;

  try {
    const result = await query(findMoveSQL, [id]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (err) {
    console.error("Could not query for move by id", err);
  }

  return null;
}
