import { z } from 'zod'

export const UserSchema = z.object({
  id: z.number().optional(),
  username: z.string().trim().min(1).max(50),
  name: z.string().trim().min(1).max(50),
  email: z.string().trim().email().max(50),
  picture: z.string().trim().url().max(255),
  created_at: z.number().int().optional(),
  updated_at: z.number().int().optional(),
})
