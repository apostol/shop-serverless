import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productScheme } from '../../model/product.schema';

const updateProduct: ValidatedEventAPIGatewayProxyEvent<typeof productScheme> = async (event) => {
  return formatJSONResponse({
    message: `Update product`,
    event,
  });
};

export const main = middyfy(updateProduct);
