const sql = require("mssql");
let pool;

async function getPool() {
  if (pool) return pool;
  pool = await sql.connect(process.env.SQL_CONNECTION_STRING);
  return pool;
}

module.exports = async function (context, req) {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const pageSize = 25;
    const offset = (page - 1) * pageSize;

    const pool = await sql.connect(process.env.SQL_CONNECTION_STRING);

    const result = await pool.request()
      .input("offset", sql.Int, offset)
      .input("pageSize", sql.Int, pageSize)
      .query(`
        SELECT BookId, Title
        FROM dbo.Books
        ORDER BY Title
        OFFSET @offset ROWS
        FETCH NEXT @pageSize ROWS ONLY
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
