import categoryScheme from "./category.schema.json";
import { FromSchema } from "json-schema-to-ts";

const schema = categoryScheme.schema as object;
export type Category = FromSchema<typeof schema>;
