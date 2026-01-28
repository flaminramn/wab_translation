const sql = require("mssql");
let pool;

async function getPool() {
  if (pool) return pool;
  pool = await sql.connect(process.env.SQL_CONNECTION_STRING);
  return pool;
}

module.exports = async function (context, req) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT TOP 20 BookId, Title FROM dbo.Books ORDER BY Title
    `);

    context.res = {
      status: 200,
      body: result.recordset
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: { error: err.message }
    };
  }
};
