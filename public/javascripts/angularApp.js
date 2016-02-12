var app = angular.module('flapperNews', ['ui.router', 'ui.bootstrap', 'ngAlertify', 'flow', 'ui.select', 'ngSanitize']);

app.config(['$compileProvider', 'flowFactoryProvider', 'uiSelectConfig', function ($compileProvider, flowFactoryProvider, uiSelectConfig){
    
    $compileProvider.debugInfoEnabled(false);    
    
    flowFactoryProvider.defaults = {
        simultaneousUploads: 0,
        singleFile: true
    };
    
    uiSelectConfig.theme = 'bootstrap';
    uiSelectConfig.resetSearchInput = true;
    uiSelectConfig.appendToBody = true;
    
}]);