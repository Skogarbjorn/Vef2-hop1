import { deleteById, findById } from "../auth/users.js";
import { addPageMetadata } from "../lib/addPageMetadata.js";
import { pagedQuery, query } from "../lib/db.js";

export async function listUsers(req, res) {
	const { limit = 5, offset = 0 } = req.query;

	const listUsersSQL = `SELECT (id, username, email, admin, created) FROM users`;
	const result = await pagedQuery(
		listUsersSQL,
		[], 
		{ limit, offset }
	);

	const resultWithPaging = addPageMetadata(
		result,
		req.path,
		{ offset, limit, total: result.total },
	);

	return res.json(resultWithPaging);
}

export async function listUser(req, res) {
	const { id } = req.params;

	const user = await findById(id);

	if (!user) {
		return res.status(404).json({ error: 'User not found' });
	}

	return res.json(user);
}

export async function deleteUser(req ,res) {
	const { id } = req.params;

	const user = await findById(id);

	if (!user) {
		return res.status(404).json({ error: 'User not found' });
	}

	const result = await deleteById(id);

	if (result) {
		return res.status(204).send();
	}

	return res.status(500).json({ error: 'Something went wrong' });
}
