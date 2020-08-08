const testIos = /iP(hone|od|ad)/.test(navigator.platform);
console.log(lang, locale, testIos);

document.addEventListener('touchstart', function addtouchclass(e) { // first time user touches the screen
    document.documentElement.classList.add('can-touch') // add "can-touch" class to document root using classList API
    document.removeEventListener('touchstart', addtouchclass, false) // de-register touchstart event
}, false)

/********************************* */


import './style.css';
import './cookieconsent.css';

import 'webpack-jquery-ui/css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap';

var Collection = require('lodash/collection');
var Array = require('lodash/array');

import * as d3 from 'd3';
import {event as currentEvent} from 'd3';

const format2dec = d3.format(".2f");

import saveAs from 'file-saver';
import Papa from 'papaparse';

import WordCloud from 'wordcloud';

import domtoimage from 'dom-to-image';

import 'sweetalert';

import cookieconsent from 'cookieconsent';

import {
    library,
    dom
} from "@fortawesome/fontawesome-svg-core";
import {
    faCog
} from '@fortawesome/free-solid-svg-icons/faCog';
import {
    faSpinner
} from '@fortawesome/free-solid-svg-icons/faSpinner';
import {
    faRecycle
} from '@fortawesome/free-solid-svg-icons/faRecycle';
import {
    faRandom
} from '@fortawesome/free-solid-svg-icons/faRandom';
import {
    faFileImage
} from '@fortawesome/free-solid-svg-icons/faFileImage';
import {
    faCheckSquare
} from '@fortawesome/free-solid-svg-icons/faCheckSquare';
import {
    faDownload
} from '@fortawesome/free-solid-svg-icons/faDownload';
import {
    faEraser
} from '@fortawesome/free-solid-svg-icons/faEraser';
import {
    faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import {
    faExpand
} from '@fortawesome/free-solid-svg-icons/faExpand';
import {
    faSync
} from '@fortawesome/free-solid-svg-icons/faSync';

library.add(
    faCog,
    faSpinner,
    faRecycle,
    faRandom,
    faFileImage,
    faCheckSquare,
    faDownload,
    faEraser,
    faExternalLinkAlt,
    faExpand,
    faSync
);

dom.watch();

import Plotly from 'plotly.js-dist';

// LEAFLET
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import 'leaflet-easybutton/src/easy-button';
import 'leaflet-easybutton/src/easy-button.css';

import 'leaflet-fontawesome-markers'

const democratie_21mars = require('./democratie_21mars.csv');
const organisation_21mars = require('./organisation_21mars.csv');
const fiscalite_21mars = require('./fiscalite_21mars.csv');
const transition_21mars = require('./transition_21mars.csv');

const jsonRegions = require('./regions.json');

const imageIntroBulles = require('./bulles-animees.jpg');

/********************************* */

// window.onload = () => {
// 	document.getElementById('main_div').style.display = 'block';
// 	document.getElementById('loader_div').style.display = 'none';
// };

/* COOKIE CONSENT */
window.addEventListener("load", function() {
	document.getElementById('main_div').style.display = 'block';
    document.getElementById('loader_div').style.display = 'none';

    var infos_div = document.getElementById("infos_div");
    infos_div.style.backgroundImage = "url('" + imageIntroBulles + "')";
    infos_div.style.backgroundSize = "cover";

    window.cookieconsent.initialise({
        "palette": {
            "popup": {
                "background": "#237afc"
            },
            "button": {
                "background": "#fff",
                "text": "#237afc"
            }
        },
        "theme": "classic",
        "position": "bottom-right",
        "content": {
            "message": "En poursuivant votre navigation sur ce site, vous acceptez l'utilisation de cookies permettant le bon fonctionnement de l'application.",
            "dismiss": "J'ai compris !",
            "link": "Gérer les cookies",
            "href": "https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser"
        }
    })
});

const bubbles_container = document.getElementById('bubbles_container');
const wordscloud_container = document.getElementById('wordscloud_container');
const sunburst_container = document.getElementById('sunburst_container');

const bubbles_div = document.getElementById('bubbles_div');
const words_div = document.getElementById('words_div');
const barplot_div = document.getElementById('barplot_div');
const map_div = document.getElementById('map_div');


const innerWidth = Math.round(window.innerWidth);
const innerHeigth = Math.round(window.innerHeight);

const initialHeightMap = (testIos) ? Math.round(screen.height * 0.43) + "px" : (innerHeigth * 0.43) + "px";

map_div.style.height = initialHeightMap;

words_div.style.height = (innerHeigth * 0.43) + "px";
barplot_div.height = (innerHeigth * 0.43) + "px";

var formatThousands = d3.format(",");
var formatPercent = d3.format(".0%");
var formatDecimal = d3.format(".2f");

$(function() {
    document.getElementById("start_btn").addEventListener('click', function() {

        document.getElementById('infos_div').classList.add('hidden');
        document.getElementById('bubbles_div').classList.remove('hidden');
        document.getElementById('dropdownw_div').classList.remove('hidden');
        document.getElementById('wordscloud_container').classList.remove('hidden');
        document.getElementById('toolbar_div').classList.remove('hidden');
        d3.select('#vis').selectAll("svg").remove();
        $('#select_questions').empty();
        nested(organisation_21mars, "organisation_21mars");
    })

    $('#select_theme li').on('click', function(e) {
        $('.motCle').show();

        $('#tooltipMap').empty();
        $('#tooltipMap').hide();

        var themeTitre = $(e.target).text();
        var theme = $(e.target).data("value");

        document.getElementById('theme_selected').innerHTML = themeTitre;
        d3.select('#vis').selectAll("svg").remove();
        $('#gates_tooltip').remove();
        $('#select_questions').empty();

        if (theme == "organisation_21mars") {
            nested(organisation_21mars, theme);
        } else if (theme == "democratie_21mars") {
            nested(democratie_21mars, theme);
        } else if (theme == "fiscalite_21mars") {
            nested(fiscalite_21mars, theme);
        } else if (theme == "transition_21mars") {
            nested(transition_21mars, theme);
        }
    });
})

function nested(dataTest, theme) {
    console.log(theme);
    var dataReady;
    var keysTest = returnKeysTest("keysTest_" + theme);

    var questionsKeys = {};
    for (var key in keysTest) {
        questionsKeys[keysTest[key]["shortKey"]] = keysTest[key];
    }

    var shortKeys = [...new Set(dataTest.map(obj => obj.question))];

    var selectList = document.getElementById("select_questions");

    for (var i = 0, lgi = shortKeys.length; i < lgi; i++) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.setAttribute('href', "#")
        a.classList.add("question_li")
        a.setAttribute('data-value', shortKeys[i])
        a.setAttribute('data-type', questionsKeys[shortKeys[i]].cl)

        a.title = questionsKeys[shortKeys[i]].cl === "ou" ? "question ouverte" : "question fermée";
        a.innerHTML = questionsKeys[shortKeys[i]]["question"]; //.substr(0,120)+'…';
        li.appendChild(a);

        selectList.appendChild(li);
    }

    document.getElementById('question_selected').innerHTML = questionsKeys[shortKeys[0]]["question"];
    document.getElementById('question_selected').dataset.value = shortKeys[0];
    document.getElementById('question_selected').dataset.type = questionsKeys[shortKeys[0]].cl;

    dataReady = prepareData(dataTest, shortKeys[0]);

    toggleQuestionDiv(questionsKeys[shortKeys[0]].cl);

    if (L.DomUtil.get('map')) {
        $('#map').remove();
        launchMap(dataReady[0], dataReady[1], dataReady[2]);
    } else {
        launchMap(dataReady[0], dataReady[1], dataReady[2]);
    }

    if (questionsKeys[shortKeys[0]].cl === "ou") {
        if (bubbles_div.offsetHeight > 0) {
            barplot_div.classList.add('hidden');
            words_div.classList.remove('hidden');
            bubbleChart()('#vis', dataReady[0], dataReady[1]);
            launchCloud(dataReady[2]);
        } else {
            document.getElementById('sunburst_container').classList.add('hidden');
            document.getElementById('bubbles_container').classList.remove('hidden');
            barplot_div.classList.add('hidden');
            words_div.classList.remove('hidden');
            bubbleChart()('#vis', dataReady[0], dataReady[1]);
            launchCloud(dataReady[2]);
        }
    } else {
        if (bubbles_div.offsetHeight > 0) {
            words_div.classList.add('hidden');
            barplot_div.classList.remove('hidden');
            bubbleChart()('#vis', dataReady[0], dataReady[1]);
            barChart(dataReady[0], questionsKeys[shortKeys[0]].cl);
        }
    }

    $('#select_questions li').on('click', function(e) {
        document.getElementById('all').classList.add('active');
        document.getElementById('month').classList.remove('active');

        document.getElementById('question_selected').innerHTML = $(e.target).text();
        document.getElementById('question_selected').dataset.type = $(e.target).data("type");
        document.getElementById('question_selected').dataset.value = $(e.target).data("value");

        dataReady = prepareData(dataTest, $(e.target).data("value"));

        toggleQuestionDiv($(e.target).data("type"));

        $('.motCle').show();
        d3.select('#vis').selectAll("svg").remove();

        if (L.DomUtil.get('map')) {
            $('#map').remove();
            $("#loader_map").show();
            setTimeout(() => {
                launchMap(dataReady[0], dataReady[1], dataReady[2]);
            })

        } else {
            launchMap(dataReady[0], dataReady[1], dataReady[2]);
        }

        $('#gates_tooltip').remove();
        $('#tooltipMap').empty();
        $('#tooltipMap').hide();

        console.log($(e.target).data("type"));

        if ($(e.target).data("type") === "ou") {
            document.getElementById('sunburst_btn').classList.add('hidden');

            document.getElementById('sunburst_container').classList.add('hidden');
            document.getElementById('bubbles_container').classList.remove('hidden');

            barplot_div.classList.add('hidden');
            words_div.classList.remove('hidden');
            launchCloud(dataReady[2]);
            bubbleChart()('#vis', dataReady[0], dataReady[1]);

        } else if ($(e.target).data("type") === "fe") {
            var nb_oui = dataReady[0].map(obj => obj.oui ? +obj.oui : 0).reduce((a, b) => a + b); //formatThousands().replace(/\,/, " ") + "&nbsp;\n";
            var nb_non = dataReady[0].map(obj => obj.non ? +obj.non : 0).reduce((a, b) => a + b);
            var nb_na = dataReady[0].map(obj => obj.vide ? +obj.vide : 0).reduce((a, b) => a + b);

            var indexMax = [nb_oui, nb_non, nb_na].indexOf(Math.max(nb_oui, nb_non, nb_na));
            (indexMax === 0) ? toggleResponseBlink("oui"): (indexMax === 1) ? toggleResponseBlink("non") : (indexMax === 1) ? toggleResponseBlink("na") : toggleResponseBlink("");

            document.getElementById('oui').innerHTML = nb_oui + " oui";
            document.getElementById('non').innerHTML = nb_non + " non";
            document.getElementById('n_a').innerHTML = nb_na + " na";

            words_div.classList.add('hidden');
            barplot_div.classList.remove('hidden');
            barChart(dataReady[0], $(e.target).data("type"));
            (document.getElementById('question_selected').dataset.sunburst === "yes") ? launchSunburst(dataReady[0], $(e.target).data("type")): bubbleChart()('#vis', dataReady[0], dataReady[1]);

        } else if ($(e.target).data("type") === "sp") {

            document.getElementById('ouinon_div').classList.add('hidden');

            document.getElementById('sunburst_container').classList.add('hidden');
            document.getElementById('bubbles_container').classList.remove('hidden');

            words_div.classList.add('hidden');
            barplot_div.classList.remove('hidden');
            barChart(dataReady[0], $(e.target).data("type"));
            bubbleChart()('#vis', dataReady[0], dataReady[1]);
        }

    });

    document.getElementById('sunburst_btn').onclick = function() {
        document.getElementById('question_selected').dataset.sunburst = "yes";
        d3.select('#vis').selectAll("svg").remove();
        $('#gates_tooltip').remove();
        document.getElementById('sunburst_container').classList.remove('hidden');
        document.getElementById('bubbles_container').classList.add('hidden');
        launchSunburst(dataReady[0], document.getElementById('question_selected').dataset.type);
    }

    document.getElementById('bubbles_btn').onclick = function() {
        document.getElementById('question_selected').dataset.sunburst = "no";

        d3.select('#sequence').selectAll("svg").remove();
        document.getElementById('sunburst_container').classList.add('hidden');
        document.getElementById('bubbles_container').classList.remove('hidden');
        bubbleChart()('#vis', dataReady[0], dataReady[1]);
    }

    document.getElementById('excepts_btn').onclick = function(e) {
        let item = {
            title: 'chaque mot séparé par un espace ou une virgule'
        };
        let storeExcepts = document.getElementById('storeExcepts_pre');
        // console.log(storeExcepts.value);
        let html = htmlWordsCloud(item, storeExcepts.value);
        setTimeout(function(e) {
            if ($('#inputTextarea')) $('#inputTextarea').focus();
        }, 0);
        swal({
            title: 'Exceptions pour les mots-clés',
            text: 'saisir ou coller les mots ne devant pas apparaitre',
            content: html,
            icon: 'info',
            className: 'lg'
        }).then(value => {
            if (value) {
                document.getElementById('words_div').classList.add('hidden');
                var excepts = document.getElementById('inputTextarea').value;
                storeExcepts.value = excepts;
                excepts = excepts.split(/[\s,]+/);

                console.log(excepts);
                $(".loaderClass").show();
                setTimeout(() => {
                    launchCloud(dataReady[2].filter(el => excepts.indexOf(el[0]) === -1));
                    document.getElementById('words_div').classList.remove('hidden');
                }, 100);
            }
        });
    }
} // fin nested

