import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

// router.get(
//     '/ipn',
//     PaymentController.validatePayment
// )

router.post(
    '/init-payment/:ideaId',
    auth(UserRole.MEMBERS),
    PaymentController.initPayment
)

export const PaymentRoutes = router;