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
   search.click(callAjax);

});



function callAjax(){
   

      //salvo una variabile che include il valore da me inserito dall'utente
      var userInput = $("#my_input").val();
      console.log("stai cercando" + userInput)
      
      $.ajax({
         url: "https://api.themoviedb.org/3/search/movie?api_key=86ad7638c6e9361746024a7df74fcc2a&query=" + userInput,
         method: "GET",
         success: function (data) {
           console.log(data.results)
           for (var i=0; i<data.results.length;i++){

            //HANDLEBARS
              //il source mi restituisce il div per intero che ho inserito nell'html
              var source = $(".global-film").text();

              var template = Handlebars.compile(source);

              var globalFilm  = {
                 titolo: data.results[i].title,
                 titoloOriginale: data.results[i].original_title,
                 lingua: data.results[i].original_language,
                 voto: data.results[i].vote_average
              };
              //imposto una var html che costituirà il mio template
              var html = template(globalFilm);
              console.log(html);

              //stampo in pagina
              $(".blocco-film").append(html);
           }
           //ripulisco 
            $("#my_input").val("")   
         },
         error: function (richiesta, stato, errori) {
            alert("E' avvenuto un errore. " + " " + richiesta + " " + stato + " " + errori);
        }
      })
}



