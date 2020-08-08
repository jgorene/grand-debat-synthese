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