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

 Milestone 2:
Trasformiamo il numero da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).

Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
Qui un esempio di chiamata per le serie tv:
https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs


Milestone 3:
In questa milestone come prima cosa aggiungiamo la copertina del film o della serie al nostro elenco.Ci viene passata dall’API solo la parte finale dell’URL, questo perché poi potremo generare da quella porzione di URL tante dimensioni diverse.Dovremo prendere quindi l’URL base delle immagini di TMDB: https://image.tmdb.org/t/p/ per poi aggiungere la dimensione che vogliamo generare (troviamo tutte le dimensioni possibili a questo link: https://www.themoviedb.org/talk/53c11d4ec3a3684cf4006400) per poi aggiungere la parte finale dell’URL passata dall’API.
Esempio di URL che torna la copertina di BORIS:
https://image.tmdb.org/t/p/w185/s2VDcsMh9ZhjFUxw77uCFDpTuXp.jpg 


Mileston4:
Trasformiamo quello che abbiamo fatto fino ad ora in una vera e propria webapp, creando un layout completo simil-Netflix:
Un header che contiene logo e search bar
Dopo aver ricercato qualcosa nella searchbar, i risultati appaiono sotto forma di “card” in cui lo sfondo è rappresentato dall’immagine di copertina (consiglio la poster_path con w342)
Andando con il mouse sopra una card (on hover), appaiono le informazioni aggiuntive già prese nei punti precedenti più la overview
*/

$(document).ready(function () {
   $(".profile").on("mouseenter mouseleave", function (event) {
      $("#_user").toggleClass("red");
   });

   $("#show_page").click(function(){
      $(".my_style-container").fadeIn();
      $(".welcome-page").fadeOut(1)
   })

   //imposto che al click della mia var search viene richiamata la funzione esterna
   var search = $("#my_search");
   search.on("click",function(){
      console.clear()
      $(".blocco-film").html("");
      $(".blocco-serie").html("");
      var urlMovie = 'https://api.themoviedb.org/3/search/movie';
      var urlTv = 'https://api.themoviedb.org/3/search/tv';
      var userInput = $("#my_input").val();
      var widthFilm = ".blocco-film > .film";
      var widthSerie = ".blocco-serie > .film";
      var sliderFilm = ".carousel_uiFilm";
      var sliderSeries = ".carousel_uiSeries";
      callAjaxFilmSeries(urlMovie, userInput, true, widthFilm,sliderFilm);
      callAjaxFilmSeries(urlTv, userInput, false, widthSerie,sliderSeries);
   });

   $("#my_input").keyup(function(k){
      console.log(k.keycode)
      if (k.keyCode == "13"){
         console.clear()
         $(".blocco-film").html("");
         $(".blocco-serie").html("");
         var urlMovie = 'https://api.themoviedb.org/3/search/movie';
         var urlTv = 'https://api.themoviedb.org/3/search/tv';
         var userInput = $("#my_input").val();
         var widthFilm = ".blocco-film > .film";
         var widthSerie = ".blocco-serie > .film";
         var sliderFilm = ".carousel_uiFilm";
         var sliderSeries = ".carousel_uiSeries";
         callAjaxFilmSeries(urlMovie, userInput, true, widthFilm, sliderFilm);
         callAjaxFilmSeries(urlTv, userInput, false, widthSerie, sliderSeries);
      }
   });
   //richiamo la funzione per mostrare le info sul click
   showHideInfo();
});

//funzione per chiamate ajax con funzioni interne
function callAjaxFilmSeries(url, userInput, type, myLength,whereSlide){
   $.ajax({
      url: url,
      method: "GET",
      data:{
         api_key: "86ad7638c6e9361746024a7df74fcc2a",
         query: userInput,
         language:"it-IT"
      },
      success: function (data) {
         var films = data.results;
         printFilmSeries(films, type);
         var sliderLength;
         var width = $(myLength).length*210 + 20;
         console.log("questo è il valore di width" +width)
         //pongo una condizione e imposto che se la mia var lunghezza è maggiore della width della viewport allora la mia var sliderLengthFilm assume il valore che mi serve
         if (width > $(window).width()) {
            sliderLength = width - $(window).width();
            console.log("risultato sottrazione" +sliderLength)
            
         } else{ //altrimenti lo slider non servirà e quindi imposto lo scorll a 0 (caso in cui i risultati mostrati sono pochi)
            sliderLength = 0;
         }
         //richiamo la mia funzione slider passando come parametro lo sliderLength , che rappresenterà la mia lunghezza di scroll max e il div al quale fare riferimento(uniche 2 variabili che cambiano)
         slider(sliderLength, whereSlide);
         //ripulisco l'input inserito dall'user
            $("#my_input").val("");   
      },
      error: function (richiesta, stato, errori) {
         alert("E' avvenuto un errore. " + " " + richiesta + " " + stato + " " + errori);
      }
   })
}

