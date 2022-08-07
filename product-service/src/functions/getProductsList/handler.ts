import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import ProductRepository from 'src/repository/productRepository';

const getProductsList: any = async (event) => {
  let list = await new ProductRepository().list()
  return formatJSONResponse({
    list,
    event,
  });
};

export const main = middyfy(getProductsList);
