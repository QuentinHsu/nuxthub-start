import { z } from 'zod'

export const DAuthSchema = z.object({
  id: z.number().positive().int().optional(),
  cookie: z.string().trim().max(255).includes('jwt_token'),
  user_id: z.number().int(),
  created_at: z.number().int().optional(),
  updated_at: z.number().int().optional(),
}).strict()

export const UserSchema = DAuthSchema.extend({
  username: z.string().trim().min(1).max(50).optional(),
  name: z.string().trim().min(1).max(50).optional(),
  picture: z.string().trim().url().max(255).optional(),
}).strict()
