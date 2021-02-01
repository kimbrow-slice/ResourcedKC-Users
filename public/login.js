async function loginUser() {
    let currentUser =  new FormData();
    currentUser.append('username', document.getElementById('username').value);
    currentUser.append('password', document.getElementById('password').value);

    for (var key of currentUser.entries()) {
        console.log(key[0] + ', ' + key[1]);
    }
    console.log(currentUser);

    let requestOptions = {
      method : "POST",
      body : currentUser,
    };
    
    const response = await fetch('/login',requestOptions);
    console.log(response);
    const body = await response.json();
    console.log(body);
    if (response.status != 200){
      console.log(body);
    }
    else if(response.status === 200) {
      setCookie("currentUser",body.id, 1);
      window.location.href = 'welcome.html';
    }
  }


document.getElementById('login').addEventListener('submit', (event) => {
    event.preventDefault();
    loginUser().then( ()=> {
      console.log('success');
    }).catch((err)=>{
      console.log(err);
    });
  })