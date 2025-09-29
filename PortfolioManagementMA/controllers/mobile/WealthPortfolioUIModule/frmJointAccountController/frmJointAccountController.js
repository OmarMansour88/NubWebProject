define({ 
	index:"",
    selecdata:{},
  initialData:[],
  //Type your controller code here
  init: function () {
    var navManager = applicationManager.getNavigationManager();
    var currentForm = navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().initCommonActions(this, "YES", currentForm);
  },


  preShow: function () {
    if (applicationManager.getPresentationFormUtility().getDeviceName() === "iPhone") {
      this.view.flxHeader.setVisibility(false);
      this.view.flxMainContainer.top = "0dp";
       // this.view.tbxSearch.setFocus(false);
   
    } else {
      this.view.flxHeader.setVisibility(true);
    }
    
  },

  postShow: function () {
    this.initActions();
    var data = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").jointAccountDetails;
    this.setUiData(data);
    this.view.imgUnMask.src = "view.png";
   },
  
  initActions: function () {
    this.view.customHeader.flxBack.onTouchEnd = this.onBack;
    this.view.btnContactUs.onClick = this.OnClickContact;
    this.view.flxUnMask.onTouchEnd =this.OnClickUnMask; 
  }, 

  OnClickUnMask: function () {
      var navManager = applicationManager.getNavigationManager();
      var data = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").jointAccountDetails;
      if (this.view.imgUnMask.src === "viewicon.png") {
        this.view.lblAccountVal.text = applicationManager.getDataProcessorUtility().mskAccNumber(data.accountNumber);
        this.view.imgUnMask.src = "view.png";
      } else {
        this.view.lblAccountVal.text = data.accountNumber;
        this.view.imgUnMask.src = "viewicon.png";
      }
  }, 

  setUiData: function (data) {
    this.view.lblAccountVal.text = applicationManager.getDataProcessorUtility().mskAccNumber(data.accountNumber);
    this.view.lblCustomerNameVal.text = data.primaryHolder;
    if (data.jointHolders !== ""){
      this.view.segCurrency.setVisibility(true);
      var jointData = data.jointHolders;
      this.formSegmentData(jointData);
    }
    else{
      this.view.segCurrency.setVisibility(false);
    }
  },
  
  formSegmentData: function (jointData) {
  var scope = this;
        var currForm = kony.application.getCurrentForm();
        var data = jointData.split(',');
        var segData = [];
        var count = 1;
        for (var list in data) {
            var storeData;
            storeData = {
                jointHolder: "Joint Holder " + count+":",
                jointHolderName: data[list],
            }
            count++;
            segData.push(storeData);
        }
        this.view.segCurrency.widgetDataMap = {
            lblJointHolder: "jointHolder",
            lblJointHolderVal: "jointHolderName",
        }
        this.view.segCurrency.setData(segData);
        currForm.forceLayout();
 },
  
  onBack: function () {
	        new kony.mvc.Navigation({"appName": "PortfolioManagementMA","friendlyName": "frmPortfolioDetails"}).navigate();
  },

  OnClickContact: function () {
   
  },

 
});