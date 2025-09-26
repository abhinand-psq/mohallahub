import dotenv from 'dotenv';
import app from './app.js';
import connectdb from './db/mongoconnection.js';

dotenv.config();

console.log(process.env.CHECK);

let connectionport = process.env.PORT || 3000;

connectdb()
  .then((res) => {
    console.log(res);
    app.listen(connectionport, () => {
      console.log(
        `your coonnection is established http://localhost:${connectionport}`
      );
    });
  })
  .catch((res) => {
    console.error('err', res);
    process.exit(1)
  });
