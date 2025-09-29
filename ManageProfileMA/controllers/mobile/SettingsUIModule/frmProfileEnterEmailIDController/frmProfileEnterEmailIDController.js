define({
  timerCounter : 0,
  init : function(){
    var FormValidator = require("FormValidatorManager");
    this.fv = new FormValidator(1);
    var navManager = applicationManager.getNavigationManager();
    var currentForm=navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
    var scope = this;
    this.view.postShow = function(){
      scope.postShow();
    };
  },
  onNavigate : function(param){
    var scope = this;
    if(param === "add")
      scope.showAddEmail();
    else if(param === "edit")
      scope.showEditEmail();
  },
  frmEnrollLAstNamePreShow : function(){
    this.setFlowAction();
    this.setPreShowData();
    this.fv.submissionView(this.view.btnContinue);
    this.view.tbxEmail.setFocus(true);
    var navigationManager = applicationManager.getNavigationManager();
    var param = navigationManager.getCustomInfo("frmProfileEnterEmailIDFlow");
    this.onNavigate(param);
    var navManager = applicationManager.getNavigationManager();
    var currentForm=navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().logFormName(currentForm);
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    //alert(this.view.imgCheckboxPrimary.src);
    var configManager = applicationManager.getConfigurationManager();
    if(configManager.isCombinedUser === "true"){
      this.view.flxPrimary.isVisible=true;
      this.view.flxPrimary.width="70%";
      this.view.flxPrimary.centerX="50%";
    }else{
      this.view.btnDeleteEmailCombinedUser.isVisible=false;
    }
  },
  validateEmailTextBox : function(){
    var text = this.view.tbxEmail.text;
    this.fv.checkAndUpdateStatusForNull(0, text);
  },
  showAddEmail : function(){
    var scopeObj = this;
    this.view.tbxEmail.text = "";
    this.view.tbxEmail.setFocus(true);
    this.view.imgCheckboxPrimary.src = "checkboxempty.png";
    this.view.btnDeleteEmail.isVisible = false;
    this.view.btnDeleteEmail.setVisibility(false);
    this.view.flxPrimary.isVisible = true;
    this.isFromEditFlow = false;
    this.view.btnContinue.text = kony.i18n.getLocalizedString("kony.mb.common.continue");
    this.view.btnContinue.onClick = function(){
      scopeObj.addUserEmail();
      //scopeObj.navToEmailList("add");
    };
    var configManager = applicationManager.getConfigurationManager();
    if(configManager.isCombinedUser === "true"){
      this.view.btnDeleteEmailCombinedUser.isVisible=false;
    }
    
  },
  showEditEmail : function(){
    var scopeObj = this;
    //this.view.btnDeleteEmail.setVisibility(true);
    this.view.btnContinue.text = kony.i18n.getLocalizedString("kony.mb.Profile.UpdateChanges");
    this.view.btnContinue.onClick = function(){
      scopeObj.updateEmail() ;
      //scopeObj.navToEmailList("edit");
    };
    this.view.btnDeleteEmail.isVisible = false;
    this.view.btnDeleteEmail.onClick = function(){
      scopeObj.deleteEmail();
    };
    var navManager = applicationManager.getNavigationManager();
    this.isFromEditFlow = true;
    var data = navManager.getCustomInfo('frmProfileEnterEmailID');
    this.view.tbxEmail.text = data.email;
    this.view.tbxEmail.setFocus(true);
    this.fv.checkAndUpdateStatusForNull(0, data.email);
    if(data.isPrimary === "true"){
      this.view.imgCheckboxPrimary.src = "checkbox.png";
      this.view.flxPrimary.isVisible = false;
      this.view.btnDeleteEmail.isVisible = false;
    }
    else{
      this.view.imgCheckboxPrimary.src = "checkboxempty.png";
      this.view.flxPrimary.isVisible = true;
      this.view.btnDeleteEmail.isVisible = true;
    }
     var configManager = applicationManager.getConfigurationManager();
    if(configManager.isCombinedUser === "true"){
      this.view.btnDeleteEmailCombinedUser.isVisible=true;
      this.view.btnDeleteEmail.isVisible=false;
    }
  },
  postShow : function(){
    if(this.isFromEditFlow !== null && this.isFromEditFlow !== undefined && this.isFromEditFlow === true){
      var navManager = applicationManager.getNavigationManager();
      var data = navManager.getCustomInfo('frmProfileEnterEmailID');
      if(data && data.email)
        this.view.tbxEmail.text = data.email;
      this.view.tbxEmail.setFocus(true);
      this.fv.checkAndUpdateStatusForNull(0, data.email);
    }
    else{
      this.view.tbxEmail.text = "";
      this.view.tbxEmail.setFocus(true);
    }
  },
  setFlowAction  : function(){
    var scopeObj = this;
    this.view.customHeader.flxBack.onClick = function(){
      scopeObj.navToSettings();
    };
    this.view.flxCheckboxPrimary.onClick = function(){
      scopeObj.toggle();
    };
    this.view.customHeader.btnRight.onClick = function(){
      var settingsMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("SettingsUIModule");
      settingsMod.presentationController.commonFunctionForNavigation("frmProfilePersonalDetails");
    };
    this.view.tbxEmail.onTextChange = function(){
      scopeObj.validateEmailTextBox();
      scopeObj.view.tbxEmail.setFocus(true);
    };
    this.view.btnDeleteEmailCombinedUser.onClick=function(){
      scopeObj.deleteYes();
    };
    this.view.confirmationAlertPopup.onClickflxYes=function(){
      scopeObj.deleteEmail();
    };
    
    this.view.confirmationAlertPopup.onClickflxNo=function(){
      scopeObj.deleteCancel();
    };
    
  },
  toggle : function(){
    if(this.view.imgCheckboxPrimary.src === "checkbox.png"){
      this.view.imgCheckboxPrimary.src = "checkboxempty.png";
    }
    else
      this.view.imgCheckboxPrimary.src = "checkbox.png"
      },
  setPreShowData  : function(){
    this.view.customHeader.btnRight.isVisible = true;
    this.view.flxConfirmationPopUp.isVisible=false;
    var scope = this;
    if(applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone"){
      this.view.flxHeader.isVisible = true;
      this.view.flxMainContainer.top = "56dp";
    }
    else{
      this.view.flxHeader.isVisible = false;
      this.view.flxMainContainer.top = "0dp";
    }
  },
  updateEmail : function(){
    var email = this.view.tbxEmail.text;
    var isPrimary = "false";
    if(this.view.imgCheckboxPrimary.src === "checkbox.png"){
      isPrimary = "true";
    }
    var navManager = applicationManager.getNavigationManager();
    var data = navManager.getCustomInfo('frmProfileEnterEmailID');
    var index = data.index;
    var id = data.id;
    var updatedData = {
    };
    updatedData.index = index;
    updatedData.email = email;
    updatedData.isPrimary = isPrimary;
    updatedData.id = id;
    var settingsMode = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("SettingsUIModule");
    settingsMode.presentationController.updateEmail(updatedData);
  },
  deleteEmail : function(){
    var email = this.view.tbxEmail.email;
    var navManager = applicationManager.getNavigationManager();
    var data = navManager.getCustomInfo('frmProfileEnterEmailID');
    var settingsMode = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("SettingsUIModule");
    settingsMode.presentationController.deleteEmail(data);
  },
  addUserEmail : function(){
    var email = this.view.tbxEmail.text;
    var isPrimary = "false";
    if(this.view.imgCheckboxPrimary.src === "checkbox.png"){
      isPrimary = "true";
    }
    var data = {};
    data.email = email;
    data.isPrimary = isPrimary;
    var settingsMode = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("SettingsUIModule");
    settingsMode.presentationController.addEmail(data);
  },
  navToSettings : function(){
    var navigationManager = applicationManager.getNavigationManager();
    navigationManager.goBack();
  },
  navToEmailList : function(param){
  },
  bindViewError : function(msg){
    applicationManager.getDataProcessorUtility().showToastMessageError(this, msg);
  },
  bindViewSuccess : function(msg){
    applicationManager.getDataProcessorUtility().showToastMessageSuccess(this, msg);
  },
  deleteCancel : function(){
    try{
      this.view.flxConfirmationPopUp.isVisible=false;
    }catch(er){
      kony.print(er);
    }
  },
  deleteYes : function(){
    try{
      this.view.confirmationAlertPopup.lblMessage =kony.i18n.getLocalizedString("kony.mb.confirmationAlertPopup.lblMessage");
      this.view.flxConfirmationPopUp.isVisible=true;
    }catch(er){
      kony.print(er);
    }
  }

});