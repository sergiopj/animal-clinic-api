import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationError } from '../../errors/app-error.js';

/**
 * Generic validation middleware factory for clinic requests
 * Wraps the validateDTO function for cleaner imports
 */
// TODO dar una vuelta a esto para que sea más genérico y reutilizable en otros módulos
export function validateClinicRequest<T extends object>(dtoClass: new () => T, property: 'body' | 'params' | 'query') {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req[property];
            const dtoInstance = plainToInstance(dtoClass, data);
            const errors = await validate(dtoInstance, {
                whitelist: true,
                forbidNonWhitelisted: true,
            });

            if (errors.length > 0) {
                const formattedErrors = errors.map((error) => ({
                    property: error.property,
                    constraints: error.constraints,
                    value: error.value,
                }));

                throw new ValidationError(
                    `Validation failed for ${property}`,
                    formattedErrors
                );
            }

            (req as any)[property] = dtoInstance;
            next();
        } catch (error) {
            next(error);
        }
    };
}
