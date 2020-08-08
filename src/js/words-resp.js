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