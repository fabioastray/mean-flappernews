app.controller('profile', [
    '$scope',  '$window', '$timeout', 'Util', 'Auth', 'User', 'userPromise', 'alertify',
    function ($scope,  $window, $timeout, Util, Auth, User, userPromise, alertify) {

        $scope.user = userPromise;
        $scope.userCopy = _(userPromise).clone();
        $scope.flow = undefined;
        $scope.isLoggedIn = Auth.isLoggedIn;
        
        $scope.$on('flow::fileAdded', function (event, $flow, flowFile) {
            
            if(!isValidFileExtension(flowFile.relativePath)){
                event.preventDefault();
            }
            else if(!isValidFileSize(flowFile.size)){
                event.preventDefault();
            }else{
                $scope.flow = flowFile;
            }
        });
        
        $scope.cancel = function (){
            $scope.user = _($scope.userCopy).clone();  
        };
        
        $scope.editProfile = function(){            
            if($scope.flow){
                var fr = new FileReader();
                fr.onloadend = function(e){
                    $scope.user.profilePhotoToServer = {
                        data: e.target.result,
                        extension: getFileExtension($scope.flow.relativePath),
                        identifier: $scope.flow.uniqueIdentifier
                    };
                    sendCurrentProfile();
                };
                fr.readAsDataURL($scope.flow.file);
            }else{
                sendCurrentProfile();
            }
        };
        
        function sendCurrentProfile(){
            User.edit($scope.user).success(function (data){
                alertify.success('Profile updated');
                var reload = $timeout(function() { 
                    $timeout.cancel(reload);$window.location.reload();
                    $window.location.reload();
                }, 2000);
            });
        }
        
        function isValidFileExtension(fileName){
            
            var allowedExtensions = ['png', 'gif', 'jpg', 'jpeg'],
        
            fileExtension = getFileExtension(fileName);
            
            if(allowedExtensions.indexOf(fileExtension.toLowerCase()) === -1){
                alertify.error('This image extension is not allowed, only ' + allowedExtensions.join(', '));
                return false;
            }else{
                return true;
            }
        }
        
        function getFileExtension(fileName){
            var fileExtension = fileName.split('.');
            return fileExtension[fileExtension.length - 1];
        }
        
        function isValidFileSize(fileSize){
            
            var fileSizeInKbs = fileSize / 1024;
            if(fileSizeInKbs > 1024){
                alertify.error('This image size is not allowed, maximum is 1024 Kb');
                return false;
            }else{
                return true;
            }
        }
        
    }]).config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $stateProvider
                .state('profile', {
                    url: '/profile',
                    templateUrl: '/public/html/profile.html',
                    controller: 'profile',
                    resolve: {
                        userPromise: ['User', function(User){
                            return User.getCurrent();
                        }]
                    }
                });

        $urlRouterProvider.otherwise('home');
    }]);