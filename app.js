fetch('/api/books')
  .then(res => res.json())
  .then(books => {
    const list = document.getElementById('book-list');
    books.forEach(book => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `book.html?bookId=${book.BookId}`;
      a.textContent = book.Title;
      li.appendChild(a);
      list.appendChild(li);
    });
  });
