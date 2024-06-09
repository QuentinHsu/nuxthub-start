import type { z } from 'zod'

import { DAuthSchema, UserSchema } from '~/server/database/schema'
import { getDuolingoUserInfo } from '~/utils/duolingo'

export default eventHandler(async (event) => {
  try {
    await readValidatedBody(event, DAuthSchema.parseAsync)
    const { user_id, cookie }: z.infer<typeof DAuthSchema> = await readBody(event)
    // Check if user already exists
    const db = hubDatabase()
    const user = await db.prepare(`SELECT * FROM users WHERE user_id = ?`).bind(user_id).first()
    if (user) {
      return {
        status: 409,
        message: 'Conflict',
        error: 'User already exists',
      }
    }

    const dUser = await getDuolingoUserInfo(user_id, cookie)
    dUser.picture = 'https://press.duolingo.com/d38d3c0af71b74294bad.svg'
    if (!dUser.username) {
      return {
        status: 401,
        message: 'Unauthorized',
        error: 'Invalid user_id in Duolingo',
      }
    }

    await db
      .prepare('INSERT INTO users (user_id, cookie, username, name, picture, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)')
      .bind(user_id, cookie, dUser.username, dUser.name = '', dUser.picture, Date.now(), Date.now())
      .run()

    return {
      status: 201,
      message: 'Created',
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
