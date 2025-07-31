let card = document.getElementById("card");

card.addEventListener("mousemove", event => {

   const pointerX = event.clientX;
   const pointerY = event.clientY;
   
   const cardRect = card.getBoundingClientRect();


   const halfWidth = cardRect.width / 2;
   const halfHeight = cardRect.height / 2;

   const cardcenterX = cardRect.left + halfWidth;
   const cardcenterY = cardRect.top + halfHeight;

   const deltaX = pointerX - cardcenterX;
   const deltaY = pointerY - cardcenterY;

   const rx = (deltaY / halfHeight) * 10; // Rotate around X-axis
   const ry = (deltaX / halfWidth) * 10; // Rotate around Y

   const disteancetoCenter = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
   const maxDistance = Math.max(halfHeight, halfWidth); // Fixed Math.max
   const degree = (disteancetoCenter / maxDistance) * 10; // Calculate degree based on distance

   card.style.transform = `perspective(400px) rotate3d(${-rx}, ${ry}, 0, ${degree}deg)`;

});

card.addEventListener("mouseleave", () => {
   card.style.transform = "perspective(400px) rotate3d(0, 0, 0, 0deg)";
});