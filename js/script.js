 // JavaScript for countdown and progress bar
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
});