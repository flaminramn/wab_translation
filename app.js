const bookId = 1;

fetch(`https://YOUR-FUNCTION-APP.azurewebsites.net/api/book/${bookId}`)
  .then(r => {
    if (!r.ok) {
      throw new Error("API failed with status " + r.status);
    }
    return r.json();
  })
  .then(data => {
    if (!data || !Array.isArray(data.pages)) {
      console.error("Invalid API response", data);
      return;
    }

    document.getElementById("title").textContent = data.title;

    const container = document.getElementById("pages");
    container.innerHTML = "";

    data.pages.forEach(p => {
      const img = document.createElement("img");
      img.src = p.fileUrl;
      img.loading = "lazy";
      container.appendChild(img);
    });
  })
  .catch(err => {
    console.error(err);
  });

