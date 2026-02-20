import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError as ClassValidatorError } from 'class-validator';
import { ValidationError } from '../errors/app-error.js';

type RequestProperty = 'body' | 'params' | 'query';

interface FormattedValidationError {
  property: string;
  constraints?: Record<string, string>;
  value?: unknown;
}

/**
 * Transforms class-validator errors into a cleaner format
 */
function formatValidationErrors(errors: ClassValidatorError[]): FormattedValidationError[] {
  return errors.map((error) => ({
    property: error.property,
    constraints: error.constraints,
    value: error.value,
  }));
}

/**
 * Validates request data against a DTO class
 */
async function validateDTO<T extends object>(dtoInstance: T): Promise<ClassValidatorError[]> {
  return validate(dtoInstance, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });
}

/**
 * Transforms plain request data into a DTO instance
 */
function transformToDTO<T extends object>(dtoClass: new () => T, data: unknown): T {
  return plainToInstance(dtoClass, data);
}

/**
 * Generic validation middleware factory for any request DTO
 * Can be used for clinic, pet, veterinarian, or any other module
 * @example requestValidator(RequestClinicDTO, 'body')
 */
export function requestValidator<T extends object>(
  dtoClass: new () => T,
  property: RequestProperty
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestData = req[property];
      const dtoInstance = transformToDTO(dtoClass, requestData);
      const validationErrors = await validateDTO(dtoInstance);

      if (validationErrors.length > 0) {
        const formattedErrors = formatValidationErrors(validationErrors);
        throw new ValidationError(
          `Validation failed for ${property}`,
          formattedErrors
        );
      }

      req[property] = dtoInstance as any;
      next();
    } catch (error) {
      next(error);
    }
  };
}
