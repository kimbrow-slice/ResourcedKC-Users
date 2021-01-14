async function createAcct() {
    let createAcct = {
      username : document.getElementById('username').value,
      password : document.getElementById('password').value,
      password2: document.getElementById('passwordConfirm').value,
      email : document.getElementById('email').value,
      admin : false
    };

    let requestOptions = {
      method: "POST",
      body: JSON.stringify(createAcct),
      headers: { "Content-Type": "application/json" },
    };
    if (confirm("Would like access your account?")) {
      window.location = "index.html"
  }
    const response = await fetch("/register", requestOptions);
    
    if (response.status != 200) {
      throw Error("Error!");
    }
    
    return createAcct;
  }