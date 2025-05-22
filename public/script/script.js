console.log("Script geladen!");

document.addEventListener("DOMContentLoaded", () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
    lazyImages.forEach((img) => {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
  
      // Voor cached afbeeldingen
      if (img.complete) {
        img.classList.add('loaded');
      }
    });
  });