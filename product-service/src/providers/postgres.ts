import { Client, ConnectionConfig } from "pg"
import DbCreateSQLs from "../data/db_create.json"
import ProductList from "../data/productList.json"
import CategoryList from "../data/categoryList.json"
import StoreList from "../data/storeList.json"

const {PG_HOST, PG_PORT, PG_USERNAME, PG_PASSWORD, PG_DATABASE} = process.env;

const dbOprions:ConnectionConfig = {
  host: PG_HOST,
  port: Number.parseInt(PG_PORT),
  user: PG_USERNAME,
  password: PG_PASSWORD,
  database: PG_DATABASE,
  ssl:{
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000
}

const createDB: () => Promise<Client> = async() => {
  const _client = new Client (dbOprions);
  _client.on("error", (err: Error)=>{
    console.log(err)
  })
  _client.on("end", ()=>{
    console.log('PG client is finished.')
  })
  await _client.connect()
  const { rows } = await _client.query(`SELECT EXISTS (SELECT FROM pg_tables WHERE 
    schemaname = 'public' AND 
    tablename  = 'category'
  )`,[]);
  if (!rows[0].exists){
    let _sqls = DbCreateSQLs as []
    _sqls.forEach(async (sql) => {
      console.log("Execute query: ", sql)
      await _client.query(sql,[])
    });
    let categories = CategoryList as []
    categories.forEach(async (item: any) => {
      let sql = "INSERT INTO category (name, description) values ($1,$2)"
      console.log("Execute query: ", sql, JSON.stringify(item))
      await _client.query(sql,[item.name, item.description],(err:Error)=>{
        console.log("INSERT CATEGORY: ",err)
      })
    })

    let products = ProductList as []
    products.forEach(async (item: any) => {
      let sql = "INSERT INTO books (id, title, description, category_id) values ($1,$2,$3, $4)"
      console.log("Execute query: ", sql, JSON.stringify(item))
      await _client.query(sql,[item.id, item.title, item.description, item.category_id],(err:Error)=>{
        console.log("INSERT BOOK: ",err)
      })
    })

    let store = StoreList as []
    store.forEach(async (item: any) => {
      let sql = "INSERT INTO store (book_id, count, price) values ($1,$2,$3)"
      console.log("Execute query: ", sql, JSON.stringify(item))
      await _client.query(sql,[item.id, item.count, item.price],(err:Error)=>{
        console.log("INSERT STORE: ",err)
      })
    })
  }
  return _client
};

export default createDB