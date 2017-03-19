angular.module('mainController', ['authServices'])

.controller('mainCtrl', function(Auth, $timeout, $location){
   
    var app = this;
    
    if (Auth.isLogedIn){
        console.log('user logged in');
        Auth.getUser().then(function(data){
            console.log(data);
        });
    } else {
        
        console.log('user is not logged in');
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