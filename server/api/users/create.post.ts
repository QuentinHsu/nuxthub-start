export default eventHandler(async (event) => {
  try {
    const user = await readBody(event)

    const db = hubDatabase()
    await db
      .prepare('INSERT INTO users (username, name, email, picture, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)')
      .bind(user.username, user.name, user.email, user.picture, Date.now(), Date.now())
      .run()

    return {}
  }
  catch (error: any) {
    return {
      status: 400,
      message: 'Bad Request',
      error: error.message,
    }
  }
})
