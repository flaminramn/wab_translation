const apiUrl = "/api/books";

fetch(apiUrl)
  .then(res => res.json())
  .then(books => {
    const list = document.createElement("ul");

    books.forEach(book => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `/book.html?bookId=${book.BookId}`; // make sure this page exists or change as needed
      link.textContent = book.Title;
      item.appendChild(link);
      list.appendChild(item);
    });

    document.getElementById("pages").innerHTML = ""; // clear any old content
    document.getElementById("pages").appendChild(list);
  })
  .catch(err => {
    document.body.innerHTML = `<p>Error loading books: ${err.message}</p>`;
  });
