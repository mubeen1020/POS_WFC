export  const getSecrets =   {
    API_URL:"http://localhost:4000/",
    token : () => { return localStorage.getItem('token'); }
}; 