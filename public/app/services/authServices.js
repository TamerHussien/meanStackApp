angular.module('authServices', [])
    
    .factory('Auth', function($http, AuthToken){
    
   var authFactory = {};
    
    authFactory.login = function(loginData){
        
        return  $http.post('/api/authenticate', loginData).then(function(data){
            
            AuthToken.setToken(data.data.token);
            
            return data;
        });
    };
    
    authFactory.isLogedIn = function(){
        
        if (AuthToken.getToken()){
            
            return true;
        } else {
            
            return false;
        };
        
    };
    
    authFactory.facebook = function(token){
      
        AuthToken.setToken(token);
        
    };
    
    authFactory.getUser = function() {
        // Check first if user has a token
        if (AuthToken.getToken()) {
            return $http.post('/api/me'); // Return user's data
        } else {
            $q.reject({ message: 'User has no token' }); // Reject if no token exists
        }
    };
    
    authFactory.logout = function() {
        AuthToken.setToken(); // Removes token from local storage
    };

    return authFactory; // Return object
})

// Factory: AuthToken handles all token-associated functions
.factory('AuthToken', function($window) {
    var authTokenFactory = {}; // Create factory object

    // Function to set and remove the token to/from local storage
    
    authTokenFactory.setToken = function(token) {
    
        // Check if token was provided in function parameters
        if (token) {
            $window.localStorage.setItem('token', token); // If so, set the token in local storage
        } else {
            $window.localStorage.removeItem('token'); // Otherwise, remove any token found in local storage (logout)
        };
};
    
    authTokenFactory.getToken = function(){
        
        return $window.localStorage.getItem('token');
    };
    
    return authTokenFactory;
})

.factory('AuthInterceptors', function(AuthToken) {
    var authInterceptorsFactory = {}; // Create factory object

    // Function to check for token in local storage and attach to header if so
    authInterceptorsFactory.request = function(config) {
        var token = AuthToken.getToken(); // Check if a token is in local storage
        if (token) config.headers['x-access-token'] = token; //If exists, attach to headers

        return config; // Return config object for use in app.js (config file)
    };

    return authInterceptorsFactory; // Return factory object

});