function prepareData(dataTest, selected) {
    var columns = ["﻿mois", "region", "authorType", "participants", "question", "oui", "non", "vide", "mots-cles"];

    dataTest.forEach((obj, i) => {
        obj["id"] = i;
    });

    var dataSelected = dataTest.filter(obj => obj["question"] === selected);

    var peopleJanvier = dataSelected.filter(obj => obj.mois === "janvier").map(obj => +obj.participants).reduce((a, b) => a + b);
    var peopleFevrier = dataSelected.filter(obj => obj.mois === "février").map(obj => +obj.participants).reduce((a, b) => a + b);
    var peopleMars = dataSelected.filter(obj => obj.mois === "mars").map(obj => +obj.participants).reduce((a, b) => a + b);

    var peopleByMonth = {};
    peopleByMonth["jan"] = peopleJanvier;
    peopleByMonth["feb"] = peopleFevrier;
    peopleByMonth["mar"] = peopleMars

    document.getElementById('output_pre').innerHTML = JSON.stringify(peopleByMonth);

    updateSpecial(dataSelected);

    updateDataSelectd(dataSelected);

    return [dataSelected, peopleByMonth, keywordsByRegion(dataSelected)];
}

function updateSpecial(dataSelected) {

    var responseSp = function(arr, pattern, number) {
        var special = arr.map(el => {
            return el.map(el => {
                if (pattern.test(el)) {
                    return +el.slice(number, el.length) != undefined ? +el.slice(number, el.length) : 0;
                }
            });
        }).reduce((acc, val) => acc.concat(val), []);

        if (Array.compact(special).length > 0) {
            return +Array.compact(special).reduce((a, b) => a += b);
        } else {
            return null;
        }
    }

    var special = dataSelected.filter(obj => obj["type"] === "sp").map(obj => obj["mots-cles"].split(','));

    var responseSpecial = [
        responseSp(special, /^Une bonne chose=/, 16),
        responseSp(special, /^Une mauvaise chose=/, 19),
        responseSp(special, /^Je ne sais pas=/, 15),
        responseSp(special, /^=/, 1)
    ];

    if (Array.compact(responseSpecial).length) {
        var maxTest = responseSpecial.indexOf(d3.max(responseSpecial));
        console.log(responseSpecial, maxTest);
        let html_sp = '<i class="glyphicon glyphicon-stop" style="color: #0f0"></i>' + " Une bonne chose = " + responseSpecial[0];
        html_sp += ' <i class="glyphicon glyphicon-stop" style="color: #f00"></i>' + " Une mauvaise chose = " + responseSpecial[1];
        html_sp += ' <i class="glyphicon glyphicon-stop" style="color: #00f"></i>' + " Je ne sais pas = " + responseSpecial[2];
        html_sp += ' <i class="glyphicon glyphicon-stop" style="color: #fff"></i>' + " na = " + responseSpecial[3];
        document.getElementById('question_special').innerHTML = html_sp;
    } else {
        document.getElementById('question_special').innerHTML = "";
    }
}

function updateDataSelectd(dataSelected) {
    let keywordsDomain = d3.extent(dataSelected.filter(obj => obj.occurrences != "no").map(obj => (+obj.occurrences / +obj.participants)));

    var fillKeywords = d3.scaleOrdinal()
        .domain(keywordsDomain)
        .range(d3.schemeOranges[9]);

    dataSelected.forEach((obj, i) => {
        if (obj["type"] === "fe") {
            let arr = [!isNaN(+obj["oui"]) ? +obj["oui"] : 0, !isNaN(+obj["non"]) ? +obj["non"] : 0, !isNaN(+obj["vide"]) ? +obj["vide"] : 0];
            let total = arr.reduce((a, b) => a += b);
            let max = arr.indexOf(Math.max(...arr));
            let tendance = arr.map(val => val / total);
            obj["rep"] = "oui=" + arr[0] + ", non=" + arr[1] + ", na=" + arr[2];
            obj["group"] = (max === 0) ? "OUI" : (max === 1) ? "NON" : (max === 2) ? "NA" : "NA";
            obj["color"] = getColorOuiNon(tendance); //fillColor((max === 0) ? "OUI" : (max === 1) ? "NON" : (max === 2) ? "NA" : "NA");
        } else if (obj["type"] === "sp") {
            var row = getRowSpecial(obj);
            // console.log(row);
            obj["color"] = getColorSpecial(row);
        } else {
            obj["group"] = keywordsCount(obj["mots-cles"]);
            obj["color"] = fillKeywords(keywordsCount(obj["mots-cles"]));
        }
    });
}

function getRowSpecial(obj) {
    var row = [];
    var arr_sp = obj["mots-cles"].split(',');
    while (arr_sp.length < 4) {
        arr_sp.push("");
    }
    arr_sp.forEach(el => {
        if (/^Une bonne chose=/.test(el)) {
            row.push(+el.slice(16, el.length) != undefined ? +el.slice(16, el.length) : 0);
        } else if (/^Une mauvaise chose=/.test(el)) {
            row.push(+el.slice(19, el.length) != undefined ? +el.slice(19, el.length) : 0);
        } else if (/^Je ne sais pas=/.test(el)) {
            row.push(+el.slice(15, el.length) != undefined ? +el.slice(15, el.length) : 0);
        } else if (/^=/.test(el)) {
            row.push(+el.slice(1, el.length) != undefined ? +el.slice(1, el.length) : 0);
        } else {
            row.push(0);
        }
    });

    var totalByArrSp = row.reduce((a, b) => a += b);
    row = row.map(val => formatDecimal(val / totalByArrSp));

    return row;
}

function keywordsCount(obj) {
    let numbers = obj.split(",")
        .map(el => el.match(/\=\d+/) ? parseInt(el.match(/\=\d+/)[0].replace(/\=/, ''), 10) : 0)
    let total = numbers.reduce((a, b) => a += b)
    let result = (total !== 0) ? [(d3.min(numbers) / total), (d3.median(numbers) / total), (d3.max(numbers) / total)] : [0, 0, 0];
    return total;
}

function getColorOuiNon(arr) {
    let oui = formatPercent(arr[0]),
        non = formatPercent(arr[1]),
        na = formatPercent(arr[2]),
        na_transparence = formatDecimal(1 - arr[2]);
    return "rgba(" + non + "," + oui + "," + na + "," + na_transparence + ")";
};

function getColorSpecial(arr) {
    let bonne = formatPercent(arr[0]),
        mauvaise = formatPercent(arr[1]),
        sais_pas = formatPercent(arr[2]),
        na = formatDecimal(1 - arr[3]);
    return "rgba(" + mauvaise + "," + bonne + "," + sais_pas + "," + na + ")";
};

function keywordsByRegion(dataSelected) {
    let patternEgal = /[\d\wàéèêëîùç\-\'\_]+\=/gi,
        keywordsAll = [],
        allWords = [];
    dataSelected.map(obj => obj["mots-cles"].split(','))
        .forEach(arr => {
            let newObj = {},
                match, key, value;
            for (var i = 0, lgi = arr.length; i < lgi; i++) {
                if (arr[i].match(patternEgal)) {
                    match = arr[i].match(patternEgal)[0];
                    key = match.replace(/\=/, "");
                    value = arr[i].replace(match, "");
                }
                newObj[key] = +value;
            }
            if (key != undefined && value != undefined && !isNaN(+value)) {
                allWords.push(key);
                keywordsAll.push(...[
                    [key, +value]
                ]);
            }
        });
    allWords = [...new Set(allWords)];

    var keyswordsByQuestion = [];
    for (var i = 0, lgi = allWords.length; i < lgi; i++) {
        var obj = {};
        var value = 0,
            key = allWords[i];
        for (var j = 0, lgj = keywordsAll.length; j < lgj; j++) {
            if (key === keywordsAll[j][0]) {
                value += keywordsAll[j][1];
            }
        }
        obj[key] = value;
        keyswordsByQuestion.push([key, value]);
    }
    keyswordsByQuestion = keyswordsByQuestion.sort((a, b) => b[1] - a[1]);

    return keyswordsByQuestion;
}

function toggleResponseBlink(div_id) {
    console.log(div_id);
    if (div_id === "oui") {
        document.getElementById('non').classList.remove('blink');
        document.getElementById('n_a').classList.remove('blink');
        document.getElementById('oui').classList.add('blink');
    } else if (div_id === "non") {
        document.getElementById('n_a').classList.remove('blink');
        document.getElementById('oui').classList.remove('blink');
        document.getElementById('non').classList.add('blink');
    } else {
        document.getElementById('non').classList.remove('blink');
        document.getElementById('oui').classList.remove('blink');
        document.getElementById('n_a').classList.add('blink');
    }
}

function toggleBlink(div_id) {
    console.log(div_id);
}

function toggleQuestionDiv(type) {
    if (type === "ou") {
        document.getElementById('motcles_div').classList.remove('hidden');
        document.getElementById('ouinon_div').classList.add('hidden');
        document.getElementById('sunburst_btn').classList.add('hidden');
    } else {
        document.getElementById('motcles_div').classList.add('hidden');
        document.getElementById('ouinon_div').classList.remove('hidden');
        document.getElementById('sunburst_btn').classList.remove('hidden');
    }
}


function exportCSVDefault(dataExport, filename) {
    var dataPointToCSV = Papa.unparse(dataExport);
    // var BOM = "\uFEFF";
    var csvDataPoint = dataPointToCSV; //BOM + dataPointToCSV;
    var blob = new Blob([csvDataPoint], { type: "text/csv;charset=utf-8" });
    saveAs(blob, filename + "_synthese.csv");
}

function bubbleChart() {

    d3.select('#tooltipCloud').style("opacity", 0);

    if (testIos) {
        var width = Math.round($('#bubbles_container').width()); // Math.round(screen.width)*1.1; //960;
        var height = Math.round($('#bubbles_container').height() * .8); //Math.round(screen.height)*0.7;
        var center = {
            x: width / 2,
            y: height / 2
        };
    } else {
        var width = Math.round($('#bubbles_container').width()); //innerWidth * 0.7; //960;
        var height = Math.round($('#bubbles_container').height() * .8); //innerHeight*0.7;
        var center = {
            x: width / 2,
            y: height / 2
        };
    }

    var bounds = document.getElementById('vis').getBoundingClientRect();

    var tooltip = floatingTooltip('gates_tooltip', 240);

    var monthCenters = {
        "janvier": {
            x: width / 3,
            y: height / 2
        },
        "février": {
            x: width / 2,
            y: height / 2
        },
        "mars": {
            x: 2 * width / 3,
            y: height / 2
        }
    };

    var monthsTitleX = {
        "janvier": (width * 0.25) - 50,
        "février": (width * 0.50) + 25,
        "mars": (width * 0.75) + 50
    };

    var peopleTitleX = {};

    var forceStrength = 0.03;

    var svg = null;
    var bubbles = null;
    var nodes = [];

    function charge(d) {
        return -Math.pow(d.radius, 2.0) * forceStrength;
    }

    var simulation = d3.forceSimulation()
        .velocityDecay(0.2)
        .force('x', d3.forceX().strength(forceStrength).x(center.x))
        .force('y', d3.forceY().strength(forceStrength).y(center.y))
        .force('charge', d3.forceManyBody().strength(charge))
        .on('tick', ticked);

    simulation.stop();

    function createNodes(rawData) {
        var maxAmount = d3.max(rawData, function (d) {
            return +d.participants;
        });

        var radiusScale = d3.scalePow()
            .exponent(0.5)
            .range([2, 70])
            .domain([0, maxAmount]);

        var myNodes = rawData.map(function (d) {
            return {
                id: d.id,
                radius: radiusScale(+d.participants),
                value: +d.participants,
                name: d.region,
                org: d.authorType,
                rep: d.rep,
                keywords: d["mots-cles"].split(","), //.join(',\n'),
                group: d.group,
                color: d.color,
                occurrences: d.occurrences,
                groupType: d.type,
                month: d.mois, //d.start_year,
                x: Math.random() * 900,
                y: Math.random() * 800
            };
        });

        myNodes.sort(function (a, b) {
            return b.value - a.value;
        });

        return myNodes;
    }

    var chart = function chart(selector, rawData, people) {
        nodes = createNodes(rawData);

        svg = d3.select(selector)
            .append('svg')
            // .attr("id", "svgBubble")
            .classed('svg', true)
            .attr('width', width)
            .attr('height', height);

        $(".svg").css({
            top: 0,
            left: -bounds.x,
            position: 'absolute'
        });

        bubbles = svg.selectAll('.bubble')
            .data(nodes, function (d) {
                return d.id;
            });

        var bubblesE = bubbles.enter()
            .append('circle')
            .classed('bubble', true);

        bubblesE.attr('r', 0)
            .attr('fill', d => d.color)
            .attr('stroke', d => d3.rgb(d.color).darker())
            .attr('stroke-width', d => 2)
            .on('mouseover', showDetail)
            .on('mouseout', hideDetail);

        bubbles = bubbles.merge(bubblesE);

        bubbles.transition()
            .duration(2000)
            .attr('r', function (d) {
                return d.radius;
            });

        simulation.nodes(nodes);

        groupBubbles();
        document.getElementById('total_people').innerHTML = " (" + formatThousands(Object.values(people).reduce((a, b) => a += b)).replace(/,/, ' ') + ")";
    };

    function ticked() {
        bubbles
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            });
    }

    function nodeYearPos(d) {
        return monthCenters[d.month].x;
    }

    function groupBubbles() {
        hideYearTitles();
        simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));
        simulation.alpha(1).restart();
    }

    function splitBubbles() {
        showYearTitles();
        simulation.force('x', d3.forceX().strength(forceStrength).x(nodeYearPos));
        simulation.alpha(1).restart();
    }

    function hideYearTitles() {
        svg.selectAll('.month').remove();
        svg.selectAll('.people').remove();
    }

    function showYearTitles() {

        var people = JSON.parse(document.getElementById('output_pre').innerHTML);

        peopleTitleX[people.jan] = (width * 0.25) - 50,
            peopleTitleX[people.feb] = (width * 0.50) + 25,
            peopleTitleX[people.mar] = (width * 0.75) + 50

        var monthsData = d3.keys(monthsTitleX);
        var months = svg.selectAll('.month')
            .data(monthsData);

        months.enter().append('text')
            .attr('class', 'month')
            .attr('x', d => monthsTitleX[d])
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .text(d => d);

        var peopleData = d3.keys(peopleTitleX);
        var people = svg.selectAll('.people')
            .data(peopleData);

        people.enter().append('text')
            .attr('class', 'people')
            .attr('x', d => peopleTitleX[d])
            .attr('y', 50)
            .attr('text-anchor', 'middle')
            .text(d => d);
    }

    function showDetail(d) {
        var groupCount = '<span class="name">Tendance: </span><span class="value">"' + d.group + '"</span><br>';
        groupCount += '<div id="tooltipBubbles_barchart" style="width: 100%; height:80px;"></div>'
        var groupSpecial = '<div id="tooltipBubbles_barchart" style="width: 100%; height:80px;"></div>';

        var groupKeywords = '<div style="width: 100%; height:80px;"><canvas id="tooltipBubble_canvas" class="word_cloud"></div>';
        d3.select(this).attr('stroke', 'black');

        var content = '<span class="name">Région: </span><span class="value">' + d.name + '</span><br/>';
        content += '<span class="name">Mois: </span><span class="value">' + d.month + '</span><br/>';
        content += '<span class="name">Organisation: </span><span class="value">' + d.org + '</span><br/>';
        content += '<span class="name">Participants: </span><span class="value">' + addCommas(d.value) + '</span><br>';

        content += (d.groupType == "fe") ? groupCount : d.groupType == "sp" ? groupSpecial : groupKeywords;

        tooltip.showTooltip(content, d3.event);

        $('#tooltipMap').show();

        if (d.groupType == "fe") {
            barchartForMap(countsForBubbles(d.rep.split(',')), "#tooltipBubbles_barchart", 30, 240);
        } else if (d.groupType == "sp") {
            barchartForMap(specialsForBubbles(d.keywords), "#tooltipBubbles_barchart", 110, 240);
        } else {
            launchCloudMap(keywordsForBubbles(d.keywords), "tooltipBubble_canvas", 280);
        }
    }

    function hideDetail(d) {
        d3.select(this)
            .attr('stroke', d3.rgb(d.color).darker());

        tooltip.hideTooltip();
    }

    chart.toggleDisplay = function (displayName) {
        if (displayName === 'month') {
            splitBubbles();
        } else {
            groupBubbles();
        }
    };

    document.getElementById('month').onclick = function () {
        document.getElementById('all').classList.toggle('active');
        this.classList.toggle('active');
        splitBubbles();
    }

    document.getElementById('all').onclick = function () {
        document.getElementById('month').classList.toggle('active');
        this.classList.toggle('active');
        groupBubbles();
    }

    return chart;
}

