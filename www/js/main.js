var zahtjevSpil;
var reqKarta;
//var spilID = null;
var spilID = "fbr7mnf2482p";
var prvaKarta = null;
var drugaKarta = null;
var preostaloKarata;
var potez;
var rezultatIgre;

window.onload = function () {
  document.getElementById("btnKarta").addEventListener("click",uzmiKartu);
  document.getElementById("btnNoviSpil").addEventListener("click",noviSpil);
  document.getElementById("btnManja").addEventListener("click",uzmiKartu);
  document.getElementById("btnVeca").addEventListener("click",uzmiKartu);
  
}

function potez(){
  if (prvaKarta === null){
    document.getElementById("poruke").innerHTML = "Morate prvo dohvatiti jednu kartu!"
  }  
  
}

function usporedi(prva, druga){
  prva = provjeriVrijednost(prva);
  druga = provjeriVrijednost(druga);
  if (druga < prva){
    console.log("manja");
    return 0;
  }
  else if (druga > prva){
    console.log("veca");
    return 1;
  }
  else{
    console.log("iste");
    return 2;
  }
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
  else if (this.id == "btnKarta"){
    rezultatIgre = 0;
    promjesajSpil();
  }
  //spremamo ID botuna koji je pozvao uzimanje karte
  potez = this.id;
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
    console.log("Prva: " + prvaKarta);
    console.log("Druga: " + drugaKarta);
    var slika = podaci.cards[0].image;
    document.getElementById('karta').innerHTML = "<img src="+slika+" />"
    if (drugaKarta != null){
      // 0 - manja, 1 - veća, 2 - jednaka
      var rezUsporedba = usporedi(prvaKarta, drugaKarta);
      prvaKarta = drugaKarta;
      drugaKarta = null;
      rezultatPoteza(rezUsporedba, potez);
      document.getElementById('rezultat').innerHTML = "Rezultat: " + rezultatIgre;      
    }   
  }
}
//Funkcija koja određuje rezultat poteza
function rezultatPoteza(usporedba, potez){
  var rezultat = false;
  if (potez == "btnManja" && usporedba === 0){
    rezultat = true;
  }
  else if (potez == "btnVeca" && usporedba === 1){
    rezultat = true; 
  }
  var por = document.getElementById("poruke");
  if ( rezultat === true){
    por.innerHTML = "Bravo, pogodio si";
    rezultatIgre ++;
  }
  else
  {
    por.innerHTML = "Krivo!!!"
    rezultatIgre = 0;
    promjesajSpil();
  } 

}

// Funkcija za provjeru preostalih karata u špilu
// Ako dođe do 0, šalje za zatjev serveru za shuffle
function provjeriSpil(broj){
  console.log(broj);
  if (broj <= 0){
    promjesajSpil();
  }
  
}
// Slanje zahtjeva za mjesanje spila
function promjesajSpil(){
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
