// To run this code, edit file
// index.html or index.jade and change
// html data-ng-app attribute from
// angle to myAppName
// -----------------------------------

//var App = angular.module('myAppName', ['angle']);


/*{
    "text": "Reports",
    "sref": "app.reports",
    "icon": "fa fa-newspaper-o"
},*/

var App = angular.module('AppName', ['angle', 'uiGmapgoogle-maps']);

App.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
    GoogleMapApi.configure({
//    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
}]);


App.run(["$log", function ($log) {

    $log.log('I\'m a line from custom.js');

}]);
App.constant("baseurl", {
    "url": " https://api.blockchain.info/"
});

App.constant("responseCode", {
    "SUCCESS": 200
});
App.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        'use strict';

        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // default route
       /* $urlRouterProvider.otherwise('/app/rewardBrands');*/
        $urlRouterProvider.otherwise('app/dashboard');
        //
        // Application Routes
        // -----------------------------------
        $stateProvider
            //
            // Single Page Routes
            // -----------------------------------
            .state('page', {
                url: '/page',
                templateUrl: 'app/pages/page.html',
                resolve: helper.resolveFor('modernizr', 'icons', 'parsley'),
                controller: ["$rootScope", function ($rootScope) {
                    $rootScope.app.layout.isBoxed = false;
                }]
            })
            // .state('page.login', {
            //     url: '/login',
            //     title: "Login",
            //     templateUrl: 'app/pages/login.html'
            // })
            // .state('page.register', {
            //     url: '/register',
            //     title: "Register",
            //     templateUrl: 'app/pages/register.html'
            // })
            // .state('page.SubadminRegister', {
            //     url: '/SubadminRegister',
            //     title: "Register",
            //     templateUrl: 'app/pages/SubadminRegister.html'
            // })
            .state('page.recover', {
                url: '/recover',
                title: "Recover",
                templateUrl: 'app/pages/recover.html'
            })
            .state('page.terms', {
                url: '/terms',
                title: "Terms & Conditions",
                templateUrl: 'app/pages/terms.html'
            })
            .state('page.404', {
                url: '/404',
                title: "Not Found",
                templateUrl: 'app/pages/404.html'
            })

            //App routes
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: helper.basepath('app.html'),
                controller: 'AppController',
                resolve: helper.resolveFor('modernizr', 'icons', 'screenfull','ngDialog')
            })
            .state('app.dashboard', {
                url: '/dashboard',
                title: 'Dashboard',
                templateUrl: helper.basepath('dashboard.html')
                //resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog')
            })

            //
            // CUSTOM RESOLVES
            //   Add your own resolves properties
            //   following this object extend
            //   method
            // -----------------------------------
            // .state('app.someroute', {
            //   url: '/some_url',
            //   templateUrl: 'path_to_template.html',
            //   controller: 'someController',
            //   resolve: angular.extend(
            //     helper.resolveFor(), {
            //     // YOUR RESOLVES GO HERE
            //     }
            //   )
            // })
        ;


    }]);

App.factory('convertdatetime', function () {
    return {

        convertDate: function (DateTime) {
            var _utc = new Date(DateTime);
            var mnth_var_date = parseInt(_utc.getMonth()) + 1;
            var mnth_var = mnth_var_date.toString();
            if (mnth_var.length == 1) {
                var month = "0" + mnth_var;
            } else {
                month = mnth_var;
            }
            if (_utc.getDate().toString().length == 1) {
                var day = "0" + (parseInt(_utc.getDate()));
            } else {
                day = parseInt(_utc.getDate());
            }
            var _utc = _utc.getFullYear() + "-" + month + "-" + day;
            return _utc;
        },

        convertToLocal: function (data) {
            var date = ConvertUTCTimeToLocalTime(data);
            var date_time = new Date((date + 'UTC').replace(/-/g, "/"));
            var date_converted = date_time.toString().replace(/GMT.*/g, "");
            return date_converted;

            function ConvertUTCTimeToLocalTime(UTCDateString) {
                var convertdLocalTime = new Date(UTCDateString);

                var hourOffset = convertdLocalTime.getTimezoneOffset() / 60;

                convertdLocalTime.setHours(convertdLocalTime.getHours() + hourOffset);

                return convertdLocalTime;
            }
        }

    };
})

App.directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());
                });
            });
        }
    };
});

