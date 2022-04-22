//Lataa teatterit pudotusvalikkoon 
loadMenu()

document.getElementById("hakunappi").addEventListener("click", (evt) => haeTiedot());

function loadMenu() {
    var xmlhttp = new XMLHttpRequest();

    //Hakee XML-tiedoston Finnkinon Schedule -sivulta
    xmlhttp.open("GET", "https://www.finnkino.fi/xml/Schedule/", true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {

        //Jos xml-tiedosto haetaan onnistuneesti ->
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {

            //Jäsennetään xml-data
            var xmlDoc = xmlhttp.responseXML;
            var items = xmlDoc.getElementsByTagName("Show");
            var theathers = '';
            const theatherslist = [""];

            //Luo arraylistin, mikä sisältää teatterien nimet
            for (i = 0; i < items.length; i++) {
                theathers = items[i].getElementsByTagName('Theatre').item(0).firstChild.nodeValue;
                var item = theathers;
                theatherslist.push(item);
            }

            //Kutsutaan funktiota toUniqueArray, joka poistaa tuplateatterit listalta
            var theatherslistNoDublicats = toUniqueArray(theatherslist);
            var select = document.getElementById("sijainnit");

            //Lisää teatterit dropdown-menuun
            for (var i = 1; i < theatherslistNoDublicats.length; i++) {
                var opt = theatherslistNoDublicats[i];
                var el = document.createElement("option");
                el.textContent = opt;
                el.value = opt;

                select.appendChild(el);
            }
        }
    }
}

//Poistaa tuplateatterin teatterilistalta dropdown-menussa
function toUniqueArray(a) {
    var newArr = [];
    for (var i = 0; i < a.length; i++) {
        if (newArr.indexOf(a[i]) === -1) {
            newArr.push(a[i]);
        }
    }
    return newArr; // Tuo teatterilistan ilman tuplateattereita
}

//Haetaan xml-tiedostosta haluttuja asioita
function haeTiedot() {

    var teatteriValinta = document.getElementById('sijainnit');
    output = teatteriValinta.options[teatteriValinta.selectedIndex].value;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "https://www.finnkino.fi/xml/Schedule/", true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function () {

        //Jos xml-tiedosto haetaan onnistuneesti ->
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            var xmlDoc = xmlhttp.responseXML;
            valikoima = xmlDoc.getElementsByTagName('Show');

            var otsikot = "";

            for (i = 0; i < valikoima.length; i++) {
                var teatterinNimi = valikoima[i].getElementsByTagName('Theatre').item(0).firstChild.nodeValue;

                if (teatterinNimi == output) {
                    var posterit = valikoima[i].getElementsByTagName('EventMediumImagePortrait').item(0).firstChild.nodeValue;
                    var elokuvaAika = valikoima[i].getElementsByTagName('dttmShowStart').item(0).firstChild.nodeValue;

                    //Poistaa T-kirjaimen näytösajasta, jonka xml-tiedosto antaa
                    elokuvaAika = elokuvaAika.replace("T", " " + '<br>');

                    var elokuvaNimi = valikoima[i].getElementsByTagName('Title').item(0).firstChild.nodeValue;
                    var raja = valikoima[i].getElementsByTagName('RatingImageUrl').item(0).firstChild.nodeValue;
                    var linkki = valikoima[i].getElementsByTagName('EventURL').item(0).firstChild.nodeValue;
                    var tyyli = valikoima[i].getElementsByTagName('Genres').item(0).firstChild.nodeValue;
                    var item = '<div id="elokuvat"><img class="image" src="' + posterit + '"><img class="rate" src="' + raja + '"><a href="' + linkki + '"><h3>' + elokuvaNimi + '</h3></a><br><p><strong>Teatteri: </strong><br><a href="' + linkki + '">' + teatterinNimi + '</a></p><p>' + '</p><div class="timeDiv"><p class="time"><strong> Seuraava näytös: </strong><br>' + elokuvaAika + '</p><p class="genre"> Genre: ' + tyyli + '</p></div></div>';
                    otsikot += item;
                }
            }
            document.getElementById('elokuvat').innerHTML = otsikot;
        }
    }
}