/**
 * Created by Vikas  on 03/08/15.
 */

App.controller('individualController', function($scope, $http, $cookies, $cookieStore, baseurl, $timeout, $state, ngDialog) {
    'use strict';
    //$scope.excelList = {};

    $scope.loading = true;
    $scope.init = function() {
        $http.get(baseurl.url + '/CustomerDetails?access_token=' + $cookieStore.get("obj").accesstoken)
            .success(function(response, status) {

                console.log(response);
                if (status == 200) {

                    var dataArray = [];
                    var custList = response.data;
                    custList.forEach(function(column) {
                        var d = {};

                        console.log(column);
                        // console.log(column.hasOwnProperty('status'));


                        if (column.status == "block") {
                            d.isBlocked = true;
                        } else if (column.status == "unblocked") {
                            d.isBlocked = false;
                        }

                        d._id = column._id;
                        d.name = column.name;
                        d.address = column.address;
                        d.mobile = column.mobile;


                        dataArray.push(d);


                    });
                    $scope.list = dataArray;
                    $scope.excelList = dataArray;
                    var dtInstance;
                    $timeout(function() {
                        $scope.loading = false;
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






    }





    $scope.viewCustomerDetails = function(data) {
        console.log(data);

        $scope.name = data.name;
        $scope.address = data.address;
        $scope.contact_person = data.contact_person;
        $scope.contact_number = data.mobile;
        $scope.email = data.email;




        ngDialog.open({
            template: 'view_individual',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    }







    // -----------block Customer---------------------



    $scope.blockCustomer = function(id,type) {

        if(type=="block"){

            $scope.blockUnblockUrl = '/individual/block';

        }else if(type=="unblock"){

            $scope.blockUnblockUrl = '/individual/unblock';

        }

        $http({
                method: 'POST',
                url: baseurl.url + '/individual/block',
                data: {
                    "id": id
                }
            })
            .success(function(response) {
                if (response.statusCode == 200) {

                    $scope.message = "Customer blocked";

                    ngDialog.open({
                        template: 'message',
                        className: 'ngdialog-theme-default',
                        closeByDocument: true,
                        scope: $scope
                    });

                    $timeout(function() {
                        ngDialog.close();
                    }, 1000);

                    console.log("customer blocked");
                } else {
                    alert("Something went wrong, please try again later.");
                    return false;
                }
            })
            .error(function(error) {
                console.log(error);
            });
    };




    /*-----------Add Credit Section dialog---------------------*/
    $scope.addCreditDialog = function() {
        ngDialog.open({
            template: 'addCredit',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByDocument: false,
            closeByEscape: false
        });
    }

    /*-----------Add Credit Section Starts---------------------*/


    $scope.addCredit = function(data) {
        $http({
                url: MY_CONSTANT.url + 'api/admin/addCustomerCredits',
                method: "POST",
                data: {
                    accessToken: $cookieStore.get('obj').accesstoken,
                    email: data.email,
                    credit: data.credit
                }
            })
            .then(function(response) {
                    ngDialog.close({
                        template: 'addCredit',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });
                    $scope.displaymsg2 = 'Credit Added';
                    ngDialog.open({
                        template: 'display_msg',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        showClose: false
                    });
                },
                function(response, status) { // optional
                    // failed
                    ngDialog.close({
                        template: 'addCredit',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });
                    $scope.displaymsg2 = 'Email id not registered';
                    ngDialog.open({
                        template: 'display_msg',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        showClose: false
                    });
                    /* alert("Something went wrong");*/
                });
    }


    /*------------Edit Customer Info Section Starts---------------*/
    $scope.pop = {};
    $scope.editData = function(data_get) {
        $scope.id = data_get._id;
        ngDialog.openConfirm({
            template: 'modalDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function(value) {}, function(reason) {});
        $scope.details = data_get;
        $scope.pop.firstName = data_get.firstName;
        $scope.pop.lastName = data_get.lastName;
        $scope.pop.email = data_get.email;
        $scope.pop.phoneNumber = data_get.phoneNumber;
        $scope.pop.credits = data_get.credits;
    };

    $scope.editCustomer = function() {
            $http({
                    url: MY_CONSTANT.url + 'api/admin/editUserProfile',
                    method: "PUT",
                    data: {
                        accessToken: $cookieStore.get('obj').accesstoken,
                        customerId: $scope.id,
                        phoneNumber: $scope.pop.phoneNumber,
                        firstName: $scope.pop.firstName,
                        lastName: $scope.pop.lastName,
                        credits: $scope.pop.credits
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

    /*-----------Export CSV Section Starts---------------------*/
    $scope.exportData = function() {
        alasql('SELECT * INTO CSV("customer.csv",{headers:true}) FROM ?', [$scope.excelList]);
    };

});

App.directive('numbersOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(inputValue) {
                // this next if is necessary for when using ng-required on your input.
                // In such cases, when a letter is typed first, this parser will be called
                // again, and the 2nd time, the value will be undefined
                if (inputValue == undefined) return ''
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
});
