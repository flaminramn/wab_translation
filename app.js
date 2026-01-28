const bookId = 1; // or any book ID
const apiUrl = `https://black-bush-05d70870f.4.azurestaticapps.net/api/book/${bookId}`;

fetch(apiUrl)
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      document.body.innerHTML = `<p>Error: ${data.error}</p>`;
      return;
    }

    // Show the book title
    const titleEl = document.createElement('h1');
    titleEl.textContent = data.title;
    document.body.appendChild(titleEl);

    // Show each page image
    data.pages.forEach(page => {
      const imgEl = document.createElement('img');
      imgEl.src = page.fileUrl;
      imgEl.alt = `Page ${page.pageNumber}`;
      imgEl.style.width = '100%'; // Adjust as needed
      imgEl.style.marginBottom = '20px';
      document.body.appendChild(imgEl);
    });
  })
  .catch(err => {
    document.body.innerHTML = `<p>Failed to load book: ${err.message}</p>`;
  });
