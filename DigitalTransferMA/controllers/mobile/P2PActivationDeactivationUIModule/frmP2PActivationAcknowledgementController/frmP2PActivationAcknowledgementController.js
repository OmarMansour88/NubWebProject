define({ 

  userDetails: {},
 //Type your controller code here 
  onNavigate: function(context) {
    var scope = this;
    var navMan = applicationManager.getNavigationManager();
    context = navMan.getCustomInfo("frmP2PActivationAcknowledgement");
    if(kony.os.deviceInfo().name === "iPhone") {
      var titleBarAttributes = this.view.titleBarAttributes;
      titleBarAttributes["shadowImage"] = "transparentbox.png";
      this.view.titleBarAttributes = titleBarAttributes;
      this.view.setBackgroundImageForNavbar({
        "image": "transparentbox.png",
        "barMetrics": constants.BAR_METRICS_DEFAULT
      });
    }
    scope.fetchUserDetails(); 
    if(!kony.sdk.isNullOrUndefined(context) && context !== "") {
      scope.view.AcknowledgementComponent.setContext(context);
    }
    scope.initActions();
  },

  initActions:function() {
    var scope = this;
    scope.view.AcknowledgementComponent.onError = function(error) {
      alert(JSON.stringify(error));
    };
    scope.view.AcknowledgementComponent.contextualActionButtonOnClick = function(data,context) {
      var navMan = applicationManager.getNavigationManager();
      if(data === "New Transfer" || data === "Try Again") {
        var formName = navMan.stack[navMan.stack.length -3];
        //navMan.navigateTo(formName);
        navMan.navigateTo({"friendlyName" : "UnifiedTransferFlowUIModule/frmSelectTransferTypeNew", "appName" : "UnifiedTransferMA"});
      } else {
        var accountMod = applicationManager.getModulesPresentationController({"moduleName" : "AccountsUIModule", "appName" : "HomepageMA"});
        accountMod.showDashboard();
      }
    };
    scope.view.AcknowledgementComponent.onBack = function() {
      alert("Back Navigation");
    };
    scope.view.flxMainContainer.onScrolling = function() {
      scope.iPhoneHeaderHandler();
    };
  },
  
  iPhoneHeaderHandler : function() {
    var scope = this;
    if(this.view.flxMainContainer.contentOffsetMeasured.y > 50) {
      scope.view.title = "Acknowledgment";
    }
    else if(this.view.flxMainContainer.contentOffsetMeasured.y < 45) {
      scope.view.title = "";
    }
  },

  fetchUserDetails : function() {
    var p2pMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "PayAPersonUIModule", "appName" : "RegionalTransferMA"});
    p2pMod.presentationController.fetchUserDetails();
  },
 });