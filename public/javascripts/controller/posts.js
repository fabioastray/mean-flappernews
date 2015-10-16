app.controller('posts', [
    '$scope', 'Auth', 'postObj', 'Post', 'alertify',
    function ($scope, Auth, postObj, Post, alertify) {

        $scope.post = postObj;
        $scope.isLoggedIn = Auth.isLoggedIn;

        $scope.addComment = function () {
            Post.addComment(postObj._id, {
                body: $scope.body,
                author: $scope.author
            }).success(function(comment){
                $scope.post.comments.push(comment);
                alertify.success('Done creating this comment');
                clearFields();
            });
        };
        
        $scope.incrementUpvoteComment = function (comment) {
            if(Auth.isLoggedIn()){
                Post.upvoteComment(postObj, comment).error(function(error){
                    alertify.error(error.message);
                });
            }else{
                alertify.error('Log in first to upvote');
            }
        };
        
        $scope.incrementDownvoteComment = function (comment) {
            if(Auth.isLoggedIn()){
                Post.downvoteComment(postObj, comment).error(function(error){
                    alertify.error(error.message);
                });
            }else{
                alertify.error('Log in first to downvote');
            }
        };
        
        function clearFields(){
            $scope.author = '';
            $scope.body = '';
            $scope.addCommentClick = false;
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
                        postObj: ['$stateParams', 'Post', function($stateParams, Post){
                            return Post.get($stateParams.id);
                        }]
                    }
                });

        $urlRouterProvider.otherwise('home');
    }]);