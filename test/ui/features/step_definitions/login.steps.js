var assert = require("assert");
var Browser = require('zombie');

module.exports = function () {
    'use strict';

    var _browser = Browser.create();

    this.Given(/^No user log$/, function (callback) {
        _browser.visit("http://127.0.0.1:3000/login/", function(err) {
            if (err) throw err;
            assert.ok(_browser.success, 'page loaded');
            assert.equal(_browser.text('h1'), 'Sign In');

            var form = _browser.query('form');

            assert(form, 'form exists');
            assert(_browser.query('input[name=username]', form), 'has username input');
            assert(_browser.query('input[name=password]', form), 'has password input');
            assert(_browser.query('button[name=submit]', form), 'has submit button');
            callback();
        });
    });

    this.When(/^Player sign in$/, function (callback) {
        _browser.visit("http://127.0.0.1:3000/login/", function(err) {
            _browser.fill("username", "toto")
                .fill("password", "toto")
                .pressButton('submit', function (err) {
                    if (err) throw err;
                    callback();
                });
        });
    });

    this.Then(/^The player is logged$/, function (callback) {
        assert(_browser.query('a[href="/logout/"]'));
        callback();
    });

};