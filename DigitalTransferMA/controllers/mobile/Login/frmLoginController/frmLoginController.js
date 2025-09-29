define({ 

 //Type your controller code here 
  onLogin : function(){
    var username = this.view.txtUsername.text;
    var password = this.view.txtPassword.text;
    kony.application.showLoadingScreen(null, "", constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true, {});
    var authParams = {
      "UserName": username,
      "Password": password,
      "loginOptions": {
        "isOfflineEnabled": false
      }
    };
    authClient = KNYMobileFabric.getIdentityService("DbxUserLogin");
    authClient.login(authParams, successCallback, errorCallback);

    function successCallback(resSuccess) {
      kony.application.dismissLoadingScreen();
      kony.print(resSuccess);
      var ntf = new kony.mvc.Navigation("Login/frmMenu");
      ntf.navigate();
    }

    function errorCallback(resError) {
      kony.application.dismissLoadingScreen();
      kony.print(resError);
      alert("login is not working...");
    }
  }

 });