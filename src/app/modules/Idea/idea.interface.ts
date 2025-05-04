import { IdeaStatus } from "@prisma/client";

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
