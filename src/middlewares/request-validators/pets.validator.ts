import { check } from "express-validator";
import { paramsValidator } from "./ParamsValidator";

export const validateGetPetById = [
  check("id", "The id field is required").not().isEmpty(),
  paramsValidator,
];

export const validateAddNewPet = [
  check("name", "The name field is required").not().isEmpty(),
  check("species", "The species field is required").not().isEmpty(),
  check("gender", "The gender field is required and must be either male or female")
    .not()
    .isEmpty()
    .custom((value: string) => {
      const lowercaseValue: string = value.toLowerCase();
      return lowercaseValue === "male" || lowercaseValue === "female";
    }),
  check(
    "birthdate",
    "The birthdate field is required and must be a valid date in the format YYYY-MM-DD"
  )
    .not()
    .isEmpty()
    .isDate({ format: "YYYY-MM-DD" }),
  paramsValidator,
];
