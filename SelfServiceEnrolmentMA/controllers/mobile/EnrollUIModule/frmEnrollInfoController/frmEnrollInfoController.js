define(function(){ 

 //Type your controller code here 
  
  return {
    onInit : function(){
      var navManager = applicationManager.getNavigationManager();
      var currentForm=navManager.getCurrentForm();
      applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
      this.view.preShow = this.preShowfunc;  
    },
    preShowfunc:function()
    {
       try {   
        this.bindevents();
        
       }catch(error){
         kony.print("frmEnrollInfo preShowfunc-->"+error);
       }},bindevents:function(){

         this.view.btnActivateProfile.onClick = this.activateProfileOnClick;
         this.view.btnContactUs.onClick = this.contactUsOnClick;
         this.view.btnLoginNow.onClick = this.loginNowOnClick;
         this.view.btnCallSupport.onClick = this.callSupportOnClick;
         
         var navManager = applicationManager.getNavigationManager();
         var checkEnrollStat = navManager.getCustomInfo("checkEnrollStat");
         if(!kony.sdk.isNullOrUndefined(checkEnrollStat)){
           if(checkEnrollStat === "EnrolledAndActivated"){
             this.loginNow();
           }else if(checkEnrollStat === "activateProfileNow"){
             this.activateYourprofile();
           }else if(checkEnrollStat === "onlyEnrolled"){
             var userFname = " ";
             var userLname = " ";
             if(!kony.sdk.isNullOrUndefined(navManager.getCustomInfo("userFname"))){
               userFname = navManager.getCustomInfo("userFname");
               navManager.setCustomInfo("userFname", " ");
             }
             if(!kony.sdk.isNullOrUndefined(navManager.getCustomInfo("userLname"))){
               userLname = navManager.getCustomInfo("userLname");
               navManager.setCustomInfo("userLname", " ");
             }
             this.enrollSuccess(userFname+" "+userLname);
           }else if(checkEnrollStat === "cantEnroll"){
             this.enrollFailure();
           }
         }

       },
    
    activateProfileOnClick:function(){
      try{
        var navManager = applicationManager.getNavigationManager();
        navManager.setCustomInfo("profileActivation", "profileActivation"); 
        navManager.navigateTo("frmEnrollActivateProfile");
      }catch(er){
        
      }
      
    },
     callSupportOnClick:function(){
      try{
        
      }catch(er){
        
      }
    },
    contactUsOnClick:function(){
      try{
        
      }catch(er){
        
      }
    },
    loginNowOnClick:function(){
      try{
        if(this.view.btnLoginNow.text === kony.i18n.getLocalizedString("kony.mb.enrollment.loginNow")){
          var navManager = applicationManager.getNavigationManager();
         // navManager.navigateTo("frmLogin");
          new kony.mvc.Navigation({"appName" : "AuthenticationMA", "friendlyName" : "frmLogin"}).navigate();
  
        }else if(this.view.btnLoginNow.text === kony.i18n.getLocalizedString("i18n.LoginActivation.ActivateYourProfile")){
          this.activateProfileOnClick();
        }
      }catch(er){
        
      }
    },

    enrollSuccess:function(userName){
      try{
        this.view.flxMainHeader.isVisible = true;
        this.view.imgTick.isVisible = true;
         if(applicationManager.getPresentationFormUtility().getDeviceName()==="iPhone"){
          this.view.flxHeader.isVisible = false;
          this.showTitleBarAttributesiOS(true);
        }else{
          this.view.flxHeader.isVisible = false;
        }
        this.view.imgTick.src = "confirmation_tick.png"
        this.view.lblSuccessMsg.isVisible = true;
        this.view.lblInfo.isVisible = true;
        this.view.btnActivateProfile.isVisible = true;
        this.view.btnContactUs.isVisible = false;
        this.view.lblUserName.text = userName.toUpperCase();
        this.view.btnActivateProfile.centerY = "92%";
        this.view.btnCallSupport.isVisible = false;
        this.view.btnLoginNow.isVisible = false;
        this.view.flxWelcomeBack.isVisible = false;
        this.view.btnActivateProfile.text = kony.i18n.getLocalizedString("i18n.LoginActivation.ActivateYourProfile");
        this.view.lblSuccessMsg.text = kony.i18n.getLocalizedString("kony.mb.Enrollment.successInfo");
        this.view.lblInfo.text = kony.i18n.getLocalizedString("kony.mb.enrollment.activationCode");
        
      }catch(e){
         kony.print("frmEnrollInfo enrollSuccess-->"+e);
      }
    },
    
    enrollFailure:function(){
      try{
        this.view.flxMainHeader.isVisible = false;
        this.view.imgTick.isVisible = true;
        this.view.imgTick.src = "error.png"
        this.view.lblSuccessMsg.isVisible = true;
        if(applicationManager.getPresentationFormUtility().getDeviceName()==="iPhone"){
          this.view.flxHeader.isVisible = false;
          this.showTitleBarAttributesiOS(true);
        }else{
          this.view.flxHeader.isVisible = true;
          this.view.customHeader.flxBack.isVisible = false;
        }
        this.view.lblSuccessMsg.text = kony.i18n.getLocalizedString("kony.mb.enrollment.cantEnroll");
        this.view.lblInfo.isVisible = true;
        this.view.lblInfo.text = kony.i18n.getLocalizedString("kony.mb.enrollment.infoCantEnroll");
        this.view.btnCallSupport.isVisible = true;
        this.view.btnLoginNow.isVisible = false;
        this.view.btnCallSupport.text = "CALL SUPPORT-- 1800 456 213";
        this.view.btnContactUs.isVisible = true;
        this.view.flxWelcomeBack.isVisible = false;
        this.view.btnContactUs.text = kony.i18n.getLocalizedString("i18n.accountDetail.contactUs");
        this.view.btnActivateProfile.centerY = "80%"
        this.view.btnActivateProfile.isVisible = false;
        
      }catch(e){
         kony.print("frmEnrollInfo enrollSuccess-->"+e);
      }
    },
    
    loginNow:function(){
      try{
        this.view.flxWelcomeBack.isVisible = true;
        if(applicationManager.getPresentationFormUtility().getDeviceName()==="iPhone"){
          this.view.flxHeader.isVisible = false;
          this.view.flxWelcomeBack.top = "0dp";
          this.showTitleBarAttributesiOS(false);
        }else{
          this.view.flxHeader.isVisible = true;
          this.view.flxWelcomeBack.top = "56dp";
        }
        this.view.lblUserWelcome.text = kony.i18n.getLocalizedString("kony.mb.resetPassword.WelcomeBack");
        this.view.lblUserRecords.text = "";
        this.view.btnLoginNow.text =  kony.i18n.getLocalizedString("kony.mb.enrollment.loginNow");
        this.view.flxMainHeader.isVisible = false;
        this.view.imgTick.isVisible = false;
        this.view.lblSuccessMsg.isVisible = false;
        this.view.lblInfo.isVisible = false;
        this.view.btnActivateProfile.isVisible = false;
        this.view.btnCallSupport.isVisible = false;
        this.view.btnContactUs.isVisible = false;
        this.view.btnLoginNow.isVisible = true;
        
      }catch(er){
        
      }
    },
    
    activateYourprofile:function(){
      try{
        this.view.flxWelcomeBack.isVisible = true;
        if(applicationManager.getPresentationFormUtility().getDeviceName()==="iPhone"){
           this.view.flxHeader.isVisible = false;
           this.view.flxWelcomeBack.top = "0dp";
           this.showTitleBarAttributesiOS(true);
        }else{
          this.view.flxHeader.isVisible = true;
          this.view.flxWelcomeBack.top = "56dp";
        }
        this.view.lblUserWelcome.text = kony.i18n.getLocalizedString("kony.mb.resetPassword.WelcomeBack");
        this.view.lblUserRecords.text = "";
        this.view.btnLoginNow.text =  kony.i18n.getLocalizedString("i18n.LoginActivation.ActivateYourProfile");
        this.view.flxMainHeader.isVisible = false;
        this.view.imgTick.isVisible = false;
        this.view.lblSuccessMsg.isVisible = false;
        this.view.lblInfo.isVisible = false;
        this.view.btnActivateProfile.isVisible = false;
        this.view.btnContactUs.isVisible = false;
        this.view.btnCallSupport.isVisible = false;
        this.view.btnLoginNow.isVisible = true;
        
      }catch(er){

      }
    },
    
    showTitleBarAttributesiOS : function (param) {
      try {
        if(kony.sdk.isNullOrUndefined(param)) return;
        var titleBarAttributes = this.view.titleBarAttributes;
        titleBarAttributes["navigationBarHidden"] = !param;
        this.view.titleBarAttributes = titleBarAttributes;
        if(param)
          this.view.lblTitle.isVisible = false;
      }
      catch(err) {
        kony.print("Exception in titleBarAttributes" + JSON.stringify(err, null, 4));
      }
    }



  }});