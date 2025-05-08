import { IdeaStatus } from "../../../../generated/prisma";


export type IIdeaFilters = {
  searchTerm?: string;
  category?: string;
  isPaid?: boolean | string;
  status?: string;
  isPublished?: boolean;
  userId?: string;
};

export interface IUpdateIdeaStatus {
  status: IdeaStatus;
}
