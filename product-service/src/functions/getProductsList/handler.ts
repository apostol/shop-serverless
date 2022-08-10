import { ValidatedEventAPIGatewayProxyEvent } from '@utils/api-gateway';
import { middyfy } from '@utils/lambda.util';
import ProductRepository from 'src/repository/productRepository';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<any> = 
  async (event) => await new ProductRepository().list()

export const main = middyfy(getProductsList);
