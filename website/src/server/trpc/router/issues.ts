import { z } from "zod";
import { Issue } from "../../../types/issue";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const issuesRouter = router({
  getRepositoryIssues: publicProcedure
    .input(z.object({ owner: z.string(), repo: z.string(), query: z.string().default("") }))
    .query(async ({ input: { owner, repo, query } }) => {
      const issues = await fetch(`https://issues-api.made-by-connor.com/${owner}/${repo}/issues?query=${query}`)
        .then(res => res.json() as Promise<{[key: string]: Issue}>)
      return issues
    }),
  refreshRepository: publicProcedure
    .input(z.object({ owner: z.string(), repo: z.string() }))
    .mutation(async ({ input: { owner, repo } }) => {
      const issues = await fetch(`https://issues-api.made-by-connor.com/${owner}/${repo}/refresh}`)
        .then(res => res.json() as Promise<{[key: string]: Issue}>)
      return issues
    }),
  getIssueDetails: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: key }) => {
      const [row, issue] = await Promise.all([
        ctx.prisma.prioritizedIssues.findUnique({
          where: {
            owner_id_issue_key: {
              owner_id: ctx.session!.user!.id,
              issue_key: key,
            }
          }
        }),

        fetch(`https://issues-api.made-by-connor.com/batch?key=${key}`)
          .then(res => res.json() as Promise<{[key: string]: Issue}>)
          .then(batch => batch[key])
      ])

      return { prioritized: !!row, issue }
    }),
  togglePriority: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: key }) => {
      const row = await ctx.prisma.prioritizedIssues.findUnique({
        where: {
          owner_id_issue_key: {
            owner_id: ctx.session!.user!.id,
            issue_key: key,
          }
        }
      })
      if (row == null) {
        await ctx.prisma.prioritizedIssues.create({
          data: {
            owner_id: ctx.session!.user!.id,
            issue_key: key,
          }
        })
        return true
      }
      await ctx.prisma.prioritizedIssues.delete({
        where: {
          owner_id_issue_key: {
            owner_id: ctx.session!.user!.id,
            issue_key: key,
          }
        }
      })
      return false
    }),
  getPrioritizedIssues: protectedProcedure
    .query(async ({ ctx }) => {
      const priorities = await ctx.prisma.prioritizedIssues
        .findMany({ where: { owner_id: ctx.session.user.id } })
      const keys = priorities.map(p => `key=${p.issue_key}`).join('&')
      const issues = await fetch(`https://issues-api.made-by-connor.com/batch?${keys}`)
        .then(res => res.json() as Promise<{[key: string]: Issue}>)
      return issues
    }),
});
