var zahtjevSpil;
var reqKarta;
//var spilID = null;
var spilID = "fbr7mnf2482p";

window.onload = function () {
  document.getElementById("btnKarta").addEventListener("click",uzmiKartu);
  document.getElementById("btnNoviSpil").addEventListener("click",noviSpil);
}


function noviSpil() {
  if (spilID === null){
    zahtjevSpil = new XMLHttpRequest();
    zahtjevSpil.open('GET', 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',true);
    zahtjevSpil.onreadystatechange = primiSpil;
    zahtjevSpil.send();
  }
  else {
    window.alert("Već postoji špil: ID =" + spilID);
  }
}

function primiSpil() {
  if (zahtjevSpil.readyState == 4 && zahtjevSpil.status == 200){
    console.log(zahtjevSpil.responseText);
    var podaci = jQuery.parseJSON(zahtjevSpil.responseText);
    console.log(podaci.deck_id);
    spilID = podaci.deck_id;
    document.getElementById("poruke").innerHTML = "Dohvatio si novi špil sa ID =" + spilID;
  }
}

function uzmiKartu() {
  // zahtjev od API-ja
  reqKarta = new XMLHttpRequest();
  var url ="https://deckofcardsapi.com/api/deck/"+spilID+"/draw/?count=1";
  reqKarta.open('GET',url,true);
  reqKarta.onreadystatechange = primiKartu;
  reqKarta.send();
  }

function primiKartu() {
  // provjera statusa i prikaz karte
  if (reqKarta.readyState == 4 && reqKarta.status == 200){
    console.log(reqKarta.responseText);
    var podaci = jQuery.parseJSON(reqKarta.responseText);
    console.log("Karte: " + podaci.cards);
    console.log("Preostalo: " + podaci.remaining);
    var slika = podaci.cards[0].image;
    document.getElementById('karta').innerHTML = "<img src="+slika+" />"
    document.getElementById("poruke").innerHTML = "Dohvatio si novu kartu, ostalo ih je još " + podaci.remaining+"."
  }
}
