function apiRequest() {
    
    const apiUrl = 'https://glosipi-web.man.aws.takeda.io/piwebapi/dataservers/F1DS03F4Hfeqh0G3eDN9d3ldEQV1VTVkdBUElBUkNQMDAx/points?nameFilter=RI*CP*BATCH*';

    axios.get(apiUrl, { withCredentials: true })
      .then(response => {
        // console.log(response.data);
      })
      .catch(error => {
        // console.error(error);
      });

};