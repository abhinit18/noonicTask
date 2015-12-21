/**
 * Created by Vikas on 31/07/15.
 */
App.controller('driversController', function($scope, $http, $cookies, $cookieStore, baseurl, $timeout, $state, ngDialog) {
    'use strict';
    $http.get(baseurl.url + '/allDriverDetails?access_token=' + $cookieStore.get('obj').accesstoken)
        .success(function(response, status) {
            console.log(response);
            if (status == 200) {
                var dataArray = [];
                var driverList = response.data;
                driverList.forEach(function(column,index) {
                    console.log(column[0]);
                    console.log(column[1]);//vehicle name
                    var d = {};
                    d._id = column[0]._id;
                    d.name = column[0].name;
                    d.license = column[0].licence;
                    d.address = "address";
                    d.truck_type = column[1];
                    d.mobile = column[0].mobile;
                    d.contract_type = "Dedicated";
                    dataArray.push(d);
                });
                $scope.list = dataArray;




                /*-----------Driver BLock Section Starts---------------------*/
                $scope.blockDriver = function(id) {
                    console.log(id);
                    $http({
                            method: 'POST',
                            url: baseurl.url + '/driver/block',
                            data: {
                                      "id": id
                                    }
                        })
                        .success(function(response) {
                            if (status == 200) {
                                console.log("driver blocked");
                            } else {
                                alert("Something went wrong, please try again later.");
                                return false;
                            }
                        })
                        .error(function(error) {
                            console.log(error);
                        });
                };



                //add driver

                $scope.addDriver = function(){
                    
                    
                        ngDialog.open({
                            template: 'add_driver',
                            className: 'ngdialog-theme-default',
                            scope: $scope
                        });
                }

                //view driver details

                $scope.viewDriverDetails = function(data){


                    console.log(data);

                    $scope.driver_name = data.name;
                    $scope.license = data.license;
                    $scope.license_expiry = "21-July-2031";
                    $scope.location = "Chandigarh";
                    $scope.driver_address = data.address;
                    $scope.truck_type = data.truck_type;
                    $scope.contact_number = data.mobile;
                    $scope.contract_type = data.contract_type;
                    
                        ngDialog.open({
                            template: 'view_driver',
                            className: 'ngdialog-theme-default',
                            scope: $scope
                        });
                }









                var dtInstance;
                $timeout(function() {
                    if (!$.fn.dataTable) return;
                    dtInstance = $('#datatable2').dataTable({
                        'paging': true, // Table pagination
                        'ordering': true, // Column ordering
                        'info': true, // Bottom left status text
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
                        .keyup(function() {
                            dtInstance.fnFilter(this.value, columnInputs.index(this));
                        });
                });
                $scope.$on('$destroy', function() {
                    dtInstance.fnDestroy();
                    $('[class*=ColVis]').remove();
                })

            } else {
                alert("Something went wrong, please try again later.");
                return false;
            }
        })
        .error(function(error) {
            console.log(error);
        });


    // -----------Driver BLock Section Starts---------------------
    $scope.blockDriver = function(email) {
        $.post(MY_CONSTANT.url + 'api/admin/toggleDriverBlock', {
                accessToken: $cookieStore.get('obj').accesstoken,
                email: email
            },
            function(data) {
                $scope.list = data;
                $scope.$apply();
                $state.reload();
            });
    };

    /*------------Edit Driver Info Section Starts---------------*/
    $scope.pop = {};
    $scope.editData = function(data_get) {
        ngDialog.openConfirm({
            template: 'modalDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function(value) {}, function(reason) {});
        $scope.details = data_get;
        $scope.pop.firstName = data_get.firstName;
        $scope.pop.email = data_get.email;
        $scope.pop.lastName = data_get.lastName;
        $scope.pop.vehicleType = data_get.vehicleType;
        $scope.pop.isDedicated = data_get.isDedicated;

    };

    $scope.editDriver = function() {
            console.log($scope.pop.vehicleType);

            if ($scope.pop.isDedicated == $scope.details.isDedicated)
                var flag = false;
            else
                var flag = true
            $http({
                    url: MY_CONSTANT.url + 'api/admin/editDriverInfo',
                    method: "POST",
                    data: {
                        accessToken: $cookieStore.get('obj').accesstoken,
                        email: $scope.pop.email,
                        firstName: $scope.pop.firstName,
                        lastName: $scope.pop.lastName,
                        vehicleType: $scope.pop.vehicleType,
                        flag: flag
                    }
                })
                .then(function(response) {
                        ngDialog.close();
                        $state.reload();
                    },
                    function(response, status) { // optional
                        // failed
                        alert("Something went wrong");
                    });
        }
        /*------------Edit Driver Info Section End---------------*/
});
