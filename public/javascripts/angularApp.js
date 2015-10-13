var app = angular.module('flapperNews', ['ui.router', 'ui.bootstrap', 'ngAlertify', 'flow']);
app.config(['$compileProvider', 'flowFactoryProvider', function ($compileProvider, flowFactoryProvider){
    
    $compileProvider.debugInfoEnabled(false);    
    
    flowFactoryProvider.defaults = {
        simultaneousUploads: 0,
        singleFile: true
    };
    
}]);