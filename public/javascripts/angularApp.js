var app = angular.module('flapperNews', ['ui.router', 'ngAlertify']);
app.config(['$compileProvider', function ($compileProvider){
    $compileProvider.debugInfoEnabled(false);    
}]);