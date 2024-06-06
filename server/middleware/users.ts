export default eventHandler(async () => {
  try {
    const db = hubDatabase()

    await db.exec(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, name TEXT NOT NULL, email TEXT NOT NULL, picture TEXT NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)`)
  }
  catch (error) {
    console.error('[ error - users ]', error)
  }
})
