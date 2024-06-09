import { z } from 'zod'
import { DAuthSchema } from '~/server/database/schema'
import { getDuolingoUserInfo } from '~/utils/duolingo'

export default eventHandler(async (event) => {
  try {
    const schemaUpdateAuth = DAuthSchema.extend({
      id: z.number().int().positive(),
    })
    await readValidatedBody(event, schemaUpdateAuth.parseAsync)
    const { id, user_id, cookie }: z.infer<typeof DAuthSchema> = await readBody(event)
    const dUser = await getDuolingoUserInfo(user_id, cookie)
    if (!dUser.username) {
      return {
        status: 401,
        message: 'Unauthorized',
        error: 'Invalid user_id in Duolingo',
      }
    }
    dUser.picture = 'https://press.duolingo.com/d38d3c0af71b74294bad.svg'
    const db = hubDatabase()
    // Check if user already exists by user_id
    const user = await db.prepare(`SELECT * FROM users WHERE user_id = ?`).bind(user_id).first()
    if (user) {
      return {
        status: 409,
        message: 'Conflict',
        error: 'User already exists by user_id in your database',
      }
    }
    await db
      .prepare(`UPDATE users SET user_id = ?, cookie = ?, username = ?, name = ?, picture = ?, updated_at = ? WHERE id = ?`)
      .bind(user_id, cookie, dUser.username, dUser.name = '', dUser.picture, Date.now(), id)
      .run()
    return {
      status: 200,
      message: 'OK',
    }
  }
  catch (error) {
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
