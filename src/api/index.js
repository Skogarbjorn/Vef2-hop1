import express from 'express';
import { requireAdmin, requireAuth } from '../auth/passport.js';
import { catchErrors } from '../lib/catchErrors.js';
import { deleteUser, listUser, listUsers } from './users.js';
import { validationCheck } from '../validate/helpers.js';
import { agesValidator, capacityValidator, practiceIdValidator, courseIdValidator, dateDoesNotOverlapValidator, dateValidator, descriptionValidator, durationValidator, endDateValidator, levelValidator, nameValidator, pagingQuerystringValidator, practiceCapacityNotFullValidator, startDateValidator, userNotSignedUpPracticeValidator, userNotSignedUpCourseValidator, moveVideoValidator, moveImageValidator, moveDescriptionValidator, moveTitleValidator, moveIdValidator } from '../validate/validators.js';
import { addPractice, deletePractice, listPractice, listPracticeSingular, signToPractice } from './practice.js';
import { addCourse, deleteCourse, listCourse, listCourses, signToCourse } from './courses.js';
import { addMove, listMove, listMoves } from './moves.js';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

export const router = express.Router();

router.get('/', async (_req, res) => {
  const path = dirname(fileURLToPath(import.meta.url));
  const indexJson = await readFile(join(path, './index.json'));
  res.json(JSON.parse(indexJson));
});

router.get('/profa',
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
	requireAdmin,
	pagingQuerystringValidator,
	validationCheck,
	catchErrors(listPracticeSingular)
);

router.post('/profa/:id',
	requireAuth,
	practiceIdValidator,
	practiceCapacityNotFullValidator,
	userNotSignedUpPracticeValidator,
	validationCheck,
	catchErrors(signToPractice)
);

router.delete('/profa/:id',
	requireAdmin,
	practiceIdValidator,
	validationCheck,
	catchErrors(deletePractice)
);

router.get('/namskeid',
	pagingQuerystringValidator,
	validationCheck,
	catchErrors(listCourses)
);

router.post('/namskeid',
	requireAdmin,
	nameValidator,
	descriptionValidator,
	levelValidator,
	startDateValidator,
	endDateValidator,
	validationCheck,
	catchErrors(addCourse)
);

router.get('/namskeid/:id',
	requireAdmin,
	courseIdValidator,
	pagingQuerystringValidator,
	validationCheck,
	catchErrors(listCourse)
)

router.post('/namskeid/:id',
	requireAuth,
	courseIdValidator,
	userNotSignedUpCourseValidator,
	validationCheck,
	catchErrors(signToCourse)
);

router.delete('/namskeid/:id',
	requireAdmin,
	courseIdValidator,
	validationCheck,
	catchErrors(deleteCourse)
);

router.get('/laera',
	pagingQuerystringValidator,
	validationCheck,
	catchErrors(listMoves)
);

router.post('/laera',
	requireAdmin,
	moveTitleValidator,
	moveDescriptionValidator,
	moveImageValidator,
	moveVideoValidator,
	validationCheck,
	catchErrors(addMove)
);

router.get('/laera/:id',
	moveIdValidator,
	validationCheck,
	catchErrors(listMove)
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
