define({ 

  init: function (){

    var configurationManager = applicationManager.getConfigurationManager();
    var params = configurationManager.userAccounts;
    if(params) {
      this.view.viewRequests.setContext(params);
    }

  },
  preShow: function (){
 //   this.view.viewRequests.onClickBack = this.navigateCustomBack;

    this.view.viewRequests.onError = function(error)
    {
      alert(JSON.stringify(error));
    };
  },
  postShow: function(){

  },

navigateCustomBack: function () {
    new kony.mvc.Navigation({"appName" : "HomepageMA", "friendlyName" : "AccountsUIModule/frmUnifiedDashboard"}).navigate();
  },

});