app.controller('posts', [
    '$scope', 'auth', 'postObj', 'post',
    function ($scope, auth, postObj, Post) {

        $scope.post = postObj;
        $scope.isLoggedIn = auth.isLoggedIn;

        $scope.addComment = function () {
            if (!$scope.body || $scope.body === '') { return; }
            Post.addComment(postObj._id, {
                body: $scope.body,
                author: 'user'
            }).success(function(comment){
                $scope.post.comments.push(comment);
                clearFields();
            });
        };
        
        $scope.incrementUpvoteComment = function (comment) {
            if(auth.isLoggedIn()){
                Post.upvoteComment(postObj, comment);
            }else{
                $scope.error = { message: 'Log in first to upvote' };
            }
        };
        
        $scope.incrementDownvoteComment = function (comment) {
            if(auth.isLoggedIn()){
                Post.downvoteComment(postObj, comment);
            }else{
                $scope.error = { message: 'Log in first to downvote' };
            }
        };
        
        function clearFields(){
            $scope.body = '';
        }

    }]).config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $stateProvider
                .state('posts', {
                    url: '/posts/{id}',
                    templateUrl: '/public/html/posts.html',
                    controller: 'posts',
                    resolve: {
                        postObj: ['$stateParams', 'post', function($stateParams, Post){
                            return Post.get($stateParams.id);
                        }]
                    }
                });

        $urlRouterProvider.otherwise('home');
    }]);