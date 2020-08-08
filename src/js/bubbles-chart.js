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
