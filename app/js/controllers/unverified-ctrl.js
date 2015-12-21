/**
 * Created by Vikas  on 03/08/15.
 */

App.controller('unverifiedController', function ($scope, $http, $cookies, $cookieStore, baseurl,$timeout, $state, ngDialog) {
    'use strict';
    //$scope.excelList = {};

$scope.payment_mode1 = "Cash";
$scope.pricing_type1 = "Price_per_package";
$scope.schedule_type1 = "Daily";
    $scope.init1=function(){
        $scope.verification = {
            "id": "",
            "Pricing_method": {
                "Cash": false,
                "pay_u": false,
                "credit_card": false
            },
            "payment_method": {
                "Location_Based_Pricing": false,
                "Zone_Based_Pricing": false,
                "Price_per_package": false
            },
            "Invoice_frequency": {
                "Daily": false,
                "Weekly": false,
                "Fortnightly": false,
                "Monthly": false,
                "Custom": 0
            }
        }
    };
    $scope.init1();
$scope.check=function(payment_mode1){
    $scope.init1();
    console.log(payment_mode1);
    $scope.pricing_type1=payment_mode1;
};$scope.check2=function(pricing_type1){
        $scope.init1();
    console.log(pricing_type1);
        $scope.payment_mode1=pricing_type1;
};$scope.check3=function(schedule_type1){
        $scope.init1();
    console.log(schedule_type1);
        $scope.schedule_type1=schedule_type1;
};
$scope.viewDetails = function(data){

console.log(data);

$scope.org_name         = data.org_name;
$scope.unit_name        = data.unit_name;
$scope.address          = data.address;
$scope.contact_person   = data.contact_person;
$scope.contact_number   = data.contact_number;



    ngDialog.open({
            template: 'view_details',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
}
$scope.slide=0;
    $scope.nextSlide = function(){
        $scope.slide++;
    }


    $scope.prevSlide = function(){
        $scope.slide--;
    }

$scope.submit = function(){
    alert("Details verified");
}


$scope.verify = function(data){

    console.log(data);

    $scope.itemId = data._id;
$scope.verification.id = data._id;
    $scope.org_name = data.org_name;
    $scope.unit_name = data.unit_name;
    $scope.address   = data.address;
    $scope.contact_person = data.contact_person;
    $scope.contact_number = data.contact_number;
    $scope.email = data.email;


     ngDialog.open({
            template: 'verify_details',
            className: 'ngdialog-theme-default',
            scope: $scope
        });

}






















    $scope.loading = true;
    $scope.init = function () {
        $http.get(baseurl.url + '/Unverified/Enterprise?access_token='+$cookieStore.get("obj").accesstoken)
            .success(function (response, status) {

                console.log(response);
                if (status == 200) {

                    var dataArray = [];
                    var custList = response.data;
                    console.log(custList);

                    /*
                  var custList = [
     {
       "_id": "564c720459e4e8723cbcbd18",
       "org_name": "xyz company ",
       "email": "xyz@gmail.com",
       "address": "fhjbvjkdfbn",
       "mobile": "987654211",
       "password": "123456"
     },
     {
       "_id": "564c9b2a59e4e8723cbcbd22",
       "name": "abcd",
       "email": "xyz@gmail.com",
       "mobile": "987654211",
       "password": "123456",
       "city": "abxcf",
       "enterprise_id": "564c720459e4e8723cbcbd18",
       "Invoice_frequency": {
         "Custom": 0,
         "Monthly": false,
         "Fortnightly": false,
         "Weekly": false,
         "Daily": false
       },
       "Pricing_method": {
         "credit_card": false,
         "pay_u": false,
         "Cash": false
       },
       "payment_method": {
         "Price_per_package": false,
         "Zone_Based_Pricing": false,
         "Location_Based_Pricing": false
       },
       "status": "block",
       "verification": "Unverified"
     }
   ];





*/





$scope.verifySubmit = function(){


console.log($scope.payment_mode1);
console.log($scope.pricing_type1);
console.log($scope.schedule_type1);

/*$scope.verification.payment_method.Cash       = false;
$scope.verification.payment_method.pay_u       = false;
$scope.verification.payment_method.credit_card = false;*/

$scope.verification.payment_method[$scope.pricing_type1]  = true;



/*$scope.verification.Pricing_method.Location_Based_Pricing = false;
$scope.verification.Pricing_method.Zone_Based_Pricing = false;
$scope.verification.Pricing_method.Price_per_package = false;*/


$scope.verification.Pricing_method[$scope.payment_mode1] = true;



/*$scope.verification.Invoice_frequency.Daily = false;
$scope.verification.Invoice_frequency.Weekly = false;
$scope.verification.Invoice_frequency.Fortnightly = false;
$scope.verification.Invoice_frequency.Monthly = false;*/



$scope.verification.Invoice_frequency[$scope.schedule_type1] = true;


if($scope.schedule_type=="custom"){
    $scope.verification.Invoice_frequency["custom"] =  $scope.schedule_type_custom;
}

    $scope.verification.id = $scope.itemId;
console.log($scope.verification);



       $http.post(baseurl.url + '/Enterprise/verification',$scope.verification)
            .success(function (response, status) {
console.log(response);
               alert("User verified");
               ngDialog.close();

            }).error(function(response, status){
               console.log(response);

               alert("User could not be verified");

            });


}




                        
//iterating through unverified customer data


  custList.forEach(function (column) {

      console.log(column[0].enterprise);
      console.log(column[0].unit);

      d._id            = custList[i]._id;
      d.org_name           = custList[i].org_name;
      d.unit_name           = custList[i+1].name;
      d.address        = custList[i].address;
      d.contact_person = "contact person";
      d.contact_number = custList[i+1].mobile;
      d.email          = custList[i+1].email;




  });



for(var i=0;i<=custList.length;i+=2){
    if(typeof(custList[i]) == 'undefined')
        break;

    var d = {};
    console.log(i);
    console.log(custList[i][0]);
    console.log(custList[i+1][0]);



if(custList[i+1]["status"]=="block"){
    d.isBlocked = true;
}else if(custList[i+1]["status"]=="unblock"){
    d.isBlocked = false;
}



if(custList[i+1].verification=="Unverified"){
    d.verified = false;
}else{
    d.verified = true;
}

        d._id            = custList[i]._id;
        d.org_name           = custList[i].org_name;
        d.unit_name           = custList[i+1].name;
        d.address        = custList[i].address;
        d.contact_person = "contact person";
        d.contact_number = custList[i+1].mobile;
        d.email          = custList[i+1].email;







                        dataArray.push(d);




}




console.log(dataArray);


                    /*custList.forEach(function (column) {
                        var d = {};
console.log(column);
                        console.log(column[0]);
                        console.log(column[1]);

if(column[1].status=="block"){
    d.isBlocked = true;
}else if(column[1].status=="unblock"){
    d.isBlocked = false;
}

if(column[1].verification=="Unverified"){
    d.verified = false;
}else{
    d.verified = true;
}

                        d._id = column[0]._id;
                        d.name = column[0].org_name;
                        d.unit = column[1].name;
                        d.address = column[0].address;
                        d.contact_person = "contact person";

                        dataArray.push(d);
                    });*/






                    $scope.list = dataArray;
                    console.log($scope.list);
                    $scope.excelList = dataArray;
                    var dtInstance;
                    $timeout(function () {
                        $scope.loading = false;
                        if (!$.fn.dataTable) return;
                        dtInstance = $('#datatable-unverified').dataTable({
                            'paging': true,  // Table pagination
                            'ordering': true,  // Column ordering
                            'info': true,  // Bottom left status text
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





    }

   
   



    /*-----------Export CSV Section Starts---------------------*/
    $scope.exportData = function () {
        alasql('SELECT * INTO CSV("customer.csv",{headers:true}) FROM ?', [$scope.excelList]);
    };

});

App.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
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