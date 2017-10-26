var zahtjevSpil;
var reqKarta;
//var spilID = null;
var spilID = "fbr7mnf2482p";
var prvaKarta = null;
var drugaKarta = null;
var preostaloKarata;

window.onload = function () {
  document.getElementById("btnKarta").addEventListener("click",uzmiKartu);
  document.getElementById("btnNoviSpil").addEventListener("click",noviSpil);
  document.getElementById("btnManja").addEventListener("click",uzmiKartu);
  document.getElementById("btnVeca").addEventListener("click",uzmiKartu);
  console.log(prvaKarta);
}

function potez(){
  if (prvaKarta === null){
    document.getElementById("poruke").innerHTML = "Morate prvo dohvatiti jednu kartu!"
  }  
  
}

function usporedi(prva, druga){
  prva = provjeriVrijednost(prva);
  druga = provjeriVrijednost(druga); 
}

function provjeriVrijednost(broj){
  if (!jQuery.isNumeric(broj)){
    switch (broj){
      case "ACE":
        broj = 1;
        break;
      case "JACK":
        broj = 11;
        break;
      case "QUEEN":
        broj = 12;
        break;
      case "KING":
        broj = 13;
        break;
    }
  }
  return parseInt(broj);
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
  // Provjera koji je botun pozvao zahtjev
  // Ako već postoji jedna karta onda se mora odabati manji/veci
  // Nije dozvoljeno samo dohvatiti kartu
  if (prvaKarta != null && this.id == "btnKarta"){
    document.getElementById("poruke").innerHTML = "Morate odigrati potez!";
    return;
  } 
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
    var podaci = jQuery.parseJSON(reqKarta.responseText);
    provjeriSpil(podaci.remaining);  
    (prvaKarta === null) ? (prvaKarta = podaci.cards[0].value) : (drugaKarta = podaci.cards[0].value);
    if (drugaKarta != null){
      var rezUsporedba = usporedi(prvaKarta, drugaKarta);
      prvaKarta = drugaKarta;
      drugaKarta = null;
    }   
    console.log("Prva: " + prvaKarta);
    console.log("Druga: " + drugaKarta);
    var slika = podaci.cards[0].image;
    document.getElementById('karta').innerHTML = "<img src="+slika+" />"
    document.getElementById("poruke").innerHTML = "Dohvatio si novu kartu, ostalo ih je još " + podaci.remaining+"."
  }
}

// Funkcija za provjeru preostalih karata u špilu
// Ako dođe do 0, šalje za zatjev serveru za shuffle
function provjeriSpil(broj){
  console.log(broj);
  if (broj <= 0){
    var zah = new XMLHttpRequest();
    var url ="https://deckofcardsapi.com/api/deck/"+spilID+"/shuffle/";
    zah.onreadystatechange = function(){
      if (zah.readyState == 4 && zah.status == 200){
        console.log("Karte su promiješane");
      }
    }
    zah.open('GET',url,true);
    zah.send();
  }
  
}
