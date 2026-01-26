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

  const id = Number(bookId);
  if (!Number.isInteger(id) || id <= 0) {
    context.res = {
      status: 400,
      headers: { "Content-Type": "application/json" },
      body: { error: "Invalid bookId" }
    };
    return;
  }

  const connStr = process.env.SQL_CONNECTION_STRING;

  // SAFE. context exists here.
  context.log("Conn string present:", !!connStr);

  if (!connStr) {
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: { error: "SQL_CONNECTION_STRING not set" }
    };
    return;
  }

  let pool;
  try {
    pool = await sql.connect(connStr);

    const result = await pool
      .request()
      .input("BookId", sql.Int, id)
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
        headers: { "Content-Type": "application/json" },
        body: { error: "Book not found" }
      };
      return;
    }

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        title: result.recordset[0].Title,
        pages: result.recordset.map(r => ({
          pageNumber: r.PageNumber,
          fileUrl: r.FileUrl
        }))
      }
    };
  } catch (err) {
    context.log.error(err);
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: { error: err.message }
    };
  } finally {
    if (pool) {
      try { await pool.close(); } catch {}
    }
  }
};


