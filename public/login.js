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
  console.log('Y NO WORK');
  const response = await fetch('/login',requestOptions);
  console.log(response);
  const body = await response.json();
  console.log(body);

 if(response.status === 200) {
    setCookie("cookie",body.token, 1);
    alert("Trying to redirect to authed route");
    fetch('/protected', {method: "GET", headers: {'Authorization': 'jwt' + body.token}, credentials: "include"})
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
