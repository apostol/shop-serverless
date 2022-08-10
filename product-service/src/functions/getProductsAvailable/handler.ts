import { ValidatedEventAPIGatewayProxyEvent } from '@utils/api-gateway';
import { middyfy } from '@utils/lambda.util';
import ProductRepository from 'src/repository/productRepository';

const getProductsAvailable: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  return await new ProductRepository().available()
};

export const main = middyfy(getProductsAvailable);
