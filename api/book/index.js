const sql = require("mssql");

let pool;

async function getPool() {
  if (pool) return pool;

  pool = await sql.connect(process.env.SQL_CONNECTION_STRING);
  return pool;
}

module.exports = async function (context, req) {
  const bookId = context.bindingData.bookId;

  if (!bookId) {
    context.res = {
      status: 400,
      body: { error: "bookId required" }
    };
    return;
  }

  if (!process.env.SQL_CONNECTION_STRING) {
    context.res = {
      status: 500,
      body: { error: "SQL_CONNECTION_STRING not set" }
    };
    return;
  }

  try {
    const pool = await getPool();

    const result = await pool.request()
      .input("BookId", sql.Int, bookId)
      .query(`
        SELECT b.Title, i.PageNumber, i.FileUrl
        FROM dbo.Books b
        JOIN dbo.BookImages i ON b.BookId = i.BookId
        WHERE b.BookId = @BookId
        ORDER BY i.PageNumber
      `);

    if (result.recordset.length === 0) {
      context.res = {
        status: 404,
        body: { error: "Book not found" }
      };
      return;
    }

    context.res = {
      status: 200,
      body: {
        title: result.recordset[0].Title,
        pages: result.recordset.map(r => ({
          pageNumber: r.PageNumber,
          fileUrl: r.FileUrl
        }))
      }
    };
  } catch (err) {
    context.log("SQL ERROR:", err);
    context.res = {
      status: 500,
      body: { error: err.message }
    };
  }
};
