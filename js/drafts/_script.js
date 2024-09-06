document.addEventListener('DOMContentLoaded', function() {
    const machines = [
        { name: 'RI_N_0677_CP01F%BATCH', value: "", timeStamp: "2024-09-03T09:31:15Z", avgTime: "5400" },
        { name: 'RI_N_0677_CP02F%BATCH', value: 'FP012_030924_1332', timeStamp: "2024-09-03T15:40:52Z", avgTime: "3600" },
        { name: 'RI_N_0677_CP03F%BATCH', value: 'S16_030924_1458', timeStamp: "2024-09-03T14:42:48Z", avgTime: "1800" },
        // Altri oggetti macchina...
    ];

    const cardContainer = document.getElementById("card-container");
    const cardContainerDetail = document.getElementById('card-container-detail');

    let formattedDate, hours, minutes, date;

    function toggleCardBackground(machine) {
        return machine.value === "" ? 'lf-bg-red' : 'lf-bg-green';
    }

    function extractDateTime(machine) {
        date = new Date(machine.timeStamp);
        formattedDate = date.toLocaleDateString('it-IT');
        const timeString = machine.timeStamp.split('T')[1].split('Z')[0];
        [hours, minutes] = timeString.split(':');
    }

    function calculateEndDate(machine) {
        return new Date(date.getTime() + machine.avgTime * 1000);
    }

    function formatEndDate(endDate) {
        const formattedEndDate = endDate.toLocaleDateString('it-IT');
        const endHours = endDate.getHours().toString().padStart(2, '0');
        const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
        return { formattedEndDate, formattedEndTime: `${endHours}:${endMinutes}` };
    }

    function createCard(machine, index) {
        const title = machine.name.split('_').slice(3, 4)[0].split('%')[0];
        extractDateTime(machine);
        const equipment = machine.value.split('_')[0];
        const cardBackgroundClass = toggleCardBackground(machine);
        const endDate = calculateEndDate(machine);
        const { formattedEndDate, formattedEndTime } = formatEndDate(endDate);

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
                                <span class="percentage-general-${index}"></span>
                            </div>
                        </div>
                    </div>
                    <div class="process">Equipment: ${equipment}</div>
                    <div class="row row-cols-2">
                        <div class="col">
                             <div>Data inizio: ${formattedDate}</div>
                        </div>
                        <div class="col">
                            <div>Ora di inizio: ${hours}:${minutes}</div>
                        </div>
                        <div class="col">
                            <div>Data fine prevista: ${formattedEndDate}</div>
                        </div>
                        <div class="col">
                            <div>Ora fine prevista: ${formattedEndTime}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="row row-cols-2">
                            <div class="col">RO:</div> 
                            <div class="progress">
                                <div id="progress-bar-ro-${index}" class="progress-bar bg-success" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                <span id="percentage-ro-${index}"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="row row-cols-2">
                            <div class="col">SOL BASICA:</div> 
                            <div class="progress">
                                <div id="progress-bar-sol-${index}" class="progress-bar bg-success" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                <span id="percentage-sol-${index}"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="row row-cols-2">
                            <div class="col">WFI:</div> 
                            <div class="progress">
                                <div id="progress-bar-wfi-${index}" class="progress-bar bg-success" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                <span id="percentage-wfi-${index}"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="row row-cols-2">
                            <div class="col">RO:</div> 
                            <div class="progress">
                                <div id="progress-bar-ro2-${index}" class="progress-bar bg-success" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                <span id="percentage-ro2-${index}"></span>
                            </div>
                        </div>
                    </div>
                    <p id="countdown-${index}" class="card-text">Tempo rimanente: <span>0</span> secondi</p>
                    <h6> Tag: ${machine.name}</h6>
                    <button class="btn btn-danger mt-2" onclick="showDetails()">Dettagli <span><i class="fa-solid fa-info m-1"></i></span></button>
                </div>
            </div>
        `;
    }

    function generateCards(machines) {
        return machines.map((machine, index) => createCard(machine, index)).join('');
    }

    function updateProgress(machine, index) {
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
    }

    function showDetails() {
        cardContainer.style.display = 'none';
        cardContainerDetail.style.display = 'block';
    }

    function goBack() {
        cardContainer.style.display = 'flex';
        cardContainerDetail.style.display = 'none';
    }

    cardContainer.innerHTML = generateCards(machines);
    machines.forEach((machine, index) => updateProgress(machine, index));

    window.showDetails = showDetails;
    window.goBack = goBack;
});
