import express from "express";
import { requireAdmin, requireAuth } from "../auth/passport.js";
import { catchErrors } from "../lib/catchErrors.js";
import { deleteUser, listUser, listUsers } from "./users.js";
import { validationCheck } from "../validate/helpers.js";
import {
  agesValidator,
  capacityValidator,
  courseIdValidator,
  dateValidator,
  descriptionValidator,
  durationValidator,
  endDateValidator,
  levelValidator,
  moveDescriptionValidator,
  moveIdValidator,
  moveImageValidator,
  moveTitleValidator,
  moveVideoValidator,
  nameValidator,
  pagingQuerystringValidator,
  practiceCapacityNotFullValidator,
  practiceIdValidator,
  startDateValidator,
  userNotSignedUpCourseValidator,
  userNotSignedUpPracticeValidator,
} from "../validate/validators.js";
import {
  addPractice,
  deletePractice,
  listPractice,
  listPracticeSingular,
  signToPractice,
  updatePractice,
} from "./practice.js";
import {
  addCourse,
  deleteCourse,
  listCourse,
  listCourses,
  signToCourse,
  updateCourse,
} from "./courses.js";
import {
  addMove,
  deleteMove,
  listMove,
  listMoves,
  updateMove,
} from "./moves.js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

export const router = express.Router();

router.get("/", async (_req, res) => {
  const path = dirname(fileURLToPath(import.meta.url));
  const indexJson = await readFile(join(path, "./index.json"));
  res.json(JSON.parse(indexJson));
});

// PROFA
router.get(
  "/profa",
  pagingQuerystringValidator,
  validationCheck,
  catchErrors(listPractice),
);

router.post(
  "/profa",
  requireAdmin,
  dateValidator,
  durationValidator,
  agesValidator,
  capacityValidator,
  validationCheck,
  catchErrors(addPractice),
);

// PROFA:ID
router.get(
  "/profa/:id",
  requireAdmin,
  pagingQuerystringValidator,
  validationCheck,
  catchErrors(listPracticeSingular),
);

router.post(
  "/profa/:id",
  requireAuth,
  practiceIdValidator,
  practiceCapacityNotFullValidator,
  userNotSignedUpPracticeValidator,
  validationCheck,
  catchErrors(signToPractice),
);

router.delete(
  "/profa/:id",
  requireAdmin,
  practiceIdValidator,
  validationCheck,
  catchErrors(deletePractice),
);

router.patch(
  "/profa/:id",
  requireAdmin,
  practiceIdValidator,
  dateValidator,
  durationValidator,
  agesValidator,
  capacityValidator,
  validationCheck,
  catchErrors(updatePractice),
);

// NAMSKEID
router.get(
  "/namskeid",
  pagingQuerystringValidator,
  validationCheck,
  catchErrors(listCourses),
);

router.post(
  "/namskeid",
  requireAdmin,
  nameValidator,
  descriptionValidator,
  levelValidator,
  startDateValidator,
  endDateValidator,
  validationCheck,
  catchErrors(addCourse),
);

// NAMSKEID:ID
router.get(
  "/namskeid/:id",
  requireAdmin,
  courseIdValidator,
  pagingQuerystringValidator,
  validationCheck,
  catchErrors(listCourse),
);

router.post(
  "/namskeid/:id",
  requireAuth,
  courseIdValidator,
  userNotSignedUpCourseValidator,
  validationCheck,
  catchErrors(signToCourse),
);

router.delete(
  "/namskeid/:id",
  requireAdmin,
  courseIdValidator,
  validationCheck,
  catchErrors(deleteCourse),
);

router.patch(
  "/namskeid/:id",
  requireAdmin,
  courseIdValidator,
  nameValidator,
  descriptionValidator,
  levelValidator,
  startDateValidator,
  endDateValidator,
  validationCheck,
  catchErrors(updateCourse),
);

// LAERA
router.get(
  "/laera",
  pagingQuerystringValidator,
  validationCheck,
  catchErrors(listMoves),
);

router.post(
  "/laera",
  requireAdmin,
  moveTitleValidator,
  moveDescriptionValidator,
  moveImageValidator,
  moveVideoValidator,
  validationCheck,
  catchErrors(addMove),
);

// LAERA:ID
router.get(
  "/laera/:id",
  moveIdValidator,
  validationCheck,
  catchErrors(listMove),
);

router.delete(
  "/laera/:id",
  requireAdmin,
  moveIdValidator,
  validationCheck,
  catchErrors(deleteMove),
);

// incomplete, still have to add hosting and shit
router.patch(
  "/laera/:id",
  moveIdValidator,
  moveTitleValidator,
  moveDescriptionValidator,
  moveImageValidator,
  moveVideoValidator,
  validationCheck,
  catchErrors(updateMove),
);

// USERS
router.get(
  "/users",
  requireAdmin,
  pagingQuerystringValidator,
  validationCheck,
  catchErrors(listUsers),
);

// USERS:ID
router.get("/users/:id", requireAdmin, validationCheck, catchErrors(listUser));

router.delete(
  "/users/:id",
  requireAdmin,
  validationCheck,
  catchErrors(deleteUser),
);
