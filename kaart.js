let map;
let fixedMarkerLatLng = [53.22174747304968, 6.553838253021241]; // Fixed marker coordinates in Groningen
let fixedMarker;
let placedMarker;
let lock;
let latlng;
let line;
let score = 0;
let score_wijzging = 0;
function fitMapToMarkers(latlngs) {
  let bounds = L.latLngBounds(latlngs);
  map.flyToBounds(bounds, {
    duration: 1, // Duration of the animation in seconds
    easeLinearity: 0.25 // EaseLinearity for smoother transition
  });
}
function setFixedMarker(latlng) {
  console.log(latlng)
  fixedMarkerLatLng = [latlng.cords[0], latlng.cords[1]];;
}
function icon() {
  let customIcon = {
    iconUrl: "	https://cdn-icons-png.flaticon.com/512/7584/7584620.png",
    iconSize: [10, 10]
  }
  let myIcon = L.icon(customIcon);

  let iconOptions = {
    title: " ",
    draggable: false,
    icon: myIcon,
    opacity: 0
  }
  return iconOptions
}
function addMarker() {

  if (placedMarker) {
    map.removeLayer(placedMarker);
    if (line) {
      map.removeLayer(line);
    }
  }
  placedMarker = L.marker(latlng, icon()).addTo(map);
  placedMarker.setOpacity(1);
}
function edit_ui() {
  document.getElementById("map").classList.add('map_after_edit');
  document.getElementById("map_holder").classList.add('map_holder_after_edit');
  document.getElementById("guess_knop").remove();
  document.getElementById("img").remove();
  updateMapSize();
  //document.getElementById("map").classList.remove('map');
}
function updateMapSize() {
  map.invalidateSize();
  // Optionally refit the bounds if necessary:
  // fitMapToMarkers([fixedMarkerLatLng, placedMarkerLatLng]);
}
async function makeRequest(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
function Klaar(daily) {
  score_wijzging = 0;
  MaakLijn();
  lock = true;
  document.getElementById("info_balk").style.visibility = 'visible';
  fitMapToMarkers([fixedMarkerLatLng, latlng]);
  fixedMarker.setOpacity(1);
  edit_ui();

  meters = Math.round(Bereken());
  score_wijzging = 2000 - meters;
  if (score_wijzging < 1) {
    console.log("doe beter je best") 
  }
  else{
    score = score + 2000 - meters  
  }
  if (daily === "1") {
    console.log(score)

  } else {
    if (!ontsleutelEnVergelijk(sessionStorage.getItem("SCWJHDSG"), score)) {
      let url = "https://api.050guessr.nl/verban/" + localStorage.getItem("key");
      makeRequest(url);
      document.getElementById("score").innerText = "je score is " + score

      document.getElementById("meters").innerText = "je bent " + meters + " meters van het doel af!";
    
      return
    }

    score = score + parseInt(score);
  }
  sessionStorage.setItem("SCWJHDSG", versleutelTekst(score))
  document.getElementById("score").innerText = "je score is " + score;

  document.getElementById("meters").innerText = "je bent " + meters + " meters van het doel af!";


  if (daily == "5" && localStorage.getItem("key") !== null) { makeRequest("https://api.050guessr.nl/set_score/" + localStorage.getItem("key") + "/" + score + "/" + sessionStorage.getItem("SCWJHDSG")) }




  
}
function versleutelTekst(e){return[...btoa(e)].map((e=>String.fromCharCode(e.charCodeAt(0)+3))).join("")}function ontsleutelEnVergelijk(e,t){let r=[...e].map((e=>String.fromCharCode(e.charCodeAt(0)-3))).join("");return atob(r)===t}
function MaakLijn() {
  let latlngs = [fixedMarkerLatLng, latlng];
  line = L.polyline(latlngs, {
    color: 'black',
    dashArray: '5, 10' // Set dashArray for dotted line
  }).addTo(map);
}
function Bereken() {
  // Calculate distance in meters
  let distance = map.distance(fixedMarkerLatLng, latlng);
  return distance
}
function maak_kaart() {
  map = L.map("map").setView([53.2194, 6.5665], 13); // Centering map on Groningen


  let nlmaps_standaard = L.tileLayer('https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/standaard/EPSG:3857/{z}/{x}/{y}.png', {
    minZoom: 6,
    maxZoom: 19,
    bounds: [[50.5, 3.25], [54, 7.6]],
    attribution: 'Kaartgegevens &copy; <a href="https://www.kadaster.nl">Kadaster</a>'
  }).addTo(map);

  fixedMarker = L.marker(fixedMarkerLatLng, icon()).addTo(map);
  lock = false;



  map.on('click', function (e) {
    if (!lock) {
      latlng = e.latlng;
      console.log(latlng);
      addMarker();
    }
  });

}