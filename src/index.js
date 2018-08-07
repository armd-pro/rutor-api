'use strict';

const FILE_CONF = __dirname + '/../config.json';

var request = require('request');
var conf = require(FILE_CONF);
const fs = require("fs");

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
    return fetch(getFullUrl(needle)).then((searchResult) => {
        return searchResult;
    });
};

var fetch = function fetch(url)
{
    return new Promise(function (resolve, reject) {

        return request({url: url, headers: {

                'Content-Type': 'application/json'

            }}, function (err, res, searchResult) {

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

            resolve(JSON.parse(searchResult));

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

