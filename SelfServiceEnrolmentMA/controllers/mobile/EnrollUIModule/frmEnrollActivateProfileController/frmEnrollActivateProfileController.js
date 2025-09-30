define({ 
  
  frmEnrollActivateProfilePreShow: function(){

    var navManager = applicationManager.getNavigationManager();
    var currentForm = navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().initCommonActions(this, "YES", currentForm);
    
    this.view.flxOption.shadowDepth = 1;
    this.resetUI();
    this.setFlowActions();
    
    if(applicationManager.getPresentationFormUtility().getDeviceName()==="iPhone"){
      this.view.flxHeader.isVisible=false;
      this.view.flxMainContainer.top = "0dp";
//       var currForm = kony.application.getCurrentForm();
//       var titleBarAttributes = currForm.titleBarAttributes;
//       titleBarAttributes["navigationBarHidden"] = false;
//       currForm.titleBarAttributes = titleBarAttributes;
    }
    else{
      this.view.flxHeader.isVisible=true;
      this.view.flxMainContainer.top = "56dp";
    }
    var profileActivation = navManager.getCustomInfo("profileActivation");
    if(!kony.sdk.isNullOrUndefined(profileActivation)){
      if(profileActivation === "profileActivation"){
         navManager.setCustomInfo("profileActivation", " ");
         this.view.activateProfile.setVisibility(true);
        this.view.flxMainContainer.setVisibility(false);
       
      }
     
    }
  },
  
  resetUI: function(){
    this.view.activateProfile.setVisibility(false);
    this.view.flxMainContainer.setVisibility(true);
  },

  setFlowActions: function(){
   const scopeObj = this;
    this.view.customHeader.flxBack.onTouchEnd = function(){
      //scopeObj.navigateToFrmLogin();
      scopeObj.navBack();
    };
    this.view.customHeader.btnRight.onClick = function(){
      //scopeObj.navigateToFrmLogin();
			scopeObj.navBack();
    };
    this.view.flxEnrollAccount.onTouchEnd = function(){
      // Enroll Your Account Flow
      var navManager = applicationManager.getNavigationManager();
      navManager.navigateTo("frmEnrollLastName");
    };
    this.view.flxActivateAccount.onTouchEnd = function(){
      // Activation Flow Component
      if (applicationManager.getPresentationFormUtility().getDeviceName() === "iPhone") {
        var currForm = kony.application.getCurrentForm();
        var titleBarAttributes = currForm.titleBarAttributes;
          titleBarAttributes["navigationBarHidden"] = true;
          currForm.titleBarAttributes = titleBarAttributes;
//         scopeObj.view.title="Profile Activation";
//         scopeObj.view.activateProfile.height="80%";
//         scopeObj.view.activateProfile.top="10%";
      }else{
//         scopeObj.view.activateProfile.height="100%";
//         scopeObj.view.activateProfile.top="0dp";
      }
      scopeObj.view.flxMainContainer.setVisibility(false);
      scopeObj.view.activateProfile.setVisibility(true);
      
      // TODO - Make Backend Call to send Activation Code
    };
  },
  
  closeActivateProfileFlow: function(){
    this.view.activateProfile.setVisibility(false);
    this.view.flxMainContainer.setVisibility(true);
  },
  
  navigateToFrmLogin: function(){
    var navManager = applicationManager.getNavigationManager();
    navManager.goBack();
  },

navBack : function(){
var enrollMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule('EnrollUIModule');
enrollMod.presentationController.resetEnrollObj();
},

});