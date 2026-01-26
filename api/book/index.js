const sql = require("mssql");

module.exports = async function (context, req) {
  const bookId = context.bindingData.bookId;

  if (!bookId) {
    context.res = {
      status: 400,
      body: { error: "bookId required" }
    };
    return;
  }

  try {
    const conn = process.env.SQL_CONNECTION_STRING;
    if (!conn) {
      context.res = {
        status: 500,
        body: { error: "SQL_CONNECTION_STRING not set" }
      };
      return;
    }

    const pool = await sql.connect(conn);

    const result = await pool.request()
      .input("BookId", sql.Int, bookId)
      .query(`
        SELECT b.Title, i.PageNumber, i.FileUrl
        FROM dbo.Books b
        JOIN dbo.BookImages i ON b.BookId = i.BookId
        WHERE b.BookId = @BookId
        ORDER BY i.PageNumber
      `);

    if (!result.recordset.length) {
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
    context.log(err);
    context.res = {
      status: 500,
      body: { error: err.message }
    };
  }
};
