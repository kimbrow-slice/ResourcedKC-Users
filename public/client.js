async function createAcct() {
    let createAcct = {
      username : document.getElementById('username').value,
      password : document.getElementById('password').value,
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
    let shelters = document.getElementById('shelterscheck').checked;
    let housing  = document.getElementById('housingcheck').checked;
    let finance  = document.getElementById('financecheck').checked;
    let food     = document.getElementById('foodcheck').chekced;
    let health   = document.getElementById('healthcheck').checked;
    let clothing = document.getElementById('clothingcheck').checked;
    let rehab    = document.getElementById('rehabcheck').checked;

    let response = [];

    let requestOptions = {
      method  : "GET",
      headers : { "Content-Type" : "application/json" },
    };

    if (shelters) {
      const sheltersresponse = await fetch("/resources/emergencyShelters", requestionOptions);
      response.push({ "shelters" : sheltersresponse.body }); //[{}, {}, {}]
    }
    if (finance) {
      const financeresponse = await fetch("/resources/financialAssistance", requestOptions);
      response.push({ "finance" : financeresponse.body });
    }
    if (housing) {
      const housingresponse = await fetch ("/resources/housing", requestOptions);
      response.push({ "housing" : housingresponse.body });
    }
    if (food) {
      const foodresponse = await fetch ("/resources/foodPantries", requestOptions);
      response.push({ "food" : foodresponse.body });
    }
    if (health) {
      const healthresponse = await fetch ("/resources/healthClinics", requestOptions);
      response.push({ "health" : healthresponse.body });
    }
    if (clothing) {
      const clothingresponse = await fetch ("/resources/clothing", requestOptions);
      response.push({ "clothing" : clothingresponse.body })
    }
    if (rehab)  {
      const rehabresponse = await fetch ("/resources/rehab", requestOptions);
      response.push({ "rehab" : rehabresponse.body })
    }

    return response
    // [ {"shelters" : [{}, {}, {}]}, {"xresponse":[{},{}] } ]
   
    // response.shelters
  }

  async function searchByName() {
    let searchByName = document.getElementById('searchbar').value.replace(' ', '+')

    let requestOptions = {
      method  : "POST",
      body    : JSON.stringify(searchByName),
      headers : { "Content-Type" : "application/json" },
    }
    const searchresponse = await fetch ('/resources/?name=' + searchByName, requestOptions);
  }
  
  async function submitResource() {​​​​​
  let node = {​​​​​
  name : document.getElementById('orgname').value,
  description : document.getElementById("services").value,
  phone : document.getElementById("number").value,
  email : document.getElementById("email").value,
  website : document.getElementById("website").value
      }​​​​​;

  let requestOptions = {​​​​​
  method : "POST",
  body : JSON.stringify(node),
  headers : {​​​​​ "Content-Type":"application/json" }​​​​​,
      }​​​​​;
  alert('You have added in your organizations information');
  window.location.href = 'index.html';
  const response = await fetch("/resources", requestOptions);
  if (res.status != 200) {​​​​​
  throw Error("Error!");
      }​​​​​
  return node;
    }​​​​​

