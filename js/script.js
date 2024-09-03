document.addEventListener('DOMContentLoaded', function() {
    const machines = [
        { name: 'RI_N_0677_CP01F%BATCH', value: "", timeStamp: "2024-09-03T09:31:15Z", avgTime: "5400" },
        { name: 'RI_N_0677_CP02F%BATCH', value: 'FP012_030924_1332', timeStamp: "2024-09-03T15:40:52Z", avgTime: "3600" },
        { name: 'RI_N_0677_CP03F%BATCH', value: 'S16_030924_1458', timeStamp: "2024-09-03T14:42:48Z", avgTime: "1800" },
        // Altri oggetti macchina...
    ];

    const cardContainer = document.getElementById("card-container");
    const cardContainerDetail = document.getElementById('card-container-detail');

    function toggleCardBackground(machine) {
        return machine.value === "" ? 'lf-bg-red' : 'lf-bg-green';
    }

    function generateCards(machines) {
        return machines.map((machine, index) => {
            // Estrai il titolo dal nome
            const title = machine.name.split('_').slice(3, 4)[0].split('%')[0];

            // Estrai data e ora da timeStamp
            const date = new Date(machine.timeStamp);
            const formattedDate = date.toLocaleDateString('it-IT');
            const timeString = machine.timeStamp.split('T')[1].split('Z')[0];
            const [hours, minutes] = timeString.split(':');

            // Estrai value
            const equipment = machine.value.split('_')[0];

            // Determina la classe di sfondo della card
            const cardBackgroundClass = toggleCardBackground(machine);

            // Calcola la data e l'ora di fine previste
            const endDate = new Date(date.getTime() + machine.avgTime * 1000);
            const formattedEndDate = endDate.toLocaleDateString('it-IT');
            const endHours = endDate.getHours().toString().padStart(2, '0');
            const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
            const formattedEndTime = `${endHours}:${endMinutes}`;

            // Crea la card
            return `
                <div class="card ${cardBackgroundClass}" id="card-${index}">
                    <div class="card-header">
                        <h4 class="card-title">Macchina: ${title}</h4>
                    </div>
                    <div class="card-body">
                        <div class="row row-cols-1">
                            <div class="col">
                                <div class="progress">
                                    <div id="progress-bar-${index}" class="progress-bar bg-success" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    <span class="percentage"></span>
                                </div>
                            </div>
                        </div>
                        <div class="process">Equipment: ${equipment}</div>
                        <div>Data inizio: ${formattedDate}</div>
                        <div>Ora di inizio: ${hours}:${minutes}</div>
                        <div>Data fine prevista: ${formattedEndDate}</div>
                        <div>Ora fine prevista: ${formattedEndTime}</div>
                        <p id="countdown-${index}" class="card-text">Tempo rimanente: <span>0</span> secondi</p>
                        <h6> Tag: ${machine.name}</h6>
                        <button class="btn btn-danger mt-2" onclick="showDetails()">Dettagli <span><i class="fa-solid fa-info m-1"></i></span></button>
                    </div>
                </div>
            `;
        }).join('');
    }

    cardContainer.innerHTML = generateCards(machines);

    machines.forEach((machine, index) => {
        if (machine.value !== "" && machine.value !== null) {
            const startDate = new Date(machine.timeStamp);
            const avgTime = parseInt(machine.avgTime, 10) * 1000;
            const endDate = new Date(startDate.getTime() + avgTime);
            const now = new Date();

            let countdown = Math.max(0, Math.floor((endDate - now) / 1000));
            const maxCountdown = countdown;

            const interval = setInterval(() => {
                countdown--;
                document.querySelector(`#countdown-${index} span`).textContent = countdown;
                const percentage = ((maxCountdown - countdown) / maxCountdown) * 100;
                document.querySelector(`#progress-bar-${index}`).style.width = `${percentage}%`;
                document.querySelectorAll('.percentage')[index].textContent = `${Math.round(percentage)}%`;
                if (countdown <= 0) {
                    clearInterval(interval);
                    document.querySelector(`#countdown-${index} span`).textContent = '0';
                    document.querySelector(`#progress-bar-${index}`).style.width = '100%';
                    document.querySelectorAll('.percentage')[index].textContent = '100%';
                }
            }, 1000);
        }
    });

    function showDetails() {
        cardContainer.style.display = 'none';
        cardContainerDetail.style.display = 'block';
    }

    function goBack() {
        cardContainer.style.display = 'flex';
        cardContainerDetail.style.display = 'none';
    }

    window.showDetails = showDetails;
    window.goBack = goBack;
});
