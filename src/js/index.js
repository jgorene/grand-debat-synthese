
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
