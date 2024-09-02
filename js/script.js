document.addEventListener('DOMContentLoaded', function() {
    const countdownElements = document.querySelectorAll('#countdown span');
    const progressBarElements = document.querySelectorAll('#progress-bar');

    countdownElements.forEach((element, index) => {
        let countdown = 30;
        const maxCountdown = countdown; // Salva il valore massimo del countdown
        const interval = setInterval(() => {
            countdown--;
            element.textContent = countdown;
            progressBarElements[index].style.width = `${((maxCountdown - countdown) / maxCountdown) * 100}%`;
            if (countdown <= 0) {
                clearInterval(interval);
            }
        }, 1000);
    });

    // Funzione per fare la chiamata API
    function fetchData() {
        const url = 'https://glosipi-web.man.aws.takeda.io/piwebapi/dataservers/F1DS03F4Hfeqh0G3eDN9d3ldEQV1VTVkdBUElBUkNQMDAx/points?nameFilter=RI*CP*BATCH*';

        fetch(url, { mode: 'no-cors' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }

    // Chiamata della funzione fetchData
    fetchData();
});
