'use strict';

module.exports = function(app) {

	var _ = require('underscore');
	var request = require('request');
	var querystring = require('querystring');

	return {
		getUri: function(uri, params) {

			if (!app.config.cryptocompare.baseUrl) {
				return null;
			}

			var url = app.config.cryptocompare.baseUrl + uri;

			if (!_.isEmpty(params)) {
				url += '?' + querystring.stringify(params);
			}

			return url;
		},
		getExchangeRates: function(currency, cb) {

			var uri = this.getUri('/data/pricemulti', { currency: currency });

			if (!uri) {
				return _.defer(function() {
					cb(new Error('Cannot get exchange rates from cryptocompare: Missing "baseUrl"'));
				});
			}

			request(uri, function(error, response, data) {

				if (error) {
					return cb(error);
				}

				if (response.statusCode >= 400) {
					return cb(new Error('Failed to get exchange rates from cryptocompare (HTTP ' + response.statusCode + ')'))
				}

				try {
					data = JSON.parse(data);
				} catch (error) {
					return cb(error);
				}

				cb(null, data);
			});
		},
	};
};
