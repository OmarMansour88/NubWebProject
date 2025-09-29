define({ 

  //Type your controller code here 
  onNavigate: function() {
    var billPayMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("BillPaymentUIModule");
    billPayMod.presentationController.showFromAccounts();
  },
  onBillPayClick: function() {
    var navManager = applicationManager.getNavigationManager();
    var accountObj = applicationManager.getAccountManager();
    var accountData = accountObj.getInternalAccounts();
    var custominfo = {"accountData":accountData};
    navManager.setCustomInfo("frmDashboard", custominfo);
    var BillPayMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("BillPaymentUIModule");
    BillPayMod.presentationController.fetchBills();
    BillPayMod.presentationController.getHolidays();
  }

});