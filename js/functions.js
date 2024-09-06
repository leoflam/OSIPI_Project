let formattedDate, startHours, startMinutes, date;

function toggleCardBackground(machine) {
    return machine.value === "" ? 'lf-bg-red' : 'lf-bg-green';
}

function extractInitialDateTime(machine) {
    date = new Date(machine.timeStamp);
    formattedDate = date.toLocaleDateString('it-IT');
    const timeString = machine.timeStamp.split('T')[1].split('Z')[0];
    [startHours, startMinutes] = timeString.split(':');
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

function calculateTimeRemaining(startDate, endDate) {
    const totalMilliseconds = endDate - startDate;
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
}

function createCard(machine, index) {
    const title = machine.name.split('_').slice(3, 4)[0].split('%')[0];
    extractInitialDateTime(machine);
    const equipment = machine.value.split('_')[0];
    const cardBackgroundClass = toggleCardBackground(machine);
    const endDate = calculateEndDate(machine);
    const { formattedEndDate, formattedEndTime } = formatEndDate(endDate);
    const { hours: remainingHours, minutes: remainingMinutes } = calculateTimeRemaining(new Date(), endDate);

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
                            <span id="percentage-${index}"></span>
                        </div>
                    </div>
                </div>
                <div class="process">Equipment: ${equipment}</div>
                <div class="row row-cols-2">
                    <div class="col">
                         <div>Data inizio: ${formattedDate}</div>
                    </div>
                    <div class="col">
                        <div>Ora di inizio: ${startHours}:${startMinutes}</div>
                    </div>
                    <div class="col">
                        <div>Data fine prevista: ${formattedEndDate}</div>
                    </div>
                    <div class="col">
                        <div>Ora fine prevista: ${formattedEndTime}</div>
                    </div>
                </div>
                ${createIntermediateProgressBars(index)}
                <p id="countdown-${index}" class="card-text">Tempo rimanente: <span>${remainingHours}h ${remainingMinutes}m</span></p>
                
                <button class="btn btn-danger mt-2" onclick="showDetails()">Dettagli <span><i class="fa-solid fa-info m-1"></i></span></button>
            </div>
        </div>
    `;
}

function createIntermediateProgressBars(index) {
    const phases = ['RO', 'SOL BASICA', 'WFI', 'RO2'];
    return phases.map((phase, phaseIndex) => `
        <div class="row">
            <div class="row row-cols-2">
                <div class="col">${phase}:</div> 
                <div class="progress">
                    <div id="progress-bar-${phase.toLowerCase()}-${index}" class="progress-bar bg-success" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    <span id="percentage-${phase.toLowerCase()}-${index}"></span>
                </div>
            </div>
        </div>
    `).join('');
}

function updateTimeRemaining(machine, index) {
    const startDate = new Date(machine.timeStamp);
    const avgTime = parseInt(machine.avgTime, 10) * 1000;
    const endDate = new Date(startDate.getTime() + avgTime);
    const now = new Date();

    let countdown = Math.max(0, Math.floor((endDate - now) / 1000));
    const interval = setInterval(() => {
        countdown--;
        const remainingTime = calculateTimeRemaining(now, endDate);
        document.querySelector(`#countdown-${index} span`).textContent = `${remainingTime.hours}h ${remainingTime.minutes}m ${remainingTime.seconds}s`;
        if (countdown <= 0) {
            clearInterval(interval);
            document.querySelector(`#countdown-${index} span`).textContent = '0h 0m 0s';
        }
    }, 1000);
}

function updateProgressBar(machine, index) {
    const startDate = new Date(machine.timeStamp);
    const avgTime = parseInt(machine.avgTime, 10) * 1000;
    const endDate = new Date(startDate.getTime() + avgTime);

    const interval = setInterval(() => {
        const now = new Date();
        const totalMilliseconds = endDate - startDate;
        const elapsedMilliseconds = now - startDate;
        const percentage = Math.min(100, (elapsedMilliseconds / totalMilliseconds) * 100);

        document.querySelector(`#progress-bar-${index}`).style.width = `${percentage}%`;
        document.querySelector(`#percentage-${index}`).textContent = `${Math.round(percentage)}%`;

        if (percentage >= 100) {
            clearInterval(interval);
            document.querySelector(`#progress-bar-${index}`).style.width = '100%';
            document.querySelector(`#percentage-${index}`).textContent = '100%';
        }
    }, 1000);
}

function generateCards(machines) {
    return machines.map((machine, index) => {
        const cardHTML = createCard(machine, index);
        setTimeout(() => {
            updateTimeRemaining(machine, index);
            updateProgressBar(machine, index);
        }, 0);
        return cardHTML;
    }).join('');
}

function showDetails() {
    cardContainer.style.display = 'none';
    cardContainerDetail.style.display = 'block';
}

function goBack() {
    cardContainer.style.display = 'flex';
    cardContainerDetail.style.display = 'none';
}
