import { ValidatedEventAPIGatewayProxyEvent } from '@utils/api-gateway';
import { middyfy } from '@utils/lambda.util';
import { Product } from 'src/models/product.model';
import ProductRepository from 'src/repository/productRepository';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<Product> = async (event) => {
  let item = await new ProductRepository().readById(event.pathParameters.id)
  return item
};

export const main = middyfy(getProductsById);
