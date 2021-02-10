async function loginUser() {
  



  // console.log(currentUser);

  let requestOptions = {
    method : "POST",
    body : JSON.stringify({  
    'username' : document.getElementById('username').value,
    'password' : document.getElementById('password').value
  }),
    headers: {"Content-Type" : "application/json"}
  };
  // console.log('Y NO WORK');
  const response = await fetch('/login',requestOptions);
  // console.log(response);
  const body = await response.json();
  // console.log(body);

 if(response.status === 200) {
    
    alert("Trying to redirect to authed route");
    window.location.href= "/authed/welcome.html";
    // fetch('/protected', {method: "GET", headers: {'Authorization': 'Bearer ' + body.token}, credentials: "same-origin", redirect:"follow"}).then(function(data){
    //   console.log("redirect res");
    //   console.log(data); 
    //   if(data.redirected){
    //     window.location.href=data.url;
    //   }
    // })
    //window.location.href="/authed/welcome.html"
  }
}


document.getElementById('login').addEventListener('submit', (event) => {
  event.preventDefault();
  loginUser().then( ()=> {
    console.log('success');
  }).catch((err, user)=>{
    if((err) || (user != user) || (user === null))
    console.log(err);
    window.location.href="401.html"
  });
})
