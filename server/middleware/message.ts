export default eventHandler(async () => {
  try {
    const db = hubDatabase()
    await db.exec('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, text TEXT, created_at INTEGER)')
  }
  catch (error) {
    console.error('[ error - users ]', error)
  }
})
