/* In questo esercizio iniziamo a replicare la logica che sta dietro a tantissimi siti che permettono la visione di film e telefilm.
Per fare questo, come fanno siti molto più rinomati, utilizzeremo un API che ci permette di avere un insieme di risultati congrui alla nostra ricerca.

Iscriviamoci al sito https://www.themoviedb.org. E’ completamente gratuito.
Richiediamo la nostra API_KEY che verrà utilizzata in tutte le nostre chiamate. Servirà all’API a capire chi sta effettuando la chiamata.
Per richiederla clicchiamo sul nostro user, poi impostazioni, API e clicchiamo su “Richiedi una nuova API key”.
Una volta generato, in Impostazioni / API avremo la nostra chiave, indispensabile per tutte le nostre chiamate.

Qua https://developers.themoviedb.org/3 troveremo tutte le chiamate possibili all’API. Possiamo giocarci in un secondo momento, ma come prima cosa concentriamoci su Search / Movies.
Con questa chiamata possiamo cercare tutti i film associati ad una ricerca (query). Passiamo come parametri query e api_key e vedremo i nostri risultati. Volendo possiamo passare anche language=it-IT per filtrare i risultati in lingua italiana.
Milestone 1:
Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
Titolo
Titolo Originale
Lingua
Voto
 */

$(document).ready(function () {

   //imposto una variabile search che corrisponde al mio tasto cerca
   var search = $("#my_search");

   //imposto che al click della mia var search viene richiamata la funzione esterna
   search.on("click",function(){
      console.clear()
      $(".blocco-film").html("")
      callAjax();
   });

   $("#my_input").keyup(function(k){
      console.log(k.keycode)
      if (k.keyCode == "13"){
         console.clear()
         $(".blocco-film").html("")
         callAjax();
      }
   });

});



function callAjax(){
   //salvo una variabile che include il valore da me inserito dall'utente
      var userInput = $("#my_input").val();
      console.log("stai cercando " + userInput)
      
      $.ajax({
         url: "https://api.themoviedb.org/3/search/movie",
         method: "GET",
         data:{
            api_key: "86ad7638c6e9361746024a7df74fcc2a",
            query: userInput,
            language:"it-IT"

         },
         success: function (data) {
           console.log(data.results)
           for (var i=0; i<data.results.length;i++){
            
              var elem = data.results[i]
            //HANDLEBARS
              //il source mi restituisce il div per intero che ho inserito nell'html
              var source = $(".global-film").text();

              var template = Handlebars.compile(source);

              var globalFilm  = {
                 titolo: elem.title,
                 imglink: 'https://image.tmdb.org/t/p/w500' + elem.poster_path,
                 titoloOriginale: elem.original_title,
                 lingua: elem.original_language,
                 flag: createFlag(elem.original_language),
                 voto: Math.ceil(elem.vote_average),
                 stars: createStars(Math.ceil(elem.vote_average))
              };
              //imposto una var html che costituirà il mio template
              var html = template(globalFilm);
              console.log(html);

              //stampo in pagina
              $(".blocco-film").append(html);
           }
           //ripulisco l'input inserito dall'user
            $("#my_input").val("")   
         },
         error: function (richiesta, stato, errori) {
            alert("E' avvenuto un errore. " + " " + richiesta + " " + stato + " " + errori);
        }
      })
}

/* Milestone 2:
Trasformiamo il numero da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).

Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
Qui un esempio di chiamata per le serie tv:
https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs
 */

 //funzione esterna per la creazione delle stelle
 function createStars(voto){
    //imposto la mia variabile con la metà del valore per ottenere una valutazione in quinti anzichè in decimi,questa quindi verrà sostituita con l elemento iesimo dell'array del voto
   var voto = voto/2;

   var star = "";

   for(var i=1; i<=5;i++){
      if(i<=voto){
         star = '<i class="fas fa-star"></i>';
      } else{
         star = '<i class="far fa-star"></i>';
      }
   }
   return star;
}

function createFlag(flag){
   var imgFlag;

   switch (flag) {

      case "en":
            imgFlag = "<img src='img/en.png' width='30px'>";
         break;
      case "it":
            imgFlag = "<img src='img/it.png' width='30px'>";
         break;
      case "de":
            imgFlag = "<img src='img/ger.png' width='30px'>";
         break;
      case "fr":
            imgFlag = "<img src='img/fr.png' width='30px'>";
         break;
      case "usa":
            imgFlag = "<img src='img/usa.png' width='30px'>";
         break;
      case "es":
            imgFlag = "<img src='img/es.png' width='30px'>";
         break;
      default:
         imgFlag = "<img src='img/world.png' width='30px'>";
   }
   return imgFlag;
}



