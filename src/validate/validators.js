import { body, param, query } from 'express-validator';
import { findByEmail, findByEmailOrUsername, findByUsername } from '../auth/users.js';
import { verifyPassword } from '../auth/users.js';

export const usernameValidator = body('username')
  .isLength({ min: 1, max: 64 })
  .withMessage("username is required, max 64 characters");

export const emailValidator = body('email')
  .isEmail()
  .withMessage("email must be a valid email");

export const passwordValidator = body('password')
  .isLength({ min: 8, max: 64 })
  .withMessage("password must be between 8 and 64 characters");

export const usernameDoesNotExistValidator = body('username').custom(
	async (username) => {
		const user = await findByUsername(username);

		if (user) {
			return Promise.reject(new Error('username already exists'));
		}

		return Promise.resolve();
	});

export const emailIsNotInUseValidator = body('email').custom(
	async (email) => {
		const user = await findByEmail(email);

		if (user) {
			return Promise.reject(new Error('email is already in use by another account'));
		}

		return Promise.resolve();
	});

export const identifierValidator = body('identifier')
  .notEmpty()
  .withMessage('Username or email is required')
  .custom((identifier) => {
		if (!identifier.includes('@') && identifier.length < 3) {
			throw new Error('Invalid username or email');
		}
		return true;
	});

export const identifierAndPasswordValidValidator = body('identifier').custom(
	async (identifier, { req: { body: req_body } = {} }) => {
		const { password } = req_body;

		if (!identifier || !password) {
			return Promise.reject(new Error('skip'));
		}

		let valid = false;
		try {
			const user = await findByEmailOrUsername(identifier);
			valid = await verifyPassword(user, password);
		} catch {
			console.info(`password incorrect for user ${user}`);
		}

		if (!valid) {
			return Promise.reject(new Error('username or password incorrect'));
		}

		return Promise.resolve();
	});
