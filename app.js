console.log("app.js loaded");

document.addEventListener("DOMContentLoaded", () => {

  let currentPage = 1;
  const pageSize = 25;

  function loadBooks(page) {
    fetch(`/api/books?page=${page}`)
      .then(res => res.json())
      .then(books => {
        const list = document.getElementById("book-list");
        list.innerHTML = "";

        if (!Array.isArray(books)) {
          list.innerHTML = "<li>Unexpected data format</li>";
          return;
        }

        books.forEach(book => {
          if (!book.BookId) return;

          const li = document.createElement("li");

          // Title link (images page)
          const titleLink = document.createElement("a");
          titleLink.href = `book.html?bookId=${book.BookId}`;
          titleLink.textContent = book.Title || "(Untitled)";
          li.appendChild(titleLink);

          // PDF link
          if (book.PdfUrl) {
            const pdfLink = document.createElement("a");
            pdfLink.href = "#";
            pdfLink.textContent = " [PDF]";
            pdfLink.rel = "noopener";

            pdfLink.addEventListener("click", e => {
              e.preventDefault();
              window.open(`/api/pdflink?bookId=${book.BookId}`, "_blank");
            });


            li.appendChild(pdfLink);
          }

          list.appendChild(li);
        });

        const pageNumber = document.getElementById("page-number");
        if (pageNumber) {
          pageNumber.textContent = page;
        }
      })
      .catch(err => {
        document.getElementById("book-list").innerHTML =
          `<li>Error: ${err.message}</li>`;
      });
  }

  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("prev");

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentPage += 1;
      loadBooks(currentPage);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage -= 1;
        loadBooks(currentPage);
      }
    });
  }

  loadBooks(currentPage);
});
