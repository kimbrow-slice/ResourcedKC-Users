
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

    // [ {"shelters" : [{}, {}, {}]}, {"xresponse":[{},{}] } ]
   
    // response.shelters
  }

  function test (arrayobject1){
    array[0].shelters
  }
    
  async function submitResource() {
    let node = {
        orgname : document.getElementById('orgname').value,
        description : document.getElementById("description").value,
        phone : document.getElementById("phone").value,
        hours : document.getElementById("hours").value,
        zipcode : document.getElementById("zipcode").value,
        website : document.getElementById("website").value
    };

  
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

