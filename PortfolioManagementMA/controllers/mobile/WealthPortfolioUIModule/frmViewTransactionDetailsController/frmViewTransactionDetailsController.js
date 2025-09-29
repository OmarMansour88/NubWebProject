define({ 

 init : function(){
    var navManager = applicationManager.getNavigationManager();
    var currentForm=navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
 
  },
  preShow:function(){
    if(applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone"){
      this.view.flxHeader.isVisible = true;
    }
    else{
      this.view.flxHeader.isVisible = false;
    }
   var navManager = applicationManager.getNavigationManager();
   var transactionDetail = navManager.getCustomInfo("frmViewTransactionDetails");
   var prevForm = kony.application.getPreviousForm().id;
   var transDetail=transactionDetail.response;
    if(prevForm === "frmInstrumentTransactions") {
       this.view.flxInstrument.setVisibility(false);
   var forUtility = applicationManager.getFormatUtilManager();
  var tradeDateObj=forUtility.getDateObjectfromString(transDetail.tradeDate);
  var valueDateObj=forUtility.getDateObjectfromString(transDetail.valueDate);
  var formattedTradeDate=forUtility.getFormatedDateString(tradeDateObj, forUtility.getApplicationDateFormat());
  var formattedValueDate=forUtility.getFormatedDateString(valueDateObj, forUtility.getApplicationDateFormat());
  transDetail.instrumentAmount = forUtility.deFormatAmount(transDetail.instrumentAmount);
  var formattedAmount= forUtility.formatAmountandAppendCurrencySymbol(transDetail.instrumentAmount, transDetail.referenceCurrency);
  transDetail.limitPrice = forUtility.deFormatAmount(transDetail.limitPrice);
  var formattedPriceVal = forUtility.formatAmountandAppendCurrencySymbol(transDetail.limitPrice, transDetail.instrumentCurrency);
  transDetail.netAmount = forUtility.deFormatAmount(transDetail.netAmount);
  var formattedNetAmount= forUtility.formatAmountandAppendCurrencySymbol(transDetail.netAmount, transDetail.instrumentCurrency);
  transDetail.fees = forUtility.deFormatAmount(transDetail.fees);
  var formattedfees= forUtility.formatAmountandAppendCurrencySymbol(transDetail.fees, transDetail.feesCurrency);
  transDetail.total = forUtility.deFormatAmount(transDetail.total);
  var formattedTotal= forUtility.formatAmountandAppendCurrencySymbol(transDetail.total, transDetail.referenceCurrency);
  //this.view.lblInstrument.text=transDetail.description;
  this.view.lblTradeDateVal.text=formattedTradeDate;
  this.view.lblTypeVal.text=formattedValueDate;
  this.view.lblQuantityVal.text=transDetail.orderType;
  this.view.lblPriceVal.text=transDetail.quantity;
  this.view.lblAmountVal.text=formattedPriceVal;
  this.view.lblExcahangeRateVal.text=formattedAmount;
  this.view.lblnstrAmountVal.text=Number(transDetail.exchangeRate).toFixed(2);
  this.view.lblValueDateVal.text=formattedNetAmount;
  this.view.lblFeesVal.text=formattedfees;
  this.view.lblTotalVal.text=formattedTotal;
  this.view.lblTradeDate.text=kony.i18n.getLocalizedString("i18n.wealth.tradeDate");
  this.view.lblType.text=kony.i18n.getLocalizedString("i18n.wealth.valueDate");
  this.view.lblQuantity.text=kony.i18n.getLocalizedString("i18n.wealth.type");
  this.view.lblPrice.text=kony.i18n.getLocalizedString("i18n.wealth.quantity");
  this.view.lblAmount.text=kony.i18n.getLocalizedString("i18n.wealth.price");
  this.view.lblExchangeRate.text=kony.i18n.getLocalizedString("i18n.wealth.amount");
  this.view.lblnstrAmount.text=kony.i18n.getLocalizedString("i18n.wealth.exchangeRate");
  this.view.lblValueDate.text=kony.i18n.getLocalizedString("i18n.wealth.amountInstr");
  this.view.lblFees.text=kony.i18n.getLocalizedString("i18n.wealth.fees");
  this.view.lblTotal.text=kony.i18n.getLocalizedString("i18n.wealth.total");
       }
    else{
       this.view.flxInstrument.setVisibility(true);
       this.setDataToTransactionDetail(transDetail); 
       }
    this.initActions();
  },
  initActions:function(){
    this.view.customHeader.flxBack.onTouchEnd = this.onBack;
  },
   postShow:function(){
  
},
   onBack : function () {
    var navigationMan=applicationManager.getNavigationManager();
    var prevForm = kony.application.getPreviousForm().id;
    if(prevForm === "frmInstrumentTransactions") 
    navigationMan.navigateTo("frmInstrumentTransactions");
    else
    navigationMan.navigateTo("frmTransactions");
  },

setDataToTransactionDetail:function(transDetail){
  //var amount=transDetail.limitPrice * transDetail.quantity;
  //var amount=transDetail.instrumentAmount;
  //var total=transDetail.total;
  var forUtility = applicationManager.getFormatUtilManager();
  var tradeDateObj=forUtility.getDateObjectfromString(transDetail.tradeDate);
  var valueDateObj=forUtility.getDateObjectfromString(transDetail.valueDate);
  var formattedTradeDate=forUtility.getFormatedDateString(tradeDateObj, forUtility.getApplicationDateFormat());
  var formattedValueDate=forUtility.getFormatedDateString(valueDateObj, forUtility.getApplicationDateFormat());
  transDetail.instrumentAmount = forUtility.deFormatAmount(transDetail.instrumentAmount);
  var formattedAmount= forUtility.formatAmountandAppendCurrencySymbol(transDetail.instrumentAmount, transDetail.referenceCurrency);
  transDetail.limitPrice = forUtility.deFormatAmount(transDetail.limitPrice);
  var formattedPriceVal = forUtility.formatAmountandAppendCurrencySymbol(transDetail.limitPrice, transDetail.instrumentCurrency);
  transDetail.netAmount = forUtility.deFormatAmount(transDetail.netAmount);
  var formattedNetAmount= forUtility.formatAmountandAppendCurrencySymbol(transDetail.netAmount, transDetail.instrumentCurrency);
  transDetail.fees = forUtility.deFormatAmount(transDetail.fees);
  var formattedfees= forUtility.formatAmountandAppendCurrencySymbol(transDetail.fees, transDetail.feesCurrency);
  transDetail.total = forUtility.deFormatAmount(transDetail.total);
  var formattedTotal= forUtility.formatAmountandAppendCurrencySymbol(transDetail.total, transDetail.referenceCurrency);
  this.view.lblInstrument.text=transDetail.description;
  this.view.lblTradeDateVal.text=formattedTradeDate;
  this.view.lblTypeVal.text=transDetail.orderType;
  this.view.lblQuantityVal.text=transDetail.quantity;
  this.view.lblPriceVal.text=formattedPriceVal;
  this.view.lblAmountVal.text=formattedAmount;
  this.view.lblExcahangeRateVal.text=Number(transDetail.exchangeRate).toFixed(2);
  this.view.lblnstrAmountVal.text=formattedNetAmount;
  this.view.lblValueDateVal.text=formattedValueDate;
  this.view.lblFeesVal.text=formattedfees;
  this.view.lblTotalVal.text=formattedTotal;
  this.view.lblTradeDate.text=kony.i18n.getLocalizedString("i18n.wealth.tradeDatemb");
  this.view.lblType.text=kony.i18n.getLocalizedString("i18n.wealth.orderType");
  this.view.lblQuantity.text=kony.i18n.getLocalizedString("i18n.wealth.quantity");
  this.view.lblPrice.text=kony.i18n.getLocalizedString("i18n.wealth.limitPrice");
  this.view.lblAmount.text=kony.i18n.getLocalizedString("i18n.wealth.amountColon");
  this.view.lblExchangeRate.text=kony.i18n.getLocalizedString("i18n.wealth.exchangeRate");
  this.view.lblnstrAmount.text=kony.i18n.getLocalizedString("i18n.wealth.amountInstr");
  this.view.lblValueDate.text=kony.i18n.getLocalizedString("i18n.wealth.valueDatemb");
  this.view.lblFees.text=kony.i18n.getLocalizedString("i18n.wealth.feesmb");
  this.view.lblTotal.text=kony.i18n.getLocalizedString("i18n.wealth.totalWithColon");
}
 });