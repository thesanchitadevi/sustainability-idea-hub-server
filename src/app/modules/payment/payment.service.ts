import { paymentStatus, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { SSLService } from "../SSL/ssl.service";

const initPayment = async (ideaId: string, user: IAuthUser) => {
  const idea = await prisma.idea.findFirstOrThrow({
    where: {
      id: ideaId,
    },
    include: {
      user: true,
    },
  });
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      id: user?.userId,
      status: UserStatus.ACTIVE,
    },
  });
  // console.log(userData)

  const initPaymentData = {
    amount: 200,
    transactionId: userData.id+'.'+ideaId,
    name: userData.name,
    email: userData.email,
    address: "N/A",
    phoneNumber: "01841511312",
  };

  const result = await SSLService.initPayment(initPaymentData);
  // console.log("res = ",result.GatewayPageURL)
  return {
    paymentUrl: result.GatewayPageURL
  }
};

const successPayment = async(userId:string, ideaId:string, amount:string) =>{
  const res = await prisma.payment.create({
    data: {
      UserId: userId,
      IdeaId: ideaId,
      amount: Number(amount),
      status: paymentStatus.PAID
    }
  })
  return res;
}

const validatePayment = async(payload:any) => {
  console.log(payload)
}

const paidIdeaInfo = async(ideaId:string, user: IAuthUser) => {

  const payment = await prisma.payment.findFirst({
    where: {
      IdeaId: ideaId,
      UserId: user?.userId
    }
  })
  return payment
  // console.log(payment)
}

export const PaymentService = {
  initPayment,
  validatePayment,
  successPayment,
  paidIdeaInfo
};
