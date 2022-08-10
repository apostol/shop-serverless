import type { Product } from "../model/product.schema";
export default class ProductRepository {
    create(item: Product): Promise<Product>;
    find(item: Product): Promise<Product[]>;
    readById(id: string): Promise<Product>;
    update(item: Product): Promise<Product>;
    delete(id: string): Promise<Product>;
    list(): Promise<Product[]>;
    available(): Promise<Product[]>;
}
