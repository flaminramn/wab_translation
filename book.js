const params = new URLSearchParams(window.location.search);
const bookId = params.get("bookId");

if (!bookId) {
  document.getElementById("title").textContent = "Book not found";
  throw new Error("Missing bookId");
}

fetch(`/api/book?bookId=${bookId}`)
  .then(res => {
    if (!res.ok) {
      throw new Error("API error " + res.status);
    }
    return res.json();
  })
  .then(data => {
    document.getElementById("title").textContent = data.Title;
    const container = document.getElementById("pages");
    container.innerHTML = "";

    data.pages.forEach(page => {
      const img = document.createElement("img");
      img.src = page.fileUrl;
      img.alt = `Page ${page.pageNumber}`;
      img.style.width = "100%";
      img.style.marginBottom = "20px";
      container.appendChild(img);
    });
  })
  .catch(err => {
    console.error(err);
    document.getElementById("title").textContent = "Failed to load book";
  });
