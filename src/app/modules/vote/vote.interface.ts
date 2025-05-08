export interface IVoteService {
  userId: string;
  ideaId: string;
  voteType: "UP_VOTE" | "DOWN_VOTE";
}