function keywordsForBubbles(arr) {
    let patternEgal = /[\d\wàéèêëîùç\-\'\_]+\=/gi;
    let allWords = [],
        match, key, value;
    for (var i = 0, lgi = arr.length; i < lgi; i++) {
        if (arr[i].match(patternEgal)) {
            match = arr[i].match(patternEgal)[0];
            key = match.replace(/\=/, "");
            value = arr[i].replace(match, "");
            allWords.push([key, +value]);
        }
    }
    return allWords;
}

function countsForBubbles(arr) {
    var allCounts = [],
        newObj = {},
        test, match, key, value, color;

    var patternEgal = /[\d\wàéèêëîùç\-\'\_]+\=/gi;
    for (var i = 0, lgi = arr.length; i < lgi; i++) {
        test = arr[i].trim();
        if (patternEgal.test(test)) {
            match = test.match(patternEgal)[0];
            key = match.replace(/\=/, "");
            value = test.replace(match, "");
            color = (key == "oui") ? "rgb(0, 162, 67)" : (key == "non") ? "rgb(255, 0, 0)" : "rgb(0, 0, 255)";
            allCounts.push({ responses: key, total: +value, color: color });
        }
    }
    return allCounts;
}

function specialsForBubbles(arr) {
    var allCounts = [],
        newObj = {},
        test, match, key, value, bonne, mauvaise, sait_pas, na, color;
    var patternEgal = /[\d\wàéèêëîùç\-\'\_]+\=/gi;

    for (var i = 0, lgi = arr.length; i < lgi; i++) {
        test = arr[i].trim();
        if (/Une bonne chose=\d+/.test(test)) {
            match = test.match(/Une bonne chose=\d+/)[0];
            key = match.replace(/\=\d+/, "");
            value = +match.slice(16, match.length)
            color = "rgb(0, 162, 67)";
        } else if (/Une mauvaise chose=\d+/.test(test)) {
            match = test.match(/Une mauvaise chose=\d+/)[0];
            key = match.replace(/\=\d+/, "");
            value = +match.slice(19, match.length)
            color = "rgb(255, 0, 0)";
        } else if (/Je ne sais pas=\d+/.test(test)) {
            match = test.match(/Je ne sais pas=\d+/)[0];
            key = match.replace(/\=\d+/, "");
            value = +match.slice(15, match.length)
            color = "rgb(0, 0, 255)";
        } else if (/^=\d+/.test(test) || /\,\=\d+/.test(test)) {
            match = test.match(/^=\d+/)[0] ? test.match(/^=\d+/)[0] : test.match(/\,\=\d+/)[0];
            key = "n/a";
            value = test.match(/^=\d+/)[0] ? +match.slice(1, match.length) : +match.slice(2, match.length);
            color = "rgb(143, 143, 143)";
        }
        allCounts.push({ responses: key, total: +value, color: color });

    }
    return allCounts;
}

function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ' ' + '$2');
    }

    return x1 + x2;
}

