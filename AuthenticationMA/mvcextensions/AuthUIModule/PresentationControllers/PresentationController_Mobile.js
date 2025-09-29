define(["CommonUtilities"], function(CommonUtilities) {
  function Auth_PresentationController() {
    scope_AuthPresenter = this;
    kony.mvc.Presentation.BasePresenter.call(this);
    this.asyncManager = applicationManager.getAsyncManager();
    this.authManger = applicationManager.getAuthManager();
    this.logger = applicationManager.getLoggerManager();
    this.dmManager = applicationManager.getDirectMarketingManager();
    this.isPasswordUpdated = false;
    this.isLogoutScreen = true;
    this.isSessionExpired = false;
    this.flowType = "";
    this.currentAuthMode = "";
    this.cardsDataForCvv = {};
    this.checkAppinit = false;
    this.usernameRules = [];
    this.passwordRules = [];
    this.isMFARequired = false;
    this.isTnCRequire = false;
    this.userList = [];
    this.unmaskedphoneNumber = "";
    this.unmaskedemail= "";
    this.maskedphoneNumber = "";
    this.maskedemail= "";
    this.rememberdeviceregflag = false;
    this.MFAresponse = "";
    this.tncResponse = null;
    this.isFaceLoginInProgress = false;
    this.time1 = 0;
    this.time2 = 0;
    this.returnFromBackGr = false;
    this.idlePopupFlag = false;
    /**   numberOfAsyncForLogin
          *  1.getUser
          *  2.getRefreshAccountsFromDB
          *  3.getDeviceRegistration
          *  4.getAccountsPostLogin
          *  5.getPFMPieChartData
          *  6.getPFMBarGraphData
          *  7.getAllEntitlements
            */
    this.numberOfAsyncForLogin = 10;
    this.secondsTillSessionExpire = 0;
    this.idleTiomeoutFormControler = null;
  }
  inheritsFrom(Auth_PresentationController, kony.mvc.Presentation.BasePresenter);
  Auth_PresentationController.prototype.initializePresentationController = function() {
  };
  /**
   * Method used to navigate to a Form in any MicroApp
   * Example of arguments to be passed:
   * {"appName" : "AccountsMA", "friendlyName" : "AccountsUIModule/frmDashboard"}
   */
  Auth_PresentationController.prototype.navigateToMicroApp = function({appName, friendlyName}){
    new kony.mvc.Navigation({appName, friendlyName}).navigate();
  };
  Auth_PresentationController.prototype.getAuthDependentManager = function(){
    return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule('AuthDependentManager').businessController;
  };
  Auth_PresentationController.prototype.showLoginForm = function() {
    this.presentUserInterface('frmLogin', {});
  };
  Auth_PresentationController.prototype.firstTimeLoginDone = function(){
    const storageManager = applicationManager.getStorageManager();
    storageManager.setStoredItem("firstTimeLogin","Done");
  };
  Auth_PresentationController.prototype.firstTimeLoginSetUname = function(){
    const storageManager = applicationManager.getStorageManager();
    storageManager.setStoredItem("firstTimeLoginUname","Done");
  };
  Auth_PresentationController.prototype.startUpCompleted = function(){
    const configManager = applicationManager.getConfigurationManager();
    configManager.isStartupCompleted = true;
  };
  Auth_PresentationController.prototype.isStartUpComplete = function(){
    const configManager = applicationManager.getConfigurationManager();
    return configManager.isStartupCompleted === true? true : false;
  };
  Auth_PresentationController.prototype.onLanguageChange = function() {
    const configManager = applicationManager.getConfigurationManager();
    const navManager = applicationManager.getNavigationManager();
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    configManager.reloadConstants();
    applicationManager.clearBusinessDataMemebers();
    configManager.resetConfigurationObject();
    navManager.clearStack();
    navManager.destroyFormsAll();
    navManager.clearEntryPointTable();
    try {
      applicationManager.postAppInitiate();
      kony.application.setApplicationProperties({
        // "statusBarForegroundColor": "000000"
      });
      const registrationManager = applicationManager.getRegistrationManager();
      registrationManager.setEventTracking();
      navManager.navigateTo("frmLogin");
    } catch (err) {
      throw GlobalExceptionHandler.addMessageAndActionForException(err, "kony.error.App_Initialisation_Failed", GlobalExceptionHandler.ActionConstants.BLOCK, arguments.callee.name);
    }
  };
  Auth_PresentationController.prototype.onLanguageChangeFromSettings = function() {
    const configManager = applicationManager.getConfigurationManager();
    const navManager = applicationManager.getNavigationManager();
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    configManager.reloadConstants();
    configManager.rearrangeHamburgerAccordingToEntitements();
    navManager.destroyFormsAll();
    const isHomepageMAPresent = configManager.isMicroAppPresent('HomepageMA');
    if(isHomepageMAPresent){
      scope_AuthPresenter.navigateToMicroApp({ 
        appName: "HomepageMA", 
        friendlyName: "AccountsUIModule/frmUnifiedDashboard"
      });
    } 
  };
  Auth_PresentationController.prototype.onLogout = function() {
    this.performLogout({ isLogoutScreen: true, isPasswordUpdated: false });
  };
  Auth_PresentationController.prototype.disableEBankingLogout = function() {
    this.performLogout({ isLogoutScreen: false, isPasswordUpdated: false });
  };
  Auth_PresentationController.prototype.passwordUpdateLogout = function() {
    this.performLogout({ isPasswordUpdated: true });
  };
  Auth_PresentationController.prototype.sessionExpiredLogout = function() {
    this.performLogout({ isLogoutScreen: false, isPasswordUpdated: false, isSessionExpired: true });
  };
  Auth_PresentationController.prototype.performLogout = function({ 
    isLogoutScreen = true, 
    isPasswordUpdated = false,
    isSessionExpired = false
  }){
    this.isLogoutScreen = isLogoutScreen;
    this.isPasswordUpdated = isPasswordUpdated;
    this.isSessionExpired = isSessionExpired;
    
    applicationManager.getPresentationUtility().showLoadingScreen();
    const authManger = applicationManager.getAuthManager();
    authManger.logout(this.presentationLogoutSuccess, this.presentationLogoutError);
  };
  Auth_PresentationController.prototype.presentationLogoutSuccess = function(resSuccess) {
    var callbacksToBeRemoved = {
        "onforeground": ["TeminAppForeGroundCallBack"],
        "onbackground": ["TeminAppBackGroundCallBack"]
        };
    kony.application.removeApplicationCallbacks(callbacksToBeRemoved);	  
    scope_AuthPresenter.logger.log("resSuccess");
    scope_AuthPresenter.logoutNavigation.call(scope_AuthPresenter, true);
  };
  Auth_PresentationController.prototype.presentationLogoutError = function(resError) {
    scope_AuthPresenter.logger.log("resError");
    scope_AuthPresenter.logoutNavigation.call(scope_AuthPresenter, false);
  };
  Auth_PresentationController.prototype.logoutNavigation = function(logoutStatus) {
    const navManager = applicationManager.getNavigationManager();
    navManager.setCustomInfo("logoutStatus", logoutStatus);
    scope_AuthPresenter.navigateToMicroApp({ 
      appName: "AuthenticationMA", 
      friendlyName: "AuthUIModule/frmLogout" 
    });
  };
  Auth_PresentationController.prototype.signInFromLogoutScreen = function() {
    const MenuHandler =  applicationManager.getMenuHandler();
    const navManager = applicationManager.getNavigationManager();
    const userPreferencesManager = applicationManager.getUserPreferencesManager();
    applicationManager.clearBusinessDataMemebers();    
    userPreferencesManager.isLoggedIn = false;
    if(navManager.getCustomInfo("logoutStatus")){
      let asobj = applicationManager.actionSheetObject;
      if(asobj){
        asobj.dismiss();
        applicationManager.actionSheetObject = null;
      }
    }
    applicationManager.getDataforLogin();
    navManager.clearStack();
    navManager.navigateTo("frmLogin");
    navManager.destroyForms();
    navManager.clearEntryPointTable();
    navManager.setCustomInfo("frmFilterAccounts",null);
    MenuHandler.forceTouchFlow = "";
    kony.theme.setCurrentTheme("BlueTheme", function onSuccess() {
      kony.print("Theme applyied successfully ");
    }, function onFailure() {
      kony.print(" Error applying theme ");
    });
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    if(navManager.getCustomInfo("logoutStatus")){
      navManager.setEntryPoint("Feedback","frmLogin");
      const configManager = applicationManager.getConfigurationManager();
      let val = configManager.getshowFeedBackPostLogout();
      if(val == "true"){
        const isAboutUsMAPresent = configManager.isMicroAppPresent('AboutUsMA');
        if(isAboutUsMAPresent){
          const feedbackModule = kony.mvc.MDAApplication.getSharedInstance().moduleManager.getModule({ appName: "AboutUsMA", moduleName: "FeedbackUIModule" });
          feedbackModule.presentationController.showFeedbackPopup({from : "profilesettingorlogout"});
        }
      }
    }
  };
  Auth_PresentationController.prototype.onLogin = function(UsernamePasswordJSON, formContext) {
    scope_AuthPresenter.rememberdeviceregflag = false;
    applicationManager.getPresentationUtility().showLoadingScreen();
    Auth_PresentationController.UsernamePasswordJSON = UsernamePasswordJSON;
    if (UsernamePasswordJSON.username && UsernamePasswordJSON.password) {
      const authManger = applicationManager.getAuthManager();
      authManger.login(UsernamePasswordJSON, this.presentationLoginSuccess.bind(formContext), this.presentationLoginError);
    } else {
      applicationManager.getPresentationUtility().dismissLoadingScreen();
      const controller = applicationManager.getPresentationUtility().getController('frmLogin', true);
      controller.bindLoginErrorMessage(applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.Invalid.Username.or.Password"));
    }
  };
  Auth_PresentationController.prototype.idleIimeOutCallback = function(){
    scope_AuthPresenter.sessionExpiredLogout();
  };
  Auth_PresentationController.prototype.setBiometricCredentials= function(){
    const devManager = applicationManager.getDeviceUtilManager();
    if(devManager.isIPhone()){
      const userPrefManager = applicationManager.getUserPreferencesManager();
      let storedUname = userPrefManager.getUserName();
      let storedPassword = userPrefManager.getPassword();
      let userCred = {
        userName: storedUname,
        password: storedPassword
      };
      let cred = {
        "securedata": userCred,
        "secureaccount": storedUname,
        "identifier": storedUname,
        "secureAccessControl": constants.KONY_KEYCHAIN_ACCESS_CONTROL_TOUCHID_ANY
      };
      kony.keychain.save(cred);
    }
  };

  Auth_PresentationController.prototype.initTimeoutConstants = function(){//Setting idleTimeout and alertIdleTimeout based on client properties configuration;
  //If client properies does not have it, we take the values from ConfigurationManager.
    var constants = CommonUtilities.CLIENT_PROPERTIES;
    var configurationManager = applicationManager.getConfigurationManager();
    if (!isNaN(constants.IDLE_TIMEOUT)){
      configurationManager.constants.IDLE_TIMEOUT = Number(constants.IDLE_TIMEOUT);
    } else {
      if (!configurationManager.constants.IDLE_TIMEOUT ) {
        configurationManager.constants.IDLE_TIMEOUT = 5;
      }
    }

    if (!isNaN(constants.ALERT_IDLE_TIMEOUT)) {
      configurationManager.constants.ALERT_IDLE_TIMEOUT = Number(constants.ALERT_IDLE_TIMEOUT);
    } else {
      if (!configurationManager.constants.ALERT_IDLE_TIMEOUT ) {
        configurationManager.constants.ALERT_IDLE_TIMEOUT = 4;
      }
    }

    if (configurationManager.constants.ALERT_IDLE_TIMEOUT >= configurationManager.constants.IDLE_TIMEOUT) {
      configurationManager.constants.ALERT_IDLE_TIMEOUT = 0;
    }
  };
  Auth_PresentationController.prototype.onBackGround = function() {
    scope_AuthPresenter.time1 = Date.now();
    scope_AuthPresenter.returnFromBackGr = true;
    };
   Auth_PresentationController.prototype.onForeGround = function() {
    scope_AuthPresenter.time2 = Date.now();
    var timeDiff = (scope_AuthPresenter.time2 - scope_AuthPresenter.time1) / 1000;
    var timeIdleOut = Math.floor(timeDiff / 60);
    var configurationManager = applicationManager.getConfigurationManager();
    if (scope_AuthPresenter.returnFromBackGr) {
    scope_AuthPresenter.returnFromBackGr = false;
    if (scope_AuthPresenter.idlePopupFlag) {
    if (timeDiff >= scope_AuthPresenter.secondsTillSessionExpire) {
    scope_AuthPresenter.cancelIdleTimout();
    scope_AuthPresenter.sessionExpiredLogout();
    } else {
    scope_AuthPresenter.secondsTillSessionExpire = scope_AuthPresenter.secondsTillSessionExpire - timeDiff;
    }
    } else {
    if (timeIdleOut >= configurationManager.constants.ALERT_IDLE_TIMEOUT) {
    scope_AuthPresenter.secondsTillSessionExpire = -1;
    }
    }
    }
    };
    Auth_PresentationController.prototype.setApplicationCallBacks = function() {
    var callbacksMapObject = {
     "onforeground": {
     "TeminAppForeGroundCallBack": scope_AuthPresenter.onForeGround
    },
     "onbackground": {
    "TeminAppBackGroundCallBack": scope_AuthPresenter.onBackGround
    }
     };
    kony.application.addApplicationCallbacks(callbacksMapObject);
    }  
  Auth_PresentationController.prototype.registerIdleTimeOut = function(){
 var constants = applicationManager.getConfigurationManager().constants;
    const devManager = applicationManager.getDeviceUtilManager();
    scope_AuthPresenter.secondsTillSessionExpire = constants.ALERT_IDLE_TIMEOUT * 60;
    kony.application.registerForIdleTimeout(constants.IDLE_TIMEOUT - constants.ALERT_IDLE_TIMEOUT, scope_AuthPresenter.showAlertIdlePopUp);
  };
  
  Auth_PresentationController.prototype.showAlertIdlePopUp = function(){
    scope_AuthPresenter.idlePopupFlag = true;
    scope_AuthPresenter.scheduleTimer();
  };
  
   Auth_PresentationController.prototype.scheduleTimer = function(){ 

    kony.timer.schedule("IdleSessionTimeout", scope_AuthPresenter.setShowTimeout, 1, true);

  };
  
  Auth_PresentationController.prototype.setShowTimeout = function(){
    var parentForm = scope_AuthPresenter.getCurrentFormController();
   	var sec = scope_AuthPresenter.secondsTillSessionExpire;
    if(sec < 0){
      scope_AuthPresenter.cancelIdleTimout();
      scope_AuthPresenter.sessionExpiredLogout();      
    }
    else{
    
      if(!parentForm.view.idleTimeoutPopup){
        var iddlePopup = new com.InfinityMB.AuthenticationMA.idleTimeoutPopup({
          "id": "idleTimeoutPopup",
          "appName": "AuthenticationMA",
            },{},{});
        parentForm.view.add(iddlePopup);
        
        parentForm.view.idleTimeoutPopup.extendSessionClick =  scope_AuthPresenter.extendSession;
      	parentForm.view.idleTimeoutPopup.signOutClick = scope_AuthPresenter.logoutBtnClick;
      }
      var constants = applicationManager.getConfigurationManager().constants;
      var timeOut = constants.ALERT_IDLE_TIMEOUT * 60;

      parentForm.view.idleTimeoutPopup.lblTimeText = 
        ("0" + parseInt(sec/60)).toString().slice(-2) + ":" + 
        ("0" + parseInt(sec%60)).toString().slice(-2);

      parentForm.view.idleTimeoutPopup.flxProgressWidth = (timeOut - sec) * 100 / timeOut + "%";
    }
    scope_AuthPresenter.secondsTillSessionExpire--;
  };
 
  Auth_PresentationController.prototype.extendSession = function(){
 
    scope_AuthPresenter.cancelIdleTimout();
	scope_AuthPresenter.idlePopupFlag = false;
    scope_AuthPresenter.registerIdleTimeOut();

  };
  
  Auth_PresentationController.prototype.logoutBtnClick = function(){
    scope_AuthPresenter.cancelIdleTimout();
    scope_AuthPresenter.onLogout();    
  };
  
  Auth_PresentationController.prototype.cancelIdleTimout = function(){
    kony.timer.cancel("IdleSessionTimeout");
    var idlePopup = scope_AuthPresenter.getCurrentFormController().view.idleTimeoutPopup;
    if (idlePopup) {
    scope_AuthPresenter.getCurrentFormController().view.remove(idlePopup);}
  };
  Auth_PresentationController.prototype.getCurrentFormController = function(){
    
    var currentFormId = kony.application.getCurrentForm().id;     
    var currentFormController = applicationManager.getPresentationUtility().getController(currentFormId, true);
  
    return currentFormController;
    
  };
  Auth_PresentationController.prototype.presentationLoginSuccess = function(resSuccess) {
    const configManager = applicationManager.getConfigurationManager();
    const navManager =  applicationManager.getNavigationManager();
    const loggerManager = applicationManager.getLoggerManager();
    const userPrefManager = applicationManager.getUserPreferencesManager();
    const valUtilManager = applicationManager.getValidationUtilManager();
    const storageManager = applicationManager.getStorageManager();
    const userName = userPrefManager.getUserName();
const devManager = applicationManager.getDeviceUtilManager();
    loggerManager.setUserID(userName);
    userPrefManager.isLoggedIn = true;
    
    scope_AuthPresenter.initTimeoutConstants();
//	if (devManager.isIPhone()) {
        scope_AuthPresenter.setApplicationCallBacks();
//    }
    scope_AuthPresenter.registerIdleTimeOut();
    if(scope_AuthPresenter.currentAuthMode === "password") {
      scope_AuthPresenter.currentAuthMode = "";
      if(userPrefManager.getUserId() === ""){
        storageManager.setStoredItem("registerForPushNotifications",true);
      } else {
        if(userPrefManager.isNewUser(Auth_PresentationController.UsernamePasswordJSON.username)){
          storageManager.setStoredItem("registerForPushNotifications",true);
        } else {
          storageManager.setStoredItem("registerForPushNotifications",false);
        }
      }
      if (userPrefManager.isNewUser(Auth_PresentationController.UsernamePasswordJSON.username)){
        userPrefManager.clearUserData(this);
      }
    }
    valUtilManager.resetFeedbackInfoIfUpgraded();
    let tempLoginData = navManager.getCustomInfo("frmLogin");
    scope_AuthPresenter.setRememberMeFlag(tempLoginData.isRememberMeOn);
    if(Auth_PresentationController.UsernamePasswordJSON){
      userPrefManager.saveUserName(Auth_PresentationController.UsernamePasswordJSON.username);
      userPrefManager.savePassword(Auth_PresentationController.UsernamePasswordJSON.password);
      userPrefManager.savetempUserName(Auth_PresentationController.UsernamePasswordJSON.username);
    }
    scope_AuthPresenter.isLoginSuccess();
    scope_AuthPresenter.firstTimeLoginSetUname();
    const regManager = applicationManager.getRegistrationManager();
    regManager.registerForPushNotifications();
    applicationManager.getNavigationManager().getCustomInfo("frmLogin").NUOUsername = null;
  };
  Auth_PresentationController.prototype.initializePermissions = function () {
    // Getting the security attributes from identity response.
    let providerTokenParams = kony.sdk.getCurrentInstance().tokens[applicationManager.getConfigurationManager().constants.IDENTITYSERVICENAME].provider_token.params;
    let securityAttributes = providerTokenParams.security_attributes;
    let userAttributes = providerTokenParams.user_attributes;
    let configurationManager = applicationManager.getConfigurationManager();
    configurationManager.isSMEUser = "false";
    configurationManager.isRBUser = "false";
    configurationManager.isMBBUser = "false";
    configurationManager.isCombinedUser = "false";
    if (!kony.sdk.isNullOrUndefined(userAttributes) && !kony.sdk.isNullOrUndefined(userAttributes.isCombinedUser)) {
      configurationManager.isCombinedUser = userAttributes.isCombinedUser;
    }
    if (!kony.sdk.isNullOrUndefined(configurationManager.customerTypeId) && configurationManager.isCombinedUser !== "true") {
      switch (userAttributes.CustomerType_id) {
        case "TYPE_ID_BUSINESS":
          configurationManager.isSMEUser = "true";
          break;
        case "TYPE_ID_RETAIL":
          configurationManager.isRBUser = "true";
          break;
         case "TYPE_ID_PROSPECT":
           configurationManager.isRBUser = "true";
           break;
      }
    }
    //Converted string to permission array
    let permissions = JSON.parse(securityAttributes.permissions);
    let features = JSON.parse(securityAttributes.features);
    let accounts = securityAttributes.accounts;
    applicationManager.getConfigurationManager().setUserPermissions(permissions);
    applicationManager.getConfigurationManager().setFeatures(features);
    applicationManager.getConfigurationManager().setUserRole(userAttributes.customerTypeId);
    //Converted account permissions to a optimized map.
  };
  Auth_PresentationController.prototype.deviceregstatus = function() {
    const registrationManager = applicationManager.getRegistrationManager();
    const deviceUtilManager = applicationManager.getDeviceUtilManager();
    let record = {
      "deviceId": deviceUtilManager.getDeviceInfo().deviceID
    };
    registrationManager.updateDeviceRegistrationStatus(record, scope_AuthPresenter.presentationDeviceRegSuccess, scope_AuthPresenter.presentationDeviceRegError);
  };
  Auth_PresentationController.prototype.deRegisterDevice = function() {    
    const registrationManager = applicationManager.getRegistrationManager();
    const deviceUtilManager = applicationManager.getDeviceUtilManager();
    let record = {
      "deviceId": deviceUtilManager.getDeviceInfo().deviceID
    };
    registrationManager.deleteRegisteredDevice(record, scope_AuthPresenter.presentationDeRegisterSuccess, scope_AuthPresenter.presentationDeRegisterFailure);
  };
  Auth_PresentationController.prototype.presentationDeRegisterSuccess = function(deRegDeviceSuc) {
    const userPrefManager = applicationManager.getUserPreferencesManager();
    const configurationManager = applicationManager.getConfigurationManager();
    userPrefManager.updateAccountPreviewFlag(false);
    userPrefManager.setDefaultAuthMode("password");    
    if(configurationManager.isCombinedUser=="true" || configurationManager.isSMEUser=="true"){
      scope_AuthPresenter.asyncManager.setSuccessStatus(9, deRegDeviceSuc);
    } else {
      scope_AuthPresenter.asyncManager.setSuccessStatus(8, deRegDeviceSuc);
    }
    if (scope_AuthPresenter.asyncManager.areAllservicesDone(scope_AuthPresenter.numberOfAsyncForLogin)){
      scope_AuthPresenter.postLoginServicesSuccess();
    }
  };  
  Auth_PresentationController.prototype.presentationDeRegisterFailure = function(error) {
    const configurationManager = applicationManager.getConfigurationManager();
    if(configurationManager.isCombinedUser=="true" || configurationManager.isSMEUser=="true"){
      scope_AuthPresenter.asyncManager.setSuccessStatus(9, error);
    } else {
      scope_AuthPresenter.asyncManager.setSuccessStatus(8, error);
    }
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    if (error["isServerUnreachable"]){
      applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", error);
    } else {
      alert(error.errorMessage);
    }
  };
  Auth_PresentationController.prototype.mfaLoginFlow = function(response){
    const authManger = applicationManager.getAuthManager();
    const controller = applicationManager.getPresentationUtility().getController('frmLogin', true);
    let param = controller.getServicekey();
    authManger.loginMFA(param, scope_AuthPresenter.loginMFASuccessCallback, scope_AuthPresenter.loginMFAErrorCallback);
  };
  Auth_PresentationController.prototype.loginMFASuccessCallback = function(res){
    scope_AuthPresenter.postLoginServices();
  };
  Auth_PresentationController.prototype.loginMFAErrorCallback = function(error){
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    if (error["isServerUnreachable"]) {
      applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", error);
    } else {
      const controller = applicationManager.getPresentationUtility().getController('frmMFASecurityCode', true);
      controller.setErrorMessageAndLogout(error.errmsg.errorMessage);
    }
  };
  Auth_PresentationController.prototype.presentationDeviceRegSuccess=function(resDeviceSuc){
    scope_AuthPresenter.setDeviceRegisterflag(true);
    const configurationManager = applicationManager.getConfigurationManager();
    if(configurationManager.isCombinedUser=="true" || configurationManager.isSMEUser=="true"){
      scope_AuthPresenter.asyncManager.setSuccessStatus(9, resDeviceSuc);
    } else {
      scope_AuthPresenter.asyncManager.setSuccessStatus(8, resDeviceSuc);
    }
    if (scope_AuthPresenter.asyncManager.areAllservicesDone(scope_AuthPresenter.numberOfAsyncForLogin)){
      scope_AuthPresenter.postLoginServicesSuccess();
    }
  };
  Auth_PresentationController.prototype.presentationDeviceRegError = function(resDeviceErr){
    var configurationManager = applicationManager.getConfigurationManager();
    if(configurationManager.isCombinedUser=="true" || configurationManager.isSMEUser=="true"){
      scope_AuthPresenter.asyncManager.setSuccessStatus(9, resDeviceErr);
    } else {
      scope_AuthPresenter.asyncManager.setSuccessStatus(8, resDeviceErr);
    }
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    if (resDeviceErr["isServerUnreachable"]){
      applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", resDeviceErr);
    } else {
      kony.ui.Alert(resDeviceErr);
    }
  };
  Auth_PresentationController.prototype.presentationLoginError = function(resError) {
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    const controller = applicationManager.getPresentationUtility().getController('frmLogin', true);
    let errMsg = resError.errmsg.errorMessage;
    controller.bindLoginErrorMessage(errMsg);
  };
  Auth_PresentationController.prototype.isLoginSuccess = function() {
    const authManger = applicationManager.getAuthManager();
    const mfarespone = authManger.getMfaDetails();
    if( mfarespone["mfa_meta"]["MFAAttributes"] && mfarespone["mfa_meta"]["MFAAttributes"]["isMFARequired"] === "true" ){
      scope_AuthPresenter.isMFARequired = true;
      let deviceregval = mfarespone["mfa_meta"]["MFAAttributes"]["isDeviceRegistered"];
      if(deviceregval == "true"){
        scope_AuthPresenter.setDeviceRegisterflag(true);
      } else {
        scope_AuthPresenter.setDeviceRegisterflag(false);
      }
      let mfaJSON = {
        "flowType" : "LoginMFA",
        "response" : mfarespone["mfa_meta"]
      };
      const controller = applicationManager.getPresentationUtility().getController('frmLogin', true);
      controller.initMFAFlow(mfaJSON);
    } else {
      let userattributes = authManger.getUserAttributes(scope_AuthPresenter.userAttributesSuccessCallback,scope_AuthPresenter.userAttributesErrorCallback);
    }
  };
  Auth_PresentationController.prototype.userAttributesSuccessCallback = function(res){
    scope_AuthPresenter.isMFARequired = false;
    if(res.isDeviceRegistered == "true") {
      scope_AuthPresenter.setDeviceRegisterflag(true);
      scope_AuthPresenter.rememberdeviceregflag = true;
    } else {
      scope_AuthPresenter.setDeviceRegisterflag(false);
      scope_AuthPresenter.rememberdeviceregflag = false;
    }
    if(res.backendIdentifiers){
      let jsonRes = JSON.parse(res.backendIdentifiers);
      if(jsonRes.T24&&jsonRes.T24[0]){
        applicationManager.getUserPreferencesManager().setBackendIdentifier(jsonRes.T24[0].BackendId);
      }
    }
    scope_AuthPresenter.postLoginServices();
  };
  Auth_PresentationController.prototype.userAttributesErrorCallback=function(error){
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    kony.print("userAttributesErrorCallback");
  };
  Auth_PresentationController.prototype.termsAndConditionSuccessCallback = function(response){
    scope_AuthPresenter.tncResponse = response;
    if (response.alreadySigned && response.alreadySigned === "true") {
      scope_AuthPresenter.isTnCRequire = false;
    } else {
      scope_AuthPresenter.isTnCRequire = true;
    }
    scope_AuthPresenter.asyncManager.setSuccessStatus(7, response);
    if (scope_AuthPresenter.asyncManager.areAllservicesDone(scope_AuthPresenter.numberOfAsyncForLogin)) {
      scope_AuthPresenter.postLoginServicesSuccess();
    }
  };
  Auth_PresentationController.prototype.termsAndConditionErrorCallback = function(response){
    scope_AuthPresenter.asyncManager.setSuccessStatus(7, response);
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    if (response["isServerUnreachable"]){
      applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", response);
    }
  };
  Auth_PresentationController.prototype.postLoginServices = function() {
    const configurationManager = applicationManager.getConfigurationManager();
    const userPreferencesManager = applicationManager.getUserPreferencesManager();
    let main_user = applicationManager.getUserPreferencesManager().getUserName();    
    let providerTokenParams =
        kony.sdk.getCurrentInstance().tokens[
          configurationManager.constants.IDENTITYSERVICENAME
        ].provider_token.params;
    let features = JSON.parse(providerTokenParams.security_attributes.features);
    scope_AuthPresenter.initializePermissions();
    scope_AuthPresenter.numberOfAsyncForLogin = 9;
    if(configurationManager.isCombinedUser == "true" || configurationManager.isSMEUser == "true"){
      scope_AuthPresenter.numberOfAsyncForLogin = 10;
    }
    scope_AuthPresenter.trackRegDevice();
    scope_AuthPresenter.asyncManager.initiateAsyncProcess(scope_AuthPresenter.numberOfAsyncForLogin);
    scope_AuthPresenter.fetchExternalBanksAndAccounts(main_user);
    userPreferencesManager.fetchUser(scope_AuthPresenter.presentationUserSuccess, scope_AuthPresenter.presentationUserError);    
    userPreferencesManager.fetchUserImage(scope_AuthPresenter.presentationUserImageSuccess, scope_AuthPresenter.presentationUserImageError);	
	if(userPreferencesManager.isRememberMeOn()){
		scope_AuthPresenter.deviceregstatus();
    } else {
       scope_AuthPresenter.deRegisterDevice();
    }
    scope_AuthPresenter.asyncManager.setSuccessStatus(2, {});
    const configManager = applicationManager.getConfigurationManager();
    const isAppPresent = configManager.isMicroAppPresent('SecureMessageMA');
    if(isAppPresent){
      var messageManager = applicationManager.getMessagesManager();
      messageManager.fetchNumberOfUnreadMessages(function(){
        let isPriorityMessagesNotAvailable = (CommonUtilities.CLIENT_PROPERTIES.MB_ENABLE_SECURE_MESSAGE !== undefined && CommonUtilities.CLIENT_PROPERTIES.MB_ENABLE_SECURE_MESSAGE.toUpperCase() === "FALSE");
			if(isPriorityMessagesNotAvailable){
				messageManager.priorityMessageCount = 0;
			}
    
      },function(){});
      var notificationManager = applicationManager.getAlertsManager();
      notificationManager.getUnreadNotificationCount(function(){},function(){});
    }
    // NOTE: Following should be uncommented if later Engage MicroApp is available.
    // if (configurationManager.isEngageEnabled()) {
    //   applicationManager.getEngageManager().onSuccessfulLogin();
    // }
    var params = {"userName" : main_user};
    configurationManager.setEntitlements(features);
    configurationManager.rearrangeHamburgerAccordingToEntitements();
    scope_AuthPresenter.fetchEntitlementsForUserSuccess();    
    //     userPreferencesManager.fetchEntitlementsForUser(
    //       params,
    //       scope_AuthPresenter.fetchEntitlementsForUserSuccess,
    //       scope_AuthPresenter.fetchEntitlementsForUserError
    //     );
    userPreferencesManager.showPasswordResetWarning(
      params,
      scope_AuthPresenter.showPasswordResetWarningSuccess,
      scope_AuthPresenter.showPasswordResetWarningError
    );
	scope_AuthPresenter.asyncManager.setSuccessStatus(6, {});
    scope_AuthPresenter.asyncManager.setSuccessStatus(3, {});
    scope_AuthPresenter.asyncManager.setSuccessStatus(4, {});
    scope_AuthPresenter.asyncManager.setSuccessStatus(8, {});
    if (scope_AuthPresenter.asyncManager.areAllservicesDone(scope_AuthPresenter.numberOfAsyncForLogin)) {
      scope_AuthPresenter.postLoginServicesSuccess();
    }
    const locale = configurationManager.getLocale();
    const termsAndConditions = configurationManager.getTermsAndConditions();
    let params2 = {
      "languageCode": termsAndConditions[locale],
      "termsAndConditionsCode": termsAndConditions["Login"]
    };
    const tncManager = applicationManager.getTermsAndConditionsManager();
    const isAboutUsMAPresent = configManager.isMicroAppPresent('AboutUsMA');
    if(isAboutUsMAPresent){
      tncManager.fetchTermsAndConditionsPostLogin(
        params2,
        scope_AuthPresenter.termsAndConditionSuccessCallback,
        scope_AuthPresenter.termsAndConditionErrorCallback
      );
    }
  };
  Auth_PresentationController.prototype.showPasswordResetWarningSuccess = function(response){
    scope_AuthPresenter.asyncManager.setSuccessStatus(1, response);
    if (scope_AuthPresenter.asyncManager.areAllservicesDone(scope_AuthPresenter.numberOfAsyncForLogin)) {
      scope_AuthPresenter.postLoginServicesSuccess();
    }
  };
  Auth_PresentationController.prototype.showPasswordResetWarningError = function(response){
    scope_AuthPresenter.asyncManager.setErrorStatus(1, response);
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    if (response["isServerUnreachable"]){
      applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", response);
    }
  };
  Auth_PresentationController.prototype.fetchEntitlementsForUserSuccess = function(){
    //   scope_AuthPresenter.asyncManager.setSuccessStatus(6, response);
    const configManager = applicationManager.getConfigurationManager();
    let isBillPayAvailable = true;
    let isTransfersAvailable = true;
    let quickActionItems = JSON.parse(JSON.stringify(configManager.quickActionItems));
    if(configManager.getConfigurationValue("isBillPayEnabled") !== "true"){
      quickActionItems.splice(1,1);
      isBillPayAvailable = false;
    }
    if ((configManager.getConfigurationValue("isKonyBankAccountsTransfer") !== "true" &&
         configManager.getConfigurationValue("isOtherKonyAccountsTransfer") !== "true" &&
         configManager.getConfigurationValue("isOtherBankAccountsTransfer") !== "true" &&
         configManager.getConfigurationValue("isInternationalAccountsTransfer") !== "true"
        ) || configManager.getDeploymentGeography() === "EUROPE") {
      if (isBillPayAvailable) {
        quickActionItems.splice(2, 1);
      } else {
        quickActionItems.splice(1, 1);
      }
      isTransfersAvailable = false;
    }
    if (configManager.getConfigurationValue("isRDCEnabled") !== "true") {
      if (isBillPayAvailable && isTransfersAvailable) {
        quickActionItems.splice(3, 1);
      } else if ((!isBillPayAvailable && isTransfersAvailable) || (isBillPayAvailable && !isTransfersAvailable)) {
        quickActionItems.splice(2, 1);
      } else {
        quickActionItems.splice(1, 1);
      }
    }
    let actionSet = kony.forcetouch.setQuickActionItems(quickActionItems);
    //     if (scope_AuthPresenter.asyncManager.areAllservicesDone(scope_AuthPresenter.numberOfAsyncForLogin)) {
    //       scope_AuthPresenter.postLoginServicesSuccess();
    //     }
  };
  Auth_PresentationController.prototype.fetchEntitlementsForUserError = function(response){
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    scope_AuthPresenter.asyncManager.setErrorStatus(6, response);
  };
  Auth_PresentationController.prototype.fetchExternalBanksAndAccounts = function(user_id) {
    var navManager = applicationManager.getNavigationManager();
    scope_AuthPresenter.asyncManager.setSuccessStatus(5, []);
    navManager.setCustomInfo("frmDashboardAggregated", { accountData: [] });
    if (scope_AuthPresenter.asyncManager.areAllservicesDone(scope_AuthPresenter.numberOfAsyncForLogin)){
      scope_AuthPresenter.postLoginServicesSuccess();
    }
  };
  Auth_PresentationController.prototype.getDeviceRegistrationStatus = function() {
    const registrationManager = applicationManager.getRegistrationManager();
    const userPrefManager = applicationManager.getUserPreferencesManager();
    let userName = userPrefManager.getUserName();
    let criteria = kony.mvc.Expression.eq("UserName", userName);
    registrationManager.fetchDevRegistrationStatus(
      criteria,
      scope_AuthPresenter.presentationDeviceRegistrationSuccess,
      scope_AuthPresenter.presentationDeviceRegistrationError
    );
  };
  Auth_PresentationController.prototype.checkDeviceRegistrationStatus = function() {
    applicationManager.getPresentationUtility().showLoadingScreen();
    const registrationManager = applicationManager.getRegistrationManager();
    const userPrefManager = applicationManager.getUserPreferencesManager();
    let userName = userPrefManager.getUserName();
    let criteria = kony.mvc.Expression.eq("UserName", userName);
    registrationManager.fetchDeviceRegistrationStatus(
      criteria,
      scope_AuthPresenter.presentationCheckDeviceRegistrationSuccess,
      scope_AuthPresenter.presentationCheckDeviceRegistrationError
    );
  };
  Auth_PresentationController.prototype.postLoginServicesSuccess = function(){
    if(scope_AuthPresenter.isTnCRequire === true) {
      const navManager = applicationManager.getNavigationManager();
      let response = scope_AuthPresenter.tncResponse;
      navManager.setCustomInfo("frmTermsAndCondition", {
        content: response.termsAndConditionsContent,
        serviceKey: response.serviceKey,
        flowType: "Login",
        contentTypeID: response.contentTypeId,
      });
      navManager.navigateTo("TermsAndConditionsUIModule/frmTermsAndCondition");
    } else {      
      scope_AuthPresenter.navigationAfterLogin();
    }
  };
  Auth_PresentationController.prototype.navigationAfterLogin = function() {
    const configManager = applicationManager.getConfigurationManager();
    const isHomepageMAPresent = configManager.isMicroAppPresent('HomepageMA');
   
    
   if(isHomepageMAPresent ){
      const dashboard = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "AccountsUIModule",
        "appName": "HomepageMA"
      });
      dashboard.presentationController.showDashboard();
      if(applicationManager.getConfigurationManager().isMicroAppPresent(applicationManager.getConfigurationManager().microappConstants.CAMPAIGN)){
        scope_AuthPresenter.fetchPostloginAds();
      }
    } else {
//       scope_AuthPresenter.navigateToMicroApp({ 
//         appName:"DummyMA", 
//         friendlyName:"DummyModule/frmDummy" 
//       });
    }
    const initiateMonolithicAppFlow = false;
    if(initiateMonolithicAppFlow){
      const userPrefManager = applicationManager.getUserPreferencesManager();
      const navManager = applicationManager.getNavigationManager();
      if(scope_AuthPresenter.isMFARequired === false){
        scope_AuthPresenter.goToAccounts();
      } else {
        if (userPrefManager.isRememberMeOn() === false){
          scope_AuthPresenter.goToAccounts();
        } else {
          if (scope_AuthPresenter.rememberdeviceregflag === false) {
            scope_AuthPresenter.goToAccounts();
          } else {
            scope_AuthPresenter.setDeviceRegisterflag(true);          
            let keys = scope_AuthPresenter.getAuthFlags();
            keys.popUpMsg = "";
            navManager.setCustomInfo("frmDevRegLoginType", keys);
            let controller = applicationManager.getPresentationUtility().getController('frmDevRegLoginType', true);
            controller.tempLoginMode = "password";
            navManager.navigateTo("frmDevRegLoginType");          
          }
        }
      }
    }
  };
  Auth_PresentationController.prototype.goToAccounts = function() {
    const MenuHandler =  applicationManager.getMenuHandler();
    const configManager = applicationManager.getConfigurationManager();
    const navManager = applicationManager.getNavigationManager();
    let check = false;
    if (scope_AuthPresenter.asyncManager.areAllservicesDone(scope_AuthPresenter.numberOfAsyncForLogin)){
      if(MenuHandler.forceTouchFlow!==""){
        scope_AuthPresenter.appForceTouchCallBack(MenuHandler.forceTouchFlow);
      } else{
        if (configManager.isAggregatedExternalAccountEnabled()) {
          scope_AuthPresenter.fetchPostloginAds();
        } else {
          var accountObj = applicationManager.getAccountManager();
          var accountData = accountObj.getInternalAccounts();
          var custominfo = navManager.getCustomInfo("frmDashboard");
          if(!custominfo){
            custominfo = {};
          }
          //added to stop showing portfolio accounts on dashboard
          var removePortifolioAccountsData = JSON.parse(JSON.stringify(accountData));
          for(var i = removePortifolioAccountsData.length-1; i >=0; i--){
            if(removePortifolioAccountsData[i].isPortFolioAccount===true){
              removePortifolioAccountsData.splice(i,1);
            }
          }
          if(removePortifolioAccountsData.length==accountData.length) {
            custominfo.accountData = accountData;
          } else {
            custominfo.accountData = removePortifolioAccountsData;
          }            
          navManager.setCustomInfo("frmDashboard", custominfo);
          scope_AuthPresenter.fetchPostloginAds();
        }
      }
    }
  };
  Auth_PresentationController.prototype.defaultLoginToAccounts = function(){
    var MenuHandler =  applicationManager.getMenuHandler();
    var configManager = applicationManager.getConfigurationManager();
    if (scope_AuthPresenter.asyncManager.areAllservicesDone(scope_AuthPresenter.numberOfAsyncForLogin)){
      if(MenuHandler.forceTouchFlow!==""){
        scope_AuthPresenter.appForceTouchCallBack(MenuHandler.forceTouchFlow);
      } else {
        var navManager = applicationManager.getNavigationManager();
        var accountObj = applicationManager.getAccountManager();
        var accountData = "";
        if(configManager.isAggregatedExternalAccountEnabled()){
          scope_AuthPresenter.fetchPostloginAds();
        } else {
          accountData = accountObj.getInternalAccounts();
          var custominfo = navManager.getCustomInfo("frmDashboard");
          if(!custominfo){
            custominfo = {};
          }
          custominfo.accountData = accountData;
          navManager.setCustomInfo("frmDashboard", custominfo);
          scope_AuthPresenter.fetchPostloginAds();
        }
      }
    }
  };
  Auth_PresentationController.prototype.appForceTouchCallBack = function(quickActionItem) {
    const configManager = applicationManager.getConfigurationManager();
    const MenuHandler =  applicationManager.getMenuHandler();
    const navManager = applicationManager.getNavigationManager();
    let msgText = "";
    let isFeatureAvailable = true;
    const presentationUtil = applicationManager.getPresentationUtility();
    if (quickActionItem) {
      if (quickActionItem === "ATM finder") {
        const currentForm = kony.application.getCurrentForm().id;
        const controller = applicationManager.getPresentationUtility().getController(currentForm, true);
        const locateUsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("LocateUsModule");
        var scope = locateUsModule.presentationController;
        kony.runOnMainThread(scope.presentLocateUsView1.bind(scope),[true,currentForm]);
      } else if (quickActionItem === "Pay a Bill") {
        if(configManager.getConfigurationValue("isBillPayEnabled") === "true"){
          const billPayMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("BillPayModule");
          billPayMod.presentationController.fetchToPayees();
          MenuHandler.forceTouchFlow = "";
        } else {
          msgText = presentationUtil.getStringFromi18n("kony.mb.Entitlements.notEntitledForBillPay");
          isFeatureAvailable = false;
        }
      } else if (quickActionItem === "Transfer Money") {
        if(configManager.getConfigurationValue("isKonyBankAccountsTransfer") === "true" || configManager.getConfigurationValue("isOtherKonyAccountsTransfer") === "true" || configManager.getConfigurationValue("isOtherBankAccountsTransfer") === "true" || configManager.getConfigurationValue("isInternationalAccountsTransfer") === "true" ){
          navManager.navigateTo("frmTransactionMode");
          MenuHandler.forceTouchFlow = "";
        } else {
          msgText = presentationUtil.getStringFromi18n("kony.mb.Entitlements.notEntitledForTransfers");
          isFeatureAvailable = false;
        }
      } else if (quickActionItem === "New Check Deposit") {
        if(configManager.getConfigurationValue("isRDCEnabled") === "true"){
          const checkDepositModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("CheckDepositModule");
          checkDepositModule.presentationController.commonFunctionForNavigation("frmDepositToCD");
          MenuHandler.forceTouchFlow = "";
        } else {
          msgText = presentationUtil.getStringFromi18n("kony.mb.Entitlements.notEntitledForCheckDeposit");
          isFeatureAvailable = false;
        }
      } else if (quickActionItem === "Money Movement") {
        const moneyMovementModule = applicationManager.getModulesPresentationController("MoneyMovementModule");
        const entitlements = moneyMovementModule.checkForTransfersModuleEntitlements();
        if((entitlements.isTransfersAvailable==1 || configManager.getConfigurationValue("ispayAPersonEnabled")=="true"  )){
          moneyMovementModule.clearMMFlowAtributes();
          let index = navManager.getFormIndex("frmDashboardAggregated");
          if (!(index && navManager.stack.includes("frmDashboardAggregated"))) {
            navManager.stack.push("frmDashboardAggregated");
            navManager.setFormIndex("frmDashboardAggregated", navManager.stack.length - 1);
          }
          moneyMovementModule.getFromAndToAccounts();
          MenuHandler.forceTouchFlow = "";
        } else {
          msgText = presentationUtil.getStringFromi18n("kony.mb.Entitlements.notEntitledForTransfers");
          isFeatureAvailable = false;
        }
      }
    }
    if(!isFeatureAvailable){
      let custominfo = navManager.getCustomInfo("frmDashboard");
      if(!custominfo){
        custominfo = {};
      }
      custominfo.isNavigationFromQuickAction = true;
      custominfo.quickActionAlertText = msgText;
      navManager.setCustomInfo("frmDashboard",custominfo);
      scope_AuthPresenter.navigateToDashboardFromAds();
    }
  };
  Auth_PresentationController.prototype.presentationUserImageSuccess = function(resSuccess){
    const userPrefManager = applicationManager.getUserPreferencesManager();
    userPrefManager.setUserImage(resSuccess.UserImage);
  };
  Auth_PresentationController.prototype.presentationUserImageError = function(err){
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    if (err["isServerUnreachable"]){
      applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", err);
    }
  };
  Auth_PresentationController.prototype.presentationUserSuccess = function (resUserSucess) {
    if ( 
      null !== resUserSucess && 
      resUserSucess.length !== 0 &&
      null !== resUserSucess[0].isVIPCustomer &&
      resUserSucess[0].isVIPCustomer !== undefined &&
      resUserSucess[0].isVIPCustomer !== ""
    ) {
      let isVIPCustomer = resUserSucess[0].isVIPCustomer;
      let theme = "BlueTheme";
      if (isVIPCustomer === "true" || isVIPCustomer === true) {
        theme = "GoldTheme";
      }
      const navManager = applicationManager.getNavigationManager();
      navManager.setCustomInfo("theme", theme);
      kony.theme.setCurrentTheme(
        theme,
        function onSuccess() {
          kony.print("Theme applied successfully ");
        },
        function onFailure() {
          kony.print(" Error applying theme ");
        }
      );
    }
    const userPreferencesManager = applicationManager.getUserPreferencesManager();
    const configManager = applicationManager.getConfigurationManager();
    const regManager = applicationManager.getRegistrationManager();
    const storageManager = applicationManager.getStorageManager();
    userPreferencesManager.setUserObj(resUserSucess);
    if (resUserSucess != null && resUserSucess.length !== 0) {
      userPreferencesManager.saveUserFirstName(resUserSucess[0].userfirstname);
      userPreferencesManager.saveUserLastName(resUserSucess[0].userlastname);
    }
    scope_AuthPresenter.asyncManager.setSuccessStatus(0, resUserSucess);
    if (scope_AuthPresenter.asyncManager.areAllservicesDone(scope_AuthPresenter.numberOfAsyncForLogin)) {
      scope_AuthPresenter.postLoginServicesSuccess();
    }
    if (storageManager.getStoredItem("registerForPushNotifications")) {
      regManager.deRegisterForPushNotifications();
      regManager.registerForPushNotifications();
    }
  };
  Auth_PresentationController.prototype.presentationUserError = function(resUserError) {
    scope_AuthPresenter.asyncManager.setErrorStatus(0, resUserError);
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    const controller = applicationManager.getPresentationUtility().getController('frmLogin', true);
    if (resUserError["isServerUnreachable"]){
      applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", resUserError);
    } else {
      controller.bindGenericError();
    }      
  };
  Auth_PresentationController.prototype.presentationDeviceRegistrationSuccess = function(resDeviceSuc) {
    var configManager = applicationManager.getConfigurationManager();
    scope_AuthPresenter.asyncManager.setSuccessStatus(1, resDeviceSuc);
    if (resDeviceSuc[0].status !== "false"){
      scope_AuthPresenter.setDeviceRegisterflag(true);
    } else {
      scope_AuthPresenter.setDeviceRegisterflag(false);
    }
    if (scope_AuthPresenter.asyncManager.areAllservicesDone(scope_AuthPresenter.numberOfAsyncForLogin)){
      scope_AuthPresenter.postLoginServicesSuccess();
    }
  };
  Auth_PresentationController.prototype.presentationDeviceRegistrationError = function(resDeviceErr) {
    scope_AuthPresenter.asyncManager.setErrorStatus(1, resDeviceErr);
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    if (resDeviceErr["isServerUnreachable"])
      applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", resDeviceErr);
  };
  Auth_PresentationController.prototype.presentationCheckDeviceRegistrationSuccess = function(resDeviceSuc) {
    const configManager = applicationManager.getConfigurationManager();
    const currentForm = kony.application.getCurrentForm().id;
    const controller = applicationManager.getPresentationUtility().getController(currentForm, true);
    if (resDeviceSuc[0].status !== "false"){
      scope_AuthPresenter.setDeviceRegisterflag(true);
      controller.checkLoginType(true);
    } else {
      scope_AuthPresenter.setDeviceRegisterflag(false);
      controller.checkLoginType(false);
    }
    applicationManager.getPresentationUtility().dismissLoadingScreen();
  };
  Auth_PresentationController.prototype.presentationCheckDeviceRegistrationError = function(resDeviceErr) {
    scope_AuthPresenter.asyncManager.setErrorStatus(1, resDeviceErr);
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    if (resDeviceErr["isServerUnreachable"])
      applicationManager.getPresentationInterruptHandler().showErrorMessage("preLogin", resDeviceErr);
  };
  Auth_PresentationController.prototype.getAuthFlags = function() {    
    const userPrefManager = applicationManager.getUserPreferencesManager();
    const devManager = applicationManager.getDeviceUtilManager();
    let keys = {};
    keys.isPinEnabled = userPrefManager.isAppLoginPinSet();
    keys.isPinModeEnabled = userPrefManager.isPinModeEnabled();
    keys.isTouchIdEnabled = userPrefManager.isTouchIdEnabled();
    keys.isRememberMeOn = userPrefManager.isRememberMeOn();
    keys.isTouchIdSupported = devManager.isTouchIDSupported();
    keys.isFaceIdSupported = devManager.isFaceIdSupported();
    keys.isFaceIdAvailable = devManager.isFaceIdAvilable();
    keys.isDeviceregistered = userPrefManager.isDeviceRegistered();
    keys.defaultAuthMode = userPrefManager.getDefaultAuthMode();
    return keys;
  };
  Auth_PresentationController.prototype.isappInitDone = function(){
    const isAppInitDone = scope_AuthPresenter.checkAppinit === true ? true : false;
    return isAppInitDone;
  };
  Auth_PresentationController.prototype.updateDeviceRegistration = function() {
    applicationManager.getPresentationUtility().showLoadingScreen();
    const registrationManager = applicationManager.getRegistrationManager();
    const deviceUtilManager = applicationManager.getDeviceUtilManager();
    var record = {
      "deviceId": deviceUtilManager.getDeviceInfo().deviceID
    };
    registrationManager.updateDeviceRegistrationStatus(record, scope_AuthPresenter.presentationDeviceSuccess, scope_AuthPresenter.presentationDeviceError);
  };
  Auth_PresentationController.prototype.presentationDeviceSuccess = function(res) {
    scope_AuthPresenter.setDeviceRegisterflag(true);
    let keys = scope_AuthPresenter.getAuthFlags();
    keys.popUpMsg = kony.i18n.getLocalizedString("kony.mb.Device.Registration.Successful");
    const navManager = applicationManager.getNavigationManager();
    navManager.setCustomInfo("frmDevRegLoginType", keys);
    const controller = applicationManager.getPresentationUtility().getController('frmDevRegLoginType', true);
    controller.tempLoginMode = "password";
    navManager.navigateTo("frmDevRegLoginType");
  };
  Auth_PresentationController.prototype.presentationDeviceError = function(err) {
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    if(err.serverErrorRes.opstatus === 20004){
      scope_AuthPresenter.setDeviceRegisterflag(true);
      let keys = scope_AuthPresenter.getAuthFlags();
      keys.popUpMsg = kony.i18n.getLocalizedString("kony.mb.Device.Registration.Successful");
      const navManager = applicationManager.getNavigationManager();
      navManager.setCustomInfo("frmDevRegLoginType", keys);
      const controller = applicationManager.getPresentationUtility().getController('frmDevRegLoginType', true);
      controller.tempLoginMode = "password";
      navManager.navigateTo("frmDevRegLoginType");
    } else {
      scope_AuthPresenter.logger.log(err);
      if (err["isServerUnreachable"]){
        applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", err);
      }
    }
  };
  Auth_PresentationController.prototype.setDefaultMode = function(authMode) {
    var userPrefManager = applicationManager.getUserPreferencesManager();
    userPrefManager.setDefaultAuthMode(authMode);
  };
  Auth_PresentationController.prototype.setTouchIdflag = function(value) {
    var userManager = applicationManager.getUserPreferencesManager();
    userManager.upadateTouchIdFlag(value);
  };
  Auth_PresentationController.prototype.setFaceIdflag = function(value) {
    var userManager = applicationManager.getUserPreferencesManager();
    userManager.updateFaceIdFlag(value);
  };
  Auth_PresentationController.prototype.setPinflag = function(value) {
    var userManager = applicationManager.getUserPreferencesManager();
    userManager.updatePinFlag(value);
  };
  Auth_PresentationController.prototype.setAccountPreviewFlag = function(value) {
    var userManager = applicationManager.getUserPreferencesManager();
    userManager.updateAccountPreviewFlag(value);
  };
  Auth_PresentationController.prototype.setRememberMeFlag = function(value) {
    var userManager = applicationManager.getUserPreferencesManager();
    userManager.updateRememberMeFlag(value);
  };
  Auth_PresentationController.prototype.setDeviceRegisterflag = function(value) {
    var userManager = applicationManager.getUserPreferencesManager();
    userManager.updateDeviceRegisterFlag(value);
  };
  Auth_PresentationController.prototype.setLoginFeaturesOff = function(){
    const userManager = applicationManager.getUserPreferencesManager();
    userManager.updateRememberMeFlag(false);
    userManager.setDefaultAuthMode("password");
    userManager.updateAccountPreviewFlag(false);
    userManager.upadateTouchIdFlag(false);
    userManager.updateFaceIdFlag(false);
    userManager.updatePinFlag(false);
    userManager.clearUserCredentials();
    applicationManager.getDataforLogin();
  };
  Auth_PresentationController.prototype.showAccountPreview = function() {
    applicationManager.getPresentationUtility().showLoadingScreen();
    const userPrefManager = applicationManager.getUserPreferencesManager();
    const accountManager = applicationManager.getAccountManager();
    if (userPrefManager.isAccountPreviewEnabled()) {
      let userName = userPrefManager.getUserName();
      let authParamKey = applicationManager.getDeviceUtilManager().getDeviceInfo().deviceID;
      let criteria = kony.mvc.Expression.and(
        kony.mvc.Expression.eq("userName", userName),
        kony.mvc.Expression.eq("deviceID", authParamKey)
      );      
      function accountPreviewSuccess(res) {
        let accPreviewData = res;
        let availableBal = 0;
        let currBal = 0;
        let outstandingBal = 0;
        const configManager = applicationManager.getConfigurationManager();
        const fotmatUtilManager = applicationManager.getFormatUtilManager();
        for (let i = 0; i < accPreviewData.length; i++) {
          let accountType = accPreviewData[i]["accountType"];
          if (accPreviewData[i]["availableBalance"])
            accPreviewData[i]["availableBalance"] = configManager.getCurrencyCode() + fotmatUtilManager.formatAmount((accPreviewData[i]["availableBalance"]),",");
          if (accPreviewData[i]["currentBalance"])
            accPreviewData[i]["currentBalance"] = configManager.getCurrencyCode() + fotmatUtilManager.formatAmount((accPreviewData[i]["currentBalance"]),",");
          if (accPreviewData[i]["outstandingBalance"])
            accPreviewData[i]["outstandingBalance"] = configManager.getCurrencyCode() + fotmatUtilManager.formatAmount((accPreviewData[i]["outstandingBalance"]),",");
          //                     if (accPreviewData[i]["accountType"] == "CreditCard")
          //                         accPreviewData[i]["outstandingBalance"] = "-" + currBal;
          if (accountType === configManager.constants.CHECKING) {
            accPreviewData[i]["accountType"] = applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.accdetails.availBal");
          } else if (accountType === configManager.constants.SAVINGS) {
            accPreviewData[i]["accountType"] = applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.accdetails.availBal");
          } else if (accountType === configManager.constants.CREDITCARD) {
            accPreviewData[i]["availableBalance"] = accPreviewData[i]["outstandingBalance"];
            accPreviewData[i]["accountType"] = applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.accdetails.outstandingBal");
          } else if (accountType === configManager.constants.DEPOSIT) {
            accPreviewData[i]["availableBalance"] = accPreviewData[i]["currentBalance"];
            accPreviewData[i]["accountType"] = applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.accdetails.currBal");
          } else if (accountType === configManager.constants.MORTGAGE) {
            accPreviewData[i]["accountType"] = applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.accdetails.outstandingBal");
          } else if (accountType === configManager.constants.LOAN) {
            accPreviewData[i]["availableBalance"] = accPreviewData[i]["outstandingBalance"];
            accPreviewData[i]["accountType"] = applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.accdetails.outstandingBal");
          }
          accPreviewData[i]["bankImg"] = "konybanklogo.png";
          accPreviewData[i]["account_type_name"] = accountType;
        }
        const controller = applicationManager.getPresentationUtility().getController('frmLogin', true);        
        let acctPreviewTimeStamp = fotmatUtilManager.getTimeStamp();
        controller.bindAccountPreViewData(accPreviewData, acctPreviewTimeStamp);
        applicationManager.getPresentationUtility().dismissLoadingScreen();
      }
      function accountPreviewError(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        const controller = applicationManager.getPresentationUtility().getController('frmLogin', true);
        if (err["isServerUnreachable"]){
          applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", err);
        } else {
          controller.bindGenericError(err.errorMessage);
        }
      }
      accountManager.fetchInternalAccountsPreLogin(criteria, accountPreviewSuccess, accountPreviewError);
    } else {
      const controller = applicationManager.getPresentationUtility().getController('frmLogin', true);
      controller.bindGenericError(applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.Please.enable.Account.Preview"));
    }
  };
  Auth_PresentationController.prototype.enablePin = function(pin) {
    applicationManager.getPresentationUtility().showLoadingScreen();
    function createPinSuccess(success) {
      applicationManager.getPresentationUtility().dismissLoadingScreen();
      var navManager = applicationManager.getNavigationManager();
      var userManager = applicationManager.getUserPreferencesManager();
      scope_AuthPresenter.setPinflag(true);
      userManager.getUserObj().isPinSet = "true";
      if (scope_AuthPresenter.flowType === "login"){
        var keys = scope_AuthPresenter.getAuthFlags();
        keys.popUpMsg = "";
        navManager.setCustomInfo("frmDevRegLoginType", keys);
        var msgData = {popUpMsg:"Login PIN has been set successfully."};
        navManager.setCustomInfo("frmDevRegPinConfirmation",msgData) ;
        navManager.navigateTo("frmDevRegPinConfirmation");
      } else {
        var tempData = scope_AuthPresenter.getAuthFlags();
        navManager.setCustomInfo("frmPreferencesDefaultLogin",tempData);
        var msgData = {popUpMsg:"Login PIN has been set successfully."};
        navManager.setCustomInfo("frmPreferencesPin",msgData) ;
        navManager.navigateTo({"appName" : "ManageProfileMA", "friendlyName" : "frmPreferencesPin"});
      }
      scope_AuthPresenter.flowType = "";
    }
    function createPinError(err) {
      if (err["isServerUnreachable"]){
        applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", err);
      } else {
        kony.ui.Alert(err.errorMessage);
      }        
    }
    var userPreferencesManager = applicationManager.getUserPreferencesManager();
    userPreferencesManager.setAppLoginPin(pin);
    createPinSuccess();
    //userPreferencesManager.createPin(pin, createPinSuccess, createPinError);
  };
  Auth_PresentationController.prototype.navigateToSSN = function(lastName) {
    scope_AuthPresenter.authManger.setForgotAttribute("userlastname",lastName);
    scope_AuthPresenter.commonFunctionForNavigation("frmForgotEnterSSN");
  };
  Auth_PresentationController.prototype.validateSSN = function(SSN) {
    const validationManager = applicationManager.getValidationUtilManager();
    let res = validationManager.isValidSSNNumber(SSN);
    if (res === true) {
      scope_AuthPresenter.authManger.setForgotAttribute("ssn",SSN);
      scope_AuthPresenter.commonFunctionForNavigation("frmForgotEnterDOB");
    } else {
      const controller = applicationManager.getPresentationUtility().getController('frmForgotEnterSSN', true);
      controller.bindViewError(applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.enroll.enterSSN"));
    }
  };
  Auth_PresentationController.prototype.validateDOB = function(dob) {
    const validationManager = applicationManager.getValidationUtilManager();
    let res = validationManager.isDOBValid(dob);
    if (res === true) {
      scope_AuthPresenter.authManger.setForgotAttribute("dateOfBirth",dob);
      let fetchUserNameJSON = scope_AuthPresenter.authManger.getForgotObject();
      scope_AuthPresenter.authManger.fetchUserName(
        fetchUserNameJSON,
        scope_AuthPresenter.presentationUserFetchSuccess,
        scope_AuthPresenter.presentationUserFetchError
      );
    } else {
      const controller = applicationManager.getPresentationUtility().getController('frmForgotEnterDOB', true);
      controller.bindViewError(applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.validDOB"));
    }
  };
  Auth_PresentationController.prototype.presentationUserFetchSuccess = function(res) {
    var username = res[0].userName;
    var data = {"UserName": username};
    scope_AuthPresenter.authManger.setPrimarykeyAttribute(data);
    scope_AuthPresenter.commonFunctionForNavigation("frmForgotMain");
  };
  Auth_PresentationController.prototype.presentationUserFetchError = function(err) {
    scope_AuthPresenter.logger.log("####Error while Fetching user : Forgot username flow");
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    if (err["isServerUnreachable"]){
      applicationManager.getPresentationInterruptHandler().showErrorMessage("preLogin", err);
    } else {
      const controller = applicationManager.getPresentationUtility().getController('frmForgotEnterLastName', true);
      controller.bindViewError(applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.enroll.usernameUnavailableMsg"));
    }
  };
  Auth_PresentationController.prototype.forgotNavigation = function(usernameTxtBoxValue) {
    if (usernameTxtBoxValue === '' || usernameTxtBoxValue === null || usernameTxtBoxValue === undefined) {
      scope_AuthPresenter.clearForgotObject();
      scope_AuthPresenter.commonFunctionForNavigation("frmForgotEnterLastName");
    } else {
      var usernameFromForgotUsername = scope_AuthPresenter.authManger.getForgotObject().UserName;
      if (usernameFromForgotUsername === '' || usernameFromForgotUsername === null || usernameFromForgotUsername === undefined) {
        scope_AuthPresenter.clearForgotObject();
        scope_AuthPresenter.commonFunctionForNavigation("frmForgotEnterLastName");
      } else {
        if (usernameTxtBoxValue === usernameFromForgotUsername) {
          scope_AuthPresenter.commonFunctionForNavigation("frmForgotSelectMethod");
        } else {
          scope_AuthPresenter.clearForgotObject();
          scope_AuthPresenter.commonFunctionForNavigation("frmForgotEnterLastName");
        }
      }
    }
    applicationManager.getPresentationUtility().dismissLoadingScreen();
  };
  Auth_PresentationController.prototype.forgotNavigationNew = function(enteredUserName){
    scope_AuthPresenter.commonFunctionForNavigation("frmForgotEnterEmailID");
  };
    Auth_PresentationController.prototype.navigateToLogin = function(UserName) {
      var navManager = applicationManager.getNavigationManager();
      var loginData = navManager.getCustomInfo("frmLogin");
      if (UserName && UserName !== undefined && UserName !== "") {
        loginData.usernameFromForgotUsername = UserName;
      }
      else
      {
        loginData.usernameFromForgotUsername = "";
        scope_AuthPresenter.clearForgotObject();
      }
      navManager.setCustomInfo("frmLogin", loginData);
      applicationManager.getPresentationUtility().dismissLoadingScreen();
      scope_AuthPresenter.commonFunctionForNavigation("frmLogin");
    };
    Auth_PresentationController.prototype.navigateToLoginAfterPasswordUpdate = function(UserName) {
        var navManager = applicationManager.getNavigationManager();
        if (UserName && UserName !== undefined && UserName !== "") {
            var loginData = navManager.getCustomInfo("frmLogin");
            loginData.usernameFromForgotUsername = UserName;
            loginData.showPasswordUpdatedSuccessMessage = true;
            navManager.setCustomInfo("frmLogin", loginData);
        }
		applicationManager.getPresentationUtility().dismissLoadingScreen();
        scope_AuthPresenter.commonFunctionForNavigation("frmLogin");
    };
    Auth_PresentationController.prototype.commonFunctionForNavigation = function(formName) {
        var navManager = applicationManager.getNavigationManager();
        navManager.navigateTo(formName);
    };
    Auth_PresentationController.prototype.navigateToCVV = function() {
        var username =  scope_AuthPresenter.authManger.getForgotObject().UserName;
        const authDependentManager = scope_AuthPresenter.getAuthDependentManager();
        authDependentManager.fetchAllCardsWithUsername(username, scope_AuthPresenter.presentationCardsFetchSuccess, scope_AuthPresenter.presentationCardsFetchError);
    };
    Auth_PresentationController.prototype.presentationCardsFetchSuccess = function(res) {
        var cardsData = res;
        if(cardsData.length >0)
          {
            scope_AuthPresenter.cardsDataForCvv = cardsData;
            scope_AuthPresenter.commonFunctionForNavigation("frmForgotEnterCVV");
          }
       else
         {
           var controller = applicationManager.getPresentationUtility().getController('frmForgotSelectMethod', true);
           var errormsg = applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.forgot.noCardsAvailable");
           controller.bindGenericError(errormsg);
         }
    };
    Auth_PresentationController.prototype.presentationCardsFetchError = function(err) {
        scope_AuthPresenter.logger.log("####Error while Fetching cards : Forgot username/password flow");
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        if (err["isServerUnreachable"])
          {
               applicationManager.getPresentationInterruptHandler().showErrorMessage("preLogin", err);
          }
        else
          {
            scope_AuthPresenter.logger.log("error finding cards");
          }
    };
    Auth_PresentationController.prototype.requestOTP = function() {
        var requestOTPJSON = scope_AuthPresenter.authManger.getForgotObject();
        scope_AuthPresenter.authManger.fetchOTP(requestOTPJSON, scope_AuthPresenter.presentationOtpRequestSuccess, scope_AuthPresenter.presentationOtpRequestError);
    };
    Auth_PresentationController.prototype.presentationOtpRequestSuccess = function(resSuccess) {
        var otp = resSuccess.otp;
        scope_AuthPresenter.commonFunctionForNavigation("frmForgotEnterSecurityCode");
    };
    Auth_PresentationController.prototype.presentationOtpRequestError = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        scope_AuthPresenter.logger.log("####Error while requesting OTP : Forgot username flow");
        if (err["isServerUnreachable"])
               applicationManager.getPresentationInterruptHandler().showErrorMessage("preLogin", err);
    };
    Auth_PresentationController.prototype.validateCVV = function(cvv, cardNumber) {
        var validationUtilManager = applicationManager.getValidationUtilManager();
        if (validationUtilManager.isValidCVV(cvv)) {
            scope_AuthPresenter.authManger.setForgotAttribute("cvv",cvv);
            scope_AuthPresenter.authManger.setForgotAttribute("cardNumber",cardNumber);
			 scope_AuthPresenter.asyncManager.initiateAsyncProcess(2);
			scope_AuthPresenter.getPasswordRulesAndPolicy(scope_AuthPresenter.getPasswordRulesAndPolicySuccessCallback,scope_AuthPresenter.getPasswordRulesAndPolicyErrorCallback);
            var verifyCVVJSon = scope_AuthPresenter.authManger.getForgotObject();
           scope_AuthPresenter.authManger.verifyCVV(verifyCVVJSon, scope_AuthPresenter.presentationCvvValidationSuccess, scope_AuthPresenter.presentationCvvValidationError);
        } else {
            applicationManager.getPresentationUtility().dismissLoadingScreen();
            var controller = applicationManager.getPresentationUtility().getController('frmForgotEnterCVV', true);
            var errormsg = applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.enterCVV");
            controller.bindGenericError(errormsg);
        }
    };
    Auth_PresentationController.prototype.presentationCvvValidationSuccess = function(resSuccess) {
		scope_AuthPresenter.asyncManager.setSuccessStatus(0, resSuccess);
        if (scope_AuthPresenter.asyncManager.areAllservicesDone(2)) {
            var navManager = applicationManager.getNavigationManager();
			var data = navManager.getCustomInfo("frmForgotCreatePassword");
			res = scope_AuthPresenter.asyncManager.getData(1);
		if(data && data!==null){
		data.passwordPolicy = res.passwordpolicy.content;
		}
		else{
      data = {"passwordPolicy":res.passwordpolicy.content};
		}
		navManager.setCustomInfo("frmForgotCreatePassword",data);
		var validationUtility = applicationManager.getValidationUtilManager();
		validationUtility.createRegexForPasswordValidation(res.passwordrules);
       scope_AuthPresenter.commonFunctionForNavigation("frmForgotCreatePassword");
		}
    };
    Auth_PresentationController.prototype.presentationCvvValidationError = function(err) {
		 scope_AuthPresenter.asyncManager.setErrorStatus(0, err);
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        scope_AuthPresenter.logger.log("####Error while validating cvv : Forgot username flow");
        if (err["isServerUnreachable"])
          {
               applicationManager.getPresentationInterruptHandler().showErrorMessage("preLogin", err);
          }
        else
          {
            var controller = applicationManager.getPresentationUtility().getController('frmForgotEnterCVV', true);
            var errorMsg = applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.invalidCVV");
            controller.bindGenericError(errorMsg);
          }
    };
    Auth_PresentationController.prototype.resendOTP = function() {
        var requestOTPJSON = scope_AuthPresenter.authManger.getForgotObject();
        scope_AuthPresenter.authManger.fetchOTP(requestOTPJSON, scope_AuthPresenter.presentationOtpResendSuccess, scope_AuthPresenter.presentationOtpResendError);
    };
    Auth_PresentationController.prototype.presentationOtpResendSuccess = function(resSuccess) {
        var otp = resSuccess.otp;
        var controller = applicationManager.getPresentationUtility().getController('frmForgotEnterSecurityCode', true);
        controller.onResendOTP();
    };
    Auth_PresentationController.prototype.presentationOtpResendError = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        scope_AuthPresenter.logger.log("####Error while resending otp : Forgot username flow");
         if (err["isServerUnreachable"])
          {
            applicationManager.getPresentationInterruptHandler().showErrorMessage("preLogin", err);
          }
        else
          {
            var controller = applicationManager.getPresentationUtility().getController('frmForgotEnterSecurityCode', true);
        	var errorMsg = applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.enroll.enterValidOTP");
        	controller.bindGenericError(errorMsg);
          }
    };
    Auth_PresentationController.prototype.validateOTP = function(otp) {
        var validationUtilManager = applicationManager.getValidationUtilManager();
        if (validationUtilManager.isValidOTP(otp)) {
            scope_AuthPresenter.authManger.setForgotAttribute("Otp",otp);
            var verifyOTPJSON = scope_AuthPresenter.authManger.getForgotObject();
			 scope_AuthPresenter.asyncManager.initiateAsyncProcess(2);
			scope_AuthPresenter.getPasswordRulesAndPolicy(scope_AuthPresenter.getPasswordRulesAndPolicySuccessCallback,scope_AuthPresenter.getPasswordRulesAndPolicyErrorCallback);
            scope_AuthPresenter.authManger.verifyOTP(verifyOTPJSON, scope_AuthPresenter.presentationOtpValidationSuccess, scope_AuthPresenter.presentationOtpValidationError);
        } else {
            applicationManager.getPresentationUtility().dismissLoadingScreen();
            var controller = applicationManager.getPresentationUtility().getController('frmForgotEnterSecurityCode', true);
            var errormsg = applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.enterSecurityCode");
            controller.bindGenericError(errormsg);
        }
    };
    Auth_PresentationController.prototype.presentationOtpValidationSuccess = function(resSuccess) {
		scope_AuthPresenter.asyncManager.setSuccessStatus(0, resSuccess);
        if (scope_AuthPresenter.asyncManager.areAllservicesDone(2)) {
           var navManager = applicationManager.getNavigationManager();
		var data = navManager.getCustomInfo("frmForgotCreatePassword");
		res = scope_AuthPresenter.asyncManager.getData(1);
    if(data && data!==null){
      data.passwordPolicy = res.passwordpolicy.content;
    }
    else{
      data = {"passwordPolicy":res.passwordpolicy.content};
    }
    navManager.setCustomInfo("frmForgotCreatePassword",data);
    var validationUtility = applicationManager.getValidationUtilManager();
    validationUtility.createRegexForPasswordValidation(res.passwordrules);
        scope_AuthPresenter.commonFunctionForNavigation("frmForgotCreatePassword");
		}
    };
    Auth_PresentationController.prototype.presentationOtpValidationError = function(err) {
		 scope_AuthPresenter.asyncManager.setErrorStatus(0, err);
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        if (err["isServerUnreachable"])
          {
            applicationManager.getPresentationInterruptHandler().showErrorMessage("preLogin", err);
          }
        else
          {
            var controller = applicationManager.getPresentationUtility().getController('frmForgotEnterSecurityCode', true);
        	var errorMsg = applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.invalidSecurityCode");
        	controller.bindGenericError(errorMsg);
          }
    };
    Auth_PresentationController.prototype.validatePassword = function(password) {
        var validationUtilManager = applicationManager.getValidationUtilManager();
        var controller = applicationManager.getPresentationUtility().getController('frmForgotCreatePassword', true);
        if (!validationUtilManager.isPasswordValidForPolicy(password)) {
            controller.showFlxSecurityRequirements();
        }
      else
        {
          controller.passwordValid();
        }
    };
  Auth_PresentationController.prototype.updatePassword = function(newPassword) {
        scope_AuthPresenter.authManger.setForgotAttribute("Password",newPassword);
        var resetPasswordJSON = {
			"serviceKey":  scope_AuthPresenter.authManger.getServicekey(),
			"UserName":  scope_AuthPresenter.authManger.getUserName(),
			"Password": newPassword
        };
        scope_AuthPresenter.authManger.resetPassword(resetPasswordJSON, scope_AuthPresenter.presentationUpdatePasswordSuccess, scope_AuthPresenter.presentationUpdatePasswordError);
    };
    Auth_PresentationController.prototype.presentationUpdatePasswordSuccess = function(resSuccess) {
        var username =  scope_AuthPresenter.authManger.getForgotObject().UserName;
        scope_AuthPresenter.clearForgotObject();
        scope_AuthPresenter.navigateToLoginAfterPasswordUpdate(scope_AuthPresenter.authManger.getUserName());
    };
    Auth_PresentationController.prototype.presentationUpdatePasswordError = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        if (err["isServerUnreachable"])
          {
            applicationManager.getPresentationInterruptHandler().showErrorMessage("preLogin", err);
          }
      else
        {
           var controller = applicationManager.getPresentationUtility().getController('frmForgotCreatePassword', true);
            controller.bindGenericError(err.errorMessage);
        }
    };
    Auth_PresentationController.prototype.clearForgotObject = function(){
      scope_AuthPresenter.authManger.clearForgotObject();
    };
    Auth_PresentationController.prototype.getForgotObjectForView = function(){
    var forgotObjView = JSON.parse(JSON.stringify(scope_AuthPresenter.authManger.getForgotObject()));
    forgotObjView.cardsData =  scope_AuthPresenter.cardsDataForCvv;
    return forgotObjView;
  };
    Auth_PresentationController.prototype.onPinLogin = function(pin) {
        applicationManager.getPresentationUtility().showLoadingScreen();
        var userMan = applicationManager.getUserPreferencesManager();
        var userName = userMan.getUserName();
        var pinId = pin;
        var deviceUtilManager = applicationManager.getDeviceUtilManager();
        var deviceID = deviceUtilManager.getDeviceInfo().deviceID;
        var data = {
            "UserName": userName,
            "pin": pin,
            "deviceId": deviceID
        };
        var authManger = applicationManager.getAuthManager();
        authManger.pinLogin(data, this.presentationLoginSuccess, this.presentationPinLoginError);
    };
    Auth_PresentationController.prototype.presentationPinLoginError = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
		 if (err.errmsg["isServerUnreachable"])
               applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", err.errmsg);
		 else
         {  var controller = applicationManager.getPresentationUtility().getController('frmLogin', true);
           controller.bindPinError(kony.i18n.getLocalizedString("kony.mb.Please.enter.a.valild.pin"));
         }
   };
 Auth_PresentationController.prototype.saveUserCredentialsOfExternalBank = function(username, password, sessionToken, mainUser, bankId, successCallback, errorCallback) {
      var loggerManager = applicationManager.getLoggerManager();
      loggerManager.log("----Start Auth_PresentationController.prototype.saveUserCredentialsOfExternalBank----");
      try {
          var authManager = applicationManager.getAuthManager();
          authManager.addExternalBankCredentials(username, password, sessionToken, mainUser, bankId, successCallback, errorCallback);
      } catch(err) {
          loggerManager.log("Error in saveUserCredentialsOfExternalBank");
      }
      loggerManager.log("----Start Auth_PresentationController.prototype.saveUserCredentialsOfExternalBank----");
  };
  Auth_PresentationController.prototype.authenticateUserInExternalBank = function(UserInfoJSON, successCallback, errorCallback){
    var self = this;
    var loggerManager = applicationManager.getLoggerManager();
    applicationManager.getPresentationUtility().showLoadingScreen();
    var validationManager = applicationManager.getValidationUtilManager();
    var authManger = applicationManager.getAuthManager();
    authManger.loginExternalBank(UserInfoJSON, successCallback, errorCallback);
  };
  Auth_PresentationController.prototype.launchExternalBankLogin = function(selectedItem) {
      var loggerManager = applicationManager.getLoggerManager();
      loggerManager.log("----Start Auth_PresentationController.prototype.launchExternalBankLogin----");
      try {
          if(selectedItem === null || selectedItem === undefined) {
              throw "Invalid params: selectedItem";
          }
          var navigationManager = applicationManager.getNavigationManager();
          navigationManager.setCustomInfo("frmExternalBankLogin", {
              "identityProvider" : selectedItem.identityProvider,
              "logo": selectedItem.logo,
              "isOauth2": selectedItem.isOauth2,
              "bankName": selectedItem.bankName,
              "bankId": selectedItem.bankId
          });
          navigationManager.navigateTo("frmExternalBankLogin");
      } catch(err) {
          loggerManager.log("Error in launchExternalBankLogin: " + JSON.stringify(err));
      }
      loggerManager.log("----End Auth_PresentationController.prototype.launchExternalBankLogin----");
  };
  Auth_PresentationController.prototype.hideFaceIdflex = function(){
        var controller = applicationManager.getPresentationUtility().getController('frmLogin', true);
        controller.flxCancelFIOnClick();
  };
  Auth_PresentationController.prototype.canPreloginAdsRenderedToUI = function(){
   var value =  scope_AuthPresenter.dmManager.getRenderPreloginAds();
   return value;
  };
  Auth_PresentationController.prototype.setRenderPreloginAdsToTrue = function(){
    scope_AuthPresenter.dmManager.setRenderPreloginAds(true);
  };  
  Auth_PresentationController.prototype.fetchUserNameAndPasswordInstructions = function(){
    scope_AuthPresenter.authManger.getUserNamePoliciesForEnroll(scope_AuthPresenter.fetchInstructionsSuccesCallback,scope_AuthPresenter.fetchInstructionsErrorCallback);
  };
  Auth_PresentationController.prototype.fetchInstructionsSuccesCallback = function(res){
    scope_AuthPresenter.usernameRules = res.records[0].policyDescription;
    scope_AuthPresenter.passwordRules = res.records[1].policyDescription;
  };
  Auth_PresentationController.prototype.fetchInstructionsErrorCallback = function(err){
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    throw GlobalExceptionHandler.addMessageAndActionForException(err, "kony.error.LoadingFormFailed", GlobalExceptionHandler.ActionConstants.ALERT, arguments.callee.name);
  };
  
  Auth_PresentationController.prototype.getMobileNo = function() {
    var userPreferencesManager = applicationManager.getUserPreferencesManager();
    return userPreferencesManager.getUserPhone();
  };
  
  Auth_PresentationController.prototype.getEmail = function() {
    var userPreferencesManager = applicationManager.getUserPreferencesManager();
    return userPreferencesManager.getUserEmail();
  };
  
  Auth_PresentationController.prototype.trackRegDevice = function(){
    function presentationSuccessCallback(){
    }
    function presentationErrorCallback(){
    }
    var registrationManager = applicationManager.getRegistrationManager();
    registrationManager.trackRegisteredDevice(presentationSuccessCallback,presentationErrorCallback);
  };
  
  Auth_PresentationController.prototype.getUsernameRulesAndPolicy = function(){
    const userPrefManager = applicationManager.getUserPreferencesManager();
    userPrefManager.fetchUsernameRulesAndPolicy(scope_AuthPresenter.getUsernameRulesAndPolicySuccessCallback,scope_AuthPresenter.getUsernameRulesAndPolicyErrorCallback);
  };
  Auth_PresentationController.prototype.getUsernameRulesAndPolicySuccessCallback = function(res){
    const navManager = applicationManager.getNavigationManager();
    let data = navManager.getCustomInfo("frmForgotCreatePassword");
    if(data && data!==null){
      data.usernamePolicy = res.usernamepolicy.content;
    } else {
      data = {"usernamePolicy":res.usernamepolicy.content};
    }
    navManager.setCustomInfo("frmForgotCreatePassword",data);
    const validationUtility = applicationManager.getValidationUtilManager();
    validationUtility.createRegexForUsernameValidation(res.usernamerules);
  };
  Auth_PresentationController.prototype.getUsernameRulesAndPolicyErrorCallback = function(err){
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    if (err["isServerUnreachable"]) {
      applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", err);
    }
  };
  
  Auth_PresentationController.prototype.getPasswordRulesAndPolicy = function(){
    const userPrefManager = applicationManager.getUserPreferencesManager();
    userPrefManager.fetchPasswordRulesAndPolicy(scope_AuthPresenter.getPasswordRulesAndPolicySuccessCallback,scope_AuthPresenter.getPasswordRulesAndPolicyErrorCallback);
  };
  Auth_PresentationController.prototype.getPasswordRulesAndPolicySuccessCallback = function(res){
    scope_AuthPresenter.asyncManager.setSuccessStatus(1, res);
    if (scope_AuthPresenter.asyncManager.areAllservicesDone(2)) {
      const navManager = applicationManager.getNavigationManager();
      let data = navManager.getCustomInfo("frmForgotCreatePassword");
      if(data && data!==null){
        data.passwordPolicy = res.passwordpolicy.content;
      } else {
        data = {"passwordPolicy":res.passwordpolicy.content};
      }
      navManager.setCustomInfo("frmForgotCreatePassword",data);
      const validationUtility = applicationManager.getValidationUtilManager();
      validationUtility.createRegexForPasswordValidation(res.passwordrules);
      scope_AuthPresenter.commonFunctionForNavigation("frmForgotCreatePassword");
    }
  };
  Auth_PresentationController.prototype.getPasswordRulesAndPolicyErrorCallback = function(err){
    scope_AuthPresenter.asyncManager.setErrorStatus(1, err);
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    if (err["isServerUnreachable"]) {
      applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", err);
    }
  };

  Auth_PresentationController.prototype.fetchCaptcha = function(data){
    scope_AuthPresenter.authManger.generateCaptcha(data, scope_AuthPresenter.fetchCaptchaSuccess, scope_AuthPresenter.fetchCaptchaFailure);
  };
  Auth_PresentationController.prototype.fetchCaptchaSuccess = function(res) {
    const controller = applicationManager.getPresentationUtility().getController('frmForgotEnterEmailID', true);
    controller.fetchCaptchaSuccess(res);
  };
  Auth_PresentationController.prototype.fetchCaptchaFailure = function(err) {
    const controller = applicationManager.getPresentationUtility().getController('frmForgotEnterEmailID', true);
    controller.fetchCaptchaFailure();
  };

  Auth_PresentationController.prototype.verifyDOB = function(verifyData) {
    const validationManager = applicationManager.getValidationUtilManager();
    const forUtility = applicationManager.getFormatUtilManager();
    let isValidDOB = validationManager.isDOBValid(verifyData.dob);
    if (isValidDOB === true) {
      let userDOB = forUtility.getDateForFormatting(verifyData.dob);
      let dateOfBirth = forUtility.getFormatedDateString(new Date(userDOB), forUtility.getBackendDateFormat());
      let phone = "";
      if(verifyData.code){
        phone = verifyData.code +"-"+verifyData.phone;
      } else {
        phone = verifyData.phone;
      }
      let fetchUserNameJSON ={"Phone": phone,"Email":verifyData.email,"DateOfBirth":dateOfBirth,"serviceKey":verifyData.serviceKey,"captchaValue":verifyData.captcha};
      scope_AuthPresenter.authManger.verifyUserName(fetchUserNameJSON, scope_AuthPresenter.presentationUserVerifySuccess, scope_AuthPresenter.presentationUserVerifyError);
    } else {
      const controller = applicationManager.getPresentationUtility().getController('frmForgotEnterDOB', true);
      controller.bindViewError(applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.validDOB"));
    }
  };
  Auth_PresentationController.prototype.presentationUserVerifySuccess = function(res) {
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    if(res!== null && res.isUserExists !=="false"){
      const username = res.user_attributes[0].UserName;
      const securitykey = res.user_attributes[0].securityKey;
      const serviceKey = res.serviceKey;
      let userlist = [];
      for(let i =0;i<res.user_attributes.length;i++){
        userlist[i]=[res.user_attributes[i].UserName,res.user_attributes[i].UserName];
      }
      let userMap = new Map();
      for(let i =0;i<res.user_attributes.length;i++){
        userMap.set(res.user_attributes[i].UserName, res.user_attributes[i]);
      }
      let data = {"UserNameList": userlist};
      scope_AuthPresenter.userList = userlist;
      scope_AuthPresenter.authManger.setPrimarykeyAttribute(data);
      scope_AuthPresenter.authManger.setUserName(userlist);
      scope_AuthPresenter.authManger.setServicekey(serviceKey);
      scope_AuthPresenter.authManger.setSecurityKey(securitykey);
      scope_AuthPresenter.commonFunctionForNavigation("frmForgotSelectUsername");
      const controller = applicationManager.getPresentationUtility().getController('frmForgotSelectUsername', true);
      controller.getUserList(userMap,serviceKey);
    } else {
      var controller = applicationManager.getPresentationUtility().getController('frmForgotEnterDOB', true);
      controller.bindVerifyError();
      var controller = applicationManager.getPresentationUtility().getController('frmForgotEnterEmailID', true);
      controller.verifyError(applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.enroll.usernameUnavailableMsg"));
    }
  };
  Auth_PresentationController.prototype.presentationUserVerifyError = function(err) {
    scope_AuthPresenter.logger.log("####Error while Fetching user : Forgot username flow");
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    if (err["isServerUnreachable"]){
      applicationManager.getPresentationInterruptHandler().showErrorMessage("preLogin", err);
    } else {
      const controller1 = applicationManager.getPresentationUtility().getController('frmForgotEnterDOB', true);
      controller1.bindVerifyError();
      const controller2 = applicationManager.getPresentationUtility().getController('frmForgotEnterEmailID', true);
      controller2.verifyCaptchaFailure(err);
    }
  };

  Auth_PresentationController.prototype.verifyCaptcha = function(verifyData) {
    scope_AuthPresenter.authManger.verifyCaptcha(verifyData, scope_AuthPresenter.presentationCaptchaVerifySuccess, scope_AuthPresenter.presentationCaptchaVerifyError);
  };
  Auth_PresentationController.prototype.presentationCaptchaVerifySuccess = function(res) {
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    const controller = applicationManager.getPresentationUtility().getController('frmForgotEnterEmailID', true);
    controller.verifyCaptchaSuccess();
  };
  Auth_PresentationController.prototype.presentationCaptchaVerifyError = function(err) {
    scope_AuthPresenter.logger.log("####Error while Fetching user : Forgot username flow");
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    if (err["isServerUnreachable"]){
      applicationManager.getPresentationInterruptHandler().showErrorMessage("preLogin", err);
    } else {
      const controller = applicationManager.getPresentationUtility().getController('frmForgotEnterEmailID', true);
      controller.verifyCaptchaFailure(err);
    }
  };

  Auth_PresentationController.prototype.getPasswordWarning = function() {
    const userPrefManager = applicationManager.getUserPreferencesManager();
    return userPrefManager.getPasswordWarning();
  };
  Auth_PresentationController.prototype.getLocaleDOB = function(dob) {
    const forUtility = applicationManager.getFormatUtilManager();
    const config = applicationManager.getConfigurationManager();
    let frontEndDateFormat = '';
    const locale = config.getLocale();
    if (locale === 'en' || locale === 'en_US'){
      frontEndDateFormat = 'm/d/Y';
    } else {
      frontEndDateFormat = config.frontendDateFormat[locale];
    }
    dob = dob.replace(/-/g, '\/');
    return forUtility.getFormatedDateString(new Date(dob), frontEndDateFormat);
  };
  
  Auth_PresentationController.prototype.navigateToMFA = function(selectedUserName){
    const username = selectedUserName[1];
    scope_AuthPresenter.authManger.setUserName(username);
    const servicekey = scope_AuthPresenter.authManger.getServicekey();
    let inputJSON = {
      "UserName": username,
      "MFAAttributes" : {
        "serviceKey":  servicekey
      }
    };
    scope_AuthPresenter.authManger.requestResetPasswordOTP(inputJSON,scope_AuthPresenter.navigateToMFASuccessCallback,scope_AuthPresenter.navigateToMFAErrorCallback);
  };
  Auth_PresentationController.prototype.navigateToMFASuccessCallback = function(res){
    const communicationType = res["MFAAttributes"].communicationType;
    scope_AuthPresenter.authManger.setCommunicationType(communicationType);
    scope_AuthPresenter.authManger.setMFAResponse(res);
    if(communicationType === "DISPLAY_ALL"){
      const servicekey = res["MFAAttributes"].serviceKey;
      scope_AuthPresenter.authManger.setServicekey(servicekey);
      const controller = applicationManager.getPresentationUtility().getController('frmForgotMFAOption3', true);
      controller.setFormUI(res);
      scope_AuthPresenter.commonFunctionForNavigation("frmForgotMFAOption3");
    } else {
      const securitykey = res["MFAAttributes"].securityKey;
      const servicekey = res["MFAAttributes"].serviceKey;
      scope_AuthPresenter.unmaskedphoneNumber = res["MFAAttributes"]["customerCommunication"]["phone"]["unmasked"];
      scope_AuthPresenter.unmaskedemail =  res["MFAAttributes"]["customerCommunication"]["email"]["unmasked"];
      scope_AuthPresenter.authManger.setServicekey(servicekey);
      scope_AuthPresenter.authManger.setSecurityKey(securitykey);
      const controller = applicationManager.getPresentationUtility().getController('frmForgotMFASecurityCode', true);
      controller.setFormUI(res);
      scope_AuthPresenter.commonFunctionForNavigation("frmForgotMFASecurityCode");
    }
  };
  Auth_PresentationController.prototype.navigateToMFAErrorCallback = function(err){
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    if (err["isServerUnreachable"]) {
      applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", err);
    }
  };
  
  Auth_PresentationController.prototype.navigateToOTPScreen = function(data){
    scope_AuthPresenter.unmaskedphoneNumber = data.phone;
    scope_AuthPresenter.unmaskedemail =  data.email;
    const username = scope_AuthPresenter.authManger.getUserName();
    const servicekey = scope_AuthPresenter.authManger.getServicekey();
    let inputJSON = {
      "UserName": username,
      "MFAAttributes" : {
        "serviceKey":  servicekey,
        "OTP": {
          "phone" : scope_AuthPresenter.unmaskedphoneNumber,
          "email" : scope_AuthPresenter.unmaskedemail
        }
      }
    };
    scope_AuthPresenter.authManger.requestResetPasswordOTP(inputJSON,scope_AuthPresenter.navigateToOTPScreenSuccessCallback,scope_AuthPresenter.navigateToOTPScreenErrorCallback);
  };
  Auth_PresentationController.prototype.navigateToOTPScreenSuccessCallback = function(res){
    const securitykey = res["MFAAttributes"].securityKey;
    scope_AuthPresenter.authManger.setSecurityKey(securitykey);
    scope_AuthPresenter.authManger.setMFAResponse(res);
    const communicationType =  scope_AuthPresenter.authManger.getCommunicationType();
    res["MFAAttributes"]["communicationType"] = communicationType;
    res["MFAAttributes"]["phone"] = scope_AuthPresenter.maskedphoneNumber;
    res["MFAAttributes"]["email"] = scope_AuthPresenter.maskedemail;
    const controller = applicationManager.getPresentationUtility().getController('frmForgotMFASecurityCode', true);
    controller.setFormUI(res);
    scope_AuthPresenter.commonFunctionForNavigation("frmForgotMFASecurityCode");
  };
  Auth_PresentationController.prototype.navigateToOTPScreenErrorCallback = function(err){
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    if (err["isServerUnreachable"]) {
      applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", err);
    }
  };
  
  Auth_PresentationController.prototype.verifyMFAOTP = function(otp){
    applicationManager.getPresentationUtility().showLoadingScreen();
    const servicekey = scope_AuthPresenter.authManger.getServicekey();
    const securitykey =  scope_AuthPresenter.authManger.getSecurityKey();
    let inputJSON ={
      "MFAAttributes":{
        "serviceKey":servicekey,
        "OTP":{
          "securityKey":securitykey,
          "otp": otp
        }
      }
    }
    scope_AuthPresenter.asyncManager.initiateAsyncProcess(2);
    scope_AuthPresenter.getPasswordRulesAndPolicy(scope_AuthPresenter.getPasswordRulesAndPolicySuccessCallback,scope_AuthPresenter.getPasswordRulesAndPolicyErrorCallback);
    scope_AuthPresenter.authManger.verifyOTPPreLogin(inputJSON,scope_AuthPresenter.verifyMFAOTPSuccessCallback,scope_AuthPresenter.verifyMFAOTPErrorCallback);
  };
  Auth_PresentationController.prototype.verifyMFAOTPSuccessCallback = function(res){
    scope_AuthPresenter.authManger.setMFAResponse(res);
    scope_AuthPresenter.asyncManager.setSuccessStatus(0, res);
    if (scope_AuthPresenter.asyncManager.areAllservicesDone(2)) {
      applicationManager.getPresentationUtility().dismissLoadingScreen();
      const navManager = applicationManager.getNavigationManager();
      let data = navManager.getCustomInfo("frmForgotCreatePassword");
      res = scope_AuthPresenter.asyncManager.getData(1);
      if(data){
        data.passwordPolicy = res.passwordpolicy.content;
      } else {
        data = {"passwordPolicy":res.passwordpolicy.content};
      }
      navManager.setCustomInfo("frmForgotCreatePassword",data);
      const validationUtility = applicationManager.getValidationUtilManager();
      validationUtility.createRegexForPasswordValidation(res.passwordrules);
      scope_AuthPresenter.commonFunctionForNavigation("frmForgotCreatePassword");
    }
  };
  Auth_PresentationController.prototype.verifyMFAOTPErrorCallback = function(err){
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    if (err["isServerUnreachable"]) {
      applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", err);
    } else {
      const controller = applicationManager.getPresentationUtility().getController('frmForgotMFASecurityCode', true);
      controller.showIncorrectOTPError(err.serverErrorRes);
    }
  };
  
  Auth_PresentationController.prototype.resendMFAOTP = function(data){
    const username = scope_AuthPresenter.authManger.getUserName();
    const servicekey = scope_AuthPresenter.authManger.getServicekey();
    let inputJSON = {
      "UserName": username,
      "MFAAttributes" : {
        "serviceKey":  servicekey,
        "OTP": {
          "phone" : scope_AuthPresenter.phoneNumber,
          "email" : scope_AuthPresenter.email,
          "securityKey" : scope_AuthPresenter.authManger.getSecurityKey()
        }
      }
    };
    scope_AuthPresenter.authManger.requestResetPasswordOTP(inputJSON,scope_AuthPresenter.resendMFAOTPSuccessCallback,scope_AuthPresenter.resendMFAOTPScreenErrorCallback);
  };
  Auth_PresentationController.prototype.resendMFAOTPSuccessCallback = function(res){
    scope_AuthPresenter.authManger.setSecurityKey(res["MFAAttributes"]["securityKey"]);
    scope_AuthPresenter.authManger.setMFAResponse(res);
    scope_AuthPresenter.MFAresponse = res;
    applicationManager.getPresentationUtility().dismissLoadingScreen();
  };
  Auth_PresentationController.prototype.resendMFAOTPScreenErrorCallback = function(err){
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    if (err["isServerUnreachable"]) {
      applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", err);
    } else {
      const controller = applicationManager.getPresentationUtility().getController('frmForgotMFASecurityCode', true);
      controller.showIncorrectOTPError(err.serverErrorRes);
    }
  };
  
  Auth_PresentationController.prototype.setUsernamePasswordJSON = function(UsernamePasswordJSON){
    Auth_PresentationController.UsernamePasswordJSON = UsernamePasswordJSON;
  };

  Auth_PresentationController.prototype.getCountryCodes = function(){
    applicationManager.getPresentationUtility().showLoadingScreen();
    const userPrefManager = applicationManager.getUserPreferencesManager();
    userPrefManager.getCountryCodes(scope_AuthPresenter.getCountryCodesSuccess, scope_AuthPresenter.getCountryCodesError);
  };
  Auth_PresentationController.prototype.getCountryCodesSuccess = function(data){
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    const controller = applicationManager.getPresentationUtility().getController('frmForgotSelectCountry', true);
    controller.setFormUI(data.countrycode);
  };
  Auth_PresentationController.prototype.getCountryCodesError = function(err){
    applicationManager.getPresentationUtility().dismissLoadingScreen();
  };

  Auth_PresentationController.prototype.regenerateActivationCode = function(data){
    scope_AuthPresenter.authManger.regenerateActivationCode(data,scope_AuthPresenter.regenerateActivationCodeSuccess,scope_AuthPresenter.regenerateActivationCodeFailure);
  };
  Auth_PresentationController.prototype.regenerateActivationCodeSuccess = function(res) {
    const controller = applicationManager.getPresentationUtility().getController('frmForgotResetInformation', true);
    controller.regenerateActivationSuccess();
  };
  Auth_PresentationController.prototype.regenerateActivationCodeFailure = function(err) {
    const controller = applicationManager.getPresentationUtility().getController('frmForgotResetInformation', true);
    controller.regenerateActivationFailure();
  };
  
  Auth_PresentationController.prototype.fetchPostloginAds = function(){
    scope_AuthPresenter.navigateToDashboardFromAds();
  };
  Auth_PresentationController.prototype.navigateToDashboardFromAds = function(){
    const configManager = applicationManager.getConfigurationManager();
    const isHomepageMAPresent = configManager.isMicroAppPresent('HomepageMA');
    if(isHomepageMAPresent){
      const accMod = kony.mvc.MDAApplication.getSharedInstance().moduleManager.getModule({ appName: "HomepageMA", moduleName: "AccountsUIModule" });
      accMod.presentationController.fetchAccountDashboardCampaignsForAggregatedDashboard();
    }
  };

return Auth_PresentationController;
});
