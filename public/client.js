
  async function findResources() {
    let shelter    = document.getElementById('emergencyshelter').checked;
    let housing    = document.getElementById('housing').checked;
    let finance    = document.getElementById('financialassistance').checked;
    let food       = document.getElementById('foodpantry').checked;
    let health     = document.getElementById('healthclinic').checked;
    let clothing   = document.getElementById('clothingcloset').checked;
    let rehab      = document.getElementById('rehabdetox').checked;
    let sextraffic = document.getElementById('sextrafficking').checked;
    

    let response = [];

    let requestOptions = {
      method  : "GET",
      headers : { "Content-Type" : "application/json" },
    };

    if (shelter) {
      const shelterresponse = await fetch("/resources/emergencyshelter", requestOptions);
      const body = await shelterresponse.json();
      response = response.concat(body);
    }
    if (finance) {
      const financeresponse = await fetch("/resources/financialassistance", requestOptions);
      const body = await financeresponse.json();
      response = response.concat(body);
    }
    if (housing) {
      const housingresponse = await fetch ("/resources/housing", requestOptions);
      const body = await housingresponse.json();
      response = response.concat(body);
    }
    if (food) {
      const foodresponse = await fetch ("/resources/foodpantry", requestOptions);
      const body = await foodresponse.json();
      response =  response.concat(body);
    }
    if (health) {
      const healthresponse = await fetch ("/resources/healthclinic", requestOptions);
      const body = await healthresponse.json();
      response = response.concat(body);
    }
    if (clothing) {
      const clothingresponse = await fetch ("/resources/clothingcloset", requestOptions);
      const body = await clothingresponse.json();
      response = response.concat(body)
    }
    if (rehab)  {
      const rehabresponse = await fetch ("/resources/rehabdetox", requestOptions);
      const body = await rehabresponse.json();
      response = response.concat(body)
    }
    if (sextraffic) {
      const sextrafficresponse = await fetch ("/resources/sextrafficking", requestOptions);
      const body =await sextrafficresponse.json();
      response = response.concat(body)
    }
    console.log(response);
    let family          = document.getElementById('family').checked;
    let women           = document.getElementById('women').checked;
    let men             = document.getElementById('men').checked;
    let lgbtq           = document.getElementById('lgbtq').checked;
    let africanamerican = document.getElementById('africanamerican').checked;
    let hispanic        = document.getElementById('hispanic').checked;
    let foreignlanguage = document.getElementById('foreignlanguage').checked;
    let infant          = document.getElementById('infant').checked;
    let children        = document.getElementById('children').checked;
    let teen            = document.getElementById('teen').checked;
    let elderly         = document.getElementById('elderly').checked;
    let religion        = document.getElementById('religion').checked;
    let hiv             = document.getElementById('hiv').checked;

    let demographics = [];

    if (family) {
      demographics.push('Family')
    }
    if (women) {
      demographics.push('Women')
    }
    if (men) {
      demographics.push('Men')
    }
    if (lgbtq) {
      demographics.push('LGBTQ')
    }
    if (africanamerican) {
      demographics.push('African American')
    }
    if (hispanic) {
      demographics.push('Hispanic')
    }
    if (foreignlanguage) {
      demographics.push('Foreign Language')
    }
    if (infant) {
      demographics.push('Infant')
    }
    if (children) {
      demographics.push('Children')
    }
    if (teen) {
      demographics.push('Teen')
    }
    if (elderly){
      demographics.push('Elderly')
    }
    if (religion) {
      demographics.push('Religion')
    }
    if (hiv) {
      demographics.push('HIV')
    }

    
    if(demographics.length === 0){
      console.log(response.length);
    }
    else{
      //console.log(response);
      let newResponse = response.filter(
        function(obj){
          console.log("obj: ")
          console.log(obj);
          for(i = 0; i <  response.length; i ++){
            if(obj.usercategories.includes(demographics[i])){
               return obj;
            }
          }
        }
      );
      console.log(newResponse);
      sessionStorage.setItem('usersearch', (JSON.stringify(newResponse)));
    }
    

    
    
    window.location.href = '../searchresults.html';

    return response;
    // [ {"shelters" : [{}, {}, {}]}, {"xresponse":[{},{}] } ]
  }
  
  //displaying the search results into the HTML 
function searchResult() {
  let resultContainer = document.getElementById('resultsPage');
  //  alert(sessionStorage.getItem('usersearch'));
   let variable = JSON.parse(sessionStorage.getItem('usersearch'));
  let results = document.createElement('p');
    for(i = 0; i < variable.length; i++){
  resultContainer.appendChild(results).innerHTML += "Organization Name: " + variable[i].orgname + "<br><br>" 
  + "Services: " + variable[i].services + "<br><br>" 
  +"Demographics: " + variable[i].usercategories + "<br><br>" 
  + "Description: " + variable[i].description + "<br><br>" 
  + "Zip Code: " + variable[i].zipcode + "<br>"
  + "Hours: " + variable[i].hours + "<br><br>"
   + "Phone: " + variable[i].phone + "<br>" 
   + "Website: " + variable[i].website + '<a href="' +variable[i].website+'"</a>'+ '<i class="fas fa-globe"></i></a>' + "<br><br><hr>"

}

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
        website : document.getElementById("website").value,
        
    };

// SERVICES AND SERVICE SUBCATEGORIES

    if (document.getElementById("emergencyshelter").checked) {
      node.services.push("Emergency Shelter")
    }
    if (document.getElementById("domesticabuse").checked) {
      node.servicesub.push("Domestic Abuse")
    }
    if (document.getElementById("homelessshelter").checked) {
      node.servicesub.push("Homeless Shelter")
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
    if (document.getElementById("sextrafficking").checked) {
      node.services.push("Sex Trafficking")
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
    if (document.getElementById("hiv").checked) {
      node.usercategories.push("HIV")
    }

    let requestOptions = {
      method: "POST",
      body: JSON.stringify(node),
      headers: { "Content-Type": "application/json" },
    };
    alert('Thank you for submitting your organization information!');
    window.location.href = '../index.html';
    const response = await fetch("/resources", requestOptions);
    //const data = await response.json()
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
        document.getElementById('domesticabuse').checked = false;
        document.getElementById('homelessshelter').checked = false;
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
      if (document.getElementById('sextrafficking').checked) {
        revealSexTraffickingSub()
      }
      if (document.getElementById('sextrafficking').checked===false) {
        hideSexTraffickingSub()
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

function revealHousingSub() {

}

function hideHousingSub() {

}

function revealFinancialAssistanceSub() {

}

function hideFinancialAssistanceSub() {

}

function revealFoodPantrySub() {

}

function hideFoodPantrySub () {

}

function revealHealthClinicSub() {

}

function hideHealthClinicSub() {

}

function revealClothingClosetSub() {

}

function hideClothingClosetSub() {

}

function revealRehabDetoxSub() {

}

function hideRehabDetoxSub() {

}

function revealSexTraffickingSub() {

}

function hideSexTraffickingSub() {

}



// async function searchByService() {
//   var arr = []
//   var checkedboxes = document.querySelectorAll('input[type=checkbox]:checked')

//   for (i = 0; i < checkedboxes.length; i++) {
//     arr.push(await fetch('/resources/' + (checkedboxes[i].id), requestOptions).json)
//   }
// }