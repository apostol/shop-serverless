import type { ValidatedEventAPIGatewayProxyEvent } from '@utils/api-gateway';
import { middyfy } from '@utils/lambda.util';
import { Product } from '@models/product.model';

const createProduct: ValidatedEventAPIGatewayProxyEvent<Product> = async (event) => {
  return {
    message: `create Product`,
    event,
  };
};

export const main = middyfy(createProduct);
