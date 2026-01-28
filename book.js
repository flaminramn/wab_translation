const params = new URLSearchParams(window.location.search);
const bookId = params.get("bookId");

fetch(`/api/book/${bookId}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("title").textContent = data.title;
    const container = document.getElementById("pages");

    data.pages.forEach(page => {
      const img = document.createElement("img");
      img.src = page.fileUrl;
      img.alt = `Page ${page.pageNumber}`;
      img.style.width = "100%";
      img.style.marginBottom = "20px";
      container.appendChild(img);
    });
  });
