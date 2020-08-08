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
