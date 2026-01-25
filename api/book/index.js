const sql = require("mssql");

module.exports = async function (context, req) {
  const bookId = context.bindingData.bookId;

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

    if (result.recordset.length === 0) {
      context.res = {
        status: 404,
        body: "Not found"
      };
      return;
    }

    context.res = {
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        title: result.recordset[0].Title,
        pages: result.recordset.map(row => ({
          pageNumber: row.PageNumber,
          fileUrl: row.FileUrl
        }))
      }
    };
  } catch (err) {
    context.log(err);
    context.res = {
      status: 500,
      body: "Server error"
    };
  }
};
