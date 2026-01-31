console.log("app.js loaded");

fetch('/api/books')
  .then(res => {
    console.log("API response status:", res.status);
    return res.json();
  })
  .then(books => {
    console.log("Books received:", books);

    const list = document.getElementById('book-list');

    if (!Array.isArray(books)) {
      list.innerHTML = "<li>Unexpected data format</li>";
      return;
    }

    books.forEach(book => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `book.html?bookId=${book.BookId}`;
      a.textContent = book.Title || "(Untitled)";
      li.appendChild(a);
      list.appendChild(li);
    });
  })
  .catch(err => {
    console.error("Error fetching books:", err);
    document.getElementById('book-list').innerHTML = `<li>Error: ${err.message}</li>`;
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
