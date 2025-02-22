// File Path: routes/carRoutes.js

import express from 'express';
import { check } from 'express-validator';
import Validate from '../middleware/validate'; 
import authMiddleware from '../middleware/authMiddleware'; 
import { createCarListing, getAllCarListings, updateCarListing, deleteCarListing } from '../controllers/carController';

const router = express.Router();

router.post('/', [
check('city').not().isEmpty().withMessage("City is required"),
check('carMake').not().isEmpty().withMessage("Car make is required"),
check('yearModel').isInt({ min :1900 }).withMessage("Year model must be an integer greater than or equal to 1900"),
check('registrationCity').not().isEmpty().withMessage("Registration city is required"),
check('mileage').isInt({ min :0 }).withMessage("Mileage must be a non-negative integer"),
check('demandPrice').isNumeric({no_symbols:true}).withMessage("Demand price must be a number without symbols").custom(value => parseFloat(value)>=0),
check('description').not().isEmpty(),
custom((value) => {
    if (!req.body.carPhotosJsonb || !Array.isArray(req.body.carPhotosJsonb)) {
        throw new Error('Car photos must be an array');
    }
    return true;
}).withMessage("Invalid car photos format. Expected an array."),
Validate],
authMiddleware,
createCarListing);

router.get('/', getAllCarListings); // Public route

router.put('/:id', [
   check('city').not().isEmpty().withMessage("City is required"),
   check('carMake').not().isEmpty().withMessage("Car make is required"),
   check('yearModel').isInt({ min :1900 }).withMessage("Year model must be an integer greater than or equal to 1900"),
   check('registrationCity').not().isEmpty().withMessage("Registration city is required"),
   check('mileage').isInt({ min :0 }).withMessage("Mileage must be a non-negative integer"),
   check('demandPrice').isNumeric({no_symbols:true}).withMessage("Demand price must be a number without symbols").custom(value => parseFloat(value)>=0),
   check('description').not().isEmpty(),
   custom((value) => {
       if (!req.body.carPhotosJsonb || !Array.isArray(req.body.carPhotosJsonb)) {
           throw new Error('Car photos must be an array');
       }
       return true;
   }).withMessage("Invalid car photos format. Expected an array."),
Validate],
authMiddleware,
updateCarListing);

router.delete('/:id', authMiddleware,
deleteCarListing);

export default router;
