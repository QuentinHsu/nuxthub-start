import { z } from 'zod'

export const UserSchema = z.object({
  id: z.number().optional(),
  username: z.string().trim().min(1).max(50),
  name: z.string().trim().min(1).max(50),
  email: z.string().trim().max(50)
    .superRefine((val, ctx) => {
      if (val === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email is required',
        })
        return false
      }
      if (!val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email is required',
        })
        return false
      }
      else if (!/^[\w-]+@[\w-]+(?:\.[\w-]+)+$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email format is incorrect',
        })
        return false
      }
    }),
  picture: z.string().trim().url().max(255),
  created_at: z.number().int().optional(),
  updated_at: z.number().int().optional(),
})
