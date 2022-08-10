import type { ValidatedEventAPIGatewayProxyEvent } from '@utils/api-gateway';
import { middyfy } from '@utils/lambda.util';
import { Product } from 'src/models/product.model';


const deleteProduct: ValidatedEventAPIGatewayProxyEvent<Product> = async (event) => {
  return {
    message: `Delete product`,
    event,
  };
};

export const main = middyfy(deleteProduct);
