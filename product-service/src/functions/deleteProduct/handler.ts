import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productScheme } from 'src/model/product.schema';


const deleteProduct: ValidatedEventAPIGatewayProxyEvent<typeof productScheme> = async (event) => {
  return formatJSONResponse({
    message: `Delete product`,
    event,
  });
};

export const main = middyfy(deleteProduct);
