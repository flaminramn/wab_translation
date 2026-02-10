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

          // PDF link (protected via SAS)
          if (book.PdfUrl) {
            const pdfLink = document.createElement("a");
            pdfLink.href = "#";
            pdfLink.textContent = " [PDF]";
            pdfLink.rel = "noopener";

            pdfLink.addEventListener("click", e => {
              e.preventDefault();

              fetch(`/api/pdflink?bookId=${book.BookId}`)
                .then(r => r.json())
                .then(d => {
                  if (!d.url) {
                    alert("PDF unavailable");
                    return;
                  }
                  window.open(d.url, "_blank");
                })
                .catch(err => {
                  console.error(err);
                  alert("Unable to open PDF");
                });
            });

            li.appendChild(pdfLink);
          }

          // IMPORTANT: add the row to the list
          list.appendChild(li);
        });

        // IMPORTANT: update page number ONCE, after loop
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

  // Initial load
  loadBooks(currentPage);
});
