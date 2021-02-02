async function logOut() {
    let requestOptions = {
        method: "POST"
    };

    const response = await fetch('/logout?_method=DELETE', requestOptions);
    console.log(response);
    if(response.status === 204){
      window.location.href ="../index.html"
    }
    
}


document.getElementById('logout').addEventListener('submit', (event) => {
    event.preventDefault();
    logOut().then( ()=> {
        console.log('success');
      }).catch((err)=>{
        console.log(err);
      });
    })