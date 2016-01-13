var app = angular.module('chirpApp',['ngRoute','ngResource'])
//setting up $rootScope
.run(function($rootScope, $http) {
  $rootScope.authenticated = false;
  $rootScope.current_user = '';
  $rootScope.signout = function(){
    $http.get('auth/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
  };
});

//routes
app.config(function($routeProvider){
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		//the login display
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		//the signup display
		.when('/register', {
			templateUrl: 'register.html',
			controller: 'authController'
		});
});

//a factory service using $resource
app.factory('postsService', function($resource){
  return $resource('/api/posts/:id');
});

app.controller('mainController',function($scope, $rootScope, postsService){

  $scope.newPost = {created_by:$rootScope.current_user, text:'', created_at:''};

  $scope.posts = postsService.query();

  $scope.post = function() {
    $scope.newPost.created_at = Date.now();
    postsService.save($scope.newPost, function(){
      $scope.posts = postsService.query();
      $scope.newPost = {created_by: $rootScope.current_user, text: '', created_at: ''};
    });
  };
});

app.controller('authController',function($scope, $http, $rootScope, $location){
  $scope.user = {username:'',password:''};
  $scope.error_message = '';

  $scope.login = function(){
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };

  $scope.register = function(){
    $http.post('/auth/signup', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };
});
