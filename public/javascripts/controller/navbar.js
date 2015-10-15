app.controller('navbar', [
    '$scope', '$location', 'Auth',
    function ($scope, $location, Auth) {
        
        init();
        
        $scope.go = function ( path ) {
            $location.path( path );
        };
        
        function init(){
            $scope.isLoggedIn = Auth.isLoggedIn;
            $scope.currentUser = Auth.payload;
            $scope.logOut = Auth.logOut;
        }
        
    }]);