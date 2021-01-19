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

  async function findResources() {
    let shelters = document.getElementById('shelterscheck').checked; //any checkmarked services;
    let finance  = document.getElementById('financecheck').checked;
    let housing  = document.getElementById('housingcheck').checked;

    let response = [];

    let requestOptions = {
      method  : "GET",
      headers : { "Content-Type" : "application/json" },
    };

    if (shelters) {
      const sheltersresponse = await fetch("/resources/emergency_shelters", requestionOptions);
      response.push({ "shelters" : sheltersresponse.body }); //[{}, {}, {}]
    }
    if (finance) {
      const financeresponse = await fetch("/resources/financial_assistance", requestOptions);
      response.push({ "finance" : financeresponse.body });
    }
    if (housing) {
      const housingresponse = await fetch ("resources/housing", requestOptions);
      response.push({ "housing" : housingresponse.body });
    }

    // [ {"shelters" : [{}, {}, {}]}, {"xresponse":[{},{}] } ]
   
    // response.shelters
  }

  function test (arrayobject1){
    array[0].shelters
  }