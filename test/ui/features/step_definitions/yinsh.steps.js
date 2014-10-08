var assert = require("assert");
var Browser = require('zombie');

module.exports = function () {
    'use strict';

    var _browser = Browser.create();

    this.Given(/^The player is logged$/, function (callback) {
        _browser.visit("http://127.0.0.1:3000/login/", function (err) {
            if (err) throw err;
            assert.ok(_browser.success, 'page loaded');
            _browser.fill("username", "toto")
                .fill("password", "toto")
                .pressButton('submit', function (err) {
                    if (err) throw err;
                    assert.ok(_browser.success, 'page loaded');
                    callback();
                });
        });
    });

    this.Given(/^An AI game is created$/, function (callback) {
        _browser.visit("http://127.0.0.1:3000/games/create/?game=yinsh", function (err) {
            if (err) throw err;
            _browser.pressButton('create', function (err) {
                if (err) throw err;
                assert.ok(_browser.success, 'page loaded');
                callback();
            });
        });
    });

    this.Given(/^The player is black$/, function (callback) {
        callback();
    });

    this.When(/^The player click at A1 intersection$/, function (callback) {
        callback();
    });

    this.Then(/^A black ring appears at A1$/, function (callback) {
        callback();
    });

};