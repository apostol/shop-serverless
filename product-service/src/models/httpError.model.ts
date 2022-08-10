import httpErrorScheme from "./httpError.schema.json";
import { FromSchema } from "json-schema-to-ts";

const schema = httpErrorScheme.schema as object;
export type HttpError = FromSchema<typeof schema>;
