document.addEventListener('DOMContentLoaded', function() {
    const machines = [
        { name: 'RI_N_0677_CP01F%BATCH', value: "", timeStamp: "2024-09-03T09:31:15Z", avgTime: "5400" },
        { name: 'RI_N_0677_CP02F%BATCH', value: 'FP012_030924_1332', timeStamp: "2024-09-03T11:32:52Z", avgTime: "3600" },
        { name: 'RI_N_0677_CP03F%BATCH', value: 'S16_030924_1458', timeStamp: "2024-09-03T12:58:01Z", avgTime: "1800" },
        { name: 'RI_N_0677_CP01F%BATCH', value: "", timeStamp: "2024-09-03T09:31:15Z", avgTime: "5400" },
        { name: 'RI_N_0677_CP02F%BATCH', value: 'FP012_030924_1332', timeStamp: "2024-09-03T11:32:52Z", avgTime: "3600" },
        { name: 'RI_N_0677_CP03F%BATCH', value: 'S16_030924_1458', timeStamp: "2024-09-03T12:58:01Z", avgTime: "1800" },
        { name: 'RI_N_0677_CP01F%BATCH', value: "", timeStamp: "2024-09-03T09:31:15Z", avgTime: "5400" },
        { name: 'RI_N_0677_CP02F%BATCH', value: 'FP012_030924_1332', timeStamp: "2024-09-03T11:32:52Z", avgTime: "3600" },
        { name: 'RI_N_0677_CP03F%BATCH', value: 'S16_030924_1458', timeStamp: "2024-09-03T12:58:01Z", avgTime: "1800" },
    ];

    const cardContainer = document.getElementById("card-container");
    const cardContainerDetail = document.getElementById('card-container-detail');

    function toggleCardBackground(machine) {
        return machine.value === "" ? 'lf-bg-red' : 'lf-bg-green';
    }

    function generateCards(machines) {
        return machines.map((machine, index) => {
            // Extract title from name
            const title = machine.name.split('_').slice(3, 4)[0].split('%')[0];

            // Format date and time from timeStamp
            const date = new Date(machine.timeStamp);
            const formattedDate = date.toLocaleDateString('it-IT');
            const hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const period = hours >= 12 ? 'PM' : 'AM';
            const formattedTime = `${hours % 12 || 12}:${minutes} ${period}`;

            // estrarre value
            const equipment = machine.value.split('_')[0];

            // Determine card background class
            const cardBackgroundClass = toggleCardBackground(machine);

            // Create card
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
                        <div>Ora di inizio: ${formattedTime}</div>
                        <p id="countdown-${index}" class="card-text">Tempo rimanente: <span>10</span> seconds</p>
                        <h6> Tag: ${machine.name}</h6>
                        <button class="btn btn-danger mt-2" onclick="showDetails()">Dettagli <span><i class="fa-solid fa-info m-1"></i></span></button>
                    </div>
                </div>
            `;
        }).join('');
    }

    cardContainer.innerHTML = generateCards(machines);

    machines.forEach((machine, index) => {
        let countdown = 60;
        const maxCountdown = countdown; // Save the maximum countdown value
        const interval = setInterval(() => {
            countdown--;
            document.querySelector(`#countdown-${index} span`).textContent = countdown;
            const percentage = ((maxCountdown - countdown) / maxCountdown) * 100;
            document.querySelector(`#progress-bar-${index}`).style.width = `${percentage}%`;
            document.querySelectorAll('.percentage')[index].textContent = `${Math.round(percentage)}%`;
            if (countdown <= 0) {
                clearInterval(interval);
            }
        }, 1000);
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

    // // Funzione per fare la chiamata API
    // function fetchData() {
    //     const url = 'https://glosipi-web.man.aws.takeda.io/piwebapi/dataservers/F1DS03F4Hfeqh0G3eDN9d3ldEQV1VTVkdBUElBUkNQMDAx/points?nameFilter=RI*CP*BATCH*';
    
    //     fetch(url, {
    //         method: 'GET',
    //         credentials: 'include', // Include le credenziali di Windows
    //         mode: 'no-cors' // Assicurati che il server supporti le richieste CORS
    //     })
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok ' + response.statusText);
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         console.log(data);
    //     })
    //     .catch(error => {
    //         console.error('There has been a problem with your fetch operation:', error);
    //     });
    // }
    

    // // Chiamata della funzione fetchData
    // fetchData();
// });
