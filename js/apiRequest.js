// const fetchData = async () => {
//   const apiUrl = 'https://glosipi-web.man.aws.takeda.io/piwebapi/dataservers/F1DS03F4Hfeqh0G3eDN9d3ldEQV1VTVkdBUElBUkNQMDAx/points?nameFilter=RI*CP*BATCH*';
//   const username = 'SVC-2395624-01'; // Sostituisci con il tuo nome utente
//   const password = 'tFl3WzsOOYD11Fy%h$so'; // Sostituisci con la tua password

//   const authString = btoa(`${username}:${password}`);

//   try {
//       const response = await axios.get(apiUrl, {
//           headers: {
//               'Authorization': `Basic ${authString}`,
//               'Content-Type': 'application/json'
//           }
//       });

//       console.log('Data:', response.data);
//   } catch (error) {
//       console.error('Error fetching data:', error);
//   }
// };

// fetchData();