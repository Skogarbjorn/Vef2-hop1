import express from 'express';
import jwt from 'jsonwebtoken';
import { createUser, deleteById, findByEmailOrUsername, findById } from '../auth/users.js';
import { 
	usernameValidator,
	emailValidator,
	passwordValidator,
  usernameDoesNotExistValidator,
	emailIsNotInUseValidator,
	identifierValidator,
  identifierAndPasswordValidValidator
} from '../validate/validators.js';
import { catchErrors } from '../lib/catchErrors.js';
import { validationCheck } from '../validate/helpers.js';
import { jwtOptions, tokenOptions, requireAuth } from './passport.js';

export const router = express.Router();

async function registerRoute(req, res) {
	const { username, email, password } = req.body;

	const result = await createUser(username, email, password);

	delete result.password;

	return res.status(201).json(result);
}

async function loginRoute(req, res) {
	const { identifier } = req.body;

	const user = await findByEmailOrUsername(identifier);

	if (!user) {
		console.info('Unable to find user', identifier);
		return res.status(500).json({});
	}

	const payload = { id: user.id };
	const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);

	delete user.password;

	return res.json({
		user,
		token,
		expiresIn: tokenOptions.expiresIn
	});
}

async function currentUserRoute(req, res) {
	const { user: { id } = {} } = req;

	console.info("finding user");
	const user = await findById(id);

	if (!user) {
		return res.status(404).json({ error: 'User not found' });
	}
	delete user.password;

	return res.json(user);
}

async function deleteCurrentUserRoute(req, res) {
	const { user: { id } = {} } = req;

	const user = await findById(id);

	if (!user) {
		return res.status(404).json({ error: 'User not found' });
	}

	const result = await deleteById(id);

	if (!result) {
		return res.status(500).json({ error: 'Something went wrong' });
	}

	delete result.password;

	return res.status(204).send();
}

router.post('/users/login',
	identifierValidator,
	passwordValidator,
	identifierAndPasswordValidValidator,
	validationCheck,
	catchErrors(loginRoute)
);

router.post('/users/register',
	usernameValidator,
	emailValidator,
	passwordValidator,
	usernameDoesNotExistValidator,
	emailIsNotInUseValidator,
	validationCheck,
	catchErrors(registerRoute)
);

router.get('/users/me',
	requireAuth,
	validationCheck,
	catchErrors(currentUserRoute)
);

router.delete('/users/me',
	requireAuth,
	validationCheck,
	catchErrors(deleteCurrentUserRoute)
);
