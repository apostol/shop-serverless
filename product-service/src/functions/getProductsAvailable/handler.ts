import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import ProductRepository from 'src/repository/productRepository';

const getProductsAvailable: any = async (event) => {
  let books = await new ProductRepository().available()
  console.log(books)
  return formatJSONResponse({
    books,
    event,
  });
};

export const main = middyfy(getProductsAvailable);
