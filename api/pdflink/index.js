module.exports = async function (context, req) {
  const bookId = req.query.bookId;

  context.res = {
    status: 200,
    body: `pdflink reached with id ${bookId}`
  };
};
