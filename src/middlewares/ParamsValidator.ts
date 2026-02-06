'use strict';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
  * Middleware to check that the required params arrive
  * @param req 
  * @param res 
  * @param next 
*/

// TODO vitaminar esto y securizar las rutas con distintos permisos
    // naming apropiado?
const paramsValidator = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }
    next();
}

export {
    paramsValidator
}