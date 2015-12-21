
App.controller('dashboardController', function ($scope, $http, $cookies, $cookieStore, baseurl,$rootScope,ngDialog,$log) {
    'use strict';

    $rootScope.test = $cookieStore.get('obj1').adminType;
    $scope.drivers = {};
    $http.get(baseurl.url + '/DashBoard/Driver?access_token=' + $cookieStore.get('obj').accesstoken)
       .success(function (response, status) {
            console.log(response);

            console.log(response.data.busyOnlineDrivers.length);
            console.log(response.data.idleOnlineDrivers.length);


            if (status == 200) {

                console.log(response.data.idleOnlineDrivers);
                $scope.totalCompletedOrder = 44;//response.data.totalCompletedOrder;
                $scope.totalNewCustomer = 44;//response.data.totalNewCustomer;
                $scope.busyOnline = response.data.busyOnlineDrivers;
                $scope.idleOnline = response.data.idleOnlineDrivers;
                $scope.idle = response.data.idleOnlineDrivers[0].driver_id.name;
                $scope.offline    = response.data.offlineDrivers;
                $scope.totalOnlineDriver = response.data.busyOnlineDrivers.length + response.data.idleOnlineDrivers.length;//response.data.totalOnlineDriver;
                $scope.totalOfflineDriver = response.data.offlineDrivers.length;//response.data.totalOnlineDriver;
                $scope.totalOrder = 44;//response.data.totalOrder;
                $scope.totalRevenue = 44;//response.data.totalRevenue;
                $scope.totalUnAssignedOrder = 44;//response.data.totalUnAssignedOrder;
                $scope.totalDrivers = response.data.busyOnlineDrivers.length + response.data.idleOnlineDrivers.length + response.data.offlineDrivers.length;
           } else {
                alert("Something went wrong, please try again later.");
                return false;
            }
       })
        .error(function (error) {
            console.log(error);
       });

});