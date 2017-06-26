var common = (function () {

    'use strict';

    const SOME_CONST = 'bc50218d91157b1ba4f142ef7baaa6a0';
    var s, section, movieCard;

    return {
        settings: {
        },
        init: init,
        movieCard: movieCard,
        jawbone: createJawboneNode
    };

    function init() {
        s = this.settings;
    }

    function movieCard(state) {
        section = document.getElementById(state);
        movieCard = section.getElementsByClassName('movie-card')[0];
        section.appendChild(movieCard.cloneNode(true));
    }

    function createJawboneNode() {
    }

})();

