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
