define({ 
dateRange : [],
performanceData : [],
segCounter: "",
segData: "",
init : function(){
    var navManager = applicationManager.getNavigationManager();
    var currentForm=navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
    this.view.lblPreviousDays.text=kony.i18n.getLocalizedString("i18n.wealth.previous30Days");  
},
  preShow:function(){
    if(applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone"){
      this.view.flxHeader.isVisible = true;
    }
    else{
      this.view.flxHeader.isVisible = false;
    }
    var navManager=applicationManager.getNavigationManager();
    var searchFlag = navManager.getCustomInfo("frmPortfolioDetails");
    navManager.setCustomInfo("frmPortfolioDetails", false);
    this.dateRange = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").selectedDateRangeDetails;
    this.performanceData = navManager.getCustomInfo("frmPerformance");
    if(searchFlag == true){
     this.chartDetails();
    }
    if(applicationManager.getModulesPresentationController("WealthPortfolioUIModule").benchmark == ""){
      applicationManager.getModulesPresentationController("WealthPortfolioUIModule").benchmark = this.performanceData.response.benchMarkList[0].benchMark;
    }
    this.view.lblBenchmarkValue.text = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").benchmark;
    this.initActions();
    this.view.brwPerformanceChart.onPageFinished = this.setDataToChart;
    this.setDataToChart();
    this.segCounter = 0;
    this.setFormData(this.performanceData);
  },
  initActions:function(){
    this.setLblPreviousDays();
    this.view.flxAdditionalOptions.setVisibility(false);
    this.view.customHeader.flxBack.onClick =this.onBack;
    this.view.flxTimePeriod.onTouchEnd = this.timePeriod;
    this.view.btnChart.onClick = this.chartDetails;
    this.view.btnMonthlyOverview.onClick = this.monthlyOverviewDetails;
    this.view.flxBenchmark.onTouchEnd = this.benchmark;
    this.view.btnLoadMore.onClick = this.loadSegDetails;
    this.view.imgInfo.onTouchEnd = this.timeWeight;
    this.view.imgMoneyInfo.onTouchEnd = this.moneyWeight;
    this.view.flxClose.onTouchEnd = this.closePopUp;
  },
  closePopUp: function(){
    this.view.flxAdditionalOptions.setVisibility(false);
  },
  timeWeight: function(){
    this.view.flxAdditionalOptions.setVisibility(true);
    this.view.lblPerformance.text = "Time-Weighted Return";
    this.view.lblDetails.text = "Return calculation that eliminates the effects on growth rates created by any inflows or outflows of cash. The time-weighted return breaks up the return into separate intervals based on whether cash was added or withdrawn.";
  },
  moneyWeight: function(){
    this.view.flxAdditionalOptions.setVisibility(true);
     this.view.lblPerformance.text = "Money-Weighted Return";
    this.view.lblDetails.text = "Return calculation that uses the rate of return that will set the present values of all cash flows equal to the value of the initial investment. For periods without cash flows Money-weighted return and Time-Weighted return are equal.";
  },
  benchmark: function(){
    var benchmark = this.performanceData.response.benchMarkList;
    var navManager = applicationManager.getNavigationManager();
        var data = {};
        data.benchmarkData = this.performanceData.response.benchMarkList;
        navManager.setCustomInfo("frmBenchmark", data);
        navManager.navigateTo("frmBenchmark");
  },
  setFormData:function(value){
    var performance = value.response;
    var forUtility = applicationManager.getFormatUtilManager();
    this.view.lblValue.text = forUtility.formatAmountandAppendCurrencySymbol(performance.performanceList.initialValue, performance.referenceCurrency);
    this.view.lblNetDepositVal.text = forUtility.formatAmountandAppendCurrencySymbol(performance.performanceList.netDeposit, performance.referenceCurrency);
    this.view.lblPLValue.text = forUtility.formatAmountandAppendCurrencySymbol(performance.performanceList.pl, performance.referenceCurrency);
    this.view.lblFeesVal.text = forUtility.formatAmountandAppendCurrencySymbol(performance.performanceList.feesAndTax, performance.referenceCurrency);
    this.view.lblCurValue.text = forUtility.formatAmountandAppendCurrencySymbol(performance.performanceList.currentValue, performance.referenceCurrency);
    var timeWeighted = (forUtility.formatAmount(performance.performanceList.timeWeighted)).replace(",", ".");
    var moneyWeighted = (forUtility.formatAmount(performance.performanceList.moneyWeighted)).replace(",", ".");
    if(performance.performanceList.timeWeighted < 0){
      this.view.lblTimeReturnVal.skin = "sknIblEE0005SSPsb45px";
      this.view.lblTimeReturnVal.text = timeWeighted +"%";
    }
    else{
      this.view.lblTimeReturnVal.skin = "sknIbl2f8523SSPsb45px";
      this.view.lblTimeReturnVal.text = "+" +timeWeighted +"%";
    }
    if(performance.performanceList.moneyWeighted < 0){
      this.view.lblMoneyReturnVal.skin = "sknIblEE0005SSPsb45px";
      this.view.lblMoneyReturnVal.text = moneyWeighted +"%";
    }
    else{
      this.view.lblMoneyReturnVal.skin = "sknIbl2f8523SSPsb45px";
      this.view.lblMoneyReturnVal.text = "+" +moneyWeighted +"%";
    }
    this.setDataToSegment(performance);
  },
  setDataToChart: function(){
    var currForm = kony.application.getCurrentForm();
    var data = this.performanceData.response.monthlyOverview;
    var data1 = [];
    var data2 = [];
    var data3 = [];
    for (var list in data){
      var formattedDate = data[list].dateTime.slice(4,6)+"/"+data[list].dateTime.slice(6,8)+"/"+data[list].dateTime.slice(0,4);
      data1.push(formattedDate);
      if(data[list].percentageChange == ""){
        data[list].percentageChange = "0";
      }
      data2.push(JSON.parse(data[list].percentageChange));
      if(data[list].benchMarkIndex == ""){
        data[list].benchMarkIndex = "0";
      }
      data3.push(JSON.parse(data[list].benchMarkIndex));
    }
      var selectedValue = this.view.lblPreviousDays.text;
      var period;
      if(selectedValue == "1 Year"){
        period ="OneY";
      }
      else if(selectedValue == "YTD"){
        period ="YTD";
      }
      else if(selectedValue == "Since Inception"){
        period ="Inception";
      }
      else{
        period ="Free";
        let date1 = new Date(this.view.lblPreviousDays.text.split("-")[0].replace(" ",""));
        let date2 = new Date(this.view.lblPreviousDays.text.split("-")[1].replace(" ",""));
        var diffTime = Math.abs(date2 - date1);
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if(diffDays > 365)
          period = "Inception";
      }
    this.view.brwPerformanceChart.evaluateJavaScript("AddPerformanceLineChart( " + JSON.stringify(data1) + " ," + JSON.stringify(data2) + "," + JSON.stringify(data3) + "," + JSON.stringify(period) + " );");
    currForm.forceLayout();
  },
  setDataToSegment: function(performance){
        var currForm = kony.application.getCurrentForm();
        var segData = [];
        var data = performance.monthlyOverview;
        for (var list in data) {
            var storeData;
            var forUtility = applicationManager.getFormatUtilManager();
            var portfolioReturn = forUtility.formatAmountandAppendCurrencySymbol(data[list].portfolioReturn, performance.referenceCurrency);
            var formattedDate = data[list].dateTime.slice(4,6)+"/"+data[list].dateTime.slice(6,8)+"/"+data[list].dateTime.slice(0,4);
            var benchMarkReturn = (forUtility.formatAmount(data[list].benchMarkIndex)).replace(",", ".");
            var percentageChange = (forUtility.formatAmount(data[list].percentageChange)).replace(",", ".");
          if(data[list].percentageChange < 0 && data[list].benchMarkIndex < 0){
            storeData = {
                date: formattedDate,
                percentageChange: {
                            "skin": "sknLblEE0005SSP26px",
                            "text":  percentageChange +"%"
                        },
                portfolioReturn: portfolioReturn,
                benchMarkReturn: {
                            "skin": "sknLblEE0005SSP26px",
                            "text":  benchMarkReturn +"%"
                        }
            }
          } 
          else if(data[list].percentageChange < 0 || data[list].benchMarkIndex < 0){
            if(data[list].percentageChange < 0){
              storeData = {
                date: formattedDate,
                percentageChange: {
                            "skin": "sknLblEE0005SSP26px",
                            "text":  percentageChange +"%"
                        },
                portfolioReturn: portfolioReturn,
                benchMarkReturn: {
                            "skin": "sknIWlbl2F8523SSPR15px",
                            "text": "+" + benchMarkReturn +"%"
                        }
            }
            }
            else{
              storeData = {
                date: formattedDate,
                percentageChange: {
                            "skin": "sknIWlbl2F8523SSPR15px",
                            "text": "+" + percentageChange +"%"
                        },
                portfolioReturn: portfolioReturn,
                benchMarkReturn: {
                            "skin": "sknLblEE0005SSP26px",
                            "text":  benchMarkReturn +"%"
                        }
            }
            }
          }
          else{
            storeData = {
                date: formattedDate,
                percentageChange: {
                            "skin": "sknIWlbl2F8523SSPR15px",
                            "text": "+" + percentageChange +"%"
                        },
                portfolioReturn: portfolioReturn,
                benchMarkReturn: {
                            "skin": "sknIWlbl2F8523SSPR15px",
                            "text": "+" + benchMarkReturn +"%"
                        }
            }
          }
            segData.push(storeData);
        }
        this.view.segDetails.widgetDataMap = {
            lblDate: "date",
            lblPercentage: "percentageChange",
            lblAmount: "portfolioReturn",
            lblProfitLoss: "benchMarkReturn"
        }
        this.segData = segData;
    if(data.length <= 10){
          this.view.btnLoadMore.setVisibility(false);
          this.view.segDetails.setData(segData);
        }
        else{
        this.view.btnLoadMore.setVisibility(true);
        var startIndex = 0;
        var endIndex = 9;
        var tempArray =  this.getArrayFromIndex(startIndex , endIndex)
        this.view.segDetails.setData(tempArray);
        }
        currForm.forceLayout();
  },
  getArrayFromIndex: function(start, end){
    var arryTemp = [];
    for (var i = start; i <= end ; i++) {
      arryTemp.push(this.segData[i]);
    }
	return arryTemp;
  },
  loadSegDetails: function(){
    this.segCounter = this.segCounter + 1;
    var startIndex = this.segCounter * 10;
    var endIndex =  startIndex + 9;
    var arrayNew =[];
    if (endIndex < this.segData.length) {
       arrayNew = this.getArrayFromIndex (startIndex , endIndex);
       this.view.btnLoadMore.isVisible = true;
    }
    else{
       var  newEnd = this.segData.length;
       arrayNew = this.getArrayFromIndex(startIndex , newEnd-1);
       this.view.btnLoadMore.isVisible = false;
    }
    var combinedArray = [].concat(this.view.segDetails.data, arrayNew);
    this.view.segDetails.setData(combinedArray);
  },
    setLblPreviousDays:function(){
     var forUtility = applicationManager.getFormatUtilManager();
      if(this.dateRange.selectedPeriod){
    if(this.dateRange.selectedPeriod=="1Year"){
       this.view.lblPreviousDays.text= "1 Year";
    }else if(this.dateRange.selectedPeriod=="YTD"){
       this.view.lblPreviousDays.text= "YTD";
    }else if(this.dateRange.selectedPeriod=="sinceInception"){
       this.view.lblPreviousDays.text= "Since Inception";
    }else{
      var startDateObj=this.dateRange.startDate.split("-");
        var formattedstartDate=startDateObj[1] +"/"+ startDateObj[2] +"/"+ startDateObj[0];
       var endDateObj=this.dateRange.endDate.split("-");
         var formattedendDate=endDateObj[1] +"/"+ endDateObj[2] +"/"+ endDateObj[0];
      this.view.lblPreviousDays.text=formattedstartDate + " - " + formattedendDate;
    }
      }
  },
    chartDetails: function(){
      this.view.btnChart.skin = "sknBtnFFFFFFBdr10px";
      this.view.btnMonthlyOverview.skin = "sknbtn000000SSPSemiBold15px";
      var currForm = kony.application.getCurrentForm();
      this.view.flxMonthlyOverviewDetails.setVisibility(false);
      currForm.forceLayout();
    },
    monthlyOverviewDetails: function(){
     this.view.btnMonthlyOverview.skin = "sknBtnFFFFFFBdr10px";
     this.view.btnChart.skin = "sknbtn000000SSPSemiBold15px";
     this.view.flxMonthlyOverviewDetails.setVisibility(true);
   },
    onBack : function () {
    var navMan = applicationManager.getNavigationManager();
      navMan.navigateTo("frmPortfolioDetails");
  },
    timePeriod: function(){
      var navManager = applicationManager.getNavigationManager();
      var dateFlag = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").selectedDateRangeDetails;
      var selectedValue = this.view.lblPreviousDays.text;
      var performance = "performance";
      var dataSet = navManager.getCustomInfo("frmPerformance");
      var period;
      if(selectedValue == "1 Year"){
        period ="1Year";
      }
      else if(selectedValue == "YTD"){
        period ="YTD";
      }
      else if(selectedValue == "Since Inception"){
        period ="sinceInception";
      }
      else{
        period ="freeDateSelected";
      }
      dataSet.performance = performance;
      dataSet.flag = dateFlag.flag;
      dataSet.selectedDays = period ;
      dataSet.startDate=dateFlag.startDate;
      navManager.setCustomInfo('frmPerformance', dataSet);
      navManager.navigateTo("frmDateRange");
  },
});