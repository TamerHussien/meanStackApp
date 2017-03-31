angular.module('mainController', ['authServices'])

.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope, $window){
   
    var app = this;
    
    app.loadMe = false;
    
    $rootScope.$on('$routeChangeStart', function(){
        
        if (Auth.isLogedIn()){
        
        Auth.getUser().then(function(data){
            
            app.isLoged = true;
            app.username = data.data.username;
            app.useremail = data.data.email;
            app.loadMe = true;
        });
    } else {
        
        app.username = '';
        app.isLoged = false;
        app.loadMe = true;
    };
    
        if ($location.hash() == '_=_') $location.hash(null);
    });
    
    this.facebook = function() {
        
        //console.log($window.location.host);
        //console.log($window.location.protocol);
        
        $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook';
    };
    
    this.twitter = function() {
        
        //console.log($window.location.host);
        //console.log($window.location.protocol);
        
        $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/twitter';
    };
    
    this.google = function() {
        
        //console.log($window.location.host);
        //console.log($window.location.protocol);
        
        $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google';
    };
    
    
    this.doLogin = function(loginData){
      app.errorMsg = false;
        
        app.loading = true;
                
       Auth.login(app.loginData).then(function(data){
          
            app.show = data.data.success;
            
            if (data.data.success){
                
                app.loading = false;
                
                app.successMsg = data.data.message  + '.... Redirecting to About Page';
                
                $timeout(function(){
                    
                    $location.path('/about');
                    app.loginData = '';
                    app.successMsg = false;
                }, 2000);
                
            } else {
                
                app.loading = false;
                
                app.errorMsg = data.data.message;
            }
        });
    };
    
    this.logout = function (){
        
        Auth.logout();
        
        $location.path('/logout');
        
        $timeout(function(){
                    
            $location.path('/');
                
                }, 2000);
    };

});