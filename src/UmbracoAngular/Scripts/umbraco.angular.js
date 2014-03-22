/* global */

'use strict';

(function () {
	var module = angular.module('umbraco.angular', []);

	module.provider('UmbracoAngular', function () {
		var Configurer = {};
		Configurer.init = function (object, config) {
			object.configuration = config;

			config.apiEndpoint = config.apiEndpoint;
			object.setApiEndpoint = function (apiEndPoint) {
				config.apiEndpoint = apiEndPoint;
			};
		};

		var globalConfiguration = {};

		Configurer.init(this, globalConfiguration);

		this.$get = ['$http', '$q', function ($http, $q) {
			function createService(config) {
				var service = {};

				function GetNodeData(id) {
					var deferred = $q.defer();

					$http.get(config.apiEndpoint + id).then(function (response) {
						deferred.resolve(response);
					});

					return deferred.promise;
				}

				function GetProperty(alias, data) {
					for (var i = 0; i < data.Properties.length; i++) {
						if (data.Properties[i].Alias == alias) {
							return data.Properties[i];
						}
					}
					return { Value: "Property not found" };
				};

				Configurer.init(service, config);
				service.GetNodeData = GetNodeData;
				service.GetProperty = GetProperty;
				return service;
			}

			return createService(globalConfiguration);
		}
		];
	});
})();