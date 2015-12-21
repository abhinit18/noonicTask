/**
 * Created by Vikas on 31/07/15.
 */
App.controller('ordersController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog) {
    'use strict';
    $scope.loading = true;
    var timeLine = [];
    $http.get(MY_CONSTANT.url + 'api/admin/orderList/' + $cookieStore.get('obj').accesstoken)
        .success(function (response, status) {
            console.log(response);
            $scope.response = response;
            if (response.data[0].timeLine[0].cancelled)
                console.log(response.data[0].timeLine[0].cancelled);
            if (status == 200) {
                var dataArray = [];
                var custList = response.data;
                custList.forEach(function (column) {
                    var d = {};
                    d._id = column._id;
                    d.orderId = column.orderId;
                    d.customerName = column.customerName;
                    d.driverName = column.driverName;
                    d.parcelDetails = column.parcelDetails;
                    d.scheduledPickUp = moment.utc(column.timeLine[0].scheduledPickUp).format("Do MMM YYYY hh:mm A");
                    d.scheduledDelivery = moment.utc(column.timeLine[0].scheduledDelivery).format("Do MMM YYYY hh:mm A");
                    d.actualCollectionTime = moment.utc(column.actualCollectionTime).format("Do MMM YYYY hh:mm A");
                    if (column.timeLine[0].delivered == undefined)
                        d.actualDeliveryTime = "-";
                    else
                        d.actualDeliveryTime = moment.utc(column.timeLine[0].delivered).format("Do MMM YYYY hh:mm A");
                    d.collectionFrom = column.collectionFrom;
                    d.deliverTo = column.deliverTo;
                    d.waitingTime = column.waitingTime;
                    d.vehicleRequired = column.vehicleRequired;
                    d.distance = column.distance;
                    d.amount = column.amount;
                    d.pickupLocation = column.pickupLocation;
                    d.deliveryLocation = column.deliveryLocation
                    d.status = column.status;

                    switch (column.status) {
                        case 'PENDING':
                            d.status = 'Pending';
                            d.text_color = '#FF0000';
                            break;
                        case 'ORDER_DELIVERED':
                            d.status = 'Delivered';
                            d.text_color = '#1f9c3d';

                            break;
                        case 'CANCELLED':
                            d.status = 'Cancelled';
                            d.text_color = '#FF0033';
                            break;
                        case 'SUCCESS':
                            d.status = 'Success';
                            d.text_color = '#F6D21A';
                            break;
                        case 'REFUND':
                            d.status = 'Refund';
                            d.text_color = '#99FF66';
                            break;
                        case 'REACHED_PICKUP_POINT':
                            d.status = 'Reached At Pick Up Point';
                            d.text_color = '#D8BFD8';
                            break;
                        case 'PICKED_UP':
                            d.status = 'Picked Up';
                            d.text_color = '#D8BFD8';
                            break;
                        case 'REACHED_DELIVERY_POINT':
                            d.status = 'Reached At Delivery Point';
                            d.text_color = '#008080';
                            break;
                        case 'REQUEST_SENT_TO_DRIVER':
                            d.status = 'Request Sent to Driver';
                            d.text_color = '#3300FF';
                            break;
                        case 'DRIVER_ASSIGNED':
                            d.status = 'Driver Assigned';
                            d.text_color = '#330033';
                            break;
                        case 'ACCEPTED':
                            d.status = 'Accepted';
                            d.text_color = '#336600';

                            break;
                        case 'REFUSED':
                            d.status = 'Refused';
                            d.text_color = '#FF3333';
                            break;
                        case 'DRIVER_RESPONDED':
                            d.status = 'Driver Responded';
                            d.text_color = '#99FFCC';
                            break;
                        case 'REASSIGNED':
                            d.status = 'Reassigned';
                            d.text_color = '#FF0000';
                            break;
                    }
                    d.createdAt = column.createdAt;
                    dataArray.push(d);
                });
                $scope.list = dataArray;
                var dtInstance;
                $timeout(function () {
                    $scope.loading = false;
                    if (!$.fn.dataTable) return;
                    dtInstance = $('#datatable2').dataTable({
                        'paging': true,  // Table pagination
                        'ordering': true,  // Column ordering
                        'info': true,
                        "scrollX": true,
                        "aLengthMenu": [5, 10, 25, 50, 100],

                        // Bottom left status text
                        oLanguage: {
                            sSearch: 'Search all columns:',
                            sLengthMenu: '_MENU_ records per page',
                            info: 'Showing page _PAGE_ of _PAGES_',
                            zeroRecords: 'Nothing found - sorry',
                            infoEmpty: 'No records available',
                            infoFiltered: '(filtered from _MAX_ total records)'
                        }

                    });
                    var inputSearchClass = 'datatable_input_col_search';
                    var columnInputs = $('tfoot .' + inputSearchClass);

                    // On input keyup trigger filtering
                    columnInputs
                        .keyup(function () {
                            dtInstance.fnFilter(this.value, columnInputs.index(this));
                        });
                });
                $scope.$on('$destroy', function () {
                    dtInstance.fnDestroy();
                    $('[class*=ColVis]').remove();
                })

            } else {
                alert("Something went wrong, please try again later.");
                return false;
            }
        })
        .error(function (error) {
            console.log(error);
        });
    $scope.timeLine = function (orderId) {
        for (var i = 0; i < $scope.response.data.length; i++) {
            if ($scope.response.data[i]._id == orderId) {
                if ($scope.response.data[i].timeLine[0].createdAt)
                    timeLine.push("Order Placed At " + $scope.response.data[i].timeLine[0].createdAt);
                if ($scope.response.data[i].timeLine[0].driverAssigned)
                    timeLine.push("Driver assigned At " + $scope.response.data[i].timeLine[0].driverAssigned);
                if ($scope.response.data[i].timeLine[0].scheduledPickUp)
                    timeLine.push("Order will picked up At " + $scope.response.data[i].timeLine[0].scheduledPickUp);
                if ($scope.response.data[i].timeLine[0].scheduledDelivery)
                    timeLine.push("Order will deliver At " + $scope.response.data[i].timeLine[0].scheduledDelivery);
                if ($scope.response.data[i].timeLine[0].reachedPickUpPoint)
                    timeLine.push("Driver reached At pickup point at " + $scope.response.data[i].timeLine[0].reachedPickUpPoint);
                if ($scope.response.data[i].timeLine[0].pickedUp)
                    timeLine.push("Driver picked up order At " + $scope.response.data[i].timeLine[0].pickedUp);
                if ($scope.response.data[i].timeLine[0].reachedDeliveryPoint)
                    timeLine.push("Driver reached At delivery point at " + $scope.response.data[i].timeLine[0].reachedDeliveryPoint);
                if ($scope.response.data[i].timeLine[0].delivered)
                    timeLine.push("Order delivered At " + $scope.response.data[i].timeLine[0].delivered);
                $scope.timeLine = timeLine;
                console.log($scope.timeLine);
            }
        }
        ngDialog.openConfirm({
            template: 'modalDialogId',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (value) {
        }, function (reason) {
        });
    }

});