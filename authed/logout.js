async function logOut() {
    let requestOptions = {
        method: "POST"
    };

    const response = await fetch('/logout?_method=DELETE', requestOptions);
    console.log(response);
    if(response.status === 204){
      
      document.cookie = "jwt=; expires = Mon, 04 Mar 1996 00:00:00 GMT"
      window.location.href ="../index.html"
    }
    
}


document.getElementById('logout').addEventListener('submit', (event) => {
    event.preventDefault();
    clearListCookies();
    window.location.href ="../index.html"
    // logOut().then( ()=> {
    //     console.log('success');
    //   }).catch((err)=>{
    //     console.log(err);
    //   });
    })
    function clearListCookies()
{   
	var cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++)
	{   
		var spcook =  cookies[i].split("=");
		deleteCookie(spcook[0]);
	}
	function deleteCookie(cookiename)
	{
		var d = new Date();
		d.setDate(d.getDate() - 1);
		var expires = ";expires="+d;
		var name=cookiename;
		//alert(name);
		var value="";
		document.cookie = name + "=" + value + expires + "; path=/acc/html";                    
	}
	window.location = ""; // TO REFRESH THE PAGE
}

