define({
    sortByValue: "",
    selectedPeriod: "",
    isSelected: "",
    duration: "",
    fromDateVal:"",
    toDateVal:"",
    init: function() {
        var scope = this;
        var currentFormObject = kony.application.getCurrentForm();
        var currentForm = currentFormObject.id;
        applicationManager.getPresentationFormUtility().initCommonActions(this, "CALLBACK", currentForm, scope.navigateCustomBack);
        this.onSelectToDate();
    },
    onBack: function() {
        try {
        var navigationMan=applicationManager.getNavigationManager();
        var previousForm=kony.application.getPreviousForm().id;
        if(previousForm==="frmOrders"){
          navigationMan.navigateTo("frmOrders");
        }else if(previousForm==="frmViewOrderHistoryDetails"){
          navigationMan.navigateTo("frmOrders");
        }else if(previousForm==="frmTransactions"){
          navigationMan.navigateTo("frmTransactions");
        }else if(previousForm==="frmViewTransactionDetails"){
          navigationMan.navigateTo("frmTransactions");
        } else if(previousForm==="frmInstrumentTransactions"){
          navigationMan.navigateTo("frmInstrumentTransactions");
        } else if(previousForm==="frmAccounts"){
            navigationMan.navigateTo("frmAccounts");
        }
        else{
          navigationMan.goBack();
        }
        } catch (e) {
        kony.print("exception onBack" + e);
      }
    },
    preShow: function() {
        if (kony.os.deviceInfo().name === "iPhone") {
            this.view.flxHeader.isVisible = false;
        }
        this.view.customHeader.flxBack.onClick = this.onBack;
        this.view.wealthCalendar.preShow();
        if (this.view.wealthCalendar.selectedDate === '') {
            this.view.btnContinue.setEnabled(false);
        } else {
            this.view.btnContinue.setEnabled(true);
        }
        this.view.flxError.setVisibility(false);
        this.view.wealthCalendar.selectedDate = '';
        this.view.wealthCalendar.triggerContinueAction = false;
        this.view.wealthCalendar.updateDateBullets();
        var startDate = new Date();
        var pastDate = (startDate.getMonth() + 1) + "/" + startDate.getDate() + "/" + 1971;
        var currentDate = (startDate.getMonth() + 1) + "/" + (startDate.getDate() + 1) + "/" + startDate.getFullYear();
        this.view.wealthCalendar.setFirstEnabledDate(pastDate);
        this.view.wealthCalendar.setLastEnabledDate(currentDate);
        var navManager = applicationManager.getNavigationManager();
        this.sortByValue = navManager.getCustomInfo("frmSortBy");
        //var prevForm = navManager.getPreviousForm();
		    var prevForm = kony.application.getPreviousForm().id;
      if(prevForm === "frmTransactions"){
        this.selectedPeriod = navManager.getCustomInfo("frmTransactions");
      }
      else if(prevForm === "frmOrder"){
        this.selectedPeriod = navManager.getCustomInfo("frmOrder");
      }
      else if(prevForm === "frmPerformance"){
        this.selectedPeriod = navManager.getCustomInfo("frmPerformance");
      }
      else if(prevForm == "frmAccounts"){
        this.selectedPeriod = navManager.getCustomInfo("frmAccounts");
      }
      else if(prevForm === "frmOrders"){
        this.selectedPeriod = navManager.getCustomInfo("frmOrders");
      }
      else if(prevForm === "frmInstrumentTransactions"){
        this.selectedPeriod = navManager.getCustomInfo("frmInstrumentTransactions");
      }
      else{
         this.selectedPeriod = navManager.getCustomInfo("frmReport");
      }
        this.highlightSelectedPeriod();
        this.initActions();
    },

    highlightSelectedPeriod: function() {
      if(this.selectedPeriod.performance){
        this.performanceFilter();
      }
      else{
        this.dateRangeDetails();
      }
        if (this.selectedPeriod.selectedDays == "previous30DaysSelected") {
            this.setOneMonth();
        } else if (this.selectedPeriod.selectedDays == "3MonthsSelected") {
            this.setThreeMonths();
        } else if (this.selectedPeriod.selectedDays == "6MonthsSelected") {
            this.setSixMonths();
        } else if (this.selectedPeriod.selectedDays == "lastYearSelected") {
            this.setLastYear();
        } else if (this.selectedPeriod.selectedDays == "1Year") {
            this.setOneMonth();
        } else if (this.selectedPeriod.selectedDays == "YTD") {
          this.setThreeMonths();
        } else if (this.selectedPeriod.selectedDays == "sinceInception") {
          this.setSixMonths();
        } else {
        this.view.btnPeriodicDays.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.view.btnThreeMonths.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.view.btnSixMonths.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.view.btnLastYear.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
          let sDate = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").selectedDateRangeDetails.startDate;
          let tempDate = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").selectedDateRangeDetails.endDate;        
          let toDate =  tempDate.split('-')[1] + "/" + tempDate.split('-')[2] + "/" + tempDate.split('-')[0];
          let stDate = sDate.split('-')[1] + "/" + sDate.split('-')[2] + "/" + sDate.split('-')[0];
          this.fromDateCalcOnBtnSelection(stDate);
          this.onSelectToDate();
          this.view.wealthCalendar.setSelectedDate(toDate);
          this.view.wealthCalendar.setMonthLabelText();
          
        }
    },
    dateRangeDetails: function(){
      this.view.btnPeriodicDays.text = "Previous 30 days";
      this.view.btnThreeMonths.text = "3 Months";
      this.view.btnSixMonths.text = "6 Months";
      var navManager = applicationManager.getNavigationManager();
      //var prevForm = navManager.getPreviousForm();
      var prevForm = kony.application.getPreviousForm().id;
      if(prevForm === "frmOrders"){
        this.view.btnLastYear.setVisibility(false);
      }
      else{
        this.view.btnLastYear.setVisibility(true);
        this.view.btnLastYear.text ="Last year";
      }
      this.view.btnPeriodicDays.padding = [2,0,2,0];
      this.view.btnThreeMonths.padding = [2,0,2,0];
      this.view.btnSixMonths.padding = [2,0,2,0];
    },
    performanceFilter: function(){
      this.view.btnPeriodicDays.text = "1 Y";
      this.view.btnThreeMonths.text = "YTD";
      this.view.btnSixMonths.text = "Since Inception";
      this.view.btnPeriodicDays.padding = [3,0,3,0];
      this.view.btnThreeMonths.padding = [3,0,3,0];
      this.view.btnSixMonths.padding = [3,0,3,0];
      this.view.btnLastYear.setVisibility(false);
    },
    initActions: function() {
        var scope = this;
        this.view.btnContinue.onClick = this.continueAction;
        this.view.customHeader.flxBack.onClick = this.onBack;
        this.view.btnPeriodicDays.onClick = this.setOneMonth;
        this.view.btnThreeMonths.onClick = this.setThreeMonths;
        this.view.btnSixMonths.onClick = this.setSixMonths;
        this.view.btnLastYear.onClick = this.setLastYear;
        this.view.flxFrom.onTouchEnd = this.onSelectFromDateValue;
        this.view.flxTo.onTouchEnd = this.onSelectToDateValue;
    },
    setOneMonth: function() {
        this.view.btnPeriodicDays.skin = "sknIWBtnBg003E75Border1pxFFFFFF40px";
        this.view.btnThreeMonths.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.view.btnSixMonths.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.view.btnLastYear.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.onSelectToDate();
      if(this.view.btnPeriodicDays.text == "1 Y"){
        this.lastYearSelection();
        this.isSelected = "1Year";
        this.duration = "OneY";
      }
      else{
        this.fromDateCalculation(30);
        this.isSelected = "previous30DaysSelected";
      }
    },
    setThreeMonths: function() {
        this.view.btnPeriodicDays.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.view.btnThreeMonths.pressedSkin = "sknIWBtnBg003E75Border1pxFFFFFF40px";
        this.view.btnThreeMonths.skin = "sknIWBtnBg003E75Border1pxFFFFFF40px";
        this.view.btnSixMonths.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.view.btnLastYear.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.onSelectToDate();
       if(this.view.btnThreeMonths.text === "YTD"){
        this.isSelected = "YTD";
        this.duration = "YTD";
        let startDate = new Date();
        var fromDateVal = "01/01/" + startDate.getFullYear();
        this.fromDateCalcOnBtnSelection(fromDateVal);
        var toDate = (startDate.getMonth() + 1) + "/" + startDate.getDate() + "/" + startDate.getFullYear();
        this.view.wealthCalendar.setSelectedDate(toDate);
      }
      else{
        //Editing for the correct month
        let currDate = new Date();
		let prev3Month = new Date();
        prev3Month.setMonth(prev3Month.getMonth() - 3);
        startDate = new Date(prev3Month);            
        //calculate time difference  
        var time_difference = currDate.getTime() - startDate.getTime();  
        //calculate days difference by dividing total milliseconds in a day  
        var days_difference = time_difference / (1000 * 60 * 60 * 24); 
        n = parseInt(days_difference);
        //Till here
        this.fromDateCalculation(n); //n replaced 90
        this.isSelected = "3MonthsSelected";
      }
    },
    setSixMonths: function() {
        this.view.btnPeriodicDays.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.view.btnThreeMonths.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.view.btnSixMonths.pressedSkin = "sknIWBtnBg003E75Border1pxFFFFFF40px";
        this.view.btnSixMonths.skin = "sknIWBtnBg003E75Border1pxFFFFFF40px";
        this.view.btnLastYear.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.onSelectToDate();
      if(this.view.btnSixMonths.text === "Since Inception"){
        // commented if condition to handle as same as in OLB
//         if(applicationManager.getModulesPresentationController("WealthPortfolioUIModule").jointAccountDetails.portfolioManagedSince!=='' && applicationManager.getModulesPresentationController("WealthPortfolioUIModule").jointAccountDetails.portfolioManagedSince !== undefined)
//           {
//             // To calculate the no. of days between two dates
//             var date2 =new Date();
//             var date1 = new Date(applicationManager.getModulesPresentationController("WealthPortfolioUIModule").jointAccountDetails.portfolioManagedSince);
//             var Difference_In_Time = date2.getTime() - date1.getTime();
//             var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
//             this.fromDateCalculation(Difference_In_Days);
//           }
//         else
//           {
            this.fromDateCalculation(548);
//           }
        
        this.isSelected = "sinceInception";
        this.duration = "Inception";
      }
      else{
        //Editing for the correct month
        let currDate = new Date();
		let prev6Month = new Date();
        prev6Month.setMonth(prev6Month.getMonth() - 6);
        startDate = new Date(prev6Month);            
        //calculate time difference  
        var time_difference = currDate.getTime() - startDate.getTime();  
        //calculate days difference by dividing total milliseconds in a day  
        var days_difference = time_difference / (1000 * 60 * 60 * 24); 
        n = parseInt(days_difference);
        //Till here
        this.fromDateCalculation(n); //n replaced 180
        this.isSelected = "6MonthsSelected";
      }
    },
    setLastYear: function() {
        this.view.btnPeriodicDays.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.view.btnThreeMonths.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.view.btnSixMonths.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.view.btnLastYear.pressedSkin = "sknIWBtnBg003E75Border1pxFFFFFF40px";
        this.view.btnLastYear.skin = "sknIWBtnBg003E75Border1pxFFFFFF40px";
        this.onSelectToDate();
        this.lastYearSelection();
    },
  lastYearSelection: function(){
        var pastDate = new Date();
        var month = pastDate.getMonth() + 1;
        var fromDate = pastDate.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (fromDate < 10) {
            fromDate = "0" + fromDate;
        }
        var fromDateVal = month + "/" + fromDate + "/" + (pastDate.getFullYear() - 1);
        this.fromDateCalcOnBtnSelection(fromDateVal);
        var startDate = new Date();
        var toDate = (startDate.getMonth() + 1) + "/" + startDate.getDate() + "/" + startDate.getFullYear();
        this.view.wealthCalendar.setSelectedDate(toDate);
        this.isSelected = "lastYearSelected";
  },
    onSelectFromDateValue: function() {
        this.onSelectFromDate();
        var fromMonth1 = this.view.lblDayOneVal.text;
        var fromMonth2 = this.view.lblDayTwoVal.text;
        var fromDate1 = this.view.lblMonthOneVal.text;
        var fromDate2 = this.view.lblMonthTwoVal.text;
        var fromYear1 = this.view.lblYearOneVal.text;
        var fromYear2 = this.view.lblYearTwoVal.text;
        var fromYear3 = this.view.lblYearThreeVal.text;
        var fromYear4 = this.view.lblYearFourVal.text;
        var fromDate = fromMonth1 + fromMonth2 + "/" + fromDate1 + fromDate2 + "/" + fromYear1 + fromYear2 + fromYear3 + fromYear4;
        this.fromDateVal=fromDate;
      this.view.wealthCalendar.setSelectedDate(fromDate);
      this.view.wealthCalendar.resetCal();
    },
    onSelectFromDate: function() {
        this.view.btnPeriodicDays.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.view.btnThreeMonths.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.view.btnSixMonths.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.view.btnLastYear.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.view.flxFromSeparator.skin = "sknFlx003e75Bg";
        this.view.flxSeparatorDate.skin = "sknFlxfafafa";
        var navMan = applicationManager.getNavigationManager();
        var setValue = true;
        var dataSet = {};
        dataSet.flag = setValue;
        navMan.setCustomInfo('frmDateRange', dataSet);
    },
    onSelectToDateValue: function() {
        this.view.btnPeriodicDays.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.view.btnThreeMonths.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.view.btnSixMonths.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.view.btnLastYear.skin = "sknIWBtnBgFFFFFFBorder1px003E7540px";
        this.onSelectToDate();
        var toMonth1 = this.view.lblDayOne.text;
        var toMonth2 = this.view.lblDayTwo.text;
        var toDate1 = this.view.lblMonthOne.text;
        var toDate2 = this.view.lblMonthTwo.text;
        var toYear1 = this.view.lblYearOne.text;
        var toYear2 = this.view.lblYearTwo.text;
        var toYear3 = this.view.lblYearThree.text;
        var toYear4 = this.view.lblYearFour.text;
        var startDate = toYear1 + toYear2 + toYear3 + toYear4 + "-" + toMonth1 + toMonth2 + "-" + toDate1 + toDate2;
        var toDate = toMonth1 + toMonth2 + "/" + toDate1 + toDate2 + "/" + toYear1 + toYear2 + toYear3 + toYear4;
        this.toDateVal=toDate;
      this.view.wealthCalendar.setSelectedDate(toDate);
      this.view.wealthCalendar.resetCal();
    },
    onSelectToDate: function() {
        this.view.flxFromSeparator.skin = "sknFlxfafafa";
        this.view.flxSeparatorDate.skin = "sknFlx003e75Bg";
        var navMan = applicationManager.getNavigationManager();
        var setValue = false;
        var dataSet = {};
        dataSet.flag = setValue;
        navMan.setCustomInfo('frmDateRange', dataSet);
    },
    fromDateCalculation: function(n) {
        var date = Date.now() - 1000 * 60 * 60 * 24 * n;
        var pastDate = new Date(date);
        var month = pastDate.getMonth() + 1;
        var fromDate = pastDate.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (fromDate < 10) {
            fromDate = "0" + fromDate;
        }
        var fromDateVal = month + "/" + fromDate + "/" + pastDate.getFullYear();
        this.fromDateCalcOnBtnSelection(fromDateVal);
        var startDate = new Date();
        var toDate = (startDate.getMonth() + 1) + "/" + startDate.getDate() + "/" + startDate.getFullYear();
        this.view.wealthCalendar.setSelectedDate(toDate);
    },
    fromDateCalcOnBtnSelection: function(date) {
        this.view.lblDayOneVal.text = date.slice(0, 1);
        this.view.lblDayTwoVal.text = date.slice(1, 2);
        this.view.lblSlashDayVal.text = date.slice(2, 3);
        this.view.lblMonthOneVal.text = date.slice(3, 4);
        this.view.lblMonthTwoVal.text = date.slice(4, 5);
        this.view.lblSlashMonthVal.text = date.slice(5, 6);
        this.view.lblYearOneVal.text = date.slice(6, 7);
        this.view.lblYearTwoVal.text = date.slice(7, 8);
        this.view.lblYearThreeVal.text = date.slice(8, 9);
        this.view.lblYearFourVal.text = date.slice(9, 10);
    },
    continueAction: function() {
        var fromMonth1 = this.view.lblDayOneVal.text;
        var fromMonth2 = this.view.lblDayTwoVal.text;
        var fromDate1 = this.view.lblMonthOneVal.text;
        var fromDate2 = this.view.lblMonthTwoVal.text;
        var fromYear1 = this.view.lblYearOneVal.text;
        var fromYear2 = this.view.lblYearTwoVal.text;
        var fromYear3 = this.view.lblYearThreeVal.text;
        var fromYear4 = this.view.lblYearFourVal.text;
        var fromDateValue = fromYear1 + fromYear2 + fromYear3 + fromYear4 + "-" + fromMonth1 + fromMonth2 + "-" + fromDate1 + fromDate2;
        var fromDateAccounts = fromYear1 + fromYear2 + fromYear3 + fromYear4 + fromMonth1 + fromMonth2 + fromDate1 + fromDate2;
        var toMonth1 = this.view.lblDayOne.text;
        var toMonth2 = this.view.lblDayTwo.text;
        var toDate1 = this.view.lblMonthOne.text;
        var toDate2 = this.view.lblMonthTwo.text;
        var toYear1 = this.view.lblYearOne.text;
        var toYear2 = this.view.lblYearTwo.text;
        var toYear3 = this.view.lblYearThree.text;
        var toYear4 = this.view.lblYearFour.text;
        var toDateValue = toYear1 + toYear2 + toYear3 + toYear4 + "-" + toMonth1 + toMonth2 + "-" + toDate1 + toDate2;
        var toDateAccounts = toYear1 + toYear2 + toYear3 + toYear4 + toMonth1 + toMonth2 + toDate1 + toDate2; 
      var navManager = applicationManager.getNavigationManager();  
      if (fromDateValue > toDateValue) {
            this.view.lblError.text = "From date should be lesser than To date";
            this.view.flxError.setVisibility(true);
            this.view.btnContinue.setEnabled(false);
            this.view.btnContinue.skin = "sknBtnOnBoardingInactive";
        } else {
            this.view.flxError.setVisibility(false);
            this.view.btnContinue.setEnabled(true);
            this.view.btnContinue.skin = "sknBtn0095e426pxEnabled";
            //var prevForm = navManager.getPreviousForm();
			      var prevForm = kony.application.getPreviousForm().id;
      if(prevForm === "frmTransactions" || prevForm === "frmInstrumentTransactions" || prevForm === "frmOrder"|| prevForm === "frmOrders"){
            if (this.sortByValue.response == undefined) {
                var params = {
                    "portfolioId": applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
                    "startDate": fromDateValue,
                    "endDate": toDateValue,
                    "searchByInstrumentName": this.selectedPeriod.searchValue,
                    "sortBy": "tradeDate"
                }
            } else {
                var params = {
                    "portfolioId": applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
                    "startDate": fromDateValue,
                    "endDate": toDateValue,
                    "searchByInstrumentName": this.selectedPeriod.searchValue,
                    "sortBy": this.sortByValue.response
                }
            }
            if (this.view.btnPeriodicDays.skin == "sknIWBtnBgFFFFFFBorder1px003E7540px" &&
                this.view.btnThreeMonths.skin == "sknIWBtnBgFFFFFFBorder1px003E7540px" &&
                this.view.btnSixMonths.skin == "sknIWBtnBgFFFFFFBorder1px003E7540px" &&
                this.view.btnLastYear.skin == "sknIWBtnBgFFFFFFBorder1px003E7540px") {
                this.isSelected = "freeDateSelected";
            }
            var dateFlag = navManager.getCustomInfo("frmDateRange");
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").selectedDateRangeDetails = {
          flag: dateFlag.flag,
          startDate: fromDateValue,
          endDate: toDateValue,
          selectedPeriod: this.isSelected
        };
            if(prevForm === "frmTransactions"){
//              var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
//              wealthModule.getTransactions(params);
             navManager.navigateTo("frmTransactions");
            } 
           else if(prevForm === "frmInstrumentTransactions"){
//              var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
//              wealthModule.getTransactions(params);
             navManager.navigateTo("frmInstrumentTransactions");
            } 
			else if(prevForm === "frmOrders"){
				applicationManager.getModulesPresentationController("WealthPortfolioUIModule").isHistory = true;
              params.type = "history";
              var orderId; 
              if(applicationManager.getModulesPresentationController("WealthPortfolioUIModule").orderList.length === 0){
                orderId = null;
              }
              else{
                orderId = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").orderList.toString();
              }
              params.orderId = orderId;
              applicationManager.getModulesPresentationController("WealthPortfolioUIModule").isDateRange = true;
			// applicationManager.getModulesPresentationController("WealthPortfolioUIModule").dateBetween = data;
			navManager.navigateTo("frmOrders");
            }
            else {
              applicationManager.getModulesPresentationController("WealthPortfolioUIModule").isHistory = true;
              params.type = "history";
              var orderId; 
              if(applicationManager.getModulesPresentationController("WealthPortfolioUIModule").orderList.length === 0){
                orderId = null;
              }
              else{
                orderId = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").orderList.toString();
              }
              params.orderId = orderId;
              applicationManager.getModulesPresentationController("WealthPortfolioUIModule").isDateRange = true;
              var temp = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").selectedDateRangeDetails;
		      applicationManager.getModulesPresentationController("WealthPortfolioUIModule").dateBetween = temp;
              var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
              wealthModule.getOrdersDetails(params);
            } 
        }
          else if(prevForm === "frmPerformance"){
            if (this.view.btnPeriodicDays.skin == "sknIWBtnBgFFFFFFBorder1px003E7540px" &&
                this.view.btnThreeMonths.skin == "sknIWBtnBgFFFFFFBorder1px003E7540px" &&
                this.view.btnSixMonths.skin == "sknIWBtnBgFFFFFFBorder1px003E7540px" &&
                this.view.btnLastYear.skin == "sknIWBtnBgFFFFFFBorder1px003E7540px") {
                this.isSelected = "freeDateSelected";
                this.duration = "Free";
            }
            var dateFlag = navManager.getCustomInfo("frmDateRange");
            applicationManager.getModulesPresentationController("WealthPortfolioUIModule").selectedDateRangeDetails = {
            flag: dateFlag.flag,
            startDate: fromDateValue,
            endDate: toDateValue,
            selectedPeriod: this.isSelected,             
            duration: this.duration
              };
         //   navManager.setCustomInfo("frmDateRange", data);
            var date1 = new Date(fromDateValue);
            var date2 = new Date(toDateValue);
            var diffTime = Math.abs(date2 - date1);
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if(diffDays < 30 && this.duration == "Free"){
            this.view.lblError.text = "Free date selection should be greater than 30days"
            this.view.flxError.setVisibility(true);
            this.view.btnContinue.setEnabled(false);
            this.view.btnContinue.skin = "sknBtnOnBoardingInactive";
            }
            else{
            this.view.flxError.setVisibility(false);
            this.view.btnContinue.setEnabled(true);
            this.view.btnContinue.skin = "sknBtn0095e426pxEnabled";
            var params ={
  				"portfolioId":applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
  				"dateFrom":fromDateAccounts,
  				"dateTo":toDateAccounts,
  				"benchMarkIndex":applicationManager.getModulesPresentationController("WealthPortfolioUIModule").benchmark,
  				"duration":this.duration,
              "currencyId": applicationManager.getModulesPresentationController("WealthPortfolioUIModule").refCurrencyId
 }
          var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
            wealthModule.getPerformance(params);
          }
          }
            else if(prevForm === "frmReport"){
              if (this.view.btnPeriodicDays.skin == "sknIWBtnBgFFFFFFBorder1px003E7540px" && this.view.btnThreeMonths.skin == "sknIWBtnBgFFFFFFBorder1px003E7540px" && this.view.btnSixMonths.skin == "sknIWBtnBgFFFFFFBorder1px003E7540px" && this.view.btnLastYear.skin == "sknIWBtnBgFFFFFFBorder1px003E7540px") {
                    this.isSelected = "freeDateSelected";
                }
              var dateFlag = navManager.getCustomInfo("frmDateRange");
            applicationManager.getModulesPresentationController("WealthPortfolioUIModule").selectedDateRangeDetails = {
            flag: dateFlag.flag,
            startDate: fromDateValue,
            endDate: toDateValue,
            selectedPeriod: this.isSelected,
            };
            navManager.navigateTo("frmReport"); 
            }
          else{
            if (this.sortByValue.response == undefined) {
             var params ={
"portfolioId":applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
"accountId":applicationManager.getModulesPresentationController("WealthPortfolioUIModule").accountNumber,
"dateFrom":fromDateAccounts,
"dateTo":toDateAccounts,
"listType":"SEARCH",
"sortBy":"bookingDate",
"searchByInstrumentName":this.selectedPeriod.searchValue
}
            } else {
                var params = {
"portfolioId":applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
"accountId":applicationManager.getModulesPresentationController("WealthPortfolioUIModule").accountNumber,
"dateFrom":fromDateAccounts,
"dateTo":toDateAccounts,
"listType":"SEARCH",
"sortBy":this.sortByValue.response,
"searchByInstrumentName":this.selectedPeriod.searchValue
                }
            }
            if (this.view.btnPeriodicDays.skin == "sknIWBtnBgFFFFFFBorder1px003E7540px" &&
                this.view.btnThreeMonths.skin == "sknIWBtnBgFFFFFFBorder1px003E7540px" &&
                this.view.btnSixMonths.skin == "sknIWBtnBgFFFFFFBorder1px003E7540px" &&
                this.view.btnLastYear.skin == "sknIWBtnBgFFFFFFBorder1px003E7540px") {
                this.isSelected = "freeDateSelected";
            }
            var dateFlag = navManager.getCustomInfo("frmDateRange");
              applicationManager.getModulesPresentationController("WealthPortfolioUIModule").selectedDateRangeDetails = {
            flag: dateFlag.flag,
            startDate: fromDateValue,
            endDate: toDateValue,
            selectedPeriod: this.isSelected,
            };
            
            navManager.navigateTo("frmAccounts");
            
          }
        }
    },
});