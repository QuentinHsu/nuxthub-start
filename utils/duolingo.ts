import type { z } from 'zod'
import { type DAuthSchema, UserSchema } from '~/server/database/schema'

/**
 * Get the user info from Duolingo
 * @param user_id  The user_id of the user in Duolingo
 * @param cookie The cookie of the user in Duolingo
 * @returns The user info from Duolingo
 */
export async function getDuolingoUserInfo(user_id: z.infer<typeof DAuthSchema.shape.user_id>, cookie: z.infer<typeof DAuthSchema.shape.cookie>): Promise<z.infer<typeof UserSchema>> {
  const IDUserFields = UserSchema.omit({ user_id: true, cookie: true, created_at: true, updated_at: true })
  const dUser: z.infer<typeof IDUserFields> = {
    username: '',
    name: '',
    picture: '',
  }
    type IFieldsType = z.infer<typeof IDUserFields>
    type IFieldsTypeKeys = keyof IFieldsType
    type IFieldsArray = IFieldsTypeKeys[]
    const fields: IFieldsArray = Object.keys(dUser) as IFieldsArray
    const url = `https://www.duolingo.com/2017-06-30/users/${user_id}?fields=${fields}`
    return await (await fetch(url, {
      headers: {
        Cookie: cookie, // no cookie, no email
      },
    })).json()
}
