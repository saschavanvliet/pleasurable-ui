document.addEventListener("DOMContentLoaded", () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
    lazyImages.forEach((img) => {
      img.addEventListener("load", () => {
        img.classList.add("loaded");
      });
  
      // Als afbeelding al geladen is (bv. uit de cache)
      if (img.complete) {
        img.classList.add("loaded");
      }
    });
  
    console.log(`Aantal lazy images gevonden: ${lazyImages.length}`);
  });