/**
 * Created by Vikas on 05/08/15.
 */

App.controller('MapCircleController', ['$scope', '$timeout', '$http', 'uiGmapLogger','uiGmapGoogleMapApi', '$cookies', '$cookieStore', 'baseurl','ngDialog'
    , function ($scope, $timeout, $http, $log, GoogleMapApi, $cookies, $cookieStore, baseurl,ngDialog) {
        $log.currentLevel = $log.LEVELS.debug;
        var center = {
            latitude: "30.7333148",
            longitude: "76.7794179"
        };
        $scope.map = {
            center: center,
            pan: true,
            zoom: 3,
            refresh: false,
            events: {},
            bounds: {}
        };

        $scope.total_no_of_drivers = "";
        $scope.MapTitle = "Driver Name";

        markerArr = new Array();
        markerCount = 0;
        var bound_val =0

        $scope.map = {
                zoom:3,
                center: new google.maps.LatLng(30.8857, 76.2599),
                pan : true
        }
        $scope.mapContainer = new google.maps.Map(document.getElementById('map-container'), $scope.map);
        var infoWindow = new google.maps.InfoWindow();


        /*================Setting marker for Live driver===================*/
        var createMarker = function (info) {
            var marker = new MarkerWithLabel({
                position: new google.maps.LatLng(info.latitude, info.longitude),
                map: $scope.mapContainer
            });

            marker.content = '<div class="infoWindowContent">' +
            '<center>Driver Info</center>' +
            '<span> Name - ' + info.fullName + '</span><br>' +
            '<span> Phone - ' + info.phoneNumber + '</span><br>' +
            '<span> Email - ' + info.email + '</span>' +
            '</div>';


            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent(marker.content);
                infoWindow.open($scope.mapContainer, marker);
            });

            markerArr.push(marker);
            markerCount = markerCount + 1;

        }

        /*================Setting marker for Live order pick up location===================*/
        var createMarker1 = function (info) {
            var marker = new MarkerWithLabel({
                position: new google.maps.LatLng(info.pickupLat, info.pickupLong),
                map: $scope.mapContainer
            });

            marker.content = '<div class="infoWindowContent">' +
            '<center>Order Info</center>' +
            '<span> Address - ' + info.driverFullName + '</span><br>' +
            '<span> Drop Off Address - ' + info.dropUpAddress + '</span><br>' +
            '<span> Phone - ' + info.pickupPhoneNo + '</span><br>' +
            '<span> Status - ' + info.status + '</span>' +
            '</div>';

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent(marker.content);
                infoWindow.open($scope.mapContainer, marker);
            });
            markerArr.push(marker);
            markerCount = markerCount + 1;
        }

        /*================Setting marker for Live order drop off location===================*/
        var createMarker2 = function (info) {
            var marker = new MarkerWithLabel({
                position: new google.maps.LatLng(info.dropUpLat, info.dropUpLong),
                map: $scope.mapContainer
            });

            marker.content = '<div class="infoWindowContent">' +
            '<center>Driver Info</center>' +
            '<span> Address - ' + info.driverFullName + '</span><br>' +
            '<span> Pick Up Address - ' + info.pickupAddress + '</span><br>' +
            '<span> Phone - ' + info.dropUpPhoneNo + '</span><br>' +
            '<span> Status - ' + info.status + '</span>' +
            '</div>';

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent(marker.content);
                infoWindow.open($scope.mapContainer, marker);
            });
            markerArr.push(marker);
            markerCount = markerCount + 1;
        }

        $scope.setBounds = function(){
            if(bound_val==0){
                var bounds = new google.maps.LatLngBounds();
                for(var i=0;i<markerCount;i++) {
                    bounds.extend(markerArr[i].getPosition());
                }
                $scope.mapContainer.fitBounds(bounds);

            }
            return 1;
        }

        $scope.drawMap = function () {

            $http.post(baseurl.url + '/DashBoard/Shipments_details?access_token=' + $cookieStore.get('obj').accesstoken,
                {
                    "from": "2015-11-24",
                    "to": "2015-11-25"
                }
            )
                .success(function (response, status) {
                    console.log(response.data);
                    var ongoinlist = response.data;
                    $scope.ongoinglist = response.data;

                    angular.forEach(ongoinlist,function (column) {
                        console.log('new',column);
                        console.log(column.vehical_details.length == 0);
                       /* if(column.vehical_details.length==0){
                            $scope.vehicleName = "No details found";
                        }else{
                            $scope.vehicleName = column.vehical_details[0].vehicle_name;
                        }*/
                        console.log(column.vehical_details[0].vehicle_name);
                        var novehicle = "No Vehicles Found";
                        var d = {};
                        d._id = column._id;
                        d.driverId = column.driverId;
                        d.driverFullName = column.shipper_name;
                        d.dropUpAddress = column.dropUpAddress;
                        d.pickupAddress = column.vehicleName;
                        d.vehicleName = column.vehical_details[0].vehicle_name;
                        d.stats1 = column.started;
                        d.stats2 = column.completed;
                        dataArray1.push(d);
                    });
                    if (status == 200) {
                        console.log(response.data.pickup.length);
                        var dataArray = [];
                        var dataArray1 = [];
                        var liveDriverList = response.data.driverDetailArray;
                        var liveOrderList = response.data.orderDetail;
                        var liveDriverStatusList = response.data.driverStatusArray;
                        var orderLength = response.data.orderDetail.length;
                        var driverLength = response.data.driverDetailArray.length;
                        var orderlength = response.data.pickup.length;
                        $scope.total_no_of_drivers = driverLength;

                        /*================ Live driver info window===================*/
                        liveDriverStatusList.forEach(function (column) {
                            var d = {};
                            d.driverId = column.driverId;
                            d.fullName = column.fullName;
                            d.phoneNumber = column.phoneNumber;
                            d.profilePicture = column.profilePicture;
                            if(column.status=='busy')
                                d.status = 0;
                            else
                            d.status = 1;
                            dataArray.push(d);
                        });
                        $scope.list = dataArray;

                        /*================  ongoing order table ===================*/
                        liveOrderList.forEach(function (column) {
                            var d = {};
                            d._id = column._id;
                            d.driverId = column.driverId;
                            d.driverFullName = column.driverFullName;
                            d.dropUpAddress = column.dropUpAddress;
                            d.pickupAddress = column.pickupAddress;
                            dataArray1.push(d);
                        });
                        $scope.orderList = dataArray1;
                        var dtInstance;
                        $timeout(function () {
                            if (!$.fn.dataTable) return;
                            dtInstance = $('#datatable2').dataTable({
                                'paging': true,  // Table pagination
                                'ordering': true,  // Column ordering
                                'info': true,  // Bottom left status text
                                'destroy': true,
                                oLanguage: {
                                    sSearch: 'Search all columns:',
                                    sLengthMenu: '_MENU_ records per page',
                                    info: 'Showing page _PAGE_ of _PAGES_',
                                    zeroRecords: 'Nothing found - sorry',
                                    infoEmpty: 'No records available',
                                    infoFiltered: '(filtered from _MAX_ total records)'
                                },
                                "pageLength": 50
                            });
                            var inputSearchClass = 'datatable_input_col_search';
                            var columnInputs = $('tfoot .' + inputSearchClass);

                            // On input keyup trigger filtering
                            columnInputs
                                .keyup(function () {
                                    dtInstance.fnFilter(this.value, columnInputs.index(this));
                                });
                        });
/*
                        $scope.$on('$destroy', function () {
                            dtInstance.fnDestroy();
                            $('[class*=ColVis]').remove();
                        })*/

                        /*================Calling Live driver marker set function===================*/
                        if (driverLength) {
                            liveDriverList.forEach(function (column) {
                                createMarker(column);
                                $scope.openInfoWindow = function (e, selectedMarker) {
                                    e.preventDefault();
                                    google.maps.event.trigger(selectedMarker, 'click');
                                }
                            });
                            $scope.mcOptions = {gridSize: 50, maxZoom: 20};

                            if ($scope.markerClusterer) {
                                $scope.markerClusterer.clearMarkers();   //clearing the markercluster to add new
                            }

                            $scope.markerClusterer = new MarkerClusterer($scope.mapContainer, markerArr, $scope.mcOptions);

                            //function to get lat long bounds according to marker position
                            bound_val = $scope.setBounds();
                        }
                        else {
                        }

                    /*================Calling marker set function for Live order pickup location===================*/
                        if (orderLength) {
                            liveOrderList.forEach(function (column) {
                                createMarker1(column);
                                $scope.openInfoWindow = function (e, selectedMarker) {
                                    e.preventDefault();
                                    google.maps.event.trigger(selectedMarker, 'click');
                                }

                            });
                            $scope.mcOptions = {gridSize: 50, maxZoom: 20};

                            if ($scope.markerClusterer) {
                                $scope.markerClusterer.clearMarkers();   //clearing the markercluster to add new
                            }

                            $scope.markerClusterer = new MarkerClusterer($scope.mapContainer, markerArr, $scope.mcOptions);

                            //function to get lat long bounds according to marker position
                            bound_val = $scope.setBounds();
                        }
                        else

                        /*================Calling marker set function for Live order drop off location===================*/
                        if (orderLength) {
                            liveOrderList.forEach(function (column) {
                                createMarker2(column);
                                $scope.openInfoWindow = function (e, selectedMarker) {
                                    e.preventDefault();
                                    google.maps.event.trigger(selectedMarker, 'click');
                                }
                            });
                            $scope.mcOptions = {gridSize: 50, maxZoom: 20};
                            if ($scope.markerClusterer) {
                                $scope.markerClusterer.clearMarkers();   //clearing the markercluster to add new
                            }
                            $scope.markerClusterer = new MarkerClusterer($scope.mapContainer, markerArr, $scope.mcOptions);
                            //function to get lat long bounds according to marker position
                            bound_val = $scope.setBounds();
                        }
                        else {

                        }
                    } else {
                        alert("Something went wrong, please try again later.");
                        return false;
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
        };
        $scope.drawMap();
      /*  $scope.setinterval= setInterval(function(){
            $scope.$on('$destroy', function () {
                dtInstance.fnDestroy();
                $('[class*=ColVis]').remove();
            })
            markerArr = [];    //empty the markerArray to refresh the map
            markerCount = 0;

            $scope.drawMap();
        }, 500000);*/


        /*================ Listing Reassignable  driver for  ongoing order ===================*/
        $scope.reAssignList = function(orderId,driverId){
            $scope.orderId = orderId;
            $http.get(baseurl.url + 'DashBoard/Shipments_details?access_token=' + $cookieStore.get('obj').accesstoken),
            {
                "from": "2015-11-6",
                "to": "2015-11-7"
            }
                .success(function (response, status) {
                    if (status == 200) {
                        var dataArray = [];
                        var nearDriverList = response.data.results;
                        nearDriverList.forEach(function (column) {
                            if (column._id != driverId) {
                                var d = {};
                                d._id = column._id;
                                d.fullName = column.fullName;
                                d.isDedicated = column.isDedicated;
                                dataArray.push(d);
                            }
                        });
                        $scope.nearDriverList = dataArray;
                        if ($scope.nearDriverList > 0) {
                            $scope.changedDriver = $scope.nearDriverList[0]._id;
                        ngDialog.open({
                            template: 'display_driver_list',
                            className: 'ngdialog-theme-default',
                            scope: $scope,
                            showClose: true
                        });
                    }
                        else{
                            ngDialog.open({
                                template: 'display_no_driver',
                                className: 'ngdialog-theme-default',
                                scope: $scope,
                                showClose: true
                            });
                        }
                    } else {
                        alert("Something went wrong, please try again later.");
                        return false;
                    }
                })
                .error(function (error) {
                    ngDialog.open({
                        template: 'display_no_driver',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        showClose: true
                    });
                    console.log(error);
                });
        }

        $scope.changeDriver = function(i){
            $scope.changedDriver = $scope.nearDriverList[i-1]._id;
        }

        /*================ Reassigning driver for  ongoing order ===================*/
        $scope.reAssign = function() {
            $http({
                method: 'POST',
                url: MY_CONSTANT.url + 'api/admin/orderAssignDriver',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {accessToken: $cookieStore.get('obj').accesstoken, orderId: $scope.orderId, driverId: $scope.changedDriver}

            })
                .success(function (response, status) {
                    ngDialog.open({
                        template: 'display_reAssign_msg',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        showClose: true
                    });
                })
                .error(function (response, status) {
                    alert("Oops driver not assigned.");
                })
        }
    }]);