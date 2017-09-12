
App.controller('dashboardController', function ($scope, $http, $cookies, $cookieStore,currencyData, baseurl,$rootScope,ngDialog,highChartsConfig,$log,$interval,$timeout) {
    'use strict';

    // $rootScope.test = $cookieStore.get('obj1').adminType;
    //$scope.currencyDataTable = [];
    $scope.genericData = {};
    var finalData = [];
    $scope.updateTicker  = function(){
        $http.get(baseurl.url + 'ticker')
            .success(function (response, status) {
                console.log(response);
                if (status == 200) {
                    $scope.currencyDataTable = Object.keys(response);
                    console.log($scope.currencyDataTable);
                    $scope.genericData.tickerData = response;
                } else {
                    alert("Something went wrong, please try again later.");
                    return false;
                }
            })
            .error(function (error) {
                console.log(error);
            });
    };
    //console.log($scope.currencyDataTable)
    $scope.convertValue = function(){
        if($scope.genericData.currency && $scope.genericData.moneyValue){
            localStorage.setItem('usersInputCurrency',$scope.genericData.currency);
            localStorage.setItem('usersInputValue',$scope.genericData.moneyValue);
        }
        
        $scope.genericData.currency = localStorage.getItem('usersInputCurrency');
        $scope.genericData.moneyValue = localStorage.getItem('usersInputValue');
        console.log($scope.genericData);
        $http({
            method:'GET',
            url:"https://blockchain.info/tobtc?currency="+$scope.genericData.currency+"&value="+$scope.genericData.moneyValue
        }).success(function(data){
            console.log(data);
            $scope.outputValue = data;
        }).error(function(error){
            console.log(error);
        })
        
    };

$scope.getTrendingData = function(){
    
    if($scope.genericData.currencyChart == "" || $scope.genericData.currencyChart === undefined){
        $scope.genericData.currencyChart = 'USD';
    }
    
    finalData = [];
    var dateUnix = (moment(new Date()).unix())*1000;
    var dataUrl = 'https://min-api.cryptocompare.com/data/histoday?fsym='+$scope.genericData.currencyChart+'&tsym=BTC&limit=900&aggregate=1&toTs='+dateUnix;
    $.getJSON(dataUrl, function (data) {
    // Create the chart
    angular.forEach(data.Data,function(dataValue){
        var dateWiseData = [(dataValue.time*1000),dataValue.volumeto];
        finalData.push(dateWiseData);
    });
    console.log('final values',finalData);
    Highcharts.stockChart('container', {

        xAxis: {
            type: 'datetime',
            tickInterval: 3600 * 1000,
            min: Date.UTC(2013,4,22),
            gapGridLineWidth: 0
        },
        rangeSelector: {

            buttons: [{
                type: 'hour',
                count: 1,
                text: '1h'
            }, {
                type: 'day',
                count: 1,
                text: '1D'
            }, {
                type: 'month',
                count: 1,
                text: '1m'
            },{
                type: 'year',
                count: 1,
                text: '1y'
            }, {
                type: 'all',
                count: 1,
                text: 'All'
            }],
            inputEnabled:false,
            allButtonsEnabled: true
        },

        title: {
            text: 'Trending Data of Bitcoin Exchange from '+$scope.genericData.currencyChart+' to BTC'
        },
        series: [{
            name: 'BTC',
            type:'area',
            data: finalData,
            gapSize: 5,
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            },
            threshold: null
        }]
    });
});
};


    $scope.getTrendingData();
    $scope.updateTicker();
    $interval(function(){
        $scope.getTrendingData();
        $scope.convertValue();
        $scope.updateTicker();
    },60000);


    Highcharts.setOptions(highChartsConfig.configs());

});