function returnKeysTest(title) {

    var keysTest_organisation_17fevrier = {
        "Q169": {
            "cl": "ou",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTY5",
            "question": "Que pensez-vous de l'organisation de l'Etat et des administrations en France ? De quelle manière cette organisation devrait-elle évoluer ?"
        },
        "Q170": {
            "cl": "fe",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTcw",
            "question": "Selon vous, l'Etat doit-il aujourd'hui transférer de nouvelles missions aux collectivités territoriales ?"
        },
        "Q171": {
            "cl": "ou",
            "li": "Q170",
            "key20190302": "QUXVlc3Rpb246MTcx",
            "question": "Si oui, lesquelles ?"
        },
        "Q204": {
            "cl": "fe",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MjA0",
            "question": "Estimez-vous avoir accès aux services publics dont vous avez besoin ?"
        },
        "Q172": {
            "cl": "ou",
            "li": "Q204",
            "key20190302": "QUXVlc3Rpb246MTcy",
            "question": "Si non, quels types de services publics vous manquent dans votre territoire et qu'il est nécessaire de renforcer ?"
        },
        "Q174": {
            "cl": "ou",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTc0",
            "question": "Quels nouveaux services ou quelles démarches souhaitez-vous voir développées sur Internet en priorité ?"
        },
        "Q175": {
            "cl": "fe",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTc1",
            "question": "Avez-vous déjà utilisé certaines de ces nouvelles formes de services publics ?"
        },
        "Q176": {
            "cl": "fe",
            "li": "Q175",
            "key20190302": "QUXVlc3Rpb246MTc2",
            "question": "Si oui, en avez-vous été satisfait ?"
        },
        "Q177": {
            "cl": "ou",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTc3",
            "question": "Quelles améliorations préconiseriez-vous ?"
        },
        "Q178": {
            "cl": "ou",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTc4",
            "question": "Quand vous pensez à l'évolution des services publics au cours des dernières années, quels sont ceux qui ont évolué de manière positive ?"
        },
        "Q179": {
            "cl": "ou",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTc5",
            "question": "Quels sont les services publics qui doivent le plus évoluer selon vous ?"
        },
        "Q180": {
            "cl": "fe",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTgw",
            "question": "Connaissez-vous le \"droit à l'erreur\", c'est-à-dire le droit d'affirmer votre bonne foi lorsque vous faites un erreur dans vos déclarations ?"
        },
        "Q181": {
            "cl": "fe",
            "li": "Q180",
            "key20190302": "QUXVlc3Rpb246MTgx",
            "question": "Si oui, avez-vous déjà utilisé ce droit à l'erreur ?"
        },
        "Q182": {
            "cl": "ou",
            "li": "Q180",
            "key20190302": "QUXVlc3Rpb246MTgy",
            "question": "Si oui, à quelle occasion en avez-vous fait usage ?"
        },
        "Q183": {
            "cl": "ou",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTgz",
            "question": "Pouvez-vous identifier des règles que l'administration vous a déjà demandé d'appliquer et que vous avez jugées inutiles ou trop complexes ?"
        },
        "Q184": {
            "cl": "fe",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTg0",
            "question": "Faut-il donner plus d'autonomie aux fonctionnaires de terrain ?"
        },
        "Q185": {
            "cl": "ou",
            "li": "Q184",
            "key20190302": "QUXVlc3Rpb246MTg1",
            "question": "Si oui, comment ?"
        },
        "Q186": {
            "cl": "fe",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTg2",
            "question": "Faut-il revoir le fonctionnement et la formation de l'administration ?"
        },
        "Q187": {
            "cl": "ou",
            "li": "Q186",
            "key20190302": "QUXVlc3Rpb246MTg3",
            "question": "Si oui, comment ?"
        },
        "Q188": {
            "cl": "ou",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTg4",
            "question": "Comment l'Etat et les collectivités territoriales peuvent-ils s'améliorer pour mieux répondre aux défis de nos territoires les plus en difficulté ?"
        },
        "Q191": {
            "cl": "ou",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTkx",
            "question": "Si vous avez été amené à chercher une formation, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :"
        },
        "Q192": {
            "cl": "ou",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTky",
            "question": "Si vous avez été amené à scolariser votre enfant, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :"
        },
        "Q193": {
            "cl": "ou",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTkz",
            "question": "Si vous avez été amené à chercher un emploi, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :"
        },
        "Q194": {
            "cl": "ou",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTk0",
            "question": "Si vous avez été amené à préparer votre retraite, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :"
        },
        "Q195": {
            "cl": "ou",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTk1",
            "question": "Si vous avez été amené à demander un remboursement de soins de santé, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :"
        },
        "Q196": {
            "cl": "ou",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTk2",
            "question": "Si vous avez été amené à faire une demande d'aide pour une situation de handicap, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :"
        },
        "Q198": {
            "cl": "ou",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTk4",
            "question": "Si vous avez été amené à créer une entreprise, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :"
        },
        "Q199": {
            "cl": "ou",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTk5",
            "question": "Si vous avez été amené à recruter du personnel, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :"
        },
        "Q200": {
            "cl": "ou",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MjAw",
            "question": "Si vous avez été amené à former du personnel, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :"
        },
        "Q201": {
            "cl": "ou",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MjAx",
            "question": "Si vous avez été amené à rémunérer du personnel, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :"
        },
        "Q202": {
            "cl": "ou",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MjAy",
            "question": "Si vous avez été amené à mettre fin à votre activité, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :"
        },
        "Q203": {
            "cl": "ou",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MjAz",
            "question": "Si vous avez été amené à recruter une personne portant un handicap, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :"
        },
        "Q189": {
            "cl": "ou",
            "li": "solo",
            "key20190302": "QUXVlc3Rpb246MTg5",
            "question": "Y a-t-il d'autres points sur l'organisation de l'Etat et des services publics sur lesquels vous souhaiteriez vous exprimer ?"
        }
    };

    var keysTest_organisation_21mars = {
        "QUXVlc3Rpb246MTY5": {
            "shortKey": "Q169",
            "value": "QUXVlc3Rpb246MTY5 - Que pensez-vous de l'organisation de l'Etat et des administrations en France ? De quelle manière cette organisation devrait-elle évoluer ?",
            "question": "Que pensez-vous de l'organisation de l'Etat et des administrations en France ? De quelle manière cette organisation devrait-elle évoluer ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTcw": {
            "shortKey": "Q170",
            "value": "QUXVlc3Rpb246MTcw - Selon vous, l'Etat doit-il aujourd'hui transférer de nouvelles missions aux collectivités territoriales ?",
            "question": "Selon vous, l'Etat doit-il aujourd'hui transférer de nouvelles missions aux collectivités territoriales ?",
            "cl": "fe",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTcx": {
            "shortKey": "Q171",
            "value": "QUXVlc3Rpb246MTcx - Si oui, lesquelles ?",
            "question": "Si oui, lesquelles ?",
            "cl": "ou",
            "li": "Q170"
        },
        "QUXVlc3Rpb246MjA0": {
            "shortKey": "Q204",
            "value": "QUXVlc3Rpb246MjA0 - Estimez-vous avoir accès aux services publics dont vous avez besoin ?",
            "question": "Estimez-vous avoir accès aux services publics dont vous avez besoin ?",
            "cl": "fe",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTcy": {
            "shortKey": "Q172",
            "value": "QUXVlc3Rpb246MTcy - Si non, quels types de services publics vous manquent dans votre territoire et qu'il est nécessaire de renforcer ?",
            "question": "Si non, quels types de services publics vous manquent dans votre territoire et qu'il est nécessaire de renforcer ?",
            "cl": "ou",
            "li": "Q204"
        },
        "QUXVlc3Rpb246MTc0": {
            "shortKey": "Q174",
            "value": "QUXVlc3Rpb246MTc0 - Quels nouveaux services ou quelles démarches souhaitez-vous voir développées sur Internet en priorité ?",
            "question": "Quels nouveaux services ou quelles démarches souhaitez-vous voir développées sur Internet en priorité ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTc1": {
            "shortKey": "Q175",
            "value": "QUXVlc3Rpb246MTc1 - Avez-vous déjà utilisé certaines de ces nouvelles formes de services publics ?",
            "question": "Avez-vous déjà utilisé certaines de ces nouvelles formes de services publics ?",
            "cl": "fe",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTc2": {
            "shortKey": "Q176",
            "value": "QUXVlc3Rpb246MTc2 - Si oui, en avez-vous été satisfait ?",
            "question": "Si oui, en avez-vous été satisfait ?",
            "cl": "fe",
            "li": "Q175"
        },
        "QUXVlc3Rpb246MTc3": {
            "shortKey": "Q177",
            "value": "QUXVlc3Rpb246MTc3 - Quelles améliorations préconiseriez-vous ?",
            "question": "Quelles améliorations préconiseriez-vous ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTc4": {
            "shortKey": "Q178",
            "value": "QUXVlc3Rpb246MTc4 - Quand vous pensez à l'évolution des services publics au cours des dernières années, quels sont ceux qui ont évolué de manière positive ?",
            "question": "Quand vous pensez à l'évolution des services publics au cours des dernières années, quels sont ceux qui ont évolué de manière positive ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTc5": {
            "shortKey": "Q179",
            "value": "QUXVlc3Rpb246MTc5 - Quels sont les services publics qui doivent le plus évoluer selon vous ?",
            "question": "Quels sont les services publics qui doivent le plus évoluer selon vous ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTgw": {
            "shortKey": "Q180",
            "value": "QUXVlc3Rpb246MTgw - Connaissez-vous le \"droit à l'erreur\", c'est-à-dire le droit d'affirmer votre bonne foi lorsque vous faites un erreur dans vos déclarations ?",
            "question": "Connaissez-vous le \"droit à l'erreur\", c'est-à-dire le droit d'affirmer votre bonne foi lorsque vous faites un erreur dans vos déclarations ?",
            "cl": "fe",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTgx": {
            "shortKey": "Q181",
            "value": "QUXVlc3Rpb246MTgx - Si oui, avez-vous déjà utilisé ce droit à l'erreur ?",
            "question": "Si oui, avez-vous déjà utilisé ce droit à l'erreur ?",
            "cl": "fe",
            "li": "Q180"
        },
        "QUXVlc3Rpb246MTgy": {
            "shortKey": "Q182",
            "value": "QUXVlc3Rpb246MTgy - Si oui, à quelle occasion en avez-vous fait usage ?",
            "question": "Si oui, à quelle occasion en avez-vous fait usage ?",
            "cl": "ou",
            "li": "Q180"
        },
        "QUXVlc3Rpb246MTgz": {
            "shortKey": "Q183",
            "value": "QUXVlc3Rpb246MTgz - Pouvez-vous identifier des règles que l'administration vous a déjà demandé d'appliquer et que vous avez jugées inutiles ou trop complexes ?",
            "question": "Pouvez-vous identifier des règles que l'administration vous a déjà demandé d'appliquer et que vous avez jugées inutiles ou trop complexes ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTg0": {
            "shortKey": "Q184",
            "value": "QUXVlc3Rpb246MTg0 - Faut-il donner plus d'autonomie aux fonctionnaires de terrain ?",
            "question": "Faut-il donner plus d'autonomie aux fonctionnaires de terrain ?",
            "cl": "fe",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTg1": {
            "shortKey": "Q185",
            "value": "QUXVlc3Rpb246MTg1 - Si oui, comment ?",
            "question": "Si oui, comment ?",
            "cl": "ou",
            "li": "Q184"
        },
        "QUXVlc3Rpb246MTg2": {
            "shortKey": "Q186",
            "value": "QUXVlc3Rpb246MTg2 - Faut-il revoir le fonctionnement et la formation de l'administration ?",
            "question": "Faut-il revoir le fonctionnement et la formation de l'administration ?",
            "cl": "fe",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTg3": {
            "shortKey": "Q187",
            "value": "QUXVlc3Rpb246MTg3 - Si oui, comment ?",
            "question": "Si oui, comment ?",
            "cl": "ou",
            "li": "Q186"
        },
        "QUXVlc3Rpb246MTg4": {
            "shortKey": "Q188",
            "value": "QUXVlc3Rpb246MTg4 - Comment l'Etat et les collectivités territoriales peuvent-ils s'améliorer pour mieux répondre aux défis de nos territoires les plus en difficulté ?",
            "question": "Comment l'Etat et les collectivités territoriales peuvent-ils s'améliorer pour mieux répondre aux défis de nos territoires les plus en difficulté ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTkx": {
            "shortKey": "Q191",
            "value": "QUXVlc3Rpb246MTkx - Si vous avez été amené à chercher une formation, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "question": "Si vous avez été amené à chercher une formation, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTky": {
            "shortKey": "Q192",
            "value": "QUXVlc3Rpb246MTky - Si vous avez été amené à scolariser votre enfant, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "question": "Si vous avez été amené à scolariser votre enfant, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTkz": {
            "shortKey": "Q193",
            "value": "QUXVlc3Rpb246MTkz - Si vous avez été amené à chercher un emploi, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "question": "Si vous avez été amené à chercher un emploi, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTk0": {
            "shortKey": "Q194",
            "value": "QUXVlc3Rpb246MTk0 - Si vous avez été amené à préparer votre retraite, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "question": "Si vous avez été amené à préparer votre retraite, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTk1": {
            "shortKey": "Q195",
            "value": "QUXVlc3Rpb246MTk1 - Si vous avez été amené à demander un remboursement de soins de santé, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "question": "Si vous avez été amené à demander un remboursement de soins de santé, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTk2": {
            "shortKey": "Q196",
            "value": "QUXVlc3Rpb246MTk2 - Si vous avez été amené à faire une demande d'aide pour une situation de handicap, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "question": "Si vous avez été amené à faire une demande d'aide pour une situation de handicap, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTk4": {
            "shortKey": "Q198",
            "value": "QUXVlc3Rpb246MTk4 - Si vous avez été amené à créer une entreprise, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "question": "Si vous avez été amené à créer une entreprise, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTk5": {
            "shortKey": "Q199",
            "value": "QUXVlc3Rpb246MTk5 - Si vous avez été amené à recruter du personnel, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "question": "Si vous avez été amené à recruter du personnel, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MjAw": {
            "shortKey": "Q200",
            "value": "QUXVlc3Rpb246MjAw - Si vous avez été amené à former du personnel, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "question": "Si vous avez été amené à former du personnel, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MjAx": {
            "shortKey": "Q201",
            "value": "QUXVlc3Rpb246MjAx - Si vous avez été amené à rémunérer du personnel, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "question": "Si vous avez été amené à rémunérer du personnel, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MjAy": {
            "shortKey": "Q202",
            "value": "QUXVlc3Rpb246MjAy - Si vous avez été amené à mettre fin à votre activité, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "question": "Si vous avez été amené à mettre fin à votre activité, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MjAz": {
            "shortKey": "Q203",
            "value": "QUXVlc3Rpb246MjAz - Si vous avez été amené à recruter une personne portant un handicap, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "question": "Si vous avez été amené à recruter une personne portant un handicap, pouvez-vous indiquer les éléments de satisfaction et/ou les difficultés rencontrés en précisant, pour chaque point, l'administration concernée :",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTg5": {
            "shortKey": "Q189",
            "value": "QUXVlc3Rpb246MTg5 - Y a-t-il d'autres points sur l'organisation de l'Etat et des services publics sur lesquels vous souhaiteriez vous exprimer ?",
            "question": "Y a-t-il d'autres points sur l'organisation de l'Etat et des services publics sur lesquels vous souhaiteriez vous exprimer ?",
            "cl": "ou",
            "li": "solo"
        }
    };

    var keysTest_democratie_21mars = {
        "QUXVlc3Rpb246MTA3": {
            "shortKey": "Q1",
            "value": "QUXVlc3Rpb246MTA3 - En qui faites-vous le plus confiance pour vous faire représenter dans la société et pourquoi ?",
            "question": "En qui faites-vous le plus confiance pour vous faire représenter dans la société et pourquoi ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTA4": {
            "shortKey": "Q2",
            "value": "QUXVlc3Rpb246MTA4 - En dehors des élus politiques, faut-il donner un rôle plus important aux associations et aux organisations syndicales et professionnelles ?",
            "question": "En dehors des élus politiques, faut-il donner un rôle plus important aux associations et aux organisations syndicales et professionnelles ?",
            "cl": "fe",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTA5": {
            "shortKey": "Q3",
            "value": "QUXVlc3Rpb246MTA5 - Si oui, à quel type d'associations ou d'organisations ? Et avec quel rôle ?",
            "question": "Si oui, à quel type d'associations ou d'organisations ? Et avec quel rôle ?",
            "cl": "ou",
            "li": "Q2"
        },
        "QUXVlc3Rpb246MTEw": {
            "shortKey": "Q4",
            "value": "QUXVlc3Rpb246MTEw - Que faudrait-il faire pour renouer le lien entre les citoyens et les élus qui les représentent ?",
            "question": "Que faudrait-il faire pour renouer le lien entre les citoyens et les élus qui les représentent ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTEx": {
            "shortKey": "Q5",
            "value": "QUXVlc3Rpb246MTEx - Le non-cumul des mandats instauré en 2017 pour les parlementaires (députés et sénateurs) est :",
            "question": "Le non-cumul des mandats instauré en 2017 pour les parlementaires (députés et sénateurs) est :",
            "cl": "sp",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTEy": {
            "shortKey": "Q6",
            "value": "QUXVlc3Rpb246MTEy - Pourquoi ?",
            "question": "Pourquoi ?",
            "cl": "ou",
            "li": "Q5"
        },
        "QUXVlc3Rpb246MTEz": {
            "shortKey": "Q7",
            "value": "QUXVlc3Rpb246MTEz - Que faudrait-il faire pour mieux représenter les différentes sensibilités politiques ?",
            "question": "Que faudrait-il faire pour mieux représenter les différentes sensibilités politiques ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTE0": {
            "shortKey": "Q8",
            "value": "QUXVlc3Rpb246MTE0 - Pensez-vous qu'il serait souhaitable de réduire le nombre d'élus (hors députés et sénateurs) ?",
            "question": "Pensez-vous qu'il serait souhaitable de réduire le nombre d'élus (hors députés et sénateurs) ?",
            "cl": "fe",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTE1": {
            "shortKey": "Q9",
            "value": "QUXVlc3Rpb246MTE1 - Si oui, lesquels ?",
            "question": "Si oui, lesquels ?",
            "cl": "ou",
            "li": "Q8"
        },
        "QUXVlc3Rpb246MTE2": {
            "shortKey": "Q10",
            "value": "QUXVlc3Rpb246MTE2 - Que pensez-vous de la participation des citoyens aux élections et comment les inciter à y participer davantage ?",
            "question": "Que pensez-vous de la participation des citoyens aux élections et comment les inciter à y participer davantage ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTE3": {
            "shortKey": "Q11",
            "value": "QUXVlc3Rpb246MTE3 - Faut-il prendre en compte le vote blanc ?",
            "question": "Faut-il prendre en compte le vote blanc ?",
            "cl": "fe",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTE4": {
            "shortKey": "Q12",
            "value": "QUXVlc3Rpb246MTE4 - Si oui, de quelle manière ?",
            "question": "Si oui, de quelle manière ?",
            "cl": "ou",
            "li": "Q11"
        },
        "QUXVlc3Rpb246MTE5": {
            "shortKey": "Q13",
            "value": "QUXVlc3Rpb246MTE5 - Que faudrait-il faire aujourd'hui pour mieux associer les citoyens aux grandes orientations et à la décision publique ? Comment mettre en place une démocratie plus participative ?",
            "question": "Que faudrait-il faire aujourd'hui pour mieux associer les citoyens aux grandes orientations et à la décision publique ? Comment mettre en place une démocratie plus participative ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTIw": {
            "shortKey": "Q14",
            "value": "QUXVlc3Rpb246MTIw - Faut-il faciliter le déclenchement du référendum d'initiative partagée (le RIP est organisé à l'initiative de membres du Parlement soutenu par une partie du corps électoral) qui est applicable depuis 2015 ?",
            "question": "Faut-il faciliter le déclenchement du référendum d'initiative partagée (le RIP est organisé à l'initiative de membres du Parlement soutenu par une partie du corps électoral) qui est applicable depuis 2015 ?",
            "cl": "fe",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTIx": {
            "shortKey": "Q15",
            "value": "QUXVlc3Rpb246MTIx - Si oui, comment ?",
            "question": "Si oui, comment ?",
            "cl": "ou",
            "li": "Q14"
        },
        "QUXVlc3Rpb246MTIy": {
            "shortKey": "Q16",
            "value": "QUXVlc3Rpb246MTIy - Que faudrait-il faire pour consulter plus directement les citoyens sur l'utilisation de l'argent public, par l'Etat et les collectivités ?",
            "question": "Que faudrait-il faire pour consulter plus directement les citoyens sur l'utilisation de l'argent public, par l'Etat et les collectivités ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTIz": {
            "shortKey": "Q17",
            "value": "QUXVlc3Rpb246MTIz - Quel rôle nos assemblées, dont le Sénat et le Conseil économique, social et environnemental, doivent-elles jouer pour représenter nos territoires et la société civile ?",
            "question": "Quel rôle nos assemblées, dont le Sénat et le Conseil économique, social et environnemental, doivent-elles jouer pour représenter nos territoires et la société civile ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTI0": {
            "shortKey": "Q18",
            "value": "QUXVlc3Rpb246MTI0 - Faut-il les transformer ?",
            "question": "Faut-il les transformer ?",
            "cl": "fe",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTI1": {
            "shortKey": "Q19",
            "value": "QUXVlc3Rpb246MTI1 - Si oui, comment ?",
            "question": "Si oui, comment ?",
            "cl": "ou",
            "li": "Q18"
        },
        "QUXVlc3Rpb246MTI3": {
            "shortKey": "Q20",
            "value": "QUXVlc3Rpb246MTI3 - Que proposez-vous pour renforcer les principes de la laïcité dans le rapport entre l'Etat et les religions de notre pays ?",
            "question": "Que proposez-vous pour renforcer les principes de la laïcité dans le rapport entre l'Etat et les religions de notre pays ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTI4": {
            "shortKey": "Q21",
            "value": "QUXVlc3Rpb246MTI4 - Comment garantir le respect par tous de la compréhension réciproque et des valeurs intangibles de la République ?",
            "question": "Comment garantir le respect par tous de la compréhension réciproque et des valeurs intangibles de la République ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTI5": {
            "shortKey": "Q22",
            "value": "QUXVlc3Rpb246MTI5 - Que faudrait-il faire aujourd'hui pour renforcer l'engagement citoyen dans la société ?",
            "question": "Que faudrait-il faire aujourd'hui pour renforcer l'engagement citoyen dans la société ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTMw": {
            "shortKey": "Q23",
            "value": "QUXVlc3Rpb246MTMw - Quels sont les comportements civiques qu'il faut promouvoir dans notre vie quotidienne ou collective ?",
            "question": "Quels sont les comportements civiques qu'il faut promouvoir dans notre vie quotidienne ou collective ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTMx": {
            "shortKey": "Q24",
            "value": "QUXVlc3Rpb246MTMx - Que faudrait-il faire pour favoriser le développement de ces comportements civiques et par quels engagements concrets chacun peut-il y participer ?",
            "question": "Que faudrait-il faire pour favoriser le développement de ces comportements civiques et par quels engagements concrets chacun peut-il y participer ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTMy": {
            "shortKey": "Q25",
            "value": "QUXVlc3Rpb246MTMy - Que faudrait-il faire pour valoriser l'engagement citoyen dans les parcours de vie, dans les relations avec l'administration et les pouvoirs publics ?",
            "question": "Que faudrait-il faire pour valoriser l'engagement citoyen dans les parcours de vie, dans les relations avec l'administration et les pouvoirs publics ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTMz": {
            "shortKey": "Q26",
            "value": "QUXVlc3Rpb246MTMz - Quelles sont les incivilités les plus pénibles dans la vie quotidienne et que faudrait-il faire pour lutter contre ces incivilités ?",
            "question": "Quelles sont les incivilités les plus pénibles dans la vie quotidienne et que faudrait-il faire pour lutter contre ces incivilités ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTM0": {
            "shortKey": "Q27",
            "value": "QUXVlc3Rpb246MTM0 - Que peuvent et doivent faire les pouvoirs publics pour répondre aux incivilités ?",
            "question": "Que peuvent et doivent faire les pouvoirs publics pour répondre aux incivilités ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTM1": {
            "shortKey": "Q28",
            "value": "QUXVlc3Rpb246MTM1 - Quel pourrait être le rôle de chacun pour faire reculer les incivilités dans la société ?",
            "question": "Quel pourrait être le rôle de chacun pour faire reculer les incivilités dans la société ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTM2": {
            "shortKey": "Q29",
            "value": "QUXVlc3Rpb246MTM2 - Quelles sont les discriminations les plus répandues dont vous êtes témoin ou victime ?",
            "question": "Quelles sont les discriminations les plus répandues dont vous êtes témoin ou victime ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTM3": {
            "shortKey": "Q30",
            "value": "QUXVlc3Rpb246MTM3 - Que faudrait-il faire pour lutter contre ces discriminations et construire une société plus solidaire et plus tolérante ?",
            "question": "Que faudrait-il faire pour lutter contre ces discriminations et construire une société plus solidaire et plus tolérante ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTM4": {
            "shortKey": "Q31",
            "value": "QUXVlc3Rpb246MTM4 - Pensez-vous qu'il faille instaurer des contreparties aux différentes allocations de solidarité ?",
            "question": "Pensez-vous qu'il faille instaurer des contreparties aux différentes allocations de solidarité ?",
            "cl": "fe",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTM5": {
            "shortKey": "Q32",
            "value": "QUXVlc3Rpb246MTM5 - Si oui, lesquelles ?",
            "question": "Si oui, lesquelles ?",
            "cl": "ou",
            "li": "Q31"
        },
        "QUXVlc3Rpb246MTQx": {
            "shortKey": "Q33",
            "value": "QUXVlc3Rpb246MTQx - Que pensez-vous de la situation de l'immigration en France aujourd'hui et de la politique migratoire ? Quelles sont, selon vous, les critères à mettre en place pour définir la politique migratoire ?",
            "question": "Que pensez-vous de la situation de l'immigration en France aujourd'hui et de la politique migratoire ? Quelles sont, selon vous, les critères à mettre en place pour définir la politique migratoire ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTQy": {
            "shortKey": "Q34",
            "value": "QUXVlc3Rpb246MTQy - En matière d'immigration, une fois nos obligations d'asile remplies, souhaitez-vous que nous puissions nous fixer des objectifs annuels définis par le Parlement ?",
            "question": "En matière d'immigration, une fois nos obligations d'asile remplies, souhaitez-vous que nous puissions nous fixer des objectifs annuels définis par le Parlement ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTQz": {
            "shortKey": "Q35",
            "value": "QUXVlc3Rpb246MTQz - Que proposez-vous afin de répondre à ce défi qui va durer ?",
            "question": "Que proposez-vous afin de répondre à ce défi qui va durer ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTQ0": {
            "shortKey": "Q36",
            "value": "QUXVlc3Rpb246MTQ0 - Quelles sont, selon vous, les modalités d'intégration les plus efficaces et les plus justes à mettre en place aujourd'hui dans la société ?",
            "question": "Quelles sont, selon vous, les modalités d'intégration les plus efficaces et les plus justes à mettre en place aujourd'hui dans la société ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTQ1": {
            "shortKey": "Q37",
            "value": "QUXVlc3Rpb246MTQ1 - Y a-t-il d'autres points sur la démocratie et la citoyenneté sur lesquels vous souhaiteriez vous exprimer ?",
            "question": "Y a-t-il d'autres points sur la démocratie et la citoyenneté sur lesquels vous souhaiteriez vous exprimer ?",
            "cl": "ou",
            "li": "solo"
        }
    };

    var keysTest_fiscalite_21mars = {
        "QUXVlc3Rpb246MTYy": {
            "shortKey": "Q1",
            "value": "QUXVlc3Rpb246MTYy - Quelles sont toutes les choses qui pourraient être faites pour améliorer l'information des citoyens sur l'utilisation des impôts ?",
            "question": "Quelles sont toutes les choses qui pourraient être faites pour améliorer l'information des citoyens sur l'utilisation des impôts ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTYz": {
            "shortKey": "Q2",
            "value": "QUXVlc3Rpb246MTYz - Que faudrait-il faire pour rendre la fiscalité plus juste et plus efficace ?",
            "question": "Que faudrait-il faire pour rendre la fiscalité plus juste et plus efficace ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTY0": {
            "shortKey": "Q3",
            "value": "QUXVlc3Rpb246MTY0 - Quels sont selon vous les impôts qu'il faut baisser en priorité ?",
            "question": "Quels sont selon vous les impôts qu'il faut baisser en priorité ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MjA2": {
            "shortKey": "Q4",
            "value": "QUXVlc3Rpb246MjA2 - Afin de financer les dépenses sociales, faut-il selon vous...",
            "question": "Afin de financer les dépenses sociales, faut-il selon vous...",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MjA1": {
            "shortKey": "Q5",
            "value": "QUXVlc3Rpb246MjA1 - S'il faut selon vous revoir les conditions d'attribution de certaines aides sociales, lesquelles doivent être concernées ?",
            "question": "S'il faut selon vous revoir les conditions d'attribution de certaines aides sociales, lesquelles doivent être concernées ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTY1": {
            "shortKey": "Q6",
            "value": "QUXVlc3Rpb246MTY1 - Quels sont les domaines prioritaires où notre protection sociale doit être renforcée ?",
            "question": "Quels sont les domaines prioritaires où notre protection sociale doit être renforcée ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTY2": {
            "shortKey": "Q7",
            "value": "QUXVlc3Rpb246MTY2 - Pour quelle(s) politique(s) publique(s) ou pour quels domaines d'action publique, seriez-vous prêts à payer plus d'impôts ?",
            "question": "Pour quelle(s) politique(s) publique(s) ou pour quels domaines d'action publique, seriez-vous prêts à payer plus d'impôts ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTY3": {
            "shortKey": "Q8",
            "value": "QUXVlc3Rpb246MTY3 - Y a-t-il d'autres points sur les impôts et les dépenses sur lesquels vous souhaiteriez vous exprimer ?",
            "question": "Y a-t-il d'autres points sur les impôts et les dépenses sur lesquels vous souhaiteriez vous exprimer ?",
            "cl": "ou",
            "li": "solo"
        }
    };

    var keysTest_transition_21mars = {
        "QUXVlc3Rpb246MTYw": {
            "shortKey": "Q1",
            "value": "QUXVlc3Rpb246MTYw - Quel est aujourd'hui pour vous le problème concret le plus important dans le domaine de l'environnement ?",
            "question": "Quel est aujourd'hui pour vous le problème concret le plus important dans le domaine de l'environnement ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTYx": {
            "shortKey": "Q2",
            "value": "QUXVlc3Rpb246MTYx - Que faudrait-il faire selon vous pour apporter des réponses à ce problème ?",
            "question": "Que faudrait-il faire selon vous pour apporter des réponses à ce problème ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTQ2": {
            "shortKey": "Q3",
            "value": "QUXVlc3Rpb246MTQ2 - Diriez-vous que votre vie quotidienne est aujourd'hui touchée par le changement climatique ?",
            "question": "Diriez-vous que votre vie quotidienne est aujourd'hui touchée par le changement climatique ?",
            "cl": "fe",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTQ3": {
            "shortKey": "Q4",
            "value": "QUXVlc3Rpb246MTQ3 - Si oui, de quelle manière votre vie quotidienne est-elle touchée par le changement climatique ?",
            "question": "Si oui, de quelle manière votre vie quotidienne est-elle touchée par le changement climatique ?",
            "cl": "ou",
            "li": "Q3"
        },
        "QUXVlc3Rpb246MTQ4": {
            "shortKey": "Q5",
            "value": "QUXVlc3Rpb246MTQ4 - À titre personnel, pensez-vous pouvoir contribuer à protéger l'environnement ?",
            "question": "À titre personnel, pensez-vous pouvoir contribuer à protéger l'environnement ?",
            "cl": "fe",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTQ5": {
            "shortKey": "Q6",
            "value": "QUXVlc3Rpb246MTQ5 - Si oui, que faites-vous aujourd'hui pour protéger l'environnement et/ou que pourriez-vous faire ?",
            "question": "Si oui, que faites-vous aujourd'hui pour protéger l'environnement et/ou que pourriez-vous faire ?",
            "cl": "ou",
            "li": "Q5"
        },
        "QUXVlc3Rpb246MTUw": {
            "shortKey": "Q7",
            "value": "QUXVlc3Rpb246MTUw - Qu'est-ce qui pourrait vous inciter à changer vos comportements comme par exemple mieux entretenir et régler votre chauffage, modifier votre manière de conduire ou renoncer à prendre votre véhicule pour de très petites distances ?",
            "question": "Qu'est-ce qui pourrait vous inciter à changer vos comportements comme par exemple mieux entretenir et régler votre chauffage, modifier votre manière de conduire ou renoncer à prendre votre véhicule pour de très petites distances ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTUx": {
            "shortKey": "Q8",
            "value": "QUXVlc3Rpb246MTUx - Quelles seraient pour vous les solutions les plus simples et les plus supportables sur un plan financier pour vous inciter à changer vos comportements ?",
            "question": "Quelles seraient pour vous les solutions les plus simples et les plus supportables sur un plan financier pour vous inciter à changer vos comportements ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTUy": {
            "shortKey": "Q9",
            "value": "QUXVlc3Rpb246MTUy - Par rapport à votre mode de chauffage actuel, pensez-vous qu'il existe des solutions alternatives plus écologiques ?",
            "question": "Par rapport à votre mode de chauffage actuel, pensez-vous qu'il existe des solutions alternatives plus écologiques ?",
            "cl": "fe",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTUz": {
            "shortKey": "Q10",
            "value": "QUXVlc3Rpb246MTUz - Si oui, que faudrait-il faire pour vous convaincre ou vous aider à changer de mode de chauffage ?",
            "question": "Si oui, que faudrait-il faire pour vous convaincre ou vous aider à changer de mode de chauffage ?",
            "cl": "ou",
            "li": "Q9"
        },
        "QUXVlc3Rpb246MTU0": {
            "shortKey": "Q11",
            "value": "QUXVlc3Rpb246MTU0 - Avez-vous pour vos déplacements quotidiens la possibilité de recourir à des solutions de mobilité alternatives à la voiture individuelle comme les transports en commun, le covoiturage, l'auto-partage, le transport à la demande, le vélo, etc. ?",
            "question": "Avez-vous pour vos déplacements quotidiens la possibilité de recourir à des solutions de mobilité alternatives à la voiture individuelle comme les transports en commun, le covoiturage, l'auto-partage, le transport à la demande, le vélo, etc. ?",
            "cl": "fe",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTU1": {
            "shortKey": "Q12",
            "value": "QUXVlc3Rpb246MTU1 - Si oui, que faudrait-il faire pour vous convaincre ou vous aider à utiliser ces solutions alternatives ?",
            "question": "Si oui, que faudrait-il faire pour vous convaincre ou vous aider à utiliser ces solutions alternatives ?",
            "cl": "ou",
            "li": "Q11"
        },
        "QUXVlc3Rpb246MjA3": {
            "shortKey": "Q13",
            "value": "QUXVlc3Rpb246MjA3 - Si non, quelles sont les solutions de mobilité alternatives que vous souhaiteriez pouvoir utiliser ?",
            "question": "Si non, quelles sont les solutions de mobilité alternatives que vous souhaiteriez pouvoir utiliser ?",
            "cl": "ou",
            "li": "Q11"
        },
        "QUXVlc3Rpb246MTU3": {
            "shortKey": "Q14",
            "value": "QUXVlc3Rpb246MTU3 - Et qui doit selon vous se charger de vous proposer ce type de solutions alternatives ?",
            "question": "Et qui doit selon vous se charger de vous proposer ce type de solutions alternatives ?",
            "cl": "ou",
            "li": "Q11"
        },
        "QUXVlc3Rpb246MTU4": {
            "shortKey": "Q15",
            "value": "QUXVlc3Rpb246MTU4 - Que pourrait faire la France pour faire partager ses choix en matière d'environnement au niveau européen et international ?",
            "question": "Que pourrait faire la France pour faire partager ses choix en matière d'environnement au niveau européen et international ?",
            "cl": "ou",
            "li": "solo"
        },
        "QUXVlc3Rpb246MTU5": {
            "shortKey": "Q16",
            "value": "QUXVlc3Rpb246MTU5 - Y a-t-il d'autres points sur la transition écologique sur lesquels vous souhaiteriez vous exprimer ?",
            "question": "Y a-t-il d'autres points sur la transition écologique sur lesquels vous souhaiteriez vous exprimer ?",
            "cl": "ou",
            "li": "solo"
        }
    };

    if (title == "keysTest_organisation_17fevrier") {
        return keysTest_organisation_17fevrier;
    } else if (title == "keysTest_organisation_21mars") {
        return keysTest_organisation_21mars;
    } else if (title == "keysTest_democratie_21mars") {
        return keysTest_democratie_21mars;
    } else if (title == "keysTest_fiscalite_21mars") {
        return keysTest_fiscalite_21mars;
    } else if (title == "keysTest_transition_21mars") {
        return keysTest_transition_21mars;
    }
}

function floatingTooltip(tooltipId, width) {

    var tt = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .attr('id', tooltipId)
        .style('pointer-events', 'none');

    if (width) {
        tt.style('width', width);
    }

    hideTooltip();

    function showTooltip(content, event) {
        tt.style('opacity', 1.0)
            .html(content);
        $('#tooltipMap').show();

        updatePosition(event);
    }

    function hideTooltip() {
        $('#tooltipMap').hide();
        
        tt.style('opacity', 0.0);
    }

    function updatePosition(event) {
        var xOffset = 20;
        var yOffset = 10;

        var ttw = tt.style('width');
        var tth = tt.style('height');

        var wscrY = window.scrollY;
        var wscrX = window.scrollX;

        var curX = (document.all) ? event.clientX + wscrX : event.pageX;
        var curY = (document.all) ? event.clientY + wscrY : event.pageY;
        var ttleft = ((curX - wscrX + xOffset * 2 + ttw) > window.innerWidth) ?
            curX - ttw - xOffset * 2 : curX + xOffset;

        if (ttleft < wscrX + xOffset) {
            ttleft = wscrX + xOffset;
        }

        var tttop = ((curY - wscrY + yOffset * 2 + tth) > window.innerHeight) ?
            curY - tth - yOffset * 2 : curY + yOffset;

        if (tttop < wscrY + yOffset) {
            tttop = curY + yOffset;
        }

        tt
            .style('top', tttop + 'px')
            .style('left', ttleft + 'px');
    }

    return {
        showTooltip: showTooltip,
        hideTooltip: hideTooltip,
        updatePosition: updatePosition
    };
}

function launchCloud(tags) {
    document.getElementById('export_wordsDiv_btn').innerHTML = '<i class="fas fa-download"></i> png';
    document.getElementById('excepts_btn').innerHTML = '<i class="fas fa-eraser"></i> effacer des mots';
    var link = 'credit: <a  href="https://wordcloud2-js.timdream.org/#love" target="_blank"> wordscloud2 ';
    link += '<i class="fas fa-external-link-alt"></i></a>';
    document.getElementById('linkInfo_btn').innerHTML = link;

    document.getElementById('words_div').classList.remove('hidden');

    var sizes = [...new Set(tags.map(el => el[1]))].sort((a, b) => a - b);
    var scale = d3.scaleLinear()
        .domain(d3.extent(sizes))
        .range([7, 100]);

    tags = tags.filter(el => el[0] != undefined);
    tags.forEach(el => {
        el[1] = Math.floor(scale(el[1]));
    })

    var w = Math.round(words_div.getBoundingClientRect().width - 10),
        h = Math.round(words_div.getBoundingClientRect().height - 40);


    var canvas = document.getElementById('cloud_canvas');
    canvas.getContext('2d').clearRect(0, 0, 0, 0);

    canvas.width = w;
    canvas.height = h;

    var tooltipCloud = d3.select('#tooltipCloud');

    WordCloud(cloud_canvas, {
        list: tags,
        gridSize: 10,
        weightFactor: 1,
        minFontSize: "30px",
        hover: function (item, dimension, event) {
            if (item != undefined) {
                tooltipCloud.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                tooltipCloud.html(item[0])
                    .style("left", (event.pageX - 30) + "px")
                    .style("top", (event.pageY + -35) + "px");
            } else {
                tooltipCloud.transition()
                    .duration(100)
                    .style("opacity", 0);
            }
        }
    });


    document.getElementById('export_wordsDiv_btn').onclick = function (e) {
        e.stopPropagation();
        let node = canvas,
            button = this,
            innerText = ' png',
            filename = 'wordsCloud',
            scale = 1.6;
        let props = {
            width: canvas.width * scale,
            height: canvas.height * scale
        }
        button.innerHTML = '<i class="fa fa-cog fa-spin"></i> ' + innerText;
        domtoimage.toBlob(node, props == undefined ? {} : props)
            .then(function (blob) {
                window.saveAs(blob, filename + '.png');
                button.innerHTML = '<i class="glyphicon glyphicon-export"></i> ' + innerText;
            });
    };

    $(".loaderClass").hide();

    return true;
}

function keywordsList(counts, excepts) {
    var arr = Object.entries(counts);

    var list = [];

    for (var i = 0, lgi = arr.length; i < lgi; i++) {
        if (excepts.indexOf(arr[i][0]) === -1 && arr[i][0].length > 2)
            list.push([arr[i][0].toLowerCase().trim(), arr[i][1]]);
    }

    return list.sort((a, b) => b[1] - a[1]);
}

function htmlWordsCloud(item, storeExcepts) {
    var form = document.createElement('FORM');
    form.setAttribute("role", "form");
    form.setAttribute("class", "form-horizontal");

    var divForm_row01 = document.createElement('DIV');
    divForm_row01.setAttribute("class", "form-group");

    var divTitle = document.createElement('DIV');
    divTitle.setAttribute("class", "col-sm-12");
    var labelTitle = document.createElement('LABEL');
    labelTitle.innerHTML = item.title;
    labelTitle.setAttribute("for", "inputTextarea");
    labelTitle.setAttribute("class", "col-form-label");
    labelTitle.style.fontWeight = 400;
    labelTitle.style.fontStyle = "italic";
    var inputTextarea = document.createElement('TEXTAREA');
    inputTextarea.id = "inputTextarea";
    inputTextarea.setAttribute("class", "form-control");
    inputTextarea.setAttribute("type", "text");
    inputTextarea.value = (storeExcepts != undefined) ? storeExcepts : "";

    divTitle.appendChild(inputTextarea);
    inputTextarea.parentNode.insertBefore(labelTitle, inputTextarea);

    divForm_row01.appendChild(divTitle);
    form.appendChild(divForm_row01);

    return form;
}
function regionForMap(dataSelected, regions) {
    var domainParticipants = [];
    dataSelected.forEach(function (obj, i) {
        var region = obj["nom_region"];
        var participants = obj["participants"];
        var occurrences = obj["occurrences"];
        var keywords = obj["keywords"];
        var responses = obj["responses"];
        regions.features.forEach(function (obj) {
            if (region == obj.properties.nom) {
                obj.properties.participants = participants;
                obj.properties.occurrences = occurrences;
                obj.properties.keywords = keywords;
                obj.properties.responses = responses;
            }
        });
        domainParticipants.push(participants);
    });
    return domainParticipants.sort((a, b) => a - b);
}

var barValues = [
    ["ticks", "valeurs"]
];

function specialResponses(arr, pattern, number) {
    return d3.sum(arr, function (d) {
        if (pattern.test(d["mots-cles"])) {
            var el = d["mots-cles"].match(pattern)[0];
            return +el.slice(number, el.length);
        }
    })
}

function dataForMap(json, typeQuestion) {
    var nestedData = d3.nest()
        .key(d => d["region"])
        // .key(d => d["﻿mois"])
        .rollup(function (v) {
            var row = [];
            var participants = d3.sum([...new Set(v.filter(obj => obj.mois == "janvier").map(obj => +obj.participants))]) +
                d3.sum([...new Set(v.filter(obj => obj.mois == "février").map(obj => +obj.participants))]) +
                d3.sum([...new Set(v.filter(obj => obj.mois == "mars").map(obj => +obj.participants))]);
            var occurrences = d3.sum([...new Set(v.filter(obj => obj.mois == "janvier").map(obj => +obj.occurrences))]) +
                d3.sum([...new Set(v.filter(obj => obj.mois == "février").map(obj => +obj.occurrences))]) +
                d3.sum([...new Set(v.filter(obj => obj.mois == "mars").map(obj => +obj.occurrences))]);
            var oui = d3.sum([...new Set(v.filter(obj => obj.mois == "janvier").map(obj => +obj.oui))]) +
                d3.sum([...new Set(v.filter(obj => obj.mois == "février").map(obj => +obj.oui))]) +
                d3.sum([...new Set(v.filter(obj => obj.mois == "mars").map(obj => +obj.oui))]);
            var non = d3.sum([...new Set(v.filter(obj => obj.mois == "janvier").map(obj => +obj.non))]) +
                d3.sum([...new Set(v.filter(obj => obj.mois == "février").map(obj => +obj.non))]) +
                d3.sum([...new Set(v.filter(obj => obj.mois == "mars").map(obj => +obj.non))]);
            var vide = d3.sum([...new Set(v.filter(obj => obj.mois == "janvier").map(obj => +obj.vide))]) +
                d3.sum([...new Set(v.filter(obj => obj.mois == "février").map(obj => +obj.vide))]) +
                d3.sum([...new Set(v.filter(obj => obj.mois == "mars").map(obj => +obj.vide))]);
            var bonne = (typeQuestion == "sp") ? specialResponses(v, /Une bonne chose=\d+/, 16) : 0;
            var mauvaise = (typeQuestion == "sp") ? specialResponses(v, /Une mauvaise chose=\d+/, 19) : 0;
            var sait_pas = (typeQuestion == "sp") ? specialResponses(v, /Je ne sais pas=\d+/, 15) : 0;
            var vide_sp = d3.sum(v, function (d) {
                if (/^=\d+/.test(d["mots-cles"])) {
                    var el = d["mots-cles"].match(/^=\d+/)[0];
                    return +el.slice(1, el.length);
                } else if (/\,\=\d+/.test(d["mots-cles"])) {
                    var el = d["mots-cles"].match(/\,\=\d+/)[0];
                    return +el.slice(2, el.length);
                }
            });
            var responses = [{
                    responses: "oui",
                    total: (oui ? oui : 0),
                    color: "rgb(0, 162, 67)"
                },
                {
                    responses: "non",
                    total: (non ? non : 0),
                    color: "rgb(255, 0, 0)"
                },
                {
                    responses: "na",
                    total: (vide ? vide : 0),
                    color: "rgb(0, 0, 255)"
                }
            ];
            var responses_sp = [{
                    responses: "bonne chose",
                    total: (bonne ? bonne : 0),
                    color: "rgb(0, 162, 67)"
                },
                {
                    responses: "mauvaise",
                    total: (mauvaise ? mauvaise : 0),
                    color: "rgb(255, 0, 0)"
                },
                {
                    responses: "ne sais pas",
                    total: (sait_pas ? sait_pas : 0),
                    color: "rgb(0, 0, 255)"
                },
                {
                    responses: "na",
                    total: (vide_sp ? vide_sp : 0),
                    color: "rgb(143, 143, 143)"
                }
            ];
            return {
                participants: participants,
                occurrences: occurrences,
                keywords: keywordsByRegion(v),
                responses: (typeQuestion != "ou" && typeQuestion == "fe") ? responses : responses_sp
            };
        })
        .entries(json);


    var jsonData = [];
    nestedData.forEach((obj, i) => {
        if (obj.key == "Ile-de-France")
            obj.key = "\u00cele-de-France";
        if (obj.key == "Pays-de-la-Loire")
            obj.key = "Pays de la Loire";
        if (obj.key == "Grand-Est")
            obj.key = "Grand Est";

        if (obj.key != "Né à l'étranger")
            jsonData.push({
                nom_region: obj.key,
                participants: +obj.value.participants,
                occurrences: +obj.value.occurrences,
                keywords: obj.value.keywords,
                responses: obj.value.responses
            });
    });

    return jsonData;
}

function launchMap(json, peopleByMonth, keyswords) {
    $('#tooltipMap').hide();

    var typeQuestion = document.getElementById('question_selected').dataset.type;

    document.getElementById('map_div').innerHTML = "<div id='map' style='width: 100%; height: 100%;'></div>";
    var tooltipMap = d3.select('#tooltipMap');

    // Creating a map object
    var map = new L.map('map', {
        center: new L.LatLng(48.864716, 2.349014),
        zoom: 4,
        minZoom: 2,
        maxZoom: 12,
    });

    var layer = new L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    map.addLayer(layer);

    var expand_button = L.easyButton({
        id: 'expand_button_map',
        states: [{
            icon: 'fa-expand',
            title: "agrandir/réduire",
            stateName: 'expand/resize',
            onClick: function () {
                $('#tooltipMap').hide();
                document.getElementById('bubbles_container').classList.toggle('hidden');
                words_div.classList.add('hidden');
                barplot_div.classList.add('hidden');
                wordscloud_container.classList.toggle('col-lg-4');
                if ($("#map_div").height() < Math.round(innerHeigth * 0.85)) {
                    $("#map_div").height(Math.round(innerHeigth * 0.85));
                } else {
                    if ($('#map_div').height()) {
                        document.getElementById('all').classList.add('active');
                        document.getElementById('month').classList.remove('active');
                        var theme = document.getElementById('theme_selected').innerHTML;
                        d3.select('#vis').selectAll("svg").remove();
                        $('#gates_tooltip').remove();
                        bubbleChart()('#vis', json, peopleByMonth);
                        if (typeQuestion == "ou") {
                            words_div.classList.remove('hidden');
                            launchCloud(keyswords);
                        } else {
                            barplot_div.classList.remove('hidden');
                            barChart(json, typeQuestion);
                        }
                        map_div.style.height = initialHeightMap;
                    }
                }
                map.invalidateSize();
            }
        }]
    }).addTo(map);

    var sync_button = L.easyButton({
        id: 'sync_button_map',
        states: [{
            icon: 'fa-sync',
            title: 'recentrer',
            stateName: 'refresh',
            onClick: function () {
                // remove_wordsDiv();
                // $('.leaflet-marker-icon').removeClass("blink");
                map.setView([48.864716, 2.349014], 4);
            }
        }]
    }).addTo(map);

    var print_button = L.easyButton({
        id: 'print_button_map',
        states: [{
            icon: 'fa-download',
            title: "export PNG",
            stateName: 'print-map',
            onClick: function (e) {
                let node = map_div,
                    button = this,
                    innerText = 'map to PNG',
                    classMap = $('.leaflet-top.leaflet-left');
                downloadAsImg(node, "map", 2, button, innerText, classMap);
            }
        }]
    }).addTo(map);

    var regionGeoJs;
    var dataReady;

    var promises = [];
    promises.push(d3.json(jsonRegions));
    promises.push(dataForMap(json, typeQuestion));

    Promise.all(promises).then(function (values) {
        var regions = values[0];
        var dataSelected = values[1];

        var domain = regionForMap(dataSelected, regions);

        regionGeoJs = L.geoJson(regions, {
            style: styleReg,
            onEachFeature: eventMouse
        }).addTo(map);

        function styleReg(feature) {
            return {
                fillColor: getColor(feature.properties.participants),
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
            };
        }

        function getColor(a) {
            return a > 20000 ? '#081d58' :
                a > 10000 ? '#225ea8' :
                a > 5000 ? '#1d91c0' :
                a > 2500 ? '#7fcdbb' :
                '#BCA97B';
        }

        function eventMouse(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }

        function highlightFeature(e) {
            var layer = e.target;
            var props = layer.feature.properties;
            var event = e.originalEvent;

            $('#tooltipMap').show();
            lauchTooltipMap(event, props);

            layer.setStyle({
                weight: 2,
                // color: '#666',
                dashArray: '',
                fillOpacity: 1
            });

            if (!L.Browser.ie && !L.Browser.opera) {
                layer.bringToFront();
            }
            info.update(props);
        }

        function resetHighlight(e) {
            regionGeoJs.resetStyle(e.target);
            info.update();
            tooltipMap.transition()
                .duration(100)
                .style("opacity", 0);
        }

        function zoomToFeature(e) {
            $('#tooltipMap').show();
            var layer = e.target;
            var props = layer.feature.properties;
            var event = e.originalEvent;
            if (testIos) {
                lauchTooltipMap(event, props);
                info.update(props);
            } else {
                map.fitBounds(e.target.getBounds());
                info.update();
            }
        }

        function lauchTooltipMap(event, props) {
            if (typeQuestion == "ou") {
                tooltipMap.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                tooltipMap.html('<canvas id="tooltip_canvas" class="word_cloud">')
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY) + "px");

                launchCloudMap(props.keywords, "tooltip_canvas", 145);

            } else {
                tooltipMap.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                tooltipMap.html('<div id="tooltip_barchart"></div>')
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY) + "px");
                (typeQuestion == "fe") ? barchartForMap(props.responses, "#tooltip_barchart", 30, 150):
                    barchartForMap(props.responses, "#tooltip_barchart", 70, 150);
            }
        }

        var info = L.control(); // { position: 'bottomleft' }

        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        };

        info.update = function (props) {
            this._div.innerHTML = '<h4>Nombre participants par région</h4>' + (props ?
                '<b>' + props.nom + '</b><br />' + props.participants + " participants" :
                'Passez la souris sur une région<br>');
        };

        info.addTo(map);

        info.addTo(map);

        var legend = L.control({
            position: 'bottomright'
        });

        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'legend'),
                seuils = [0, 2500, 5000, 10000, 20000],
                labels = [];
            for (var i = seuils.length - 1; i >= 0; i--) {
                if (seuils[i] == 0) {
                    div.innerHTML += '<i style="background:' + getColor(seuils[i] + 1) + '"></i> &ge;&ensp;' + seuils[i] + '&ensp;<br>';
                } else {
                    div.innerHTML += '<i style="background:' + getColor(seuils[i] + 1) + '"></i>' + seuils[i] + '&ensp;<br>';
                }
            }

            return div;
        };
        legend.addTo(map);

        map.invalidateSize();
    }) // fin promise

    $(".loaderClass").hide();
}
/* save div to image */
function downloadAsImg(node, filename, scale, button, innerText, classMap) {
    if (classMap !== undefined) classMap.hide();
    button.innerHTML = '<i class="fa fa-cog fa-spin"></i> ' + innerText;
    (scale !== undefined && isFinite(scale) && node.clientWidth * scale < window.innerWidth) ? scale = scale: scale = 1;
    var props = {
        width: node.clientWidth * scale,
        height: node.clientHeight * scale,
        style: {
            'transform': 'scale(' + scale + ')',
            'transform-origin': 'top left'
        }
    }
    domtoimage.toBlob(node, props == undefined ? {} : props)
        .then(function (blob) {
            window.saveAs(blob, filename + '.png');
            if (classMap !== undefined) classMap.show();
            button.innerHTML = '<i class="glyphicon glyphicon-export"></i> ' + innerText;
        });
}

function launchCloudMap(tags, canvas_id, width) {
    var sizes = [...new Set(tags.map(el => el[1]))].sort((a, b) => a - b);
    var scale = d3.scaleLinear()
        .domain(d3.extent(sizes))
        .range([6, 60]);

    tags.forEach(el => {
        el[1] = Math.floor(scale(el[1]));
    });
    var canvas = document.getElementById(canvas_id);
    canvas.getContext('2d').clearRect(0, 0, 0, 0);

    canvas.width = width;
    canvas.height = 75;

    WordCloud(canvas_id, {
        list: tags,
        gridSize: 2,
        weightFactor: 1,
        minFontSize: "10px",
    });
}

function barchartForMap(data, div_id, left, width) {
    // set the dimensions and margins of the graph
    var margin = {
            top: 5,
            right: 5,
            bottom: 20,
            left: left
        },
        width = width - margin.left - margin.right,
        height = 80 - margin.top - margin.bottom;
    // set the ranges
    var y = d3.scaleBand()
        .range([height, 0])
        .padding(0.1);
    var x = d3.scaleLinear()
        .range([0, width]);

    var svg = d3.select(div_id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function (d) {
        d.total = +d.total;
    });
    // Scale the range of the data in the domains
    x.domain([0, d3.max(data, function (d) {
        return d.total;
    })])
    y.domain(data.map(function (d) {
        return d.responses;
    }));

    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g");

    bars.append("rect")
        .attr("class", "bar")
        //.attr("x", function(d) { return x(d.sales); })
        .attr("width", function (d) {
            return x(d.total);
        })
        .attr("y", function (d) {
            return y(d.responses);
        })
        .attr("height", y.bandwidth())
        .attr("fill", d => d.color);

    bars.append("text")
        .attr("class", "label-barchartMap")
        //y position of the label is halfway down the bar
        .attr("y", function (d) {
            return y(d.responses) + y.bandwidth() / 2 + 4;
        })
        //x position is 3 pixels to the right of the bar
        .attr("x", function (d) {
            return x(d.total) - 30;
        })
        .text(function (d) {
            return d.total;
        })
        .attr("fill", "white");

    svg.append("g")
        .call(d3.axisLeft(y));
}

function barChart(events, type) {
    var dataTrace1 = [],
        dataTrace2 = [],
        dataTrace3 = [],
        dataTrace4 = [];
    var name1,
        name2,
        name3,
        name4;

    if (type == "fe") {
        name1 = "oui";
        name2 = "non";
        name3 = "na";
        var nestedData = d3.nest()
            .key(d => d["authorType"] ? d["authorType"] : "non indiqué")
            .rollup(function(v) {
                return {
                    count: v.length,
                    participants: d3.sum(v, function(d) {
                        return d["participants"];
                    }),
                    oui: d3.sum(v, function(d) {
                        return d["oui"];
                    }),
                    non: d3.sum(v, function(d) {
                        return d["non"];
                    }),
                    vide: d3.sum(v, function(d) {
                        return d["vide"];
                    })
                };
            })
            .entries(events);

        var uniqueAuthors = nestedData.map(el => el.key);
        nestedData.forEach(obj => {
            dataTrace1.push(obj.value["oui"]);
            dataTrace2.push(obj.value["non"]);
            dataTrace3.push(obj.value["vide"]);
        });
    } else {
        name1 = "Une bonne chose";
        name2 = "Une mauvaise chose";
        name3 = "Je ne sais pas";
        name4 = "na";
        var nestedData = d3.nest()
            .key(d => d["authorType"] ? d["authorType"] : "non indiqué")
            .rollup(function(v) {
                return {
                    count: v.length,
                    participants: d3.sum(v, function(d) {
                        return d["participants"];
                    }),
                    bonne: d3.sum(v, function(d) {
                        if (/Une bonne chose=\d+/.test(d["mots-cles"])) {
                            var el = d["mots-cles"].match(/Une bonne chose=\d+/)[0];
                            return +el.slice(16, el.length);
                        }
                    }),
                    mauvaise: d3.sum(v, function(d) {
                        if (/Une mauvaise chose=\d+/.test(d["mots-cles"])) {
                            var el = d["mots-cles"].match(/Une mauvaise chose=\d+/)[0];
                            return +el.slice(19, el.length);

                        }
                    }),
                    sait_pas: d3.sum(v, function(d) {
                        if (/Je ne sais pas=\d+/.test(d["mots-cles"])) {
                            var el = d["mots-cles"].match(/Je ne sais pas=\d+/)[0];
                            return +el.slice(15, el.length);

                        }
                    }),
                    vide: d3.sum(v, function(d) {
                        if (/^=\d+/.test(d["mots-cles"])) {
                            var el = d["mots-cles"].match(/^=\d+/)[0];
                            return +el.slice(1, el.length);
                        } else if (/\,\=\d+/.test(d["mots-cles"])) {
                            var el = d["mots-cles"].match(/\,\=\d+/)[0];
                            return +el.slice(2, el.length);
                        }
                    })
                };
            })
            .entries(events);

        var uniqueAuthors = nestedData.map(el => el.key);
        nestedData.forEach(obj => {
            dataTrace1.push(obj.value["bonne"]);
            dataTrace2.push(obj.value["mauvaise"]);
            dataTrace3.push(obj.value["sait_pas"]);
            dataTrace4.push(obj.value["vide"]);

        });

    }

    var trace1 = {
        x: uniqueAuthors,
        y: dataTrace1,
        name: name1,
        type: 'bar',
        marker: {
            color: 'rgb(0, 162, 67)',
            width: 1
        }
    };

    var trace2 = {
        x: uniqueAuthors,
        y: dataTrace2,
        name: name2,
        type: 'bar',
        marker: {
            color: 'rgb(255, 0, 0)',
            width: 1
        }
    };

    var trace3 = {
        x: uniqueAuthors,
        y: dataTrace3,
        name: name3,
        type: 'bar',
        marker: {
            color: 'rgb(0, 0, 255)',
            width: 1
        }
    };

    var trace4 = {
        x: uniqueAuthors,
        y: dataTrace4,
        name: name4,
        type: 'bar',
        marker: {
            color: 'rgb(200, 200, 200)',
            width: 1
        }
    };

    var data = [trace1, trace2, trace3, trace4];

    var layout = {
        title: 'Répartition par type d\'organisation',
        height: innerHeigth * 0.46,
        showlegend: true,
        autosize: true,
        barmode: 'group', 
        yaxis: {
            title: 'réponses (1k = 1000)',
            titlefont: {color: 'rgb(38, 102, 148)'},
            tickfont: {color: 'rgb(38, 102, 148)'},
        },
        legend: {
            xanchor: "auto",
            yanchor: "bottom",
            y: 1,
            x: 0,
            orientation: "h"
        }
    };

    Plotly.newPlot('barplot_div', data, layout);
}

function itemsVis(json) {
    var nestedDataDay = getNestedData(json, "YYYY-MM-DD", "par jour");
    var nestedDataWeek = getNestedData(json, "W", "par semaine");
    var nestedDataMonth = getNestedData(json, "YYYY-MM", "par mois");
    var nestedDataYear = getNestedData(json, "YYYY", "par an");

    var itemsDay = nestedDataDay.map(function(item) {
        var obj = {
            x: moment(item.key).endOf("day").subtract(12, 'hours').format("YYYY-MM-DD"),
            y: Math.round(item.value.total * 100) / 100,
            z: Math.round(item.value.totalSize * 100) / 100,
            group: item.value.group,
        }
        return obj;
    });

    var itemsWeek = nestedDataWeek.map(function(item) {
        var obj = {
            x: moment().day("Monday").week(item.key).subtract(3, 'days').format("YYYY-MM-DD"),
            y: Math.round(item.value.total * 100) / 100,
            z: Math.round(item.value.totalSize * 100) / 100,
            group: item.value.group,
        }
        return obj;
    });

    var itemsMonth = nestedDataMonth.map(function(item) {
        var obj = {
            x: moment(item.key + '-' + '01').endOf("month").subtract(3.5, 'days').format("YYYY-MM-DD"),
            y: Math.round(item.value.total * 100) / 100,
            z: Math.round(item.value.totalSize * 100) / 100,
            group: item.value.group,
        }
        return obj;
    });

    var itemsYear = nestedDataYear.map(function(item) {
        var obj = {
            x: moment(item.key + '-01-' + '01').endOf("year").subtract(3, 'days').format("YYYY-MM-DD"),
            y: Math.round(item.value.total * 100) / 100,
            z: Math.round(item.value.totalSize * 100) / 100,
            group: item.value.group,
        }
        return obj;
    });
    var items = itemsDay.concat(itemsWeek, itemsMonth, itemsYear);

    var itemsGlobal = items.map(function(obj) {
        return {
            group: obj.group,
            x: moment(obj.x).format("YYYY-MM-DD"),
            y: obj.y
        }
    })

    return items;
}


function getNestedData(json, format, group) {
    return nestedJson(json, format, group);
}

function nestedJson(json, format, group) {
    var data = d3.nest()
        .key(function(d) {
            return moment(d.dtstart).format(format);
        })
        .rollup(function(v) {
            return {
                format: format,
                group: group,
                count: v.length,
                totalSize: d3.sum(v, function(d) {
                    return d.size;
                }),
                total: d3.sum(v, function(d) {
                    return d.duration;
                }),
                avg: d3.mean(v, function(d) {
                    return d.duration;
                })
            };
        })
        .entries(json);
    return data;
}

 function questionSpecial(events, typeQuestion) {
     console.log(events, typeQuestion);

     var changeAuthor = function(author) {
         if (author === "Citoyen / Citoyenne") {
             return "Citoyen(ne)";
         } else if (author === "Élu / élue et Institution") {
             return "Élu(e) et Institution";
         } else if (author === "Organisation à but non lucratif") {
             return "Organisation (BNL)";
         } else if (author === "Organisation à but lucratif") {
             return "Organisation (BL)";
         } else if (author === "" || author === " " || author === "null") {
             return "non indiqué";
         } else if (author === null) {
             return "non indiqué";
         } else {
             return author;
         }
     }

     var nestedData = d3.nest()
         .key(d => d["region"])
         .key(d => d["authorType"])
         .rollup(function(v) {
             return {
                 bonne: d3.sum(v, function(d) {
                     if (/Une bonne chose=\d+/.test(d["mots-cles"])) {
                         var el = d["mots-cles"].match(/Une bonne chose=\d+/)[0];
                         return +el.slice(16, el.length);
                     }
                 }),
                 mauvaise: d3.sum(v, function(d) {
                     if (/Une mauvaise chose=\d+/.test(d["mots-cles"])) {
                         var el = d["mots-cles"].match(/Une mauvaise chose=\d+/)[0];
                         return +el.slice(19, el.length);

                     }
                 }),
                 sait_pas: d3.sum(v, function(d) {
                     if (/Je ne sais pas=\d+/.test(d["mots-cles"])) {
                         var el = d["mots-cles"].match(/Je ne sais pas=\d+/)[0];
                         return +el.slice(15, el.length);

                     }
                 }),
                 na: d3.sum(v, function(d) {
                     if (/^=\d+/.test(d["mots-cles"])) {
                         var el = d["mots-cles"].match(/^=\d+/)[0];
                         return +el.slice(1, el.length);
                     } else if (/\,\=\d+/.test(d["mots-cles"])) {
                         var el = d["mots-cles"].match(/\,\=\d+/)[0];
                         return +el.slice(2, el.length);
                     }
                 })
             };
         })
         .entries(events);

     var getTendance = function(arr) {
         let total = arr.reduce((a, b) => a += b);
         let max = arr.indexOf(Math.max(...arr));
         return  getColorSpecial(arr.map(val => val / total));
     }

     var jsonData = [];
     for (var i = 0, lgi = nestedData.length; i < lgi; i++) {
         var key1 = nestedData[i].key;
         var values1 = nestedData[i].values;
         var children1 = [];
         var bonne2 = 0,
             mauvaise2 = 0,
             sait_pas2 = 0,
             na2 = 0,
             arr2 = [];
         for (var j = 0, lgj = values1.length; j < lgj; j++) {
             var key2 = changeAuthor(values1[j].key.trim());
             var values2 = values1[j].value;
             var children2 = [];
             for (var key in values2) {
                 var bonne = values2["bonne"] !== undefined ? values2["bonne"] : 0;
                 var mauvaise = values2["mauvaise"] !== undefined ? values2["mauvaise"] : 0;
                 var sait_pas = values2["sait_pas"] !== undefined ? values2["sait_pas"] : 0;
                 var na = values2["na"] !== undefined ? values2["na"] : 0;
                 var arr = [bonne, mauvaise, sait_pas, na];

                 var color = (key === "bonne") ? 'rgb(0%,100%,0%)' : (key === "mauvaise") ? 'rgb(100%,0%,0%)' : (key === "sait_pas") ? 'rgb(0%,0%,100%)' : 'rgb(78%, 78%, 78%)';

                 children2.push({ name: key, size: values2[key], color: color });
             }
             bonne2 += bonne;
             mauvaise2 += mauvaise;
             sait_pas2 += sait_pas;
             na2 = na;
             arr2 = [bonne2, mauvaise2, sait_pas2, na2];
             children1.push({ name: key2, children: children2, color: getTendance(arr) });
         }
         jsonData.push({ name: key1, children: children1, color: getTendance(arr2) });
     }

     return { "name": "root", "children": jsonData };
 }

 function launchSunburst(events, typeQuestion) {
     console.log(typeQuestion);
     if (typeQuestion === "fe") {
         drawSunburst(questionOuiNon(events, typeQuestion));
     } else if (typeQuestion === "sp") {
         drawSunburst(questionSpecial(events, typeQuestion));
     }
 }

 function drawSunburst(json) {

     if ($('#sunburst_svg'))
         d3.select('#sunburst_div').selectAll("svg").remove();

     var width = Math.round($('#sunburst_container').width());
     var height = Math.round(Math.round(window.innerHeight) * 0.65);
     var radius = Math.min(width, height) / 2;

     var bounds = sunburst_container.getBoundingClientRect();

     document.getElementById("explanation").style.top = bounds.height + "px";
     document.getElementById("explanation").style.left = (bounds.width / 2) - 75 + "px";

     var b = {
         w: 180,
         h: 30,
         s: 3,
         t: 10
     };

     var totalSize = 0;

     var vis = d3.select("#chart").append("svg:svg")
         .attr("id", "sunburst_svg")
         .attr("width", width)
         .attr("height", height)
         .append("svg:g")
         .attr("id", "container_g")
         .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");



     var partition = d3.partition()
         .size([2 * Math.PI, radius * radius]);

     var arc = d3.arc()
         .startAngle(function(d) { return d.x0; })
         .endAngle(function(d) { return d.x1; })
         .innerRadius(function(d) { return Math.sqrt(d.y0); })
         .outerRadius(function(d) { return Math.sqrt(d.y1); });

     createVisualization(json);

     function createVisualization(json) {
         initializeBreadcrumbTrail();

         vis.append("svg:circle")
             .attr("id", "sunburst_circle")
             .attr("r", radius)
             .style("opacity", 0);

         var root = d3.hierarchy(json)
             .sum(function(d) {
                 // console.log(d);
                 return d.size;
             })
             .sort(function(a, b) { return b.value - a.value; });

         var nodes = partition(root).descendants()
             .filter(function(d) {
                 return (d.x1 - d.x0 > 0.005);
             });

         var path = vis.data([json]).selectAll("path")
             .data(nodes)
             .enter().append("svg:path")
             .attr("class", "sunburst_path")
             .attr("display", function(d) { return d.depth ? null : "none"; })
             .attr("d", arc)
             .attr("fill-rule", "evenodd")
             .style("fill", function(d) {
                 return d.data.color; //colors[d.data.name];
             })
             .style("opacity", 1)
             .on("mouseover", mouseover);

         d3.select("#container_g").on("mouseleave", mouseleave);

         totalSize = path.datum().value;
     };

     function mouseover(d) {
         if (this.classList[0] === "sunburst_path") {
             var percentage = (100 * d.value / totalSize).toPrecision(2);
             var percentageString = percentage + "%";
             if (percentage < 0.1) {
                 percentageString = "< 0.1%";
             }

             d3.select("#explanation-info")
                 .text("pourcentage sur global")

             d3.select("#percentage")
                 .text(percentageString);

             d3.select("#explanation")
                 .style("visibility", "");

             var sequenceArray = d.ancestors().reverse();
             sequenceArray.shift();
             updateBreadcrumbs(sequenceArray, percentageString);

             d3.select('#container_g').selectAll("path")
                 .style("opacity", 0.3);

             vis.selectAll("path")
                 .filter(function(node) {
                     return (sequenceArray.indexOf(node) >= 0);
                 })
                 .style("opacity", 1);
         }
     }


     function mouseleave(d) {

         d3.select("#trail")
             .style("visibility", "hidden");


         d3.selectAll(".sunburst_path").on("mouseover", null);


         d3.selectAll(".sunburst_path")
             .transition()
             .duration(1000)
             .style("opacity", 1)
             .on("end", function() {
                 d3.select(this).on("mouseover", mouseover);
             });

         d3.select("#explanation")
             .style("visibility", "hidden");
     }

     function initializeBreadcrumbTrail() {

         var trail = d3.select("#sequence").append("svg:svg")
             .attr("width", width)
             .attr("height", 50)
             .attr("id", "trail");

         trail.append("svg:text")
             .attr("id", "endlabel")
             .style("fill", "#000");
     }

     function breadcrumbPoints(d, i) {
         var points = [];
         points.push("0,0");
         points.push(b.w + ",0");
         points.push(b.w + b.t + "," + (b.h / 2));
         points.push(b.w + "," + b.h);
         points.push("0," + b.h);
         if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
             points.push(b.t + "," + (b.h / 2));
         }
         return points.join(" ");
     }


     function updateBreadcrumbs(nodeArray, percentageString) {

         var trail = d3.select("#trail")
             .selectAll("g")
             .data(nodeArray, function(d) { return d.data.name + d.depth; });

         trail.exit().remove();

         var entering = trail.enter().append("svg:g");

         entering.append("svg:polygon")
             .attr("points", breadcrumbPoints)
             .style("fill", function(d) {
                 return d.data.color; //colors[d.data.name];
             });

         entering.append("svg:text")
             .attr("x", (b.w + b.t) / 2)
             .attr("y", b.h / 2)
             .attr("dy", "0.35em")
             .attr("text-anchor", "middle")
             .text(function(d) { return d.data.name; });


         entering.merge(trail).attr("transform", function(d, i) {
             return "translate(" + i * (b.w + b.s) + ", 0)";
         });

         d3.select("#trail").select("#endlabel")
             .attr("x", (nodeArray.length + 0.3) * (b.w + b.s))
             .attr("y", b.h / 2)
             .attr("dy", "0.35em")
             .attr("text-anchor", "end")
             .text(percentageString);

         d3.select("#trail")
             .style("visibility", "");

     }
 }

 function questionOuiNon(events, typeQuestion) {
     console.log(events, typeQuestion);

     var getColor = function(arr) {
         let oui = formatPercent(arr[0]),
             non = formatPercent(arr[1]),
             na = formatPercent(arr[2]);
         return "rgb(" + non + "," + oui + "," + na + ")";
     };

     var changeAuthor = function(author) {
         if (author === "Citoyen / Citoyenne") {
             return "Citoyen(ne)";
         } else if (author === "Élu / élue et Institution") {
             return "Élu(e) et Institution";
         } else if (author === "Organisation à but non lucratif") {
             return "Organisation (BNL)";
         } else if (author === "Organisation à but lucratif") {
             return "Organisation (BL)";
         } else if (author === "" || author === " " || author === "null") {
             return "non indiqué";
         } else if (author === null) {
             return "non indiqué";
         } else {
             return author;
         }
     }

     var nestedData = d3.nest()
         .key(d => d["region"])
         .key(d => d["authorType"])
         .rollup(function(v) {

             return {
                 oui: d3.sum(v, function(d) {
                     return d["oui"];
                 }),
                 non: d3.sum(v, function(d) {
                     return d["non"];
                 }),
                 na: d3.sum(v, function(d) {
                     return d["vide"];
                 })
             };
         })
         .entries(events);

     var getTendance = function(arr) {
         let total = arr.reduce((a, b) => a += b);
         let max = arr.indexOf(Math.max(...arr));
         return getColor(arr.map(val => val / total));
     }

     var jsonData = [];
     for (var i = 0, lgi = nestedData.length; i < lgi; i++) {
         var key1 = nestedData[i].key;
         var values1 = nestedData[i].values;
         var children1 = [];
         var oui2 = 0,
             non2 = 0,
             na2 = 0,
             arr2 = [];
         for (var j = 0, lgj = values1.length; j < lgj; j++) {
             var key2 = changeAuthor(values1[j].key.trim());
             var values2 = values1[j].value;
             var children2 = [];

             for (var key in values2) {
                 var oui = values2["oui"] !== undefined ? values2["oui"] : 0;
                 var non = values2["non"] !== undefined ? values2["non"] : 0;
                 var na = values2["na"] !== undefined ? values2["na"] : 0;
                 var arr = [oui, non, na];

                 var color = (key === "oui") ? 'rgb(0%,100%,0%)' : (key === "non") ? 'rgb(100%,0%,0%)' : (key === "na") ? 'rgb(0%,0%,100%)' : tendance;
                 children2.push({ name: key, size: values2[key], color: color });
             }
             oui2 += oui;
             non2 += non;
             na2 += na;
             arr2 = [oui2, non2, na2];

             children1.push({ name: key2, children: children2, color: getTendance(arr) });
         }
         jsonData.push({ name: key1, children: children1, color: getTendance(arr2) });
     }

     return { "name": "root", "children": jsonData };
 }
