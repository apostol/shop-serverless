import type { Product } from "../model/product.schema"
import ProductList from "../db/productList.json"

export default class ProductRepository {
  async create(item: Product): Promise<Product> {
    return item;
  }
  async read(item: Product): Promise<Product> {
    return item;
  }
  async readById(id: string): Promise<Product> {
    let items = await this.list()
    return items.find(t=>t.id == id);
  }

  async update(item: Product): Promise<Product> {
    return item;
  }
  async delete(item: Product): Promise<Product> {
    return item;
  }
  public async list(): Promise<Product[]> {
    return ProductList;
  }
}