define({ 
   // Global Parameters.
  flxStack : [],
  nativeTitle: "",
  
  onNavigate: function(params){
    var scope = this;
    if(kony.os.deviceInfo().name === "iPhone") {
      var titleBarAttributes = this.view.titleBarAttributes;
      titleBarAttributes["shadowImage"] = "transparentbox.png";
      this.view.titleBarAttributes = titleBarAttributes;
      this.view.setBackgroundImageForNavbar({
        "image": "transparentbox.png",
        "barMetrics": constants.BAR_METRICS_DEFAULT
      });
    }
    if(params !== "" && params !== null && params !== undefined) {
    scope.view.AddNewAccount.setContext(params);
    }
    scope.initActions();
  },

  initActions: function() {
    var scope = this;
    scope.view.flxP2PTransferMain.onScrolling = function() {
      scope.iPhoneHeaderHandler();
    };
    scope.view.AddNewAccount.onRequestStart = function() {
      scope.requestStart();
    };
    scope.view.AddNewAccount.onRequestEnd = function() {
     scope.requestEnd();
    };
    scope.view.AddNewAccount.onBackButtonClick = function() {
      scope.backNavigate();
    };
    scope.view.AddNewAccount.createAccountCallback = function(response) {
      var navMan = applicationManager.getNavigationManager();
      if(!response["MFAAttributes"])
      {
//         var ntf = new kony.mvc.Navigation("frmP2PNewAccountAck");
//         ntf.navigate(response); 
        navMan.setCustomInfo("frmP2PNewAccountAckNew", response);
        navMan.navigateTo("UnifiedTransfersP2PAddBeneficiaryUIModule/frmP2PNewAccountAckNew");
        
      }
      else
      {
        var ntf = new kony.mvc.Navigation("frmMFAValidationNew");
        ntf.navigate(response);     
      }
    };
    scope.view.AddNewAccount.iPhoneHeaderProps = function(headerProperties) {
      scope.setiPhoneHeaderProps(headerProperties);
    };
  },

  requestStart: function() {
    kony.application.showLoadingScreen(null, "", constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true, null);
  },

  requestEnd: function() {
    kony.application.dismissLoadingScreen();
  },

  backNavigate: function() {
	var navMan = applicationManager.getNavigationManager();
    navMan.navigateTo({
                    "friendlyName": "UnifiedTransferFlowUIModule/frmSelectTransferTypeNew",
                    "appName": "UnifiedTransferMA"
                });
  },

   iPhoneHeaderHandler: function(){
    var scope = this;
    if(scope.view.flxP2PTransferMain.contentOffsetMeasured.y > 50){
      scope.view.title = this.nativeTitle;
    }
    else if(scope.view.flxP2PTransferMain.contentOffsetMeasured.y < 45){
      scope.view.title = "";
    }
  },

  /*iPhoneBackNavigation: function() {
    var scope = this;
    var stackLength = scope.flxStack.length;
    var currentScreen = scope.flxStack[stackLength - 1];
    if(this.flxStack.length > 1 && currentScreen !== "flxVerifyDetails" && currentScreen !== "flxDate") {
      scope.view.AddNewAccount.goBack();
    } else if(currentScreen === "flxVerifyDetails") {
      scope.view.AddNewAccount.onVerifyDetailsBack();
    } else if(currentScreen === "flxDate") {
      scope.view.AddNewAccount.dateBackNavigation();
    } else {
      scope.backNavigate();
    }
  },*/
  iPhoneBackNavigation: function() {
    var scope = this;
    var stackLength = scope.flxStack.length;
    var currentScreen = scope.flxStack[stackLength - 1];
    if(this.flxStack.length > 1) {
      scope.view.AddNewAccount.goBack();
    } else {
      scope.backNavigate();
    }
  },
showRightBar: function(cancelTitle) {
    var itemArray = new kony.ui.BarButtonItem({
      "type": constants.BAR_BUTTON_TITLE,
      "tintColor": "#ffffff",
      "style": constants.BAR_ITEM_STYLE_PLAIN,
      "enabled": true,
      "action": this.backNavigate,
      "metaData": {
        "title": cancelTitle
      }
    });
    this.view.setRightBarButtonItems({
      "items": [itemArray],
      "animated": false
    });
  },

  hideRightBar: function(){
    this.view.setRightBarButtonItems({
      "items": [],
      "animated": false
    });
  },

  setiPhoneHeaderProps: function(headerProperties) {
    var scope = this;
    this.flxStack = headerProperties["stack"];
    this.nativeTitle = headerProperties["headerTitle"];
    var cancelTitle = headerProperties["cancelText"];
    var stackLength = scope.flxStack.length;
    var currentScreen = scope.flxStack[stackLength - 1];
    var screenList = ["flxPayeeNickname","flxCurrencySelection","flxAddAddress","flxEmailAddress","flxPhoneNumber","flxPaymentMethod","flxSwiftBICSearch","flxSwiftBICSearchList"];
    if((screenList.includes(currentScreen)) || cancelTitle === "") {
      this.hideRightBar();
    } else {
      this.showRightBar(cancelTitle);
    } 
  },
});