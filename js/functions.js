const cardContainer = document.getElementById("card-container");
const cardContainerDetail = document.getElementById('card-container-detail');

// let formattedDate, startHours, startMinutes, date;

//Setter

function setStatus(machine) {
    let status;
    if (machine.value != ""){
        status = "Occupato";
    }else if(machine.maintenance){
        status = "In manutenzione";
    }else{
        status = "Disponibile";
    }
    return  status;
}

function setCardBackground(status) {
    let bgcolor;
   
    switch(status){
        case "Occupato":
            bgcolor = "lf-bg-yellow";
            break
        
        case "In manutenzione":
            bgcolor = "lf-bg-red";
            break
        
        case "Disponibile":
            bgcolor = "lf-bg-green";
            break
        default:
            break;
    }
    return bgcolor;
}


function setStepTime(machine){
    if(machine.step.timeRemaining == 0){
        return "N/A"
    }else{
        return machine.step.timeRemaining / 60;
    }
}

///////

function calculateInitialDateTime(machine, status) {
    if (status == "Disponibile" || status=="In manutenzione"){
        return "N/A";
    } else {
        return new Date(machine.timeStamp);
    }
}

function calculateEndDate(machine, status, startDate) {
    if (status == "Disponibile" || status=="In manutenzione"){
        return "N/A";
    }else{
        return new Date(startDate.getTime() + machine.avgTime * 1000);
    }
}

function formatDateTime(date) {
    let Hours,Minutes,formattedDate;
    if (date == "N/A"){
        Hours = "N/A";
        Minutes = "N/A";
        formattedDate ="N/A";
    } else {
        formattedDate = date.toLocaleDateString('it-IT');
        Hours = date.getHours().toString().padStart(2, '0');
        Minutes = date.getMinutes().toString().padStart(2, '0');
    }
    return {formattedDate,Hours,Minutes}
}


// function formatEndDate(endDate) {
    
//     if(endDate == "N/A"){
//         const formattedEndDate = "N/A";
//         const endHours = "N/A";
//         const endMinutes = "N/A";
//         return { formattedEndDate, formattedEndTime: `${endHours}:${endMinutes}` };
//     }else{
//         const formattedEndDate = endDate.toLocaleDateString('it-IT');
//         const endHours = endDate.getHours().toString().padStart(2, '0');
//         const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
//         return { formattedEndDate, formattedEndTime: `${endHours}:${endMinutes}` };
//     }
    
// }

function calculateTimeRemaining(startDate, endDate) {
    if (endDate == "N/A"){
        const hours = "N/A";
        const minutes = "N/A";
        const seconds = "N/A";
        return { hours, minutes, seconds };
    }else{
        const totalMilliseconds = endDate.getTime() - startDate.getTime();
        const totalSeconds = Math.max(0, Math.floor(totalMilliseconds / 1000)); // Imposta a zero se negativo
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return { hours, minutes, seconds };
    }
    
}


function createCard(machine, index) {
    const title = machine.name.split('_').slice(3, 4)[0].split('%')[0];
    const status = setStatus(machine);
    const cardBackgroundClass = setCardBackground(status);
    const startDate = calculateInitialDateTime(machine, status);
    const endDate = calculateEndDate(machine, status, startDate);
    const equipment = machine.value.split('_')[0];
    
    
    const { formattedDate: formattedStartDate, Hours: startHours, Minutes: startMinutes } = formatDateTime(startDate);
    const { formattedDate: formattedEndDate, Hours: endHours, Minutes: endMinutes } = formatDateTime(endDate);
    const { hours: remainingHours, minutes: remainingMinutes, seconds:remainingSeconds } = calculateTimeRemaining(new Date(), endDate);
    

    return `
        <div class="card ${cardBackgroundClass}" id="card-${index}">
            <div class="card-header">
                <h4 class="card-title">CIP: ${title}</h4>
                <div class="">
                        <span class="fw-bold">Stato:</span>
                        <span>${status}</span>
                </div>
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
                <div class="process"><span class="fw-bold">Equipment in lavaggio:</span> ${equipment}</div>
                <div class="card-text mb-2"><span class="fs-4" >Tempo rimanente lavaggio CIP: </span><span class="fw-bold fs-1" id="countdown-${index}">${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s</span></div>
                <div class="row row-cols-2 mb-2">
                    <div class="col">
                         <div><span class="fw-bold">Data inizio:</span> ${formattedStartDate}</div>
                    </div>
                    <div class="col">
                        <div><span class="fw-bold">Data fine: </span>${formattedEndDate}</div>
                    </div>
                    <div class="col">
                        <div><span class="fw-bold">Ora di inizio:</span> ${startHours}:${startMinutes}</div>
                    </div>
                    <div class="col">
                        <div><span class="fw-bold">Ora fine prevista:</span> ${endHours}:${endMinutes}</div>
                    </div>
                </div>
                


                <div class="my-2">
                    <span class="fw-bold">Step di processo in corso:</span> 
                    <span>N/A</span>
                </div>
                
                <button class="btn btn-danger mt-2" onclick="showDetails()">Dettagli <span><i class="fa-solid fa-info m-1"></i></span></button>
            </div>
        </div>
    `;
}

function updateProgressBar(machine, index) {
    const status = setStatus(machine);
    let percentage = 0;

    if (status === "Disponibile" || status === "In manutenzione") {
        percentage = 0;
    } else {
        const startDate = calculateInitialDateTime(machine);
        const endDate = calculateEndDate(machine);


        const interval = setInterval(() => {
            const now = new Date();
            const totalMilliseconds = endDate.getTime() - startDate.getTime();
            const elapsedMilliseconds = now.getTime() - startDate.getTime();
            console.log(totalMilliseconds,elapsedMilliseconds);

            if (elapsedMilliseconds < 0) {
                clearInterval(interval);
                console.log("Tempo negativo");
                return;
            }

            percentage = Math.min(100, (elapsedMilliseconds / totalMilliseconds) * 100);

            const progressBar = document.querySelector(`#progress-bar-${index}`);
            const percentageText = document.querySelector(`#percentage-${index}`);

            if (progressBar && percentageText) {
                progressBar.style.width = `${percentage}%`;
                percentageText.textContent = `${Math.round(percentage)}%`;
            } else {
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

   
    if (percentage == 0) {
        const progressBar = document.querySelector(`#progress-bar-${index}`);
        const percentageText = document.querySelector(`#percentage-${index}`);

        if (progressBar && percentageText) {
            progressBar.style.width = '0%';
            percentageText.textContent = '0%';
        } 
    }
}

function updateTimeRemaining(machine, index) {
    const startDate = new Date(machine.timeStamp);
    const endDate = new Date(startDate.getTime() + parseInt(machine.avgTime, 10) * 1000);
    const status = setStatus(machine);

    if (status === "Disponibile" || status === "In manutenzione") {
        const hours = 0;
        const minutes = 0;
        const seconds = 0;
        document.querySelector(`#countdown-${index}`).textContent = `${hours}h ${minutes}m ${seconds}s`;
    }else{
        const interval = setInterval(() => {
            const now = new Date();
            const { hours, minutes, seconds } = calculateTimeRemaining(now, endDate);

            document.querySelector(`#countdown-${index}`).textContent = `${hours}h ${minutes}m ${seconds}s`;
            
            const timeRemaining = (endDate - now) / 1000;

            // if (timeRemaining <= 600) {
            //     // console.log(`Adding blinking class to card ${index}`);
            //     document.querySelector(`#card-id-${index}`).classList.add('blinking');
            // }


            if (hours === 0 && minutes === 0 && seconds === 0) {
                clearInterval(interval);
            }
        }, 1000); 
    }

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

//UTILS
function showDetails() {
    cardContainer.style.display = 'none';
    cardContainerDetail.style.display = 'block';
}

function goBack() {
    cardContainer.style.display = 'flex';
    cardContainerDetail.style.display = 'none';
}


//DOM
document.addEventListener('DOMContentLoaded', function() {
    const cardContainer = document.getElementById("card-container");

    cardContainer.innerHTML = generateCards(machines);
});
