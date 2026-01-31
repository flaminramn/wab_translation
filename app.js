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

  const titleLink = document.createElement("a");
  titleLink.href = `book.html?bookId=${book.BookId}`;
  titleLink.textContent = book.Title || "(Untitled)";

  const pdfLink = document.createElement("a");
  pdfLink.href = `/books/${book.BookId}/searchablepdf.pdf`;
  pdfLink.textContent = " [PDF]";
  pdfLink.target = "_blank";
  pdfLink.rel = "noopener";

  li.appendChild(titleLink);
  li.appendChild(pdfLink);
  list.appendChild(li);
});


        document.getElementById("page-number").textContent = page;
      })
      .catch(err => {
        document.getElementById("book-list").innerHTML =
          `<li>Error: ${err.message}</li>`;
      });
  }

  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("prev");

  nextBtn.addEventListener("click", () => {
    currentPage += 1;
    loadBooks(currentPage);
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage -= 1;
      loadBooks(currentPage);
    }
  });

  loadBooks(currentPage);
});



// ===============================
// Auth banner logic (ADD BELOW)
// ===============================

fetch("/.auth/me")
  .then(r => r.json())
  .then(data => {
    const loggedIn = data.clientPrincipal !== null;

    const loginLink = document.getElementById("login");
    const logoutLink = document.getElementById("logout");
    const userEmail = document.getElementById("user-email");

    if (loginLink && logoutLink) {
      loginLink.style.display = loggedIn ? "none" : "inline";
      logoutLink.style.display = loggedIn ? "inline" : "none";
    }

    if (loggedIn && userEmail) {
      userEmail.textContent = " | " + data.clientPrincipal.userDetails;
    }
  })
  .catch(err => {
    console.error("Auth check failed:", err);
  });
