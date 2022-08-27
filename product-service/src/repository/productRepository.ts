import type { Product } from "../models/product.model"
import Client from "../providers/postgres"

export default class ProductRepository {

  async create(item: Product): Promise<Product> {
    let rows;
    let _client;
    try{
      _client = await Client()
      rows = await _client.query(`INSERT INTO books(description, title, category_id)
      VALUES($1,$2,$3) RETURNING *`, [item.description, item.title, item.category_id])
    }catch(err){
      console.log(err)
    }finally{
      _client.end()
    }
    return rows?.rowCount == 1?rows.rows[0]:null;
  }

  async find(item: Product): Promise<Product[]> {
    let result:Product[] = [];
    let _client;
    try{
      _client = await Client()
      if (item.description){
        const { rows } = await _client.query(`SELECT * FROM books WHERE description like "%$1%"`, [item.description])
        result.concat(rows)
      }
      if (item.title){
        const { rows } = await _client.query(`SELECT * FROM books WHERE tile like "%$1%"`, [item.title])
        result.concat(rows)
      }
    }catch(err){
      console.log(err)
    }finally{
      _client.end()
    }
    return result;
  }
  async readById(id: string): Promise<Product> {
    let rows
    let _client
    try{
      _client = await Client()
      rows = await _client.query<Product>('SELECT id, description, title, price, count, category_id FROM books b left join store s on b.id = s.book_id WHERE id = $1 limit 1', [id])
    }catch(err){
      console.log(err)
    }finally{
      _client.end()
    }
    return rows.rowCount == 1?rows.rows[0]:null;
  }

  async update(item: Product): Promise<Product> {
    let _client;
    try{
      _client = await Client()
      if (item.description)
        await _client.query('UPDATE books set description = "$1"', [item.description])
      if (item.title)
        await _client.query('UPDATE books set title = "$1"', [item.title])
    }catch(err){
      console.log(err)
    }finally{
      _client.end()
    }
    return item;
  }

  async delete(id: string): Promise<Product> {
    let _client, rows;
    try{
      _client = await Client()
      rows = await _client.query('DELETE FROM books WHERE id = $1 limit 1 RETURNING *', [id])
    }catch(err){
      console.log(err)
    }finally{
      _client.end()
    }
    return rows?.length == 1?rows[0]:null;
  }

  public async list(): Promise<Product[]> {
    let _client
    let result:Product[] = [];
    try{
      _client = await Client()
      const { rows } = await _client.query('SELECT id, description, title, price, count, category_id FROM books b left join store s on b.id = s.book_id', [])
      result = rows as Product[]
    }catch(err){
      console.log(err)
    }finally{
      _client.end()
    }
    return result;
  }

  public async available(): Promise<Product[]> {
    let _client
    let result:Product[] = [];
    try{
      _client = await Client()
      const { rows } = await _client.query('SELECT id, description, title, price, count, category_id FROM store left join books b on store.book_id = b.id', [])
      result = rows as Product[]
    }catch(err){
      console.log(err)
    }finally{
      _client.end()
    }
    return result;
  }
}