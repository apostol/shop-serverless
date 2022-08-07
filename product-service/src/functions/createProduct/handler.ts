import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import productScheme  from 'src/model/product.schema';

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof productScheme> = async (event) => {
  return formatJSONResponse({
    message: `create Product`,
    event,
  });
};

export const main = middyfy(createProduct);
