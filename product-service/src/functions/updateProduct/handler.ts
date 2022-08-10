import type { ValidatedEventAPIGatewayProxyEvent } from '@utils/api-gateway';
import { middyfy } from '@utils/lambda.util';
import { Product } from '../../models/product.model';

const updateProduct: ValidatedEventAPIGatewayProxyEvent<Product> = async (event) => {
  return {}
};

export const main = middyfy(updateProduct);
