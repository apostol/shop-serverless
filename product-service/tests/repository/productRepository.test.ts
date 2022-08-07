import ProductRepository from "../../src/repository/productRepository"

describe('testing index file', () => {
  test('empty string should result in zero', async () => {
    let r = new ProductRepository()
    console.log(await JSON.stringify(r.list()))
    //expect(main).toBe(0);
  });
});

describe('testing index file', () => {
  test('empty string should result in zero', async () => {
    let r = new ProductRepository()
    console.log(await JSON.stringify(r.readById('7567ec4b-b10c-48c5-9345-fc73c48a80aa')))
    //expect(main).toBe(0);
  });
});
