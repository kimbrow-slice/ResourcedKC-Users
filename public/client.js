
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
        servicesub : [],
        usercategories : [],
        orgname : document.getElementById('orgname').value,
        orgname_lower : document.getElementById('orgname').value.toLowerCase(),
        description : document.getElementById("description").value,
        phone : document.getElementById("phone").value,
        hours : document.getElementById("hours").value,
        zipcode : document.getElementById("zipcode").value,
        website : document.getElementById("website").value
    };

// SERVICES AND SERVICE SUBCATEGORIES

    if (document.getElementById("emergencyshelter").checked) {
      node.services.push("Emergency Shelter")
    }
    if (document.getElementById("domesticabuse").checked && document.getElementById("emergencyshelter").checked) {
      node.servicesub.push("Domestic Abuse")
    }
    if (document.getElementById("homelessshelter").checked && document.getElementById("emergencyshelter").checked) {
      node.servicesub.push("Homeless Shelter")
    }
      //make sure to use && for the subcats so they arent accidentally added if the user decudes to uncheck the primary category!
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
    if (document.getElementById("domesticabuse").checked) {
      node.servicesub.push("Domestic Abuse")
    }
    if (document.getElementById("homelessshelter").checked) {
      node.services.push("Homeless Shelter")
    }

// USER CATEGORIES

    if (document.getElementById("family").checked) {
      node.usercategories.push("Family")
    }
    if (document.getElementById("women").checked) {
      node.usercategories.push("Women")
    }
    if (document.getElementById("men").checked) {
      node.usercategories.push("Men")
    }
    if (document.getElementById("lgbtq").checked) {
      node.usercategories.push("LGBTQ")
    }
    if (document.getElementById("africanamerican").checked) {
      node.usercategories.push("African American")
    }
    if (document.getElementById("hispanic").checked) {
      node.usercategories.push("Hispanic")
    }
    if (document.getElementById("foreignlanguage").checked) {
      node.usercategories.push("Foreign Language")
    }
    if (document.getElementById("infant").checked) {
      node.usercategories.push("Infant")
    }
    if (document.getElementById("children").checked) {
      node.usercategories.push("Children")
    }
    if (document.getElementById("teen").checked) {
      node.usercategories.push("Teen")
    }
    if (document.getElementById("elderly").checked) {
      node.usercategories.push("Elderly")
    }
    if (document.getElementById("religion").checked) {
      node.usercategories.push("Religion")
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

function subCategoryCheckboxes() {
  let needsubcat = document.getElementsByClassName('needsubcat')
  for (i = 0; i < needsubcat.length; i++){
    needsubcat[i].addEventListener('click', function(){
      if (document.getElementById('emergencyshelter').checked) {
        revealEmergencyShelterSub()
      }
      if (document.getElementById('emergencyshelter').checked===false) {
        hideEmergencyShelterSub()
      }
      if (document.getElementById('housing').checked) {
        revealHousingSub()
      }
      if (document.getElementById('housing').checked===false) {
        hideHousingSub()
      }
      if (document.getElementById('financialassistance').checked) {
        revealFinancialAssistanceSub()
      }
      if (document.getElementById('financialassistance').checked===false) {
        hideFinancialAssistanceSub()
      }
      if (document.getElementById('foodpantry').checked) {
        revealFoodPantrySub()
      }
      if (document.getElementById('foodpantry').checked===false) {
        hideFoodPantrySub()
      }
      if (document.getElementById('healthclinic').checked) {
        revealHealthClinicSub()
      }
      if (document.getElementById('healthclinic').checked===false) {
        hideHealthClinicSub()
      }
      if (document.getElementById('clothingcloset').checked) {
        revealClothingClosetSub()
      }
      if (document.getElementById('clothingcloset').checked===false) {
        hideClothingClosetSub()
      }
      if (document.getElementById('rehabdetox').checked) {
        revealRehabDetoxSub()
      }
      if (document.getElementById('rehabdetox').checked===false) {
        hideRehabDetoxSub()
      }
    })
  }
};

function revealEmergencyShelterSub() {
  document.getElementById('domesticabuse').style.display="inline";
  document.getElementById('domesticabuselabel').style.display="inline";
  document.getElementById('homelessshelter').style.display="inline";
  document.getElementById('homelessshelterlabel').style.display="inline";
}

function hideEmergencyShelterSub() {
  document.getElementById('domesticabuse').style.display="none";
  document.getElementById('domesticabuselabel').style.display="none";
  document.getElementById('homelessshelter').style.display="none";
  document.getElementById('homelessshelterlabel').style.display="none";
}