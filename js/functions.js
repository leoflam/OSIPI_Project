const cardContainer = document.getElementById("card-container");
const cardContainerDetail = document.getElementById('card-container-detail');

let formattedDate, startHours, startMinutes, date;

function toggleCardBackground(machine) {
    return machine.value === "" ? 'lf-bg-red' : 'lf-bg-green';
}

function extractInitialDateTime(machine) {
    date = new Date(machine.timeStamp);
    formattedDate = date.toLocaleDateString('it-IT');
    startHours = date.getHours();
    startMinutes = date.getMinutes();

    // return {
    //     formattedDate,
    //     startHours,
    //     startMinutes
    // };

    //pensando che lavorassero sullo stesso fuso orario, invece il database è in fuso orario utc
    // const timeString = machine.timeStamp.split('T')[1].split('Z')[0];
    // [startHours, startMinutes] = timeString.split(':');
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
    const totalMilliseconds = endDate.getTime() - startDate.getTime();
    const totalSeconds = Math.max(0, Math.floor(totalMilliseconds / 1000)); // Imposta a zero se negativo
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
    const { hours: remainingHours, minutes: remainingMinutes, seconds:remainingSeconds } = calculateTimeRemaining(new Date(), endDate);

    return `
        <div class="card ${cardBackgroundClass}" id="card-${index}">
            <div class="card-header">
                <h4 class="card-title">Macchina: ${title}</h4>
            </div>
            <div class="card-body">
                <div class="row row-cols-1 my-2">
                    <div class="col">
                        <div class="progress">
                            <div id="progress-bar-${index}" class="progress-bar bg-success" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                            <span class="percentage" id="percentage-${index}"></span>
                        </div>
                    </div>
                </div>
                <div class="process"><span class="fw-bold">Equipment:</span> ${equipment}</div>
                <div class="row row-cols-2 mb-2">
                    <div class="col">
                         <div><span class="fw-bold">Data inizio:</span> ${formattedDate}</div>
                    </div>
                    <div class="col">
                        <div><span class="fw-bold">Data fine: </span>${formattedEndDate}</div>
                    </div>
                    <div class="col">
                        <div><span class="fw-bold">Ora di inizio:</span> ${startHours}:${startMinutes}</div>
                    </div>
                    <div class="col">
                        <div><span class="fw-bold">Ora fine prevista:</span> ${formattedEndTime}</div>
                    </div>
                </div>
                ${createIntermediateProgressBars(index)}
                <div id="countdown-${index}" class="card-text mb-2">Tempo rimanente: <span>${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s</span></div>
                
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

function updateProgressBar(machine, index) {
    // Utilizza extractInitialDateTime per ottenere la data di inizio
    extractInitialDateTime(machine);
    const startDate = date;
    if (isNaN(startDate)) {
        console.error("Invalid start date");
        return;
    }

    // Utilizza calculateEndDate per ottenere la data di fine
    const endDate = calculateEndDate(machine);

    console.log(`Start Date: ${startDate}`);
    console.log(`End Date: ${endDate}`);
    console.log(`Current Date: ${new Date()}`);

    if (startDate > new Date()) {
        console.error("Start date is in the future");
        console.log(`Current Date: ${new Date()}`);
        console.log(`Start Date: ${startDate}`);
        return;
    }

    const interval = setInterval(() => {
        const now = new Date();
        const totalMilliseconds = endDate - startDate;
        const elapsedMilliseconds = now - startDate;

        console.log(`Now: ${now}`);
        console.log(`Total Milliseconds: ${totalMilliseconds}`);
        console.log(`Elapsed Milliseconds: ${elapsedMilliseconds}`);

        if (elapsedMilliseconds < 0) {
            console.error("Elapsed time is negative");
            clearInterval(interval);
            return;
        }

        const percentage = Math.min(100, (elapsedMilliseconds / totalMilliseconds) * 100);

        console.log(`Percentage: ${percentage}%`);

        const progressBar = document.querySelector(`#progress-bar-${index}`);
        const percentageText = document.querySelector(`#percentage-${index}`);

        if (progressBar && percentageText) {
            progressBar.style.width = `${percentage}%`;
            percentageText.textContent = `${Math.round(percentage)}%`;
        } else {
            console.error(`Progress bar or percentage text not found for index ${index}`);
            clearInterval(interval);
            return;
        }

        if (percentage >= 100) {
            clearInterval(interval);
            progressBar.style.width = '100%';
            percentageText.textContent = '100%';
        }
    }, 1000);
}

function updateTimeRemaining(machine, index) {
    const startDate = new Date(machine.timeStamp);
    const endDate = new Date(startDate.getTime() + parseInt(machine.avgTime, 10) * 1000);

    const interval = setInterval(() => {
        const now = new Date();
        const { hours, minutes, seconds } = calculateTimeRemaining(now, endDate);

        document.querySelector(`#countdown-${index} span`).textContent = `${hours}h ${minutes}m ${seconds}s`;

        if (hours === 0 && minutes === 0 && seconds === 0) {
            clearInterval(interval);
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

document.addEventListener('DOMContentLoaded', function() {
    const cardContainer = document.getElementById("card-container");

    cardContainer.innerHTML = generateCards(machines);
});
