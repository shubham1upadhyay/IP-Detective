const getInfoBtn = document.getElementById("get-info");
// extracting the data fields
const ipField = document.getElementById("ip-address");
const cityField = document.getElementById("city");
const latitudeField = document.getElementById("latitude");
const longitudeField = document.getElementById("longitude");
const country = document.getElementById("country");
const regionField = document.getElementById("region");
const organisationField = document.getElementById("organisation");
const hostNameField = document.getElementById("host-name");
const timeZoneField = document.getElementById("time-zone");
const dateTimeField = document.getElementById("date-time");
const pincodeField = document.getElementById("pincode");
const messageField = document.getElementById("message");
const mapFrame = document.getElementById("frame");
const filterContainer = document.getElementById("filter-card")
const gobackBtn = document.getElementById("go-back")
const frame = document.getElementById("frame");

getInfoBtn.addEventListener('click', ()=>{
    // Retrieve user's IP address using an API
    fetch("https://api.ipify.org/?format=json")
      .then((res) => res.json())
      .then((data) => {
        let ipAddress = data.ip;
  
        // Fetch additional information based on the IP address
        fetch(`https://ipinfo.io/${ipAddress}?token=a65aa5704d8782`)
          .then((response) => response.json())
          .then((data) => {
            const ip = data.ip;
            const lat = data.loc.split(",")[0];
            const lon = data.loc.split(",")[1];
            const timezone = data.timezone;
            const pincode = data.postal;
            localStorage.setItem("ip_add", ip);
            // Display location on a map
            displayDetails(lat, lon, data);
            pinInfo(timezone, pincode);
            getPostOffices(pincode);
          })
          .catch((error) => {
            console.log("Error:", error);
          });
      });
      document.querySelector(".section-1").style.display = "none";
      document.querySelector(".result").style.display = "block";
  });
  
  function displayDetails(lat, lon, data) {
    // frame.setAttribute('src', `https://maps.google.com/maps?q=${lat}, ${lon}&z=15&output=embed"`);

    let src = `https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed`;
    mapFrame.setAttribute('src', src);

    latitudeField.innerText = lat;
    longitudeField.innerText = lon;
    cityField.innerText = data.city
    regionField.innerText = data.region;
    organisationField.innerText = data.org;
    timeZoneField.innerText = data.timeZone;
    hostNameField.innerText = data.ip;
}

gobackBtn.addEventListener('click', ()=>{
    document.querySelector(".section-1").style.display = "block";
    document.querySelector(".result").style.display = "none";
})



// below are the functions to retrieve the data
  
  function pinInfo(timezone, pincode) {
    
    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      .then((response) => response.json())
      .then((data) => {
        const postOffices = data[0].PostOffice;
        
        messageField.innerText = data[0].Message;
  
      let currentTime = new Date().toLocaleString("en-US", {
          timeZone: timezone,
        });
        pincodeField.innerText = pincode;
        dateTimeField.innerText = currentTime;
        timeZoneField.innerText = timezone;
      });
  } 
  
  function getPostOffices(pincode) {
    // Fetch post office data based on the pincode
    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      .then((response) => response.json())
      .then((data) => {
        const postOffices = data[0].PostOffice;
  
  
        // Display each post office's details
        postOffices.forEach((postOffice) => {

          filterContainer.innerHTML += `
            <ul class="result-card">
            <li>Name : <span class="text-success">${postOffice.Name}</span></li>
            <li>Branch Type : <span class="text-success">${postOffice.BranchType}</span></li>
            <li>Delivery Status : <span class="text-success">${postOffice.DeliveryStatus}</span></li>
            <li>District : <span class="text-success">${postOffice.District}</span></li>
            <li>Division : <span class="text-success">${postOffice.Division}</span></li>
            </ul>
          `;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  document.getElementById("search").addEventListener('input', ()=>{
    filterPostOffices();
  })

  function filterPostOffices() {
    
    const search = document.getElementById("search");
    let searchKey = search.value.trim().toLowerCase();

    const listItems = document.getElementsByTagName("ul");
  
    // Filter the post offices based on the search box input
    for (let i = 0; i < listItems.length; i++) {
      const listItem = listItems[i];
      const text = listItem.textContent || listItem.innerText;
      if (text.toLowerCase().indexOf(searchKey) > -1) {
        listItem.style.display = "";
      } else {
        listItem.style.display = "none";
      }
    }
  }