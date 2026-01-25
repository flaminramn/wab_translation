const bookId = 1; // change per book

fetch(`/api/book/${bookId}`)
  .then(r => r.json())
  .then(data => {
    document.getElementById("title").textContent = data.title;

    const container = document.getElementById("pages");
    data.pages.forEach(p => {
      const img = document.createElement("img");
      img.src = p.fileUrl;
      img.loading = "lazy";
      container.appendChild(img);
    });
  });
