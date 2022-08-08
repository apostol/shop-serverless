import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import ProductRepository from 'src/repository/productRepository';

const getProductsList: any = async (event) => {
  let books = await new ProductRepository().list()
  return formatJSONResponse({
    books,
    event,
  });
};

export const main = middyfy(getProductsList);
