import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import ProductRepository from 'src/repository/productRepository';

const getProductsById: any = async (event) => {
  let result = null
  try{
    let item = await new ProductRepository().readById(event.pathParameters.id)
    result = formatJSONResponse({
      message: "ok",
      id: event.pathParameters.id,
      product: item
    });
  } catch(err){
    result = formatJSONResponse({
      message: err
    });
  }
  return result;
};

export const main = middyfy(getProductsById);
