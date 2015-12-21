/**
 * Created by Vikas  on 03/08/15.
 */

App.controller('enterpriseController', function($scope, $http, $cookies, $cookieStore, baseurl, $timeout, $state, ngDialog) {
    'use strict';
    //$scope.excelList = {};

    $scope.loading = true;
    $scope.init = function() {
        $http.get(baseurl.url + '/EnterpriseDetails?access_token=' + $cookieStore.get("obj").accesstoken)
            .success(function(response, status) {

                console.log(response);
                if (status == 200) {

                    var dataArray = [];
                    var custList = response.data;
                    custList.forEach(function(column) {

                        console.log(column);

                        //column[0] has organization
                        //column[1] has its units

                        var d = {};



                        d._id            = column[0]._id;
                        d.org_name       = column[0].org_name;
                        d.unit_name      = column[1].name;
                        d.address        = column[0].address;
                        d.contact_person = "Contact Person";
                        d.contact_number = column[1].mobile;
                        d.email          = column[1].email;




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


        // -----------block Enterprise user---------------------


        $scope.blockCustomer = function(id) {
            console.log(id);

         $http({
                            method: 'POST',
                            url: baseurl.url + '/Enterprise/block',
                            data: {
                                      "id": id
                                  }
                        })
                        .success(function(response) {
                            console.log(response);
                            if (response.statusCode == 200) {
                                $scope.message = "User blocked";
                                   ngDialog.open({
            template: 'message',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByDocument: false,
            closeByEscape: false
        });

$timeout(function(){
    ngDialog.close();
},1000);

                            } else {
                                alert("Something went wrong, please try again later.");
                                return false;
                            }
                        })
                        .error(function(error) {
                            console.log(error);
                        });
        };








        //--------------------view Enterprise User details-------------------------


        $scope.viewCustomer = function(data){
            console.log(data);

            $scope.org_name = data.org_name;
            $scope.unit_name = data.unit_name;
            $scope.address = data.address;
            $scope.contact_person = data.contact_person;
            $scope.contact_number = data.contact_number;
            $scope.email = data.email

            ngDialog.open({
            template: 'view_enterprise',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByDocument: false,
            closeByEscape: false
        });

        }




    }

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
