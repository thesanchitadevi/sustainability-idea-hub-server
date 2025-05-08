import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../../generated/prisma';


const router = express.Router();

router.get(
    '/ipn',
    PaymentController.validatePayment
)

router.post(
    '/init-payment/:ideaId',
    auth(UserRole.MEMBERS),
    PaymentController.initPayment
)

router.post('/success', PaymentController.successPayment);
router.post('/fail', PaymentController.failedPayment);
router.post('/cancel', PaymentController.canceledPayment);

router.get('/paidIdea/:ideaId', auth(UserRole.MEMBERS), PaymentController.alreadyPaidByUser)

export const PaymentRoutes = router;