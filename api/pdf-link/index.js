const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
const sql = require("mssql");


module.exports = async function (context, req) {
    context.log("pdf-link invoked");
  // 1. Require login
  if (!req.headers["x-ms-client-principal"]) {
    context.res = { status: 401, body: "Not authenticated" };
    return;
  }

  const bookId = req.query.bookId;
  if (!bookId) {
    context.res = { status: 400, body: "bookId required" };
    return;
  }

  // 2. DB lookup
  const pool = await sql.connect(process.env.SQL_CONNECTION_STRING);

  const result = await pool.request()
    .input("BookId", sql.Int, bookId)
    .query(`
      SELECT FolderName
      FROM dbo.Books
      WHERE BookId = @BookId
    `);

  if (!result.recordset.length) {
    context.res = { status: 404, body: "Book not found" };
    return;
  }

  const folderName = result.recordset[0].FolderName;

  // 3. Blob info
  const containerName = "wab-scans";
  const blobName = `${folderName}/searchablepdf.pdf`;

  // 4. Build SAS
  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);

  const accountName = blobServiceClient.accountName;
  const credential = blobServiceClient.credential;

  const expiresOn = new Date();
  expiresOn.setMinutes(expiresOn.getMinutes() + 10); // 10-minute access

  const sasUrl = await blobServiceClient
    .getContainerClient(containerName)
    .getBlobClient(blobName)
    .generateSasUrl({
      permissions: "r",
      expiresOn
    });

  // 5. Return signed link
  context.res = {
    status: 200,
    body: { url: sasUrl }
  };
};
