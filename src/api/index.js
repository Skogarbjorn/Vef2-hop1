import express from 'express';
import { requireAdmin, requireAuth } from '../auth/passport.js';
import { catchErrors } from '../lib/catchErrors.js';
import { deleteUser, listUser, listUsers } from './users.js';
import { validationCheck } from '../validate/helpers.js';
import { agesValidator, capacityValidator, courseIdValidator, dateDoesNotOverlapValidator, dateValidator, durationValidator, pagingQuerystringValidator, practiceCapacityNotFullValidator, userNotSignedUpValidator } from '../validate/validators.js';
import { addPractice, listPractice, listPracticeSingular, signToPractice } from './practice.js';

export const router = express.Router();

router.get('/profa',
	requireAuth,
	pagingQuerystringValidator,
	validationCheck,
	catchErrors(listPractice)
);

router.post('/profa',
	requireAdmin,
	dateValidator,
	durationValidator,
	agesValidator,
	capacityValidator,
	dateDoesNotOverlapValidator,
	validationCheck,
	catchErrors(addPractice)
);

router.get('/profa/:id',
	requireAuth,
	validationCheck,
	catchErrors(listPracticeSingular)
);

router.post('/profa/:id',
	requireAuth,
	courseIdValidator,
	practiceCapacityNotFullValidator,
	userNotSignedUpValidator,
	validationCheck,
	catchErrors(signToPractice)
);

router.get('/users',
	requireAdmin,
	pagingQuerystringValidator,
	validationCheck,
	catchErrors(listUsers)
);

router.get('/users/:id',
	requireAdmin,
	validationCheck,
	catchErrors(listUser),
);

router.delete('/users/:id',
	requireAdmin,
	validationCheck,
	catchErrors(deleteUser)
);
