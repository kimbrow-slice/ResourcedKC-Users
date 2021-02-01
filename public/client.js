
  async function findResources() {
    let shelters = document.getElementById('shelterscheck').checked;
    let housing  = document.getElementById('housingcheck').checked;
    let finance  = document.getElementById('financecheck').checked;
    let food     = document.getElementById('foodcheck').checked;
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
    let searchByName = document.getElementById('searchbar').value

    let requestOptions = {
      method  : "GET",
      headers : { "Content-Type" : "application/json" }
    }
    const searchresponse = await fetch ('/resources/search?name=' + searchByName, requestOptions);
  }

  async function submitResource() {
    console.log("test");
    let node = {
        services : [],
        orgname : document.getElementById('orgname').value,
        orgname_lower : document.getElementById('orgname').value.toLowerCase(),
        description : document.getElementById("description").value,
        phone : document.getElementById("phone").value,
        hours : document.getElementById("hours").value,
        zipcode : document.getElementById("zipcode").value,
        website : document.getElementById("website").value,
        
    };

    if (document.getElementById("emergencyshelter").checked) {
      node.services.push("Emergency Shelter")
    }
    if (document.getElementById("housing").checked) {
      node.services.push("Housing")
    }
    if (document.getElementById("financialassistance").checked) {
      node.services.push("Financial Assistance")
    }
    if (document.getElementById("foodpantry").checked) {
      node.services.push("Food Pantry")
    }
    if (document.getElementById("healthclinic").checked) {
      node.services.push("Health Clinic")
    }
    if (document.getElementById("clothingcloset").checked) {
      node.services.push("Clothing Closet")
    }
    if (document.getElementById("rehabdetox").checked) {
      node.services.push("Rehab and Detox")
    }

    let requestOptions = {
      method: "POST",
      body: JSON.stringify(node),
      headers: { "Content-Type": "application/json" },
    };
    alert('Thank you submitting your organzations information!');
    window.location.href = 'index.html';
    const response = await fetch("/resources", requestOptions);
    
    if (response.status != 200) {
      throw Error ("Error!");
    } 

    return node;
    
  }

/**TESTING FOR GETTING USER FOR WELCOME PAGE**/
async function getLists() {
  let requestOptions = {
    method : "GET",
    headers: { "Content-Type": "application/json"},
  };
  const response = await fetch("/welcome", requestOptions);
  const body = await response.json();
  if(response.status != 200) {
    throw Error(body.message);
  }
  return body;
}

async function getCurrentUser(id) {
  let requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  const response = await fetch('/welcome/' + id, requestOptions);
  const body = await response.json();
  console.log(id);
  if(response.status !=200 ){
    throw Error(body.message);
  }
  return body;
}
/****LOGIN***/
