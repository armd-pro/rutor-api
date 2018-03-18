'use strict';

const FILE_CONF = __dirname + '/../config.json';

var request = require('request');
var cheerio = require('cheerio');
var conf = require(FILE_CONF);
const fs = require("fs");

// cool-tor.org
const HOST = 'http://' + conf.host;

var searchOptions = {
    base: HOST + '/search/',
    page: 0,
    category: 0,
    method: 100,
    order: 0
};

exports.config = function (newOptions) {
    return searchOptions = Object.assign({}, searchOptions, newOptions);
};

exports.search = function (needle) {
    return fetch(getFullUrl(needle)).then(parse);
};

var fetch = function fetch(url)
{
    return new Promise(function (resolve, reject) {

        return request(url, function (err, res, body) {

            if(conf.host !== res.request.host)
            {
                conf.host = res.request.host;

                fs.writeFile(FILE_CONF, JSON.stringify(conf), (error) => {
                    // console.log(error)
                });
            }

            if (err) {
                reject(err);
            }

            if (res.statusCode !== 200) {
                reject(new Error('Unsafe status code (' + res.statusCode + ') when making request'));
            }

            resolve(body);

        });

    });
};

var getBaseUrl = function getBaseUrl() {
    var _searchOptions = searchOptions,
        page = _searchOptions.page,
        category = _searchOptions.category,
        method = _searchOptions.method,
        order = _searchOptions.order;

    if (!page && !category && !method && !order) return searchOptions.base;
    return searchOptions.base + (page + '/' + category + '/' + method + '/' + order + '/');
};

var getFullUrl = function getFullUrl(needle) {
    return getBaseUrl() + encodeURIComponent(needle);
};

var parse = function parse(html) {



    var $ = cheerio.load(html);

    return $('#index').find('tr:not(.backgr)').map(function (i, elem) {

        var $td = $(elem).find('td');
        var $links = $($td[1]).find('a');
        var $peers = $($td[$td.length - 1]);

        return {
            title: $($links[2]).text().trim(),
            date: $($td[0]).text().trim(),
            size: $($td[$td.length - 2]).html().replace('&#xA0;', ' '),
            url: HOST + $($links[2]).attr('href'),
            magnet: $($links[0]).attr('href'),
            torrent: $($links[1]).attr('href'),
            seeds: parseInt($peers.find('.green').text().trim()),
            leaches: parseInt($peers.find('.red').text().trim())
        };
    }).get();
};
