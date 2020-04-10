window.onload = function(){
  //displayStores()
}

var map;
var markers = [];
var infoWindow;

function initMap() {
  var losAngeles = {
      lat: 34.063380, 
      lng: -118.358080
  };
  map = new google.maps.Map(document.getElementById('map'), {
      center: losAngeles,
      zoom: 11,
      mapTypeId: 'roadmap',
  });
  infoWindow = new google.maps.InfoWindow();
  searchStores()
}



function searchStores(){
  var foundStores = []
  var zipCode = document.getElementById('zip-code-input').value;
  if(zipCode){
    for(var store of stores){
      var postal = store['address']['postalCode'].substring(0,5);
      if(postal == zipCode){
        foundStores.push(store)
      }
    }
  }else {
    foundStores = stores;
  }
  clearLocations();
  displayStores(foundStores)
  showStoresMarkers(foundStores)
  setOnClickListenner()
}

function clearLocations(){
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}


function setOnClickListenner(){
  var storeElements = document.querySelectorAll('.store-container')
  storeElements.forEach((elem, index) => {
    elem.addEventListener('click', () => {
      new google.maps.event.trigger(markers[index], 'click');
    })
  })
}

function displayStores(stores){
  var storesHtml = '';
  for(var [index, store] of stores.entries()){
      var address = store['addressLines'];
      var phone = store['phoneNumber'];
      storesHtml += `
          <div class="store-container">
            <div class="store-container-background">
              <div class="store-info-container">
                  <div class="store-address">
                      <span>${address[0]}</span>
                      <span>${address[1]}</span>
                  </div>
                  <div class="store-phone-number">${phone}</div>
              </div>
              <div class="store-number-container">
                  <div class="store-number">
                      ${index+1}
                  </div>
              </div>
            </div>
          </div>
      `
      document.querySelector('.stores-list').innerHTML = storesHtml;
  }
}


function showStoresMarkers(stores){
  var bounds = new google.maps.LatLngBounds();
  for(var [index, store] of stores.entries()){
      var latlng = new google.maps.LatLng(
          store["coordinates"]["latitude"],
          store["coordinates"]["longitude"]);
      var name = store["name"];
      var address = store["addressLines"][0];
      var openStatus = store["openStatusText"]
      var phoneNumber = store["phoneNumber"]

      bounds.extend(latlng);
      createMarker(latlng, name, address,openStatus, phoneNumber, index+1)
  }
  map.fitBounds(bounds);
}

function createMarker(latlng, name, address, openStatus, phoneNumber, index){
  var html = `
    <div class="store-info-window">
      <div class="store-info-name">
        ${name}
      </div>
      <div class="store-info-status">
      <div class="circle">
      <i class="far fa-clock"></i>
      </div>
        ${openStatus}
      </div>
      <div class="store-info-address">
        <div class="circle">
         <i class="fas fa-location-arrow"></i>
        </div>
        ${address}
      </div>
      <div class="store-info-phone">
        <div class="circle">
          <i class="fas fa-phone-alt"></i>
        </div>
        ${phoneNumber}
      </div>
    </div>
  `
  var icon = 'https://i.imgur.com/L43qlPq.png'
 

  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: {
      text: index.toString(),
      color: "#00cf",
      fontSize: "15px",
      fontWeight: "bold"
    },
    icon,
    animation: google.maps.Animation.DROP,
  });
  google.maps.event.addListener(marker, 'click', function() {

    
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}
