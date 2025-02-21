import { body, param, query as ex_query } from 'express-validator';
import { findByEmail, findByEmailOrUsername, findByUsername } from '../auth/users.js';
import { verifyPassword } from '../auth/users.js';
import { query } from '../lib/db.js';
import { doIntervalsIntersect } from '../lib/dateOverlap.js';
import { findById as findPracticeById } from '../api/practice.js';
import { findById as findCourseById } from '../api/courses.js';
import { findById as findMoveById } from '../api/moves.js';

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

export const pagingQuerystringValidator = [
	ex_query('offset')
	  .optional()
	  .isInt({ min: 0 })
	  .withMessage('offset must not be negative'),
	ex_query('limit')
	  .optional()
	  .isInt({ min: 1, max: 100 })
	  .withMessage('limit must be positive and not above 100')
];

export const dateValidator = body('date')
  .exists()
  .not().isEmpty()
  .withMessage('date cannot be empty')
  .isISO8601()
  .toDate()
  .withMessage('date must be in format "yyyy-mm-dd hh:mm:ss"');

export const durationValidator = body('duration')
  .exists()
  .withMessage('duration must be defined')
  .trim()
  .custom((duration) => { console.log(duration); return true; })
	.matches(/^(\d+\s*(hour|minute|second|day)s?\s*)+$/i)
  .withMessage('duration must be in format "X hours", "Y minutes", etc.');

export const agesValidator = body('ages')
  .exists()
  .isIn(['5-7 ára', '8-12 ára', 'fullorðnir'])
  .withMessage('ages must be one of the schemes defined in database');

export const capacityValidator = body('capacity')
  .isInt({ min: 1 })
  .withMessage('capacity must be an integer, minimum 1');

export const dateDoesNotOverlapValidator = body('date').custom(
	async (date, { req: { body: req_body } = {} }) => {
		const { duration } = req_body;

		const dateSQL = `SELECT * FROM practice`;

		const result = await query(dateSQL);

		if (!result) {
			return Promise.resolve();
		}

		for (const row of result.rows) {
			if (doIntervalsIntersect(date, duration, row.date, row.duration)) {
				return Promise.reject(new Error('date is already occupied'));
			}
		}

		return Promise.resolve();
	});

export const userNotSignedUpPracticeValidator = param('id').custom(
	async (id, { req: { user: req_user } = {} }) => {
		const findSQL = `
		  SELECT * FROM practice_signups WHERE user_id = $1 AND practice_id = $2`;

		const result = await query(findSQL, [req_user.id, id]);

		if (result.rowCount === 1) {
			return Promise.reject(new Error('user is already signed up'));
		}

		return Promise.resolve();
	});

export const userNotSignedUpCourseValidator = param('id').custom(
	async (id, { req: { user: req_user } = {} }) => {
		const findSQL = `
		  SELECT * FROM course_signups WHERE user_id = $1 AND course_id = $2`;

		const result = await query(findSQL, [req_user.id, id]);

		if (result.rowCount === 1) {
			return Promise.reject(new Error('user is already signed up'));
		}

		return Promise.resolve();
	});

export const practiceIdValidator = param('id')
  .exists()
  .withMessage('practice id must be defined')
  .custom(
		async (id) => {
			const result = await findPracticeById(id);

			if (!result) {
				return Promise.reject(new Error('practice does not exist'));
			}

			return Promise.resolve();
		});

export const courseIdValidator = param('id')
  .exists()
  .withMessage('course id must be defined')
  .custom(
		async (id) => {
			const result = await findCourseById(id);

			if (!result) {
				return Promise.reject(new Error('course does not exist'));
			}

			return Promise.resolve();
		});

export const practiceCapacityNotFullValidator = param('id').custom(
	async (id) => {
		const result = await findPracticeById(id);

		const capacity = result.capacity;

		const signupsSQL = `
		  SELECT * FROM practice_signups WHERE practice_id = $1`;

		const signupsResult = await query(signupsSQL, [id]);

		const signupsNum = signupsResult.rows.length;

		if (signupsNum < capacity) {
			return Promise.resolve();
		}

		return Promise.reject(new Error('practice already full'));
	});

export const nameValidator = body('name')
  .exists()
  .withMessage('name must be filled out')
  .isLength({ min: 3, max: 256 })
  .withMessage('name must be between 3 and 256 characters');

export const descriptionValidator = body('description')
  .exists()
  .withMessage('description must be filled out')
  .isLength({ max: 500 })
  .withMessage('description cannot be longer than 500 characters');

export const levelValidator = body('level')
  .exists()
  .withMessage('level must be selected')
  .isIn(['byrjendur', 'miðstig', 'hæsta stig'])
  .withMessage('level must be one of the presets defined');

export const startDateValidator = body('start_date')
  .exists()
  .not().isEmpty()
  .withMessage('start date cannot be empty')
  .isISO8601()
  .toDate()
  .withMessage('date must be in format "yyyy-mm-dd hh:mm:ss"');

export const endDateValidator = body('start_date')
  .exists()
  .not().isEmpty()
  .withMessage('start date cannot be empty')
  .isISO8601()
  .toDate()
  .withMessage('date must be in format "yyyy-mm-dd hh:mm:ss"');


export const moveTitleValidator = body('title')
  .exists()
  .isLength({ min: 1, max: 128 })
  .withMessage('title must not be empty and shorter than 128 characters');

export const moveDescriptionValidator = body('description')
  .exists()
  .isLength({ max: 2000 })
  .withMessage('description cannot be longer than 2000 characters');

export const moveImageValidator = body('image')
  .exists()
  .withMessage('image must be sent, even if empty');

export const moveVideoValidator = body('image')
  .exists()
  .withMessage('video must be sent, even if empty');

export const moveIdValidator = param('id')
  .exists()
  .withMessage('move id must be specified')
  .custom(
		async (id) => {
			const result = await findMoveById(id);

			if (!result) {
				return Promise.reject(new Error('move does not exist'));
			}

			return Promise.resolve();
		});
