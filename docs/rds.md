# RDS Usage

RDS, Relational Database Service. Equal to well know Amazon [RDS](http://aws.amazon.com/rds/).
Support `MySQL` and `SQL Server`.

## MySQL Usage

### Create RDS instance

```js
var rds = require('ali-sdk').rds;

var db = rds({
  host: 'your-rds-address.mysql.rds.aliyuncs.com',
  port: 3306,
  user: 'your-username',
  password: 'your-password',
  database: 'your-database-name',
  // The maximum number of connections to create at once. (Default: 10)
  // connectionLimit: 10,
});
```

### Queries

- Query with arguments

```js
var data = yield db.query('SELECT * FROM your_table LIMIT 100');
// data contains `rows` and `fields` properties
console.log(data.rows);
```

- Query with arguments

```js
var data = yield db.query('SELECT * FROM your_table WHERE id=?', [123]);
// data contains `rows` and `fields` properties
console.log(data.rows);
```

### Transactions

- Get connection first

```js
var conn = yield db.getConnection();
```

- beginTransaction, commit or rollback

```js
var conn = yield db.getConnection();
try {
  yield conn.beginTransaction();
} catch (err) {
  conn.release();
  throw err;
}

try {
  yield conn.query(insertSQL1);
  yield conn.query(insertSQL2);
  yield conn.commit();
} catch (err) {
  // error, rollback
  yield conn.rollback(); // rollback call won't throw err
  throw err;
} finally {
  // should release connection whatever
  conn.release();
}
```

## SQL Server Usage

TBD
