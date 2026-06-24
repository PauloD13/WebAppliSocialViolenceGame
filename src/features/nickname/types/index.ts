import { z } from 'zod';

// Esquema de validação para a cadeia de caracteres do apelido
export const nicknameSchema = z.object({
  nickname: z.string()
    .min(3, 'O apelido deve possuir ao menos 3 caracteres.')
    .max(15, 'O apelido deve possuir no máximo 15 caracteres.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Utilize apenas letras, números e sublinhados (_).')
});

export type NicknameFormData = z.infer<typeof nicknameSchema>;