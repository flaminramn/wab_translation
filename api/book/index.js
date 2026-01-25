const sql = require("mssql");

module.exports = async function (context, req) {
  const bookId = context.bindingData.bookId;

  if (!bookId) {
    context.res = {
      status: 400,
      headers: { "Content-Type": "application/json" },
      body: { error: "bookId required" }
    };
    return;
  }

  try {
    const pool = await sql.connect(process.env.SQL_CONNECTION_STRING);

    const result = await pool
      .request()
      .input("BookId", sql.Int, bookId)
      .query(`
        SELECT b.Title, i.PageNumber, i.FileUrl
        FROM dbo.Books b
        JOIN dbo.BookImages i ON b.BookId = i.BookId
        WHERE b.BookId = @BookId
        ORDER BY i.PageNumber
      `);

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: result.recordset
    };
  } catch (err) {
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: { error: err.message }
    };
  }
};
