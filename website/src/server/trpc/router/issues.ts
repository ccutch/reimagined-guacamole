import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const issuesRouter = router({
  getRepositoryIssues: publicProcedure
    .input(z.object({ owner: z.string(), repo: z.string(), query: z.string().default("") }))
    .query(async ({  input: { owner, repo, query } }) => {
      const issues = await fetch(`https://issues-api.made-by-connor.com/${owner}/${repo}/issues?query=${query}`)
        .then(res => res.json())
      return issues
    }),
  refreshRepository: publicProcedure
    .input(z.object({ owner: z.string(), repo: z.string() }))
    .mutation(async ({ input: { owner, repo } }) => {
      const issues = await fetch(`https://issues-api.made-by-connor.com/${owner}/${repo}/refresh}`)
        .then(res => res.json())
      return issues
    }),
  getPrioritizedIssues: protectedProcedure
    .query(async ({ ctx }) => {
      const priorities = await ctx.prisma.prioritizedIssues
        .findMany({ where: { owner_id: ctx.session.user.id }})
      const keys = priorities.map(p => `key=${p.issue_key}`).join('&')
      const issues = await fetch(`https://issues-api.made-by-connor.com/batch?${keys}`)
        .then(res => res.json())
      return issues
    }),
});
