import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

const getProductsAvailable: any = async (event) => {
  return formatJSONResponse({
    message: `Get Available`,
    event,
  });
};

export const main = middyfy(getProductsAvailable);
