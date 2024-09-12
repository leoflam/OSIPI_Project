function apiRequestAccess(){
    AuthorizationServiceConfiguration.fetchFromIssuer(openIdConnectUrl)
  .then(response => {
    log('Fetched service configuration', response);
    this.configuration = response;
    this.showMessage('Completed fetching configuration');
  })
  .catch(error => {
    log('Something bad happened', error);
    this.showMessage(`Something bad happened ${error}`)
  });
    
}