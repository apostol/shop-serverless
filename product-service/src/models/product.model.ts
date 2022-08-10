import productScheme from "./product.schema.json";
import { FromSchema } from "json-schema-to-ts";

const schema = productScheme.schema
export type Product = FromSchema<typeof schema>;
