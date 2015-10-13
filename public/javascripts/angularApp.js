var app = angular.module('flapperNews', ['ui.router', 'ui.bootstrap', 'ngAlertify', 'flow']);
app.config(['$compileProvider', 'flowFactoryProvider', function ($compileProvider, flowFactoryProvider){
    
    $compileProvider.debugInfoEnabled(false);    
    
    flowFactoryProvider.defaults = {
        permanentErrors: [404, 500, 501],
        maxChunkRetries: 1,
        chunkRetryInterval: 5000,
        simultaneousUploads: 4,
        singleFile: true
    };
    
}]);