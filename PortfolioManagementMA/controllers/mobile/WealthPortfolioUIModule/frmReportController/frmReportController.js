define({
// reportTypeData: {},
 dateRange: {},
 reportData:"",
  downloadData:[],
  init: function(){
      this.view.preShow = this.preShow;
      var navManager = applicationManager.getNavigationManager();
      var currentForm = navManager.getCurrentForm();
      applicationManager.getPresentationFormUtility().initCommonActions(this, "YES", currentForm);
 },
  preShow: function(){   
     var navManager = applicationManager.getNavigationManager();
   // this.reportTypeData = navManager.getCustomInfo("frmReportType");
    this.reportData = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").reportData;
  // if(this.reportTypeData === undefined){
    if(applicationManager.getModulesPresentationController("WealthPortfolioUIModule").reportType == ""){
      applicationManager.getModulesPresentationController("WealthPortfolioUIModule").reportType = this.reportData.response.reportTypeList[0].reportType;
      applicationManager.getModulesPresentationController("WealthPortfolioUIModule").reportParams =this.reportData.response.reportTypeList[0].downloadParams;
     }
  //  else{
    this.view.lblAccSummary.text = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").reportType;
  //  }
    this.dateRange = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").selectedDateRangeDetails;
    this.setLblPreviousDays();
       if (applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone") {
            this.view.flxHeader.isVisible = true;
        } else {
            this.view.flxHeader.isVisible = false;
        }
    this.view.flxTimePeriod.setVisibility(true);
    this.view.flxReportType.setVisibility(true);
    this.view.segDownload.setVisibility(false);
    
    var data = this.reportData.response.downloadTypeList;
   this.downloadData=[];
    for(var list in data){
     var storeData ={ 
      docName : data[list].downloadType,
      downloadParams : data[list].downloadParams
     };
     this.downloadData.push(storeData);
    }

    this.view.segDownload.widgetDataMap = {lblType:"docName"};
    this.view.segDownload.removeAll();
    this.view.segDownload.setData(this.downloadData);
   

    this.initActions();
    this.checkPermissions();
  },
  initActions: function(){
    this.view.customHeader.btnRight.onClick = this.goBack;
    this.view.customHeader.flxBack.onClick = this.goBack;
    this.view.btnTglReport.skin = "sknBtnFFFFFFSSPSB15px";
    this.view.btnTglStatement.skin = "sknbtn000000SSPSB15px";
    this.view.flxBtn.setVisibility(true);
    this.view.flxPreviousDays.onTouchEnd = this.showDatePicker;
    this.view.flxAccountSummary.onTouchEnd = this.showReportTypes;
    this.view.btnTglReport.onClick = this.reportStatementToggle.bind(this, this.view.btnTglReport);
    this.view.btnTglStatement.onClick = this.reportStatementToggle.bind(this, this.view.btnTglStatement);
    this.view.btnGetReport.onClick = this.downloadStatement;
    this.view.segDownload.onRowClick = this.downloadStatementinSeg;
  },
    setLblPreviousDays:function(){
     var forUtility = applicationManager.getFormatUtilManager();
      if(this.dateRange){
    if(this.dateRange.selectedPeriod=="previous30DaysSelected"){
      this.view.lblPreviousDays.text=kony.i18n.getLocalizedString("i18n.wealth.previous30Days");
    }else if(this.dateRange.selectedPeriod=="3MonthsSelected"){
      this.view.lblPreviousDays.text=kony.i18n.getLocalizedString("i18n.wealth.threeMonths");
    }else if(this.dateRange.selectedPeriod=="6MonthsSelected"){
       this.view.lblPreviousDays.text=kony.i18n.getLocalizedString("i18n.wealth.sixMonths");
    }else if(this.dateRange.selectedPeriod=="lastYearSelected"){
       this.view.lblPreviousDays.text=kony.i18n.getLocalizedString("i18n.wealth.lastYear");
    }else{
      var startDateObj=this.dateRange.startDate.split("-");
        var formattedstartDate=startDateObj[1] +"/"+ startDateObj[2] +"/"+ startDateObj[0];
       var endDateObj=this.dateRange.endDate.split("-");
         var formattedendDate=endDateObj[1] +"/"+ endDateObj[2] +"/"+ endDateObj[0];
      this.view.lblPreviousDays.text=formattedstartDate + " - " + formattedendDate;
    }
      }else{
         this.view.lblPreviousDays.text = kony.i18n.getLocalizedString("i18n.wealth.previous30Days"); 
      }
  },
  reportStatementToggle: function(widgetInfo){
    let skin1 = this.view.btnTglReport.skin;
    let skin2 = this.view.btnTglStatement.skin;
    this.view.btnTglReport.skin = (skin1 ===  "sknBtnFFFFFFSSPSB15px") ? "sknbtn000000SSPSB15px":"sknBtnFFFFFFSSPSB15px";
    this.view.btnTglStatement.skin = (skin2 ===  "sknBtnFFFFFFSSPSB15px") ? "sknbtn000000SSPSB15px":"sknBtnFFFFFFSSPSB15px";
    if(widgetInfo.id === "btnTglReport"){
      this.loadReport();
    }
    else{
      this.loadStatement();
    }
  },
  goBack: function(){
 		var params = {
                "portfolioId": applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
                "navPage": "Portfolio",
                "graphDuration": "OneM"
            };
            var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
            wealthModule.getPortfolioAndGraphDetails(params);
  },
  loadReport: function(){
    this.view.flxTimePeriod.setVisibility(true);
    this.view.flxReportType.setVisibility(true);
    this.view.segDownload.setVisibility(false);
    this.view.flxBtn.setVisibility(true);
  },
  loadStatement: function(){
    this.view.flxTimePeriod.setVisibility(false);
    this.view.flxReportType.setVisibility(false);
   
    
    this.view.segDownload.setVisibility(true);
    this.view.flxBtn.setVisibility(false);
  },
  downloadStatementinSeg: function(){
     var rowIndex = this.view.segDownload.selectedRowIndex[1];
        let downloadTypeParams = this.downloadData[rowIndex].downloadParams;
     applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams={};
    applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams.navPage="Reports";
     var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
        wealthModule.getDownloadList(downloadTypeParams);
  },
  downloadStatement: function(){
           let downloadParams=applicationManager.getModulesPresentationController("WealthPortfolioUIModule").reportParams;
         applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams={};
		 downloadParams.accountId = scope_WealthPresentationController.accountNumber;
    applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams.navPage="Reports";
     var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
        wealthModule.getDownloadList(downloadParams);
   
  },
   onClickDownloadMessage:function(base64String,filename)
  {
    try 
    {  
       this.view.socialshare.shareWithBase64(base64String,filename);
    }catch(error){
   applicationManager.getPresentationUtility().dismissLoadingScreen();
    }
  },
  showDatePicker: function(){   
    var navManager = applicationManager.getNavigationManager();
    //  var selectedValue = this.view.lblPrevio =usDays.text;
      var selectedValue = this.view.lblPreviousDays.text;
      var dataSet = {};
      var period;
      if(selectedValue == "Previous 30 days"){
        period ="previous30DaysSelected";
      }
      else if(selectedValue == "3 Months"){
        period ="3MonthsSelected";
      }
      else if(selectedValue == "6 Months"){
        period ="6MonthsSelected";
      }
      else if(selectedValue == "Last year"){
        period ="lastYearSelected";
      }
      else{
        period ="freeDateSelected";
      }
      //  dataSet.searchValue = this.view.tbxSearch.text;
        dataSet.selectedDays = period;
        navManager.setCustomInfo('frmReport', dataSet);
        navManager.navigateTo("frmDateRange");
  },
  showReportTypes: function(){
        var navManager = applicationManager.getNavigationManager();
    //    navManager.navigateTo("frmReportType");
   // var data;
   // data.reportTypeData = this.reportTypeData;
    navManager.setCustomInfo("frmReportType",this.reportData.response.reportTypeList);
    navManager.navigateTo("frmReportType");
  },
  
  checkPermissions:function(){
    let generateReportPermission = applicationManager.getConfigurationManager().checkUserPermission("WEALTH_REPORT_MANAGEMENT_REPORT_CREATE");
    this.view.flxBtn.setVisibility(generateReportPermission);
    this.view.flxTimePeriod.setVisibility(generateReportPermission);
    this.view.flxReportType.setVisibility(generateReportPermission);

    let downloadStatementPermission = applicationManager.getConfigurationManager().checkUserPermission("WEALTH_REPORT_MANAGEMENT_REPORT_DOWNLOAD");

    if(generateReportPermission && downloadStatementPermission){
      this.view.lblCommon.setVisibility(false);
      this.view.flxReport.setVisibility(generateReportPermission);
      this.view.flxStatement.setVisibility(downloadStatementPermission);
    }else{
      this.view.lblCommon.setVisibility(true);
      this.view.flxReport.setVisibility(false);
      this.view.flxStatement.setVisibility(false);
      this.view.segDownload.setVisibility(downloadStatementPermission);
      this.view.lblCommon.text = generateReportPermission ? "Generate Report" : "Download Statement" ;
    }

  }
});