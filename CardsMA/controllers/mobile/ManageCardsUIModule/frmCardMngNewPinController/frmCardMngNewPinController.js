define({
	init : function() {
      try{
        var navManager = applicationManager.getNavigationManager();
        var currentForm=navManager.getCurrentForm();
        applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
      }
      catch(err) {
        throw GlobalExceptionHandler.addMessageAndActionForException(err, "kony.error.LoadingFormFailed", GlobalExceptionHandler.ActionConstants.ALERT, arguments.callee.name);
      }
    },
    preShow : function(){
var loggerManager = applicationManager.getLoggerManager();
try {
loggerManager.log("#### start frmCardMngNewPinController : preShow ####");
var navManager = applicationManager.getNavigationManager();
var configManager=applicationManager.getConfigurationManager();
var frmData = navManager.getCustomInfo("frmCardMngReasons");
this.cardData = frmData;
this.renderTitleBar();
this.view.txtCurrentPinValue.text = "";
this.view.txtNewPin.text="";
this.clearConfirmPin();
this.view.txtNewPin.maxTextLength=configManager.pinChangeLength;
this.view.txtConfirmPin.maxTextLength=configManager.pinChangeLength;
 this.view.txtCurrentPinValue.maxTextLength=configManager.pinChangeLength;
this.view.txtCurrentPinValue.onTextChange = this.validatePins;
this.view.imgMaskUnmask.onTouchEnd = this.imgMaskUnmaskToggle;
this.view.txtConfirmPin.onTextChange = this.validatePins;
this.view.txtNewPin.onTextChange = this.clearConfirmPin;
this.view.btnContinue.setEnabled(false);
this.view.btnContinue.skin = "sknBtne9e9e9a0a0a0SSReg30px";
this.view.customHeader.flxBack.onClick = this.flxBackOnClick;
this.view.customHeader.btnRight.onClick = this.cancelOnClick;
this.view.btnContinue.onClick = this.updateCurrentCard;
applicationManager.getPresentationUtility().dismissLoadingScreen();
var currentForm=navManager.getCurrentForm();
applicationManager.getPresentationFormUtility().logFormName(currentForm);
      }
      catch(err) {
        throw GlobalExceptionHandler.addMessageAndActionForException(err, "kony.error.LoadingFormFailed", GlobalExceptionHandler.ActionConstants.ALERT, arguments.callee.name);
      }
    },
	clearConfirmPin : function(){
   
      if(this.view.txtNewPin.text !== this.temp)
      {
        this.view.txtConfirmPin.text = "";
        this.view.imgPinMatch.src="tickmark.png";
        this.view.btnContinue.setEnabled(false);
        this.view.btnContinue.skin = "sknBtne9e9e9a0a0a0SSReg30px";
      }
    },
    updateCurrentCard : function(){
      var loggerManager = applicationManager.getLoggerManager();
     // try {
        loggerManager.log("#### start frmCardMngNewPinController : updateCurrentCard ####");
        applicationManager.getPresentationUtility().showLoadingScreen();
         var confiMan=applicationManager.getConfigurationManager();
        if(!this.isConsecutive(this.view.txtConfirmPin.text, confiMan.pinChangeLength)){
          var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule");
          this.cardData.newPin=this.view.txtConfirmPin.text;
          this.cardData.pinNumber=this.view.txtCurrentPinValue.text;
      	  manageCardsModule.presentationController.updateCardData(this.cardData);
        }
        else{
			applicationManager.getPresentationUtility().dismissLoadingScreen();
          applicationManager.getDataProcessorUtility().showToastMessageError(this, kony.i18n.getLocalizedString("kony.mb.cardManage.ErrorConsecutivePinNo"));
        }
   //   }
     // catch(err) {
   //     applicationManager.getPresentationUtility().dismissLoadingScreen();
     //   throw GlobalExceptionHandler.addMessageAndActionForException(err, "kony.error.ServiceCallFailed", GlobalExceptionHandler.ActionConstants.ALERT, arguments.callee.name);
     // }
    },
//     updateCardSuccess : function(response){
//       var loggerManager = applicationManager.getLoggerManager();
//       try {
//         loggerManager.log("#### start frmCardMngNewPinController : updateCardSuccess ####");
//         var navManager = applicationManager.getNavigationManager();
//         var nextfrmData = navManager.getCustomInfo("frmCardManageHome");
//         nextfrmData.cardData = this.cardData;
//         navManager.setCustomInfo("frmCardManageHome", nextfrmData);
//         var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsModule");
//     	manageCardsModule.presentationController.showCardsHome();
//       }
//       catch(err) {
//         applicationManager.getPresentationUtility().dismissLoadingScreen();
//         throw GlobalExceptionHandler.addMessageAndActionForException(err, "kony.error.ServiceCallFailed", GlobalExceptionHandler.ActionConstants.ALERT, arguments.callee.name);
//       }
//     },
//     updateCardFailure : function(response){
//       var loggerManager = applicationManager.getLoggerManager();
//       try {
//         loggerManager.log("#### start frmCardMngNewPinController : updateCardFailure ####");
//         applicationManager.getPresentationUtility().dismissLoadingScreen();
//         if(response["isServerUnreachable"])
//           applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", response);
//         else{
//           //alert("Something went wrong - card request");
//           applicationManager.getDataProcessorUtility().showToastMessageError(this, kony.i18n.getLocalizedString("kony.mb.cardManage.failUpdateCard"));
//         }
//       }
//       catch(err) {
//         applicationManager.getPresentationUtility().dismissLoadingScreen();
//         throw GlobalExceptionHandler.addMessageAndActionForException(err, "kony.error.ServiceCallFailed", GlobalExceptionHandler.ActionConstants.ALERT, arguments.callee.name);
//       }
//     },
    renderTitleBar: function() {
      var loggerManager = applicationManager.getLoggerManager();
      try {
        loggerManager.log("#### start frmCardMngNewPinController : renderTitleBar ####");
        if (applicationManager.getPresentationFormUtility().getDeviceName() === 'iPhone') {
          this.view.flxHeader.setVisibility(false);
        }
      }
      catch(err) {
        throw GlobalExceptionHandler.addMessageAndActionForException(err, "kony.error.LoadingFormFailed", GlobalExceptionHandler.ActionConstants.ALERT, arguments.callee.name);
      }
    },
    imgMaskUnmaskToggle: function() {
      this.temp = this.view.txtNewPin.text;
      var loggerManager = applicationManager.getLoggerManager();
      try {
        loggerManager.log("#### start frmCardMngNewPinController : imgMaskUnmaskToggle ####");
        if (this.view.imgMaskUnmask.src === "view.png") {
          this.view.imgMaskUnmask.src = "viewactive.png";
          this.view.txtNewPin.secureTextEntry = false;
          this.view.flxNewPin.forceLayout();
        } else {
          this.view.imgMaskUnmask.src = "view.png";
          this.view.txtNewPin.secureTextEntry = true;
          this.view.flxNewPin.forceLayout();
        }
      }
      catch(err) {
        throw GlobalExceptionHandler.addMessageAndActionForException(err, "kony.error.processingError", GlobalExceptionHandler.ActionConstants.LOG, arguments.callee.name);
      }
    },
    validatePins:function() {
      var loggerManager = applicationManager.getLoggerManager();
      try {
        loggerManager.log("#### start frmCardMngNewPinController : validatePins ####");
         var confiMan=applicationManager.getConfigurationManager();
          		var newPin = this.view.txtNewPin.text;
        var confirmNewPin = this.view.txtConfirmPin.text;
        var oldPin = this.view.txtCurrentPinValue.text;
        if(newPin === confirmNewPin && newPin.length === confiMan.pinChangeLength && oldPin.length === confiMan.pinChangeLength)
        {
          this.view.imgPinMatch.src="greentick.png";
          this.view.btnContinue.setEnabled(true);
          this.view.btnContinue.skin = "sknBtn0095e4RoundedffffffSSP26px";
        }
        else
        {
          this.view.imgPinMatch.src="tickmark.png";
          this.view.btnContinue.setEnabled(false);
          this.view.btnContinue.skin = "sknBtne9e9e9a0a0a0SSReg30px";
        }
        this.view.flxConfirmPin.forceLayout();
      }
      catch(err) {
        throw GlobalExceptionHandler.addMessageAndActionForException(err, "kony.error.processingError", GlobalExceptionHandler.ActionConstants.LOG, arguments.callee.name);
      }
    },
  	isConsecutive: function(pin,length){
      for(var i = 0; i < length-1; i++){
        if(parseInt(pin[i])+1 === parseInt(pin[i+1])){
          continue;
        }else
          return false;
      }
      return true;
    },
  	flxBackOnClick: function(){
        var navManager = applicationManager.getNavigationManager();
        navManager.goBack();
  	},
  	cancelOnClick: function(){
      try{
        var navManager = applicationManager.getNavigationManager();
        var frmData = {
          "isMainScreen": false
        };
        navManager.setCustomInfo("frmCardManageHome",frmData);
        var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule");
        manageCardsModule.presentationController.showCardsHome();
      }
      catch(err) {
        throw GlobalExceptionHandler.addMessageAndActionForException(err, "kony.error.LoadingFormFailed", GlobalExceptionHandler.ActionConstants.ALERT, arguments.callee.name);
      }
    }
});