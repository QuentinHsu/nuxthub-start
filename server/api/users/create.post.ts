import { UserSchema } from '~/server/database/schema'

export default eventHandler(async (event) => {
  try {
    await readValidatedBody(event, UserSchema.parse)
    const user = await readBody(event)

    const db = hubDatabase()
    await db
      .prepare('INSERT INTO users (username, name, email, picture, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)')
      .bind(user.username, user.name, user.email, user.picture, Date.now(), Date.now())
      .run()

    return {
      status: 201,
      message: 'Created',
    }
  }
  catch (error: any) {
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
