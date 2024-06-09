import { z } from 'zod'

const SchemeBody = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().optional().default(10),

}).strict()

export default eventHandler(async (event) => {
  try {
    await readValidatedBody(event, SchemeBody.parseAsync)
    const { page, limit }: z.infer<typeof SchemeBody> = await readBody(event)
    const db = hubDatabase()
    // 不光要查处数据，还要查出总数
    const users = (await db.prepare(`SELECT * FROM users LIMIT ? OFFSET ?`).bind(limit, (page - 1) * (limit)).all()).results
    // 查询总数
    const total = (await db.prepare(`SELECT COUNT(*) FROM users`).first() || {})['COUNT(*)'] || 0

    return {
      status: 200,
      message: 'OK',
      data: users,
      pagination: {
        total,
        page,
        limit,
      },
    }
  }
  catch (error: unknown) {
    function getErrorMessage(error: any) {
      try {
        return JSON.parse(error.message)
      }
      catch {
        return error.message
      }
    }
    return {
      status: 400,
      message: 'Bad Request',
      error: getErrorMessage(error),
    }
  }
})
