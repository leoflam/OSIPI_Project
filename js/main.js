document.addEventListener('DOMContentLoaded', function() {
    const cardContainer = document.getElementById("card-container");
    const cardContainerDetail = document.getElementById('card-container-detail');

    cardContainer.innerHTML = generateCards(machines);

    window.showDetails = showDetails;
    window.goBack = goBack;
});
