define({
  selectedLanguage: -1,
  init : function(){
    var navManager = applicationManager.getNavigationManager();
    var currentForm = navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
  },
  preShow: function () {
    var self = this;
    if(applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone"){
      this.view.flxHeader.isVisible = true;
    }
    else{
      this.view.flxHeader.isVisible = false;
    }
    this.initActions();
	//this.setDataToLanguage();
    this.view.customHeader.btnRight.onClick=this.onClose;
    this.view.customHeader.flxBack.onClick = this.flxBackOnClick;
  },
  initActions : function(){
    this.view.segLanguages.onRowClick = this.segLanguagesOnRowClick;
    this.view.btnUpdateLanguage.onClick = this.btnUpdateLanguageOnClick;
  },
  postShow: function(){
    try{
      this.setDataToLanguage();
    }catch(er){
      kony.print(er);
    }
  },
  segLanguagesOnRowClick: function() {
    var navMan = applicationManager.getNavigationManager();
    var config = applicationManager.getConfigurationManager();
    var selectedSectionIndex = Math.floor(this.view.segLanguages.selectedRowIndex[0]);
    var selectedRowIndex = Math.floor(this.view.segLanguages.selectedRowIndex[1]);
    this.selectedLanguage =this.getBackendLanguage(this.view.segLanguages.data[selectedRowIndex].lblLanguage);
    var currentLocale = kony.i18n.getCurrentLocale();
    if (currentLocale === 'en')
        currentLocale = 'en_US'
    if (currentLocale === config.locale[this.selectedLanguage]) {
        this.view.btnUpdateLanguage.setEnabled(false);
        this.view.btnUpdateLanguage.skin = "sknBtna0a0a0SSPReg26px";
    } else {
        this.view.btnUpdateLanguage.setEnabled(true);
        this.view.btnUpdateLanguage.skin = "sknBtn0095e4RoundedffffffSSP26px";
    }
  },
  btnUpdateLanguageOnClick : function(){
      var config = applicationManager.getConfigurationManager();
          var scope = this;
          var basicProperties =
          {
            "message": applicationManager.getPresentationUtility().getStringFromi18n("i18n.common.changeLanguageMessage") + " " + scope.selectedLanguage + " ?",
            "alertType": constants.ALERT_TYPE_CONFIRMATION,
            "alertTitle": "",
            "yesLabel": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.Yes"),
            "noLabel": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.AlertNo"),
            "alertIcon": "",
            "alertHandler": function(response) {
              if(response){
                scope.changeLanguage();
              }
            }
          };
      applicationManager.getPresentationUtility().showAlertMessage(basicProperties, {});
  },
  changeLanguage : function(){
    var navMan = applicationManager.getNavigationManager();
    var config = applicationManager.getConfigurationManager();
    var selectedSectionIndex=Math.floor(this.view.segLanguages.selectedRowIndex[0]);
    var selectedRowIndex=Math.floor(this.view.segLanguages.selectedRowIndex[1]);
    this.selectedLanguage = this.getBackendLanguage(this.view.segLanguages.data[selectedRowIndex].lblLanguage);
    var sm = applicationManager.getStorageManager();
    var langObj = {"language":this.selectedLanguage,"index":selectedRowIndex,"flow":config.constants.LANG_CHANGE_FROM_SETTINGS};
    sm.setStoredItem("langObj",langObj);
    config.setLocaleAndDateFormat();
    var currentLocale = config.getLocale();
        if (currentLocale === 'en_US')
            currentLocale = 'en';
        if (currentLocale) {
            kony.i18n.setCurrentLocaleAsync(currentLocale, this.languageChangeOnSuccess, this.languageChangeOnFailure);
        }
  },
  languageChangeOnSuccess: function() {
    var authMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsUIModule", "appName" : "ManageProfileMA"});
    //authMod.presentationController.commonFunctionForNavigation("frmLanguageSelectionLoading");
     authMod.presentationController.commonFunctionForNavigation({"appName" : "AuthenticationMA", "friendlyName" : "frmLanguageSelectionLoading"});
  },
  languageChangeOnFailure: function() {
    kony.print("Fail");
  },
  getLanguageMasterData : function(){
    return {
           "US English" : "en_US",
           "UK English" : "en_GB",
           "Spanish" : "es_ES",
           "German" : "de_DE",
           "French" : "fr_FR"
        };
  },
   getValueFromKey : function(value){
      var configManager = applicationManager.getConfigurationManager();
      var langObject = configManager.locale;
      for (var key in langObject) {
        if (langObject.hasOwnProperty(key)) {
           var shortLang = langObject[key];
           if(shortLang===value){
               return key;
           }
        }
      }
    },
    getBackendLanguage : function(lang){
         var languageData = this.getLanguageMasterData();
         for(var key in languageData) {
            if (languageData.hasOwnProperty(key)) {
                if(key===lang){
                  return this.getValueFromKey(languageData[key]);
                }
           }
        }
    },
  setDataToLanguage : function(){
    var languageData = this.getLanguageMasterData();
    var dataMap = {
      "flxLanguage": "flxLanguage",
      "imgCheckbox": "imgCheckbox",
      "lblLanguage": "lblLanguage",
      "imgFlag": "imgFlag"
    };
    var flags = {
      "US English": "us.png",
      "UK English": "uk.png",
      "Spanish": "spanish.png",
      "German": "german.png",
      "French": "french.png"
    };
    var data = [];
    for (var key in languageData) {
            if (languageData.hasOwnProperty(key)) {
               var language = key;
               var dataElt = {
                  "imgCheckbox": {
                  "src": "radiobuttonactive.png",
               },
               "lblLanguage": language,
               "imgFlag": flags[language],
               "template": "flxLanguage"
              };
            data.push(dataElt);
       }
    }
    this.view.segLanguages.widgetDataMap = dataMap;
    this.view.segLanguages.setData(data);
    var sm = applicationManager.getStorageManager();
    var langObjFromStorage = sm.getStoredItem("langObj");
    var index = 0;
    if(!kony.sdk.isNullOrUndefined(langObjFromStorage)){
      index = langObjFromStorage.index;
    }
    this.view.segLanguages.selectedRowIndices = [[0,[index]]];
    this.selectedLanguage = this.view.segLanguages.data[index].lblLanguage;
    this.view.btnUpdateLanguage.setEnabled(false);
    this.view.btnUpdateLanguage.skin = "sknBtna0a0a0SSPReg26px";
    this.view.forceLayout();
  },
  onClose : function () {
    var navManager = applicationManager.getNavigationManager();
    navManager.goBack();
  },
  flxBackOnClick: function() {
      	var navMan=applicationManager.getNavigationManager();
      	navMan.goBack();
    }
 });