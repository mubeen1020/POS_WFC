export  const getSecrets =   {
    API_URL:"http://localhost:1700/",
    token : () => { return localStorage.getItem('token'); }
}; 