//funzione esterna per la creazione delle stelle
 function createStars(voto){
    //imposto la mia variabile con la metà del valore per ottenere una valutazione in quinti anzichè in decimi,questa quindi verrà sostituita con l elemento iesimo dell'array del voto
   var voto = voto/2;

   var star = "";

   for(var i=1; i<=5;i++){
      //soluzione alternativa con operatore ternario
      star += (i <= voto) 
      ? '<i class="fas fa-star"></i>' 
      : '<i class="far fa-star"></i>'
   }
   return star;
};

//funzione esterna per la creazione di bandiere
function createFlag(flag){
   var imgFlag = [
      "en", "es", "it", "fr", "usa", "de"
   ];
   
   if (imgFlag.includes(flag)){
      return "<img src='img/" + flag + ".png' + width='30px'>";
   }

   return "<img src='img/world.png' width='30px'>";
};

//funzione esterna per la stampa dei film e delle serie tv
function printFilmSeries(film, isFilm){
   
   for (var i = 0; i < film.length; i++) {
      var elem = film[i];
      console.log(elem)
      //HANDLEBARS
      //il source mi restituisce il div per intero che ho inserito nell'html
      var source = $(".global-film-series").text();

      var template = Handlebars.compile(source);

      //con questa condizione verifico che il mio terzo parametro sia uguale o meno ad un film passando poi come terzo argomento della funzione una condizione booleana ( vedi chiamata ajax).
      //qualora fosse vera allora il title assumerà il valore richiesto dall'api per i film , se fosse falsa mi restiuirà i valori richiesti dall'api per le serie tv
      if(isFilm == true){
         var titolo = elem.title;
         var titoloOriginale = elem.original_title;
         var printHere = $(".blocco-film");
      }else{
         titolo = elem.name;
         titoloOriginale = elem.original_name
         printHere = $(".blocco-serie");
      }
      
      var globalFilm = {
         titolo: titolo,
         imglink: createPoster(elem.poster_path),
         titoloOriginale: titoloOriginale,
         lingua: elem.original_language,
         flag: createFlag(elem.original_language),
         voto: Math.ceil(elem.vote_average),
         stars: createStars(Math.ceil(elem.vote_average)),
         overview: overview(elem.overview)
      };
      var html = template(globalFilm);
      console.log(html);
      printHere.append(html);
   }
   
}

//funzione per generare i poster e gestirà il caso in cui l'immagine è uguale a un valore nullo
function createPoster(posterPath) {
   var poster = 'https://image.tmdb.org/t/p/original';

   if (posterPath == null) {
      poster = "https://fontmeme.com/permalink/191126/4afe42c72da796daf5f2206c7126a97a.png"
   } else {
      poster += posterPath
   }

   return poster;
}

//funzione per gestire le info sull'hover delle immagini
function showHideInfo(){
   $(document).on("click", ".film", function () {
      $(this).find(".info").removeClass("hidden")
   })
   $(document).on("mouseleave", ".info", function () {
      $(this).addClass("hidden")
   })
}

//funzione per gestire la trama se è o meno presente
function overview(overview) {
   var trama ="";
   if (overview.length < 1) {
      trama = " Mi spiace, al momento non abbiamo una trama disponibile per questo titolo"
   } else{
      trama += overview
   }
   return trama;
}

// Slider film/series
function slider(maxScroll,selector){

   $(selector).draggable({
         axis: "x", // asse si spostamento
         opacity: 0.6, // opacità
         cursor: "grabbing",
   
         drag: function (event, ui) {
            //con questo imposto il left minimo. Impostandolo a 0 faccio in modo che non sia possibile scorrere da destra verso sinistra appena visualizzati i risultati.
            ui.position.left = Math.min(0, ui.position.left);
             // lo scrollmax potrebbe essere uguale alla width del contenitore film per il numero di risultati ottenuti tradotto in numero negativo 
            ui.position.left = Math.max(-maxScroll, ui.position.left);
         }
      });
}