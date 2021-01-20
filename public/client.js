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
      const sheltersresponse = await fetch("/resources/emergency_shelters", requestionOptions);
      response.push({ "shelters" : sheltersresponse.body }); //[{}, {}, {}]
    }
    if (finance) {
      const financeresponse = await fetch("/resources/financial_assistance", requestOptions);
      response.push({ "finance" : financeresponse.body });
    }
    if (housing) {
      const housingresponse = await fetch ("/resources/housing", requestOptions);
      response.push({ "housing" : housingresponse.body });
    }
    if (food) {
      const foodresponse = await fetch ("/resources/foodpantries", requestOptions);
      response.push({ "food" : foodresponse.body });
    }
    if (health) {
      const healthresponse = await fetch ("/resources/healthclinics", requestOptions);
      response.push({ "health" : healthresponse.body });
    }
    if (clothing) {
      const clothingresponse = await fetch ("/resources/clothing", requestOptions);
      response.push({ "clothing" : clothingresponse.body })
    }
    if (rehab)  {
      const rehabresponse = await fetch ("/resources/clothing", requestOptions);
      response.push({ "rehab" : rehabresponse.body })
    }

    // [ {"shelters" : [{}, {}, {}]}, {"xresponse":[{},{}] } ]
   
    // response.shelters
  }

  function test (arrayobject1){
    array[0].shelters
  }
    
  async function submitResource() {​​​​​
  let node = {​​​​​
  name : document.getElementById('orgName').value,
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
