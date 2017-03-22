angular.module('mainController', ['authServices'])

.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope){
   
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
    
    });
    
    
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