import dotenv from "dotenv";
dotenv.config()

console.log(process.env.cur_env);
console.log(process.env.cur_env == "production");

