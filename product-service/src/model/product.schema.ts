import { FromSchema } from "json-schema-to-ts";

export const productScheme = {
  type: "object",
  properties: {
    id: { type: 'string' },
    count: { type: 'number' },
    description: { type: 'string' },
    price: { type: 'number' },
    title: { type: 'string' },
    category_id: { type: 'number' }
  },
} as const;

export type Product = FromSchema<typeof productScheme>;

