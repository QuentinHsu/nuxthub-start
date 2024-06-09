export default eventHandler(async () => {
  try {
    const db = hubDatabase()

    await db.exec('CREATE TABLE IF NOT EXISTS users ('
    + 'id INTEGER PRIMARY KEY AUTOINCREMENT, '
    + 'user_id INTEGER NOT NULL UNIQUE, '
    + 'cookie TEXT NOT NULL, '
    + 'username TEXT NOT NULL, '
    + 'name TEXT, '
    + 'picture TEXT, '
    + 'created_at INTEGER NOT NULL, '
    + 'updated_at INTEGER NOT NULL'
    + ')',
    )
  }
  catch (error) {
    console.error('[ error - users ]', error)
  }
})
