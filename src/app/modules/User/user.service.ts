
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import { IFile } from "../../interfaces/file";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { userSearchableFields } from "./user.contants";
import { IAuthUser } from "../../interfaces/common";
import { Prisma, UserRole } from "../../../../generated/prisma";

// const createAdmin = async (req: Request): Promise<Admin> => {
//   const file = req.file as IFile;
//   console.log("file", file);

//   if (file) {
//     const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
//     req.body.admin.profileImage = uploadToCloudinary?.secure_url;
//   }
//   const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

//   const userData = {
//     email: req.body.admin.email,
//     password: hashedPassword,
//     role: UserRole.ADMIN,
//     name: req.body.admin.name, //added name to userData
//   };

//   const result = await prisma.$transaction(async (transactionClient) => {
//     await transactionClient.user.create({
//       data: userData,
//     });

//     const createAdminData = await transactionClient.admin.create({
//       data: req.body.admin,
//     });

//     return createAdminData;
//   });

//   return result;
// };

// const createUser = async (req: Request) => {
//   const file = req.file as IFile;
//   // console.log("file", file);
//   let profileImageUrl = '';
//   if (file) {
//     const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
//     profileImageUrl = uploadToCloudinary?.secure_url || '';
//   }
//   const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

//   const userData = {
//     email: req.body.user.email,
//     password: hashedPassword,
//     name: req.body.user.name, //added name to userData
//     profile_image: profileImageUrl,
//   };
//   // console.log("userdata = ", userData)

//    const result = await prisma.user.create({
//     data: userData,
//     select: {
//       id: true,
//       email: true,
//       name:true,
//       role:true,
//       createdAt: true,
//       updatedAt: true
//     }
//    })

  

 
//   return result;
// };

const createUser = async (req: Request) => {
  const file = req.file as Express.Multer.File;
  let profileImageUrl = '';

  if (file) {
    const cloudinaryResponse = await fileUploader.uploadToCloudinary(file);
    profileImageUrl = cloudinaryResponse?.secure_url || '';
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.user.email,
    password: hashedPassword,
    name: req.body.user.name,
    profile_image: profileImageUrl,
  };

  const result = await prisma.user.create({
    data: userData,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};


const getAllUsersFromDB = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  //console.log(filterData);
  if (params.searchTerm) {
    andCondions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditons: Prisma.UserWhereInput =
    andCondions.length > 0 ? { AND: andCondions } : {};

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      status: true,
      createdAt: true,
      updatedAt: true,
     
    },
  });

  const total = await prisma.user.count({
    where: whereConditons,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const changeProfileStatus = async (id: string, status: UserRole) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  return updateUserStatus;
};
const changeProfileRole = async (id: string, role: UserRole) => {
  await prisma.user.findUniqueOrThrow({
   where: {
     id,
     status:'ACTIVE'
   },
 });


 const updateUserRole = await prisma.user.update({
   where: {
     id,
   },
   data: role,
 });

 return updateUserRole;
};

// const getMyProfile = async (user: IAuthUser) => {
//   const userInfo = await prisma.user.findUniqueOrThrow({
//     where: {
//       email: user?.email,
//     },
//     select: {
//       id: true,
//       email: true,
     
//       role: true,
//       status: true,
//     },
//   });

//   let profileInfo;

//   if (userInfo.role === UserRole.SUPER_ADMIN) {
//     profileInfo = await prisma.admin.findUnique({
//       where: {
//         email: userInfo.email,
//       },
//     });
//   } else if (userInfo.role === UserRole.ADMIN) {
//     profileInfo = await prisma.admin.findUnique({
//       where: {
//         email: userInfo.email,
//       },
//     });
//   }

//   return { ...userInfo, ...profileInfo };
// };

// const updateMyProfile = async (user: IAuthUser, req: Request) => {
//   const userInfo = await prisma.user.findUniqueOrThrow({
//     where: {
//       email: user?.email,
//       status: UserStatus.ACTIVE,
//     },
//   });

//   const file = req.file as IFile;
//   if (file) {
//     const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
//     req.body.profileImage = uploadToCloudinary?.secure_url;
//   }

//   let profileInfo;

//   if (userInfo.role === UserRole.SUPER_ADMIN) {
//     profileInfo = await prisma.admin.update({
//       where: {
//         email: userInfo.email,
//       },
//       data: req.body,
//     });
//   } else if (userInfo.role === UserRole.ADMIN) {
//     profileInfo = await prisma.admin.update({
//       where: {
//         email: userInfo.email,
//       },
//       data: req.body,
//     });
//   }

//   return { ...profileInfo };
// };

export const UserServices = {
  // createAdmin,
  getAllUsersFromDB,
  changeProfileStatus,
  changeProfileRole,
  // changeProfileStatus,
  // getMyProfile,
  // updateMyProfile,
  createUser
};
