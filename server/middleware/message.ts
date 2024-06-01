export default eventHandler(async (event) => {
  const db = hubDatabase()

  // initialize the database schema if it doesn't exist yet (this is a no-op if the schema already exists)
  await db.exec('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, text TEXT, created_at INTEGER)')

})
