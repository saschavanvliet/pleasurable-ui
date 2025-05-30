const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  });

  document.querySelectorAll('.fade-in-geveltuinafbeelding').forEach(img => {
    observer.observe(img);
  });

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
  
  function scrollCarousel(direction) {
    const container = document.getElementById('stekjesCarousel');
    const scrollAmount = 220;
    container.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }