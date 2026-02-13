const sql = require("mssql");
const {
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions
} = require("@azure/storage-blob");

module.exports = async function (context, req) {

  const bookId = req.query.bookId;

  if (!bookId) {
    context.res = { status: 400 };
    return;
  }

  const conn = process.env.SQL_CONNECTION_STRING;
  const accountName = process.env.STORAGE_ACCOUNT_NAME;
  const accountKey = process.env.STORAGE_ACCOUNT_KEY;
  const containerName = process.env.STORAGE_CONTAINER_NAME;

  const pool = await sql.connect(conn);

  const result = await pool.request()
    .input("BookId", sql.Int, bookId)
    .query(`
      SELECT PdfUrl
      FROM dbo.Books
      WHERE BookId = @BookId
    `);

  if (result.recordset.length === 0) {
    context.res = { status: 404 };
    return;
  }

  const pdfUrl = result.recordset[0].PdfUrl;
  const url = new URL(pdfUrl);
  const blobName = url.pathname.replace(`/${containerName}/`, "");

  const credential = new StorageSharedKeyCredential(accountName, accountKey);

  const expiresOn = new Date();
  expiresOn.setMinutes(expiresOn.getMinutes() + 10);

  const sas = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("r"),
      expiresOn
    },
    credential
  ).toString();

  const signedUrl = `${pdfUrl}?${sas}`;

  context.res = {
    status: 302,
    headers: {
      Location: signedUrl
    }
  };
};
