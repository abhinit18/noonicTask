/**
 * Created by Vikas on 29/07/15.
 */
App.controller('LoginController', function ($scope, $http, $cookies, $cookieStore, baseurl, $state,$rootScope) {
    $scope.account = {};
    $scope.authMsg = '';
    $scope.loginAdmin = function () {
        $scope.authMsg = '';

            $http({
                url: baseurl.url + '/adminLogin',
                method: "POST",
                data: { username: $scope.account.username,
                    password: $scope.account.password
                }
            })
                .then(function(response) {
                    console.log(response);
                    //if(response.data.statusCode == 200){
                    //    $state.go('app.dashboard');
                    //}
                    //
                    //var someSessionObj = {'accesstoken': response.data.data.accessToken};
                    //var someSessionObj1 = {'adminType': response.data.data.adminType};
                    //$cookieStore.put('obj', someSessionObj);
                    //$cookieStore.put('obj1', someSessionObj1);
                    //$state.go('app.dashboard');

                    var someSessionObj = {'accesstoken': response.data.data.accessToken};
                    var someSessionObj1 = {'type': response.data.data.type};
                    $cookieStore.put('obj', someSessionObj);
                    $cookieStore.put('obj1', someSessionObj1);
                    $state.go('app.individual');
                },
                function(response) { // optional
                    console.log(response);
                    return;
                    // failed
                    if(response.data.statusCode==400){
                        $scope.authMsg = response.data.message;
                        setTimeout(function () {
                            $scope.authMsg = "";
                            $scope.$apply();
                        }, 3000);
                    }
                    else
                    alert("Something Went Wrong");
                });
    };
    $scope.recover = function () {
        $.post(MY_CONSTANT.url + '/forgot_password',
            {
                email: $scope.account.email
            }).then(
            function (data) {
                data = JSON.parse(data);
                if (data.status == 200) {
                    $scope.successMsg = data.message.toString();
                } else {
                    $scope.errorMsg = data.message.toString();

                }
                $scope.$apply();
            })
    };
    $scope.logout = function () {
        $cookieStore.remove('obj');
        $state.go('page.login');
    }

});