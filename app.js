console.log("app.js loaded");

console.log("app.js loaded");

let currentPage = 1;
const pageSize = 25;

function loadBooks(page) {
  fetch(`/api/books?page=${page}`)
    .then(res => {
      console.log("API response status:", res.status);
      return res.json();
    })
    .then(books => {
      console.log("Books received:", books);

      const list = document.getElementById("book-list");
      list.innerHTML = "";

      if (!Array.isArray(books)) {
        list.innerHTML = "<li>Unexpected data format</li>";
        return;
      }

      books.forEach(book => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `book.html?bookId=${book.BookId}`;
        a.textContent = book.Title || "(Untitled)";
        li.appendChild(a);
        list.appendChild(li);
      });

      document.getElementById("page-number").textContent = page;
    })
    .catch(err => {
      console.error("Error fetching books:", err);
      document.getElementById("book-list").innerHTML =
        `<li>Error: ${err.message}</li>`;
    });
}

document.getElementById("next").addEventListener("click", () => {
  currentPage += 1;
  loadBooks(currentPage);
});

document.getElementById("prev").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage -= 1;
    loadBooks(currentPage);
  }
});

loadBooks(currentPage);


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
