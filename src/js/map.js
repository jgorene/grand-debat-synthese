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
