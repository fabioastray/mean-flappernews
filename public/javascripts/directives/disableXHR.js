app.directive('disableXhr', ['$http', function ($http){
    return {
        link: function (scope, element, attrs){
            scope.isLoading = function(){
                return $http.pendingRequests.length > 0;
            };
            
            scope.$watch(scope.isLoading, function (loading){
               if(loading){
                   element.prop('disabled', true);
               } else{
                   element.prop('disabled', false);
               }
            });
        }
    };    
}]);