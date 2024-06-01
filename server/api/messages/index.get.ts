export default eventHandler(async () => {
  const db = hubDatabase()

  const { results } = await db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all()

  return results
})
