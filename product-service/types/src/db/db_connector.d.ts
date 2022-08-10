import { Client } from "pg";
declare const createDB: () => Promise<Client>;
export default createDB;
