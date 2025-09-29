define({
    selectedData: [],
    accountData: "",
    dateRange: [],
    sortByCustomData: "",
    init: function() {
        var navManager = applicationManager.getNavigationManager();
        var currentForm = navManager.getCurrentForm();
        applicationManager.getPresentationFormUtility().initCommonActions(this, "YES", currentForm);

    },
    preShow: function() {
        if (applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone") {
            this.view.flxHeader.isVisible = true;
        } else {
            this.view.flxHeader.isVisible = false;
        }
        this.view.flxAdditionalOptions.setVisibility(false);
        var navManager = applicationManager.getNavigationManager();
        var searchFlag = navManager.getCustomInfo("frmPortfolioDetails");
        if (searchFlag == true) {
            this.view.tbxSearch.text = "";
            this.view.imgClose.isVisible = false;
        }
        navManager.setCustomInfo("frmPortfolioDetails", false);
        this.dateRange = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").selectedDateRangeDetails;
        this.sortByCustomData = navManager.getCustomInfo("frmSortBy");
        var configManager = applicationManager.getConfigurationManager();
      if(configManager.getBaseCurrency() === 'EUR'){
      this.view.segmentDetailsWealth.setEuroFlow(true);
    }
      else{
         this.view.segmentDetailsWealth.setEuroFlow(false);
      }
        this.initActions();
        this.view.segmentDetailsWealth.setLblPreviousDays(this.dateRange);
            var params ={
"portfolioId":applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
"accountId":applicationManager.getModulesPresentationController("WealthPortfolioUIModule").accountNumber,
"dateFrom":this.dateRange.startDate.replace(/-/g, ''),
"dateTo":this.dateRange.endDate.replace(/-/g, ''),
"listType":"SEARCH",
"sortBy":(applicationManager.getModulesPresentationController("WealthPortfolioUIModule").sortByValueAccounts === "")?"bookingDate":applicationManager.getModulesPresentationController("WealthPortfolioUIModule").sortByValueAccounts,
"searchByInstrumentName":" "
};
      this.view.segmentDetailsWealth.setContext(params);
      this.checkPermission();
	  this.view.lblDownloadTransactions.text = kony.i18n.getLocalizedString("i18n.wealth.downloadAccountActivity");
	  this.view.lblSortyBy.text = kony.i18n.getLocalizedString("i18n.wealth.sortBy");
	},
    initActions: function() {
      applicationManager.getModulesPresentationController("WealthPortfolioUIModule").navPage = "";
      this.view.segmentDetailsWealth.onRowClickEvent = this.onAccountSelect;
    this.view.segmentDetailsWealth.onMoveToDateRange   = this.timePeriod;
      this.view.segmentDetailsWealth.onMoveToCashAccounts = this.cashAccounts;
        this.view.customHeader.flxSearch.onTouchEnd = this.moreOptions;
        this.view.flxCancelOption.onTouchEnd = this.onCancel;
        this.view.flxSortBy.onTouchEnd = this.onClickSortBy;
      this.view.flxDownloadTransactions.onTouchEnd = this.onClickDownloadTxns;
        this.view.customHeader.flxBack.onClick = this.onBack;
      
        var navManager = applicationManager.getNavigationManager();
        this.accountData = navManager.getCustomInfo("frmCashAccounts");
      this.view.segmentDetailsWealth.setCashAccounts(this.accountData);
    
          this.view.segmentDetailsWealth.onRequestEnd = function() {
      applicationManager.getPresentationUtility().dismissLoadingScreen();
    };
	this.view.segmentDetailsWealth.onRequestStart = function() {
      applicationManager.getPresentationUtility().showLoadingScreen();
    };
    },
      onSearch: function() {
        this.view.imgClose.isVisible = true;
        if (this.view.tbxSearch.text == "" || this.view.tbxSearch.text == null) {
            this.view.imgClose.isVisible = false;
        }
    },
    clearText: function() {
        this.view.tbxSearch.text = "";
        this.view.imgClose.isVisible = false;
        this.searchData();
    },
      setLblPreviousDays: function() {
        var forUtility = applicationManager.getFormatUtilManager();
        if (this.dateRange.selectedPeriod) {
            if (this.dateRange.selectedPeriod == "previous30DaysSelected") {
                this.view.lblPreviousDays.text = kony.i18n.getLocalizedString("i18n.wealth.previous30Days");
            } else if (this.dateRange.selectedPeriod == "3MonthsSelected") {
                this.view.lblPreviousDays.text = kony.i18n.getLocalizedString("i18n.wealth.threeMonths");
            } else if (this.dateRange.selectedPeriod == "6MonthsSelected") {
                this.view.lblPreviousDays.text = kony.i18n.getLocalizedString("i18n.wealth.sixMonths");
            } else if (this.dateRange.selectedPeriod == "lastYearSelected") {
                this.view.lblPreviousDays.text = kony.i18n.getLocalizedString("i18n.wealth.lastYear");
            } else {
              var startDate = this.dateFormat(this.dateRange.startDate);
              var startDateObj=startDate.split("-");
              var formattedstartDate=startDateObj[1] +"/"+ startDateObj[2] +"/"+ startDateObj[0];
              var endDate = this.dateFormat(this.dateRange.endDate);
              var endDateObj=endDate.split("-");
              var formattedendDate=endDateObj[1] +"/"+ endDateObj[2] +"/"+ endDateObj[0];
              this.view.lblPreviousDays.text = formattedstartDate + " - " + formattedendDate;
            }
        } 
    },
    postShow: function() {

    },
    cashAccounts: function() {
        var navManager = applicationManager.getNavigationManager();
        var data = {};
       // data.searchText = this.view.tbxSearch.text;
      var selectedValue = this.view.segmentDetailsWealth.setCashAccounts(this.accountData);
        if (this.accountData.cashAccountName == undefined) {
            data.response = this.accountData.response;
            data.accountName = this.accountData.accountName;
            data.cashData = this.accountData.cashData;
            navManager.setCustomInfo("frmCashAccounts", data);
        } else {
            data.response = this.accountData.response;
            data.accountName = this.accountData.cashAccountName;
            data.cashData = this.accountData.cashData;
            navManager.setCustomInfo("frmCashAccounts", data);
        }
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").navPage = "";
        navManager.navigateTo("frmCashAccounts");
    },
    moreOptions: function() {
       this.view.flxMainContainer.setEnabled(false);
    this.view.flxHeader.setEnabled(false);
        this.view.flxAdditionalOptions.setVisibility(true);
    },
    onCancel: function() {
       this.view.flxMainContainer.setEnabled(true);
    this.view.flxHeader.setEnabled(true);
        this.view.flxAdditionalOptions.setVisibility(false);
    },
      searchData: function() {
        var searchText = this.view.tbxSearch.text;
        this.view.segList.removeAll();
        var today = new Date();
        var endDate = today.getFullYear() + ('0' + (today.getMonth() + 1)).slice(-2) + ('0' + today.getDate()).slice(-2);
        var previousDate = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
        var startDate = previousDate.getFullYear() + ('0' + (previousDate.getMonth() + 1)).slice(-2) + ('0' + previousDate.getDate()).slice(-2);
        var sortVal = "bookingDate";
        if (this.sortByCustomData.response == undefined && this.dateRange.startDate == undefined) {
            this.dateRange.startDate = startDate;
            this.dateRange.endDate = endDate;
        } else if (this.sortByCustomData.response == undefined || this.dateRange.startDate == undefined) {
            if (this.dateRange.startDate) {
                startDate = this.dateRange.startDate;
                endDate = this.dateRange.endDate;
            } else {
                sortVal = this.sortByCustomData.response;
            }
        } else {
            startDate = this.dateRange.startDate;
            endDate = this.dateRange.endDate;
            sortVal = this.sortByCustomData.response;
        }
        var params = {
"portfolioId":applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
"accountId":applicationManager.getModulesPresentationController("WealthPortfolioUIModule").accountNumber,
"dateFrom":startDate,
"dateTo":endDate,
"listType":"SEARCH",
"sortBy":sortVal,
"searchByInstrumentName":searchText
                }
        var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
        wealthModule.getAccountActivity(params);
    },
    onClickSortBy: function() {
       this.view.flxMainContainer.setEnabled(true);
    this.view.flxHeader.setEnabled(true);
       var data = {};
        data.searchText = this.view.tbxSearch.text;
        var navManager = applicationManager.getNavigationManager();
        if (this.sortByCustomData.response == undefined) {
            data.sortByValue = "bookingDate";
            navManager.setCustomInfo("frmAccounts", data);
        } else {
            data.sortByValue = this.sortByCustomData.response;
            navManager.setCustomInfo("frmAccounts", data);
        }
        var navManager = applicationManager.getNavigationManager();
        navManager.navigateTo("frmSortBy");
    },
    onBack: function() {
        var navMan = applicationManager.getNavigationManager();
      navMan.navigateTo("frmPortfolioDetails");
    },
    timePeriod: function() {
        var navManager = applicationManager.getNavigationManager();
        var dateFlag = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").selectedDateRangeDetails;
    //  var selectedValue = this.view.lblPreviousDays.text;
      var selectedValue = this.view.segmentDetailsWealth.getPreviousDaysText();
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
        dataSet.flag = dateFlag.flag;
        dataSet.selectedDays = period;
        navManager.setCustomInfo('frmAccounts', dataSet);
        navManager.navigateTo("frmDateRange");
    },
    setDataToSegment: function(accountsList) {
        var scope = this;
        var currForm = kony.application.getCurrentForm();
        var segData = [];
        var rowData = [];
      var data = accountsList.response.accountActivityList.body;
      if(data.length == 0){
        this.view.segList.setVisibility(false);
        this.view.flxError.setVisibility(true);
      }
      else{
        this.view.segList.setVisibility(true);
        this.view.flxError.setVisibility(false);
        for (var list in data) {
            var storeData;
            var values;
            var forUtility = applicationManager.getFormatUtilManager();
            var amount = forUtility.formatAmountandAppendCurrencySymbol(data[list].amount, data[list].currencyId);
            var balance = forUtility.formatAmountandAppendCurrencySymbol(data[list].balance, data[list].currencyId);
            var name = data[list].displayName;
            if (data[list].shortName != undefined || data[list].shortName != "") {
                name = data[list].displayName + " " + data[list].shortName;
            }
            if (name.length >= 30) {
                name = name.substr(0, 30) + "...";
            }
            var bookDate = this.dateFormat(data[list].bookingDate);
            var bookingDate = forUtility.getDateObjectfromString(bookDate);
            var valDate = this.dateFormat(data[list].valueDate);
            var valueDate = forUtility.getDateObjectfromString(valDate);
            var formattedBookingDate = forUtility.getFormatedDateString(bookingDate, forUtility.getApplicationDateFormat());
            var formattedValueDate = forUtility.getFormatedDateString(valueDate, forUtility.getApplicationDateFormat())
            storeData = {
                accountName: name,
                amount: amount,
                balance: balance,
                type: data[list].displayName,
                instrument: data[list].shortName,
                quantity: data[list].quantity,
                bookingDate: formattedBookingDate,
                valueDate: formattedValueDate
            }
            if (data[list].quantity != "" && data[list].shortName != "") {
                values = {
                    Change: amount,
                    "Account Balance": balance,
                    Type: data[list].displayName,
                    Instrument: data[list].shortName,
                    Quantity: data[list].quantity,
                    "Booking Date": formattedBookingDate,
                    "Value Date": formattedValueDate
                }
            } else if (data[list].quantity != "" || data[list].shortName != "") {
                if (data[list].quantity) {
                    values = {
                        Change: amount,
                        "Account Balance": balance,
                        Type: data[list].displayName,
                        Quantity: data[list].quantity,
                        "Booking Date": formattedBookingDate,
                        "Value Date": formattedValueDate
                    }
                } else {
                    values = {
                        Change: amount,
                        "Account Balance": balance,
                        Type: data[list].displayName,
                        Instrument: data[list].shortName,
                        "Booking Date": formattedBookingDate,
                        "Value Date": formattedValueDate
                    }
                }
            } else {
                values = {
                    Change: amount,
                    "Account Balance": balance,
                    Type: data[list].displayName,
                    "Booking Date": formattedBookingDate,
                    "Value Date": formattedValueDate
                }
            }
            rowData.push(values);
            segData.push(storeData);
        }
        this.view.segList.widgetDataMap = {
            lblName: "accountName",
            lblValue: "amount",
            lblDate: "bookingDate",
            lblAmountValue: "balance"
        }
        this.view.segList.setData(segData);
        this.selectedData = rowData;
        currForm.forceLayout();
    }
    },
  dateFormat: function(date){
    //yyyymmdd - yyyy-mm-dd
    var formattedDate = date.slice(0,4)+"-"+date.slice(4,6)+"-"+date.slice(6,8);
    return formattedDate;
  },
    accountDetails: function() {
        var rowIndex = this.view.segList.selectedRowIndex[1];
        var value = this.selectedData[rowIndex];
        var navManager = applicationManager.getNavigationManager();
        var data = {};
        data.details = value;
        navManager.setCustomInfo("frmActivityDetails", data);
        navManager.navigateTo("frmActivityDetails");
    },
      onAccountSelect:function(rowData){
     var navManager=applicationManager.getNavigationManager();
     var data={};
     var value = rowData.row;
        var values;
        var forUtility = applicationManager.getFormatUtilManager();
        var amount = forUtility.formatAmountandAppendCurrencySymbol(value.amount, value.currencyId);
        var balance = forUtility.formatAmountandAppendCurrencySymbol(value.balance, value.currencyId);
        var bookDate = this.dateFormat(value.bookingDate);
            var bookingDate = forUtility.getDateObjectfromString(bookDate);
            var valDate = this.dateFormat(value.valueDate);
            var valueDate = forUtility.getDateObjectfromString(valDate);
            var formattedBookingDate = forUtility.getFormatedDateString(bookingDate, forUtility.getApplicationDateFormat());
            var formattedValueDate = forUtility.getFormatedDateString(valueDate, forUtility.getApplicationDateFormat())
        if (value.quantity != "" && value.shortName != "") {
                values = {
                    Change: amount,
                    "Account Balance": balance,
                    Type: value.displayName,
                    Instrument: value.shortName,
                    Quantity: value.quantity,
                    "Booking Date": formattedBookingDate,
                    "Value Date": formattedValueDate
                }
            } else if (value.quantity != "" || value.shortName != "") {
                if (value.quantity) {
                    values = {
                        Change: amount,
                        "Account Balance": balance,
                        Type: value.displayName,
                        Quantity: value.quantity,
                        "Booking Date": formattedBookingDate,
                        "Value Date": formattedValueDate
                    }
                } else {
                    values = {
                        Change: amount,
                        "Account Balance": balance,
                        Type: value.displayName,
                        Instrument: value.shortName,
                        "Booking Date": formattedBookingDate,
                        "Value Date": formattedValueDate
                    }
                }
            } else {
                values = {
                    Change: amount,
                    "Account Balance": balance,
                    Type: value.displayName,
                    "Booking Date": formattedBookingDate,
                    "Value Date": formattedValueDate
                }
            }
     data.details=values;
     navManager.setCustomInfo("frmActivityDetails", data);
     navManager.navigateTo("frmActivityDetails");
  },
  
  onClickDownloadTxns: function() {
     this.view.flxMainContainer.setEnabled(true);
    this.view.flxHeader.setEnabled(true);
      applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams = this.view.segmentDetailsWealth.getCriteriaObjValue(); 
      applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams.navPage = "Accounts Activity";
      var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
        wealthModule.getDownloadList(applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams);
        //kony.print("test"+applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams);
    },
    onClickDownloadMessage:function(base64String,filename)
  {
    try 
    {  
       //this.view.flxPopup.setVisibility(false);
       this.view.flxAdditionalOptions.isVisible = false;
       this.view.socialshare.shareWithBase64(base64String,filename);
    }catch(error){
   
      applicationManager.getPresentationUtility().dismissLoadingScreen();
    }
  },
  checkPermission: function(){
    var configManager = applicationManager.getConfigurationManager();
    var getPermissionDetails = JSON.parse(this.view.segmentDetailsWealth.getFeaturesAndPermissions());
    var accountActivityDetailViewPermission=false;
    if(typeof getPermissionDetails !=="undefined")
      {
        if (getPermissionDetails.viewAccountDetails.length > 0) {
        accountActivityDetailViewPermission = configManager.checkAtLeastOnePermission(getPermissionDetails.viewAccountDetails);
        this.view.segmentDetailsWealth.onRowClickEvent= accountActivityDetailViewPermission ? this.onAccountSelect : "";
        }
        
      }
    
    
  },
});