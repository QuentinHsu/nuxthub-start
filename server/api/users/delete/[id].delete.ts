import type { z } from 'zod'

import type { DAuthSchema } from '~/server/database/schema'

export default eventHandler(async (event) => {
  try {
    const id: z.infer<typeof DAuthSchema.shape.id> = Number(getRouterParam(event, 'id'))
    if (Number.isNaN(id)) {
      return {
        status: 400,
        message: 'Bad Request',
        error: 'id must be a number',
      }
    }
    const db = hubDatabase()
    // fist: Confirm whether the data exists.
    const isExist = Boolean(await db.prepare(`SELECT * FROM users WHERE id = ?`).bind(id).first())
    if (!isExist) {
      return {
        status: 404,
        message: 'Not Found',
        error: 'User does not exist',
      }
    }

    await db.prepare(`DELETE FROM users WHERE id = ?`).bind(id).run()
    return {
      status: 200,
      message: 'OK',
    }
  }
  catch (error: any) {
    console.error('[ error - users delete ]', error)
    return {
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    }
  }
})
