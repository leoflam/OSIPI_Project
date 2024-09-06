document.addEventListener('DOMContentLoaded', function() {
    const cardContainer = document.getElementById("card-container");

    cardContainer.innerHTML = generateCards(machines);
});
