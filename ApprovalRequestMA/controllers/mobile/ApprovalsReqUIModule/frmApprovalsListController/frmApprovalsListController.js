define(["CommonUtilities"], function(CommonUtilities){ 
  return{
    mockDataApprovals : {"BBGeneralTransaction":[{"Status":"Pending","TransactionType":"INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE","DebitOrCreditAccount":"200425033823231","AccountName":"Business Advantage Savings-X3231","companyName":"Sugar Dough Bakers Inc._KalyaniFinalSB","Amount":"2","CreatedOn":"2020-04-25 03:38:37.0","TransactionType_id":"INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE","Company_id":"200425033822747","Reccurence":"2","Frequency":"Yearly","StatusValue":"Pending","userName":"KalyaniFinalSB","Payee":"AT&T Mobile-X1232","CreatedBy":"1610413996","TransactionDate":"31/01/2020T09:49:18Z","Transaction_id":"154","createdby":"1610413996","receivedApprovals":"0","requiredApprovals":"1","Request_id":"1512","featureName":"International Account to Account Fund Transfer "},{"Status":"Pending","TransactionType":"TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE","DebitOrCreditAccount":"200425033823231","AccountName":"Business Advantage Savings-X3231","companyName":"Sugar Dough Bakers Inc._KalyaniFinalSB","Amount":"12","CreatedOn":"2020-04-25 03:38:37.0","TransactionType_id":"TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE","Company_id":"200425033822747","Frequency":"Once","StatusValue":"Pending","userName":"KalyaniFinalSB","Payee":"Mobile -X3243","CreatedBy":"1610413996","TransactionDate":"02/02/2020T08:20:10Z","Transaction_id":"320","createdby":"1610413996","receivedApprovals":"0","requiredApprovals":"1","Request_id":"1514","featureName":"Transfer between customer own accounts"},{"Status":"Pending","TransactionType":"BILL_PAY_CREATE","DebitOrCreditAccount":"200425033823303","AccountName":"Pro Business Checking-X3303","companyName":"Sugar Dough Bakers Inc._KalyaniFinalSB","Amount":"12","CreatedOn":"2020-04-25 03:38:37.0","TransactionType_id":"BILL_PAY_CREATE","Company_id":"200425033822747","StatusValue":"Pending","userName":"KalyaniFinalSB","Payee":"AT&T Mobile","CreatedBy":"1610413996","TransactionDate":"03/02/2020T08:25:39Z","Transaction_id":"324","createdby":"1610413996","receivedApprovals":"0","requiredApprovals":"1","Request_id":"1509","featureName":"Bill Payment Service"},{"Status":"Pending","TransactionType":"INTRA_BANK_FUND_TRANSFER_CREATE","DebitOrCreditAccount":"200425033823266","AccountName":"Progress Business Checking-X3266","companyName":"Sugar Dough Bakers Inc._KalyaniFinalSB","Amount":"12","CreatedOn":"2020-04-25 03:38:37.0","TransactionType_id":"INTRA_BANK_FUND_TRANSFER_CREATE","Company_id":"200425033822747","Frequency":"Once","StatusValue":"Pending","userName":"KalyaniFinalSB","Payee":"Airtel comm...-X2343","CreatedBy":"1610413996","TransactionDate":"05/02/2020T08:29:17Z","Transaction_id":"179","createdby":"1610413996","receivedApprovals":"0","requiredApprovals":"1","Request_id":"1511","featureName":"Intra Bank Fund Transfer"},{"Status":"Pending","TransactionType":"DOMESTIC_WIRE_TRANSFER_CREATE","DebitOrCreditAccount":"200425033823231","AccountName":"Business Advantage Savings-X3231","companyName":"Sugar Dough Bakers Inc._KalyaniFinalSB","Amount":"20","CreatedOn":"2020-04-25 03:38:38.0","TransactionType_id":"DOMESTIC_WIRE_TRANSFER_CREATE","Company_id":"200425033822747","StatusValue":"Pending","userName":"KalyaniFinalSB","Payee":"AT&T-X3244","CreatedBy":"1610413996","TransactionDate":"03/02/2020T03:38:38Z","Transaction_id":"1996","createdby":"1610413996","receivedApprovals":"0","requiredApprovals":"1","Request_id":"1516","featureName":"Domestic Wire Transfer"},{"Status":"Pending","TransactionType":"INTERNATIONAL_WIRE_TRANSFER_CREATE","DebitOrCreditAccount":"200425033823231","AccountName":"Business Advantage Savings-X3231","companyName":"Sugar Dough Bakers Inc._KalyaniFinalSB","Amount":"10","CreatedOn":"2020-04-25 03:38:38.0","TransactionType_id":"INTERNATIONAL_WIRE_TRANSFER_CREATE","Company_id":"200425033822747","StatusValue":"Pending","userName":"KalyaniFinalSB","Payee":"L&T-X7382","CreatedBy":"1610413996","TransactionDate":"03/02/2020T03:38:38Z","Transaction_id":"1995","createdby":"1610413996","receivedApprovals":"0","requiredApprovals":"1","Request_id":"1515","featureName":"International Wire Transfer"},{"Status":"Pending","TransactionType":"INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE","DebitOrCreditAccount":"200425033823231","AccountName":"Business Advantage Savings-X3231","companyName":"Sugar Dough Bakers Inc._KalyaniFinalSB","Amount":"2","CreatedOn":"2020-04-25 03:38:37.0","TransactionType_id":"INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE","Company_id":"200425033822747","Reccurence":"2","Frequency":"Yearly","StatusValue":"Pending","userName":"KalyaniFinalSB","Payee":"Airtel c....-x3245","CreatedBy":"1610413996","TransactionDate":"03/02/2020T09:49:18Z","Transaction_id":"170","createdby":"1610413996","receivedApprovals":"0","requiredApprovals":"1","Request_id":"1510","featureName":"Interbank Account to Account Fund Transfer"}],"opstatus":0,"httpStatusCode":0},
    _prevFormData : {},
    _isApprovalsOrRequests : "",
    _constantsSkin : {"headerImgUp" : "arrowupblue.png","imgReject" : "cancelreject.png","imgApprove" : "approvetick.png", "flxApproveSkin": "sknUnderlinef639afTab","flxRejectSkin" : "sknflxf6f6f6Bcg"},
    _approvalsReqModule: null,
    _fetchParams : {},
    _processedDataGeneralTransactionApprovals : null,
    _processedDataACHTransactionApprovals : null,
    _processedDataACHFilesApprovals : null,
    _originalArrayApprovals : [],
    _timerCounter: 0,
    _selectedSecionIndex : null,
    _serviceCounter : 0,

    /*
     *init is called when the form is loaded , initialisation happen here
     *
     */
    init : function(){
      try{
        kony.print("Entered init");
        var navManager = applicationManager.getNavigationManager();
        var currentForm=navManager.getCurrentForm();

        applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
        this._approvalsReqModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ApprovalsReqUIModule");

        this.view.preShow = this.preShowForm;
        this.view.postShow = this.postShowForm;

      }catch(e){
        kony.print("Exception in init::"+e);}
    },

    /*
     *OnNavigate is called when the form is navigated after init , 
     *
     */
    onNavigate: function(params) {
      try {
        kony.print("onNavigate inside" + JSON.stringify(params));

      } catch (e) {
        kony.print("Exception in onNavigate" + e);
      }
    },

    //preShowForm is called when the form is pre loaded 
    preShowForm : function(){
      try{
        kony.print("Entered preShowForm");
        var MenuHandler =  applicationManager.getMenuHandler();
        // MenuHandler.setUpHamburgerForForm(this,"Approval & Request");
        var navManager = applicationManager.getNavigationManager();
        var currentForm = navManager.getCurrentForm();
        applicationManager.getPresentationFormUtility().logFormName(currentForm);
        this.selectedFilter = "";
        this.initActions();
        this.resetForm();
        this.fetchDataBasedOnPermissions();
        this.hasFilterBeenSetup = false;
        this.view.filter.setVisibility(false);
      }catch(e){
        kony.print("Exception in preShowForm::"+e);}
    },

    fetchDataBasedOnPermissions : function(){
      var configManager = applicationManager.getConfigurationManager();
      var isViewGeneralTransactionsEnabled = configManager.getViewGeneralTransactionPermissionsList().some(configManager.checkUserPermission.bind(configManager));
      var isViewACHTransactionsEnabled = configManager.getViewACHTransactionPermissionsList().some(configManager.checkUserPermission.bind(configManager));
      var isViewACHFilesEnabled = configManager.getViewACHFilePermissionsList().some(configManager.checkUserPermission.bind(configManager));

      var requestData = {
        "sortByParam":"",
        "sortOrder": "", //createdts
        "searchString": "",
        "pageSize": "" ,
        "pageOffset": "",
        "filterByParam":"",
        "filterByValue": "",
        //"removeByParam": "featureActionId",
        // "removeByValue": "BULK_PAYMENT_REQUEST_SUBMIT"
      };
      this.fetchPendingApprovals(requestData);
      /* if(isViewGeneralTransactionsEnabled){
        this.fetchGeneralTransactionApprovals();
        this._serviceCounter += 1;
      }
      if(isViewACHTransactionsEnabled){
        this.fetchACHTransactionApprovals(); 
        this._serviceCounter += 1;
      }
      if(isViewACHFilesEnabled){
        this.fetchACHFileApprovals();
        this._serviceCounter += 1;
      }*/
    },

    setDataAfterServiceCalls : function(){
      var segData = this._approvalsReqModule.presentationController.dataFormToSegMyApprovals(
        this._processedDataGeneralTransactionApprovals,
        this._processedDataACHTransactionApprovals,
        this._processedDataACHFilesApprovals);
      this._originalArrayApprovals = CommonUtilities.cloneJSON(segData);
      this.setDataInApprovalsList(segData);
      applicationManager.getPresentationUtility().dismissLoadingScreen();
    },

    //postShowForm is called when the form is post loaded
    postShowForm : function(){
      try{
        kony.print("Entered postShowForm");
        this.fetchCounts();

      }catch(e){
        kony.print("Exception in postShowForm::"+e);}
    },

    /*
     *initActions is to bind the actions form widgets
     *
     */
    initActions: function() {
      try {
        kony.print("Entered initActions");
        this.view.segApprovalList.onRowClick = this.segListApprovalsonRowClick;
        this.view.customHeader.flxBack.onClick = this.navToPrevForm;
        this.view.tbxSearch.onTextChange = this.searchApprovalOnEmpty;
        this.view.tbxSearch.onDone=this.searchMyApprovalsServiceCall;
        this.view.rejectPopUp.txtRejectreason.onTextChange=this.rejectBtnEnableTextChange;
        this.view.flxRejectMenu.onClick = this.dummyFunction;
        this.view.rejectPopUp.flxContainer.onClick = this.dummyFunction;
        this.view.onDeviceBack=this.dummyFunction;
        this.view.flxImgUp.onClick=this.showflxAdvSearch;
        this.view.flxImgUp.isVisible=true;
       // this.view.flxSearch.onClick= this.showReasonPage;
      } catch (e) {
        kony.print("Exception in initActions" + e);
      }
    },


    dummyFunction: function() {

    },
    /*
     *resetForm is to reset the entire form widgets

     */
    resetForm: function() {
      try {
        kony.print("Entered resetForm");
        this.view.flxRejectMenu.isVisible = false;
        this.view.flxPopup.isVisible = false;
        this.view.tbxSearch.text = "";
        this._timerCounter = 0;
        this._serviceCounter = 0;
        this.view.expandCollapseView.segList.removeAll();
        this.view.segApprovalList.removeAll();
        this._prevFormData = {};
        this.initializeFetchParams();
        this._originalArrayApprovals = [];

        if(applicationManager.getPresentationFormUtility().getDeviceName()==="iPhone"){
          this.view.flxHeader.isVisible = false;
          this.view.flxFooterMenu.isVisible = true;
          this.view.flxMainContainer.top = "0dp";
          this.view.flxMainContainer.bottom = "60dp";

          this.view.title = kony.i18n.getLocalizedString("kony.mb.dashboard.pendingApprovals"); //"Approvals";//
        }else{
          this.view.flxHeader.isVisible = true;
          this.view.customHeader.imgBack.src = "backbutton.png";
          this.view.customHeader.lblLocateUs.text = kony.i18n.getLocalizedString("kony.mb.dashboard.pendingApprovals"); //"Approvals";//
          this.view.flxFooterMenu.isVisible = false;
          this.view.flxMainContainer.top = "56dp";
          this.view.flxMainContainer.bottom = "0dp";
        }

        var widgetDataMapping = {
          "lblTransactionAP": "lblTransactionAP",
          "lblTransactionAmountAP": "lblTransactionAmountAP",
          "flxSeparatorAP": "flxSeparatorAP",
          "flxWrapper": "flxWrapper",
          "imgIndicator": "imgIndicator",
          "lblDateAP": "lblDateAP",
          "flxApprovalReqExpColHeader": "flxApprovalReqExpColHeader",
          "flxImgUp": "flxImgUp",
          "imgUpArrow": "imgUpArrow",
          "lblHeader": "lblHeader",
          "flxNoPending": "flxNoPending",
          "lblPayment" :"lblPayment",
          "flxApprovalsList" : "flxApprovalsList",
          "flxRejectAP": "flxRejectAP",
          "imgRejectAP": "imgRejectAP",
          "lblRejectAP": "lblRejectAP",
          "flxApproveAP": "flxApproveAP",
          "imgApproveAP": "imgApproveAP",
          "lblApproveAP": "lblApproveAP",
          "lblTransactionPending" : "lblTransactionPending"
        };
        this.view.segApprovalList.widgetDataMap(widgetDataMapping);

      } catch (e) {
        kony.print("Exception in resetForm" + e);
      }
    },

    rejectCancel:function()
    {
      try {  
        this.view.flxRejectMenu.isVisible = false;
        this.view.rejectPopUp.txtRejectreason.text="";
      }catch(error){
        kony.print("frmACHTransactionsdetails rejectCancel-->"+error);
      }       
    },

    initializeFetchParams : function(){
      this._fetchParams = {
        "searchString": "",
        "sortByParam": "createdts",
        "sortOrder": "DESC",
        "pageSize": 100,
        "pageOffset": 0,
        "filterByTransactionType" : "",
        "filterByStatus" : ""
      };
    },

    /*
     *setDataInApprovalsList - This function is to set the data inside the segment
     *
     */
    setDataInApprovalsList: function(segData) {
      try {
        kony.print("entered setDataInApprovalsList"+JSON.stringify(segData));

        var widgetDataMapping = {
          "lblTransactionAP": "lblTransactionAP",
          "lblTransactionAmountAP": "lblTransactionAmountAP",
          "flxSeparatorAP": "flxSeparatorAP",
          "flxWrapper": "flxWrapper",
          "imgIndicator": "imgIndicator",
          "lblDateAP": "lblDateAP",
          "flxApprovalReqExpColHeader": "flxApprovalReqExpColHeader",
          "flxImgUp": "flxImgUp",
          "imgUpArrow": "imgUpArrow",
          "lblHeader": "lblHeader",
          "flxNoPending": "flxNoPending",
          "lblPayment" :"lblPayment",
          "flxApprovalsList" : "flxApprovalsList",
          "flxRejectAP": "flxRejectAP",
          "imgRejectAP": "imgRejectAP",
          "lblRejectAP": "lblRejectAP",
          "flxApproveAP": "flxApproveAP",
          "imgApproveAP": "imgApproveAP",
          "lblApproveAP": "lblApproveAP",
          "lblTransactionPending" : "lblTransactionPending"
        };
        var dataArr = [] ;
        dataArr = CommonUtilities.cloneJSON(segData);
        //var addHeaderCountArr = this.setHeaderCount(dataArr);
        //this.view.expandCollapseView.setDataInList(widgetDataMapping, addHeaderCountArr);
        this.view.segApprovalList.widgetDataMap(widgetDataMapping);
        this.view.lblHeader.text = "All ("+response.length+")";
        this.view.segApprovalList.setData(segData);
      } catch (e) {
        kony.print("Exception in setDataInApprovalsList" + e);
      }
    },

    /*
    *setHeaderCount - Header count need to be added 
   *
    */
    setHeaderCount : function(segDataArr){
      try{
        kony.print("Entered setHeaderCount");

        for(var i = 0; i < segDataArr.length; i++){
          if(segDataArr[i][1].length > 0){
            var countOfRowInHeader = segDataArr[i][1].length ;
            if(segDataArr[i][1][0].template !== "flxNoPending"){
              segDataArr[i][0].lblHeader.text = segDataArr[i][0].lblHeader.text +" ("+countOfRowInHeader+")";
            }else{
              segDataArr[i][0].lblHeader.text = segDataArr[i][0].lblHeader.text +" (0)";
            }
          }
        }

        return segDataArr;
      }catch(e){
        kony.print("Exception in setHeaderCount::"+e);}
    },

    /*
  **searchMyApprovalsServiceCall
  **
  */
    searchMyApprovalsServiceCall : function(){
      try{
        kony.print("Entered searchMyApprovalsServiceCall");
        var searchText = this.view.tbxSearch.text;//CommonUtilities.validateSearchString(this.view.tbxSearch.text);
        if (searchText.includes("/")) {
          searchText = CommonUtilities.getBackendDateFormat(searchText, "mm/dd/yyyy");
        }
        var requestData = {
          "sortByParam":"",
          "sortOrder": "", //createdts
          "searchString": searchText,
          "pageSize": "" ,
          "pageOffset": "",
          "filterByParam":"",
          "filterByValue": "",
          // "removeByParam": "featureActionId",
          //   "removeByValue": "BULK_PAYMENT_REQUEST_SUBMIT"
        };
        this.fetchPendingApprovals(requestData);

      }catch(e){
        kony.print("Exception in searchMyApprovalsServiceCall::"+e);}
    },

    /*
  **searchMyApprovalsListLocal
  **
  */
    searchMyApprovalsListLocal : function(){
      try{
        kony.print("Entered searchMyApprovalsListLocal");

        var searchText = this.view.tbxSearch.text.toLowerCase();
        if(searchText === ""){
          this.setDataInApprovalsList(this._originalArrayApprovals);
          return;
        }

        if(searchText.length > 2){
          var segData = CommonUtilities.cloneJSON(this._originalArrayApprovals);

          var addSearchedArr = [];

          for(var i =0 ; i<segData.length; i++){
            addSearchedArr = [];

            var rowItems = segData[i][1];
            if(rowItems.length > 0){
              if(rowItems[0].template !== "flxNoPending"){
                for(var j =0 ; j<rowItems.length; j++){
                  var lblTransactionAP = rowItems[j].lblTransactionAP.text.toLowerCase();
                  var lblDateAP = rowItems[j].lblDateAP.text. toLowerCase();
                  var achTransTemplateName = kony.sdk.isNullOrUndefined(rowItems[j].data.TemplateName) ? "" : rowItems[j].data.TemplateName.toLowerCase();
                  var achTransReqType = kony.sdk.isNullOrUndefined(rowItems[j].data.RequestType) ? "" : rowItems[j].data.RequestType.toLowerCase();
                  var achFileReqType = kony.sdk.isNullOrUndefined(rowItems[j].data.FileRequestType) ? "" : rowItems[j].data.FileRequestType.toLowerCase();
                  var achFileName = kony.sdk.isNullOrUndefined(rowItems[j].data.FileName) ? "" : rowItems[j].data.FileName.toLowerCase();
                  var debitorCreditAccount = kony.sdk.isNullOrUndefined(rowItems[j].data.DebitOrCreditAccount) ? ""  : rowItems[j].data.DebitOrCreditAccount.toLowerCase();
                  var debitAccounts = kony.sdk.isNullOrUndefined(rowItems[j].data.debitAccounts) ? ""  : rowItems[j].data.debitAccounts.toLowerCase();
                  var debitAccount = kony.sdk.isNullOrUndefined(rowItems[j].data.DebitAccount) ? ""  : rowItems[j].data.DebitAccount.toLowerCase();

                  if(lblTransactionAP.indexOf(searchText) > -1 || lblDateAP.indexOf(searchText) > -1 ||
                     achTransReqType.indexOf(searchText) > -1 || achTransTemplateName.indexOf(searchText) > -1 ||
                     achFileName.indexOf(searchText) > -1 || achFileReqType.indexOf(searchText) > -1 ||
                     debitorCreditAccount.indexOf(searchText) > -1 || debitAccounts.indexOf(searchText) > -1 ||
                     debitAccount.indexOf(searchText) > -1  ){
                    addSearchedArr.push(rowItems[j]);
                  }
                }//End of rowITems for loop
                if(addSearchedArr.length === 0){
                  var noPendingMsg;
                  if(segData[i][0].lblHeader !== null && segData[i][0].lblHeader !== undefined && segData[i][0].lblHeader !== "")                    
                  {
                    var header=segData[i][0].lblHeader.text;
                    if(header === kony.i18n.getLocalizedString("kony.mb.ApprovalRequests.Transactions"))
                    {
                      noPendingMsg = kony.i18n.getLocalizedString("kony.mb.ApprovalRequests.NoPendingTransactionsApproval");
                    }
                    else if(header === kony.i18n.getLocalizedString("kony.mb.ApprovalRequests.ACHTransactions"))
                    {
                      noPendingMsg = kony.i18n.getLocalizedString("kony.mb.ApprovalRequests.NoPendingACHTransApprovals");
                    }
                    else if(header === kony.i18n.getLocalizedString("kony.mb.ApprovalRequests.ACHFiles"))
                    {
                      noPendingMsg = kony.i18n.getLocalizedString("kony.mb.ApprovalRequests.NoPendingACHFileApprovals");
                    }
                  }
                  else
                    noPendingMsg = kony.i18n.getLocalizedString("kony.mb.ApprovalRequests.NoPendingACHTransApprovals");
                  addSearchedArr.push({
                    "template": "flxNoPending",
                    "lblTransactionPending": {"text": noPendingMsg},
                    "flxNoPending": {"isVisible": true,"height": "80dp"}
                  });
                }
                segData[i].pop();
                segData[i].push(addSearchedArr);
              }
            }
          }//End of header for Loop
          kony.print("searchMyApprovalsListLocal segData"+JSON.stringify(segData));
          this.setDataInApprovalsList(segData);
        }
      }catch(e){
        kony.print("Exception in searchMyApprovalsListLocal::"+e);}
    },

    approvePendingTransction: function() {
      applicationManager.getPresentationUtility().showLoadingScreen();
      var scopeObj = this;
      var selectedItems = this.view.segApprovalList.selectedRowItems[0];
      var request_id = selectedItems.data.requestId;
      var featureActionId = selectedItems.data.featureActionId;
      var comments = this.view.rejectPopUp.txtRejectreason.text;
      var req = 
          {
            "requestId":request_id,
            "featureActionId": featureActionId,
            "comments":kony.i18n.getLocalizedString("kony.mb.ApprovalRequests.Approved")
          };
      var navObj = 
          {	
            requestData: req,
            formData : scopeObj
          };
      scopeObj._approvalsReqModule.presentationController.approvePendingTransactions(navObj);
    },


    /**
    * approveTransaction : onClick of Approve a General Transaction
    * @member of {frmBBMyApprovalsController}
    * @param {JSON Object} eventObject - button object 
    * @param {JSON Object} context - Selected segment Row Data  
    * @return {} 
    * @throws {}
    */
    approveTransaction: function() {
      try{
        kony.print("Entered in approveTransaction");
        applicationManager.getPresentationUtility().showLoadingScreen();
        var selectedItems = this.view.expandCollapseView.segList.selectedRowItems[0];
        kony.print("selectedItems::"+JSON.stringify(selectedItems));
        var TransactionId = selectedItems["request_id"];
        var scopeObj = this;
        var params = {
          "Request_id": TransactionId,
          "Comments": kony.i18n.getLocalizedString("kony.mb.ApprovalRequests.Approved"),
          "Action": kony.i18n.getLocalizedString("kony.mb.ApprovalRequests.Approved")
        };
        var navObj = 
            {	
              requestData: params,
              formData : scopeObj
            };
        scopeObj._approvalsReqModule.presentationController.approveBBGeneralTransactions(navObj);
      }catch(e){
        kony.print("Exception in approveTransaction"+e);
        applicationManager.getPresentationUtility().dismissLoadingScreen();
      }
    },

    approveBBTransactionSuccessfull : function(response){
      try{
        kony.print("Entered approveBBTransactionSuccessfull"+JSON.stringify(response));
        this.fetchGeneralTransactionApprovals();

      }catch(e){
        kony.print("Exception in approveBBTransactionSuccessfull"+e);
        applicationManager.getPresentationUtility().dismissLoadingScreen();
      }
    },

    /**
    * approveACHTransaction : approve the selected ACH Transacton - presentation call
    * @member of {frmBBMyApprovalsController}
    * @param {JSON Object} eventobject - Event object details of a 
    * @param {JSON Object} context - selected section details 
    * @return {} 
    * @throws {}
    */
    approveACHTransaction: function() {
      applicationManager.getPresentationUtility().showLoadingScreen();
      var scopeObj = this;
      var selectedItems = this.view.expandCollapseView.segList.selectedRowItems[0];
      var achTransactionId = selectedItems["request_id"];
      var req = {
        "Request_id": achTransactionId,
        "Comments": kony.i18n.getLocalizedString("kony.mb.ApprovalRequests.Approved"),
        "Action": kony.i18n.getLocalizedString("kony.mb.ApprovalRequests.Approved")
      };
      var navObj = 
          {	
            requestData: req,
            formData : scopeObj
          };
      scopeObj._approvalsReqModule.presentationController.approveACHTransactions(navObj);
    },

    /**
    * approveTransaction : onClick of Approve a General Transaction
    * @member of {frmBBMyApprovalsController}
    * @param {JSON Object} eventObject - button object 
    * @param {JSON Object} context - Selected segment Row Data  
    * @return {} 
    * @throws {}
    */
    approveACHFile: function(){
      var scopeObj=this;
      applicationManager.getPresentationUtility().showLoadingScreen();
      var selectedRowData = this.view.expandCollapseView.segList.selectedRowItems[0];
      var request_id = selectedRowData["request_id"];
      var req = {
        "Request_id": request_id,
        "Comments": kony.i18n.getLocalizedString("kony.mb.ApprovalRequests.Approved"),
        "Action": kony.i18n.getLocalizedString("kony.mb.ApprovalRequests.Approved")
      };
      var navObj = 
          {	
            requestData: req,
            formData : scopeObj
          };
      scopeObj._approvalsReqModule.presentationController.approveACHFiles(navObj);
    },

    /**
    * btnRejectOnClick : onClick of Reject in Pop-up for Reject a General Transaction.
    * @member of {frmBBMyApprovalsController}
    * @param {}
    * @return {} 
    * @throws {}
    */
    btnRejectOnClick : function(){
      try{
        var scopeObj = this;
        var selectedItems = this.view.segApprovalList.selectedRowItems[0];
        var request_id = selectedItems.data.requestId;
        var featureActionId = selectedItems.data.featureActionId;
        var comments = this.view.rejectPopUp.txtRejectreason.text;
        var req = 
            {
              "requestId":request_id,
              "featureActionId": featureActionId,
              "comments":comments
            };

        var navObj = 
            {	
              requestData: req,
              formData : scopeObj
            };
        scopeObj._approvalsReqModule.presentationController.rejectPendingTransaction(navObj);

      }catch(e){
        kony.print("Exception in btnRejectOnClick"+e);
      }
    },
    /**
    * rejectTransaction : onClick of Yes in Pop-up for Reject a General Transaction.
    * @member of {frmBBMyApprovalsController}
    * @param {string} Request_id - Request_id of General Transaction to Reject
    * @return {} 
    * @throws {}
    */
    rejectTransaction: function(request_id){
      applicationManager.getPresentationUtility().showLoadingScreen();
      var scopeObj= this;
      var Comments = this.view.rejectPopUp.txtRejectreason.text;
      var req = 
          {
            "Request_id": request_id,
            "Action": kony.i18n.getLocalizedString("kony.mb.ApprovalRequests.Rejected"),
            "Comments": Comments
          };
      var navObj = 
          {	
            requestData: req,
            formData : scopeObj
          };
      scopeObj._approvalsReqModule.presentationController.rejectBBGeneralTransactions(navObj);
    },

    /**
    * rejectACHTransaction : Reject the selected ACH Transacton, based on Yes on Pop-up - presentation call
    * @member of {frmBBMyApprovalsController}
    * @param {string} Request_id - ID of the ACH Transaction to be Rejected
    * @return {} 
    * @throws {}
    */
    rejectACHTransaction: function(request_id){
      applicationManager.getPresentationUtility().showLoadingScreen();
      var scopeObj = this;
      var Comments = this.view.rejectPopUp.txtRejectreason.text;
      var req = {
        "Request_id": request_id,
        "Comments": Comments,
        "Action": kony.i18n.getLocalizedString("kony.mb.ApprovalRequests.Rejected"),
      };
      var navObj = 
          {	
            requestData: req,
            formData : scopeObj
          };
      scopeObj._approvalsReqModule.presentationController.rejectACHTransaction(navObj);
    },

    /**
    * rejectACHFile : onClick of Yes, in Reject an ACHFile Pop-up - perform the reject service call
    * @member of {frmBBMyApprovalsController}
    * @param {String} Request_id - ID to delete the ACH File   
    * @return {} 
    * @throws {}
    */
    rejectACHFile: function(request_id){
      try{
        applicationManager.getPresentationUtility().showLoadingScreen();
        var scopeObj = this;
        var Comments = this.view.rejectPopUp.txtRejectreason.text;
        var req = {
          "Request_id": request_id,
          "Comments": Comments,
          "Action": kony.i18n.getLocalizedString("kony.mb.ApprovalRequests.Rejected"),
        };
        var navObj = 
            {	
              requestData: req,
              formData : scopeObj
            };
        scopeObj._approvalsReqModule.presentationController.rejectACHFile(navObj);
      }catch(e){
        kony.print("Exception in rejectACHFile::"+e);
      }
    },

    /*
     *approveBtnOnClick - This function is called when user swipe and clics on approve button
     *
     */
    approveBtnOnClick: function(widgetInfo,context) {
      try {
        kony.print("Entered approveBtnOnClick::"+JSON.stringify(context));
        var isiPhone = applicationManager.getPresentationFormUtility().getDeviceName() === "iPhone";
        if(isiPhone) {
          var msgText = kony.i18n.getLocalizedString("kony.mb.achwithdrawal.approvepopup");
          var basicConfig = {message: msgText,
                             alertTitle:"",
                             alertIcon:null,
                             alertType: constants.ALERT_TYPE_CONFIRMATION,
                             yesLabel:applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.ApprovalRequests.Approve"),
                             noLabel: applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.Cancel"),
                             alertHandler: this.approveConfirmIphone
                            };
          var pspConfig = {};
          applicationManager.getPresentationUtility().showAlertMessage(basicConfig, pspConfig);
        }else{
          this.view.rejectPopUp.flxReject.onClick = this.approvePendingTransction;
          this.view.rejectPopUp.flxCancel.onClick = this.rejectCancel;
          this.view.flxRejectMenu.isVisible = true;
          this.view.rejectPopUp.txtRejectreason.text = "";
          this.view.rejectPopUp.txtRejectreason.isVisible = false;
          this.view.rejectPopUp.lblContent.text= kony.i18n.getLocalizedString("kony.mb.achwithdrawal.approvepopup");// kony.i18n.getLocalizedString("kony.mb.request.rejectmsg");
          this.view.rejectPopUp.lblContentreject.isVisible = false;
          this.view.rejectPopUp.flxReject.setEnabled(true);
          this.view.rejectPopUp.lblTitle.text = "Approve";
          this.view.rejectPopUp.lblYes.text = "Approve";
        }

      } catch (error) {
        kony.print("Exception in  approveBtnOnClick-->" + error);
      }
    },


    approveConfirmIphone : function(response){
      if(response === true)
      {
        this.approvePendingTransction();
      }
    },

    /*
     *segListApprovalsonRowClick - This function is to called on row click of the segment
     *
     */
    segListApprovalsonRowClick: function() {
      try {
        kony.print("entered segListApprovalsonRowClick:: ");
        var selectedHeaderIndex = this.view.segApprovalList.selectedRowIndex;
        var selecteditems = this.view.segApprovalList.selectedRowItems;
        var navManager = applicationManager.getNavigationManager();
        var device = kony.os.deviceInfo();
        var type = device.name;
        var noPending;

        if(type !== "iPhone"){
          noPending = selecteditems[0].template.id;
        }else{
          noPending = selecteditems[0].template;
        } 

        if(noPending === "flxNoPending"){    
          return;
        }
        var formFlow = {};
        if(selecteditems[0].data.featureActionId == "ACH_PAYMENT_CREATE" || 
           selecteditems[0].data.featureActionId == "ACH_COLLECTION_CREATE"){
          navManager.setCustomInfo("formFlow","ACHTransactionDetailsApprovals");        
          navManager.setCustomInfo("ACHTranactionDetails",selecteditems); 

        }else if(selecteditems[0].data.featureActionId == "ACH_FILE_UPLOAD" ){
          navManager.setCustomInfo("formFlow","ACHTransactionDetailsApprovals");        
          navManager.setCustomInfo("ACHTranactionDetails",selecteditems); 
        }else if(selecteditems[0].data.featureActionId == "BULK_PAYMENT_REQUEST_SUBMIT" ){
          navManager.setCustomInfo("formFlow","BulkPaymentApproval");        
          navManager.setCustomInfo("ACHTranactionDetails",selecteditems); 
        }else if(selecteditems[0].data.featureActionId == "CHEQUE_BOOK_REQUEST_CREATE"){
          navManager.setCustomInfo("formFlow", "ChequeBookApprovals");
          navManager.setCustomInfo("chequeBookApprovalDetails",selecteditems);
        }
        else{
          navManager.setCustomInfo("formFlow","TransactionDetailsApprovals");        
          navManager.setCustomInfo("generalTransactionDetails",selecteditems); 
        }

        /*switch(selectedHeaderIndex[0]){
          case 0 : //Transaction Details

            navManager.setCustomInfo("formFlow","TransactionDetailsApprovals");        
            navManager.setCustomInfo("generalTransactionDetails",selecteditems); 

            break;
          case 1 : //ACH Transactions
            navManager.setCustomInfo("formFlow","ACHTransactionDetailsApprovals");        
            navManager.setCustomInfo("ACHTranactionDetails",selecteditems); 
            break;
          case 2 :
            navManager.setCustomInfo("formFlow","ACHFileListApprovals");        
            navManager.setCustomInfo("ACHFileDetails",selecteditems);
            var ACHFieldID = selecteditems[0].ACHFileID;
            var navigationObject = {
              "requestData":{
                "achFileId":ACHFieldID}
            };
            var ApprovalsReqUIModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule('ApprovalsReqUIModule');
            ApprovalsReqUIModule.presentationController.getACHFileRecord(navigationObject);
            break;
        }*/

        navManager.navigateTo("frmACHTransactionDetail"); 
      } catch (e) {
        kony.print("Exception in segListApprovalsonRowClick" + e);
      }
    },

    getACHFileRecordsSuccessCB:function(response){
      try{
        var ACHFileRecordID = response;
        var navigationObject = {
          "requestData":{
            "achFileRecordId":ACHFileRecordID}
        };
        var ApprovalsReqUIModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule('ApprovalsReqUIModule');
        ApprovalsReqUIModule.presentationController.getACHFileSubRecord(navigationObject);
      }catch(er){
      }
    },

    /*
     *navToPrevForm - This function is to called to navigate back to prev form
     *
     */
    navToPrevForm: function() {
      try {
        kony.print("entered navToPrevForm");
        var navMan=applicationManager.getNavigationManager();
        var formFlow = navMan.getCustomInfo("formFlow");
        var previousForm=kony.application.getPreviousForm().id;
        if(formFlow==="StatusMessage" || previousForm==="frmStausMessage"){
          navMan.navigateTo("frmApprovalsAndRequestsTitle");
        }else if(formFlow==="BusinessDashboard"){
          navMan.navigateTo("frmBusinessDashboard");
        }else if(formFlow==="frmBulkRejectReason"){
          navMan.navigateTo("frmApprovalsAndRequestsTitle");
        }else{
          navMan.goBack();
        }
        //navMan.goBack();
      } catch (e) {
        kony.print("exception navToPrevForm" + e);
      }
    },

    /*
     *rejectBtnOnClick - This function is called when user swipe and clics on reject button
     *
     */
    rejectBtnOnClick: function(widgetInfo,context) {
      var selectedItems = this.view.segApprovalList.selectedRowItems[0];
      if(selectedItems.data.featureActionId == "BULK_PAYMENT_REQUEST_SUBMIT" ){
        this.showReasonPage();
      }else{
        this.showRejectPopup(widgetInfo,context);
      }
    },

    showReasonPage : function(){//widgetInfo,context){
      try {
        kony.print("Entered showReasonPage::");
        var selectedItems = this.view.segApprovalList.selectedRowItems[0];
        var request_id = selectedItems.data.requestId;
        var featureActionId = selectedItems.data.featureActionId;
        var comments = this.view.rejectPopUp.txtRejectreason.text;
        var req = 
            {
              "requestId":request_id,
              "featureActionId": featureActionId,
              "comments":comments
            };

        var navObj = 
            {	
              requestData: req,
              "prevFormName" : "frmApprovalsList"
            };
       
        var navManager = applicationManager.getNavigationManager();
        navManager.setCustomInfo("frmBulkRejectReason",navObj );// navObj);
        navManager.navigateTo("frmBulkRejectReason");
      } catch (error) {
        kony.print("Exception in  showReasonPage-->" + error);
      }
    },

    showRejectPopup: function(widgetInfo,context){
      try {
        kony.print("Entered showRejectPopup::"+JSON.stringify(context));
        this.view.rejectPopUp.flxReject.onClick = this.btnRejectOnClick;
        this.view.rejectPopUp.flxCancel.onClick = this.rejectCancel;
        this.view.flxRejectMenu.isVisible = true;
        this.view.rejectPopUp.txtRejectreason.text = "";
        this.view.rejectPopUp.txtRejectreason.isVisible = true;
        this.view.rejectPopUp.lblContent.text=kony.i18n.getLocalizedString("kony.mb.request.rejectmsg");
        this.view.rejectPopUp.lblContentreject.isVisible = true;
        this.view.rejectPopUp.lblContentreject.text=kony.i18n.getLocalizedString("kony.mb.approve.rejectreason");
        this.view.rejectPopUp.lblTitle.text = "Reject";
        if(this.view.rejectPopUp.txtRejectreason.text==="" || this.view.rejectPopUp.txtRejectreason.text===""){
          this.view.rejectPopUp.flxReject.setEnabled(false);
        }else{
          this.view.rejectPopUp.flxReject.setEnabled(true);
        }
        this.view.rejectPopUp.lblYes.text = "Reject";
      } catch (error) {
        kony.print("Exception in showRejectPopup-->" + error);
      }
    },

    rejectBtnEnableTextChange: function(){
      try {
        if(this.view.rejectPopUp.txtRejectreason.text==="" || this.view.rejectPopUp.txtRejectreason.text===""){
          this.view.rejectPopUp.flxReject.setEnabled(false);
        }else{
          this.view.rejectPopUp.flxReject.setEnabled(true);
        }
      } catch (error) {
        kony.print("Exception in  rejectBtnTextChange-->" + error);
      }
    },

    fetchGeneralTransactionApprovals :function(){
      try {
        kony.print("Entered fetchGeneralTransactionApprovals");
        var scopeObj = this;
        var navObj = 
            {	
              requestData: this._fetchParams,
              formData : this
            };
        scopeObj._approvalsReqModule.presentationController.getGeneralTransactionsPendingForMyApprovals(navObj);
      } catch (error) {
        kony.print("Exception in  fetchGeneralTransactionApprovals-->" + error);
      }
    },

    fetchGenTransactionMyApprovalSuccessCallBack :function(response){
      try {
        kony.print("Entered  view controller fetchGenTransactionMyApprovalSuccessCallBack"+JSON.stringify(response));
        this._processedDataGeneralTransactionApprovals = response;
        this._serviceCounter -= 1;
        if(this._serviceCounter === 0){
          this.setDataAfterServiceCalls();
        }
      } catch (error) {
        kony.print("Exception in  fetchGenTransactionMyApprovalSuccessCallBack-->" + error);
      }
    },

    fetchPendingApprovals : function(requestData){
      var scopeObj = this;
      var navObj = requestData;
      var navManager = applicationManager.getNavigationManager();
      navManager.setCustomInfo("formFlow","frmApprovalsList");
      scopeObj._approvalsReqModule.presentationController.getPendingApprovals(navObj);
    },

    fetchMyPendingApprovalSuccessCallBack :function(response){
      try {
        kony.print("Entered  view controller fetchMyPendingApprovalSuccessCallBack"+JSON.stringify(response));
        this.view.segApprovalList.removeAll();
        if(response.length === 1){
          if(response[0].template == "flxNoPending"){
            this.view.lblHeader.text = "All (0)";
          }else{
            this.view.lblHeader.text = "All ("+response.length+")";
          }
        }else{
          this.view.lblHeader.text = "All ("+response.length+")";
        }
        this._originalArrayApprovals = CommonUtilities.cloneJSON(response);

        response.sort(function(a, b) {
          var c = new Date(a.data.sentDate);
          var d = new Date(b.data.sentDate);
          return d-c;
        });
        this.view.segApprovalList.setData(response);
      } catch (error) {
        kony.print("Exception in  fetchMyPendingApprovalSuccessCallBack-->" + error);
      }
    },

    fetchACHTransactiofnApprovals : function(){
      var scopeObj = this;
      var navObj = 
          {	
            requestData: this.fetchParams,
          };
      scopeObj._approvalsReqModule.presentationController.getACHTransactionsPendingForMyApprovals(navObj);
    },

    fetchACHTransactionMyApprovalSuccessCallBack :function(response){
      try {
        kony.print("Entered  view controller fetchACHTransactionMyApprovalSuccessCallBack"+JSON.stringify(response));
        this._processedDataACHTransactionApprovals = response;
        this._serviceCounter -= 1;
        if(this._serviceCounter === 0){
          this.setDataAfterServiceCalls();
        }
      } catch (error) {
        kony.print("Exception in  fetchACHTransactionMyApprovalSuccessCallBack-->" + error);
      }
    },


    fetchACHFileApprovals : function(){
      var scopeObj = this;
      var navObj = 
          {	
            requestData: this.fetchParams,
          };
      scopeObj._approvalsReqModule.presentationController.getACHFilesPendingForMyApprovals(navObj);
    },

    fetchACHFilesMyApprovalSuccessCallBack :function(response){
      try {
        kony.print("Entered  view controller fetchACHFilesMyApprovalSuccessCallBack"+JSON.stringify(response));
        this._processedDataACHFilesApprovals = response;
        this._serviceCounter -= 1;
        if(this._serviceCounter === 0){
          this.setDataAfterServiceCalls();
        }
      } catch (error) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        kony.print("Exception in  fetchACHFilesMyApprovalSuccessCallBack-->" + error);
      }
    },

    showflxAdvSearch : function() {
      if(this.hasFilterBeenSetup) {
        this.view.filter.setVisibility(true);
        this.view.filter.btnAll.onClick = this.selectAll.bind(this);
        this.view.filter.segSingleTransactions.onRowClick = this.singleSegmentSelected.bind(this);
        this.view.filter.segBulkTransactions.onRowClick = this.bulkSegmentSelected.bind(this);
        this.view.filter.segOtherRequests.onRowClick = this.otherSegmentSelected.bind(this);
        this.view.forceLayout();
        return;
      }
      var scope = this;
      var presenter = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule('ApprovalsReqUIModule');
      var datasize = parseInt(presenter.presentationController.singleApprovalsPendingCount)
      + parseInt(presenter.presentationController.bulkApprovalsPendingCount)
      + parseInt(presenter.presentationController.otherApprovalsPendingCount);
      this.view.filter.lblAllCounter.text = "(" + datasize + ")";
      scope.view.filter.btnSelectTransactionType.onClick = function(){
        var scopex = this;
        scopex.view.filter.setVisibility(false);
        this.view.forceLayout();
      }.bind(scope);
      scope.view.filter.segSingleTransactions.widgetDataMap = {
        "flxApprovalsAndRequestFilter": "flxApprovalsAndRequestFilter",
        "flxText": "flxText",
        "imgSelect": "imgSelect",
        "lblCounter": "lblCounter",
        "lblSeperator": "lblSeperator",
        "lblText": "lblText"
      };
      scope.view.filter.segBulkTransactions.widgetDataMap = {
        "flxApprovalsAndRequestFilter": "flxApprovalsAndRequestFilter",
        "flxText": "flxText",
        "imgSelect": "imgSelect",
        "lblCounter": "lblCounter",
        "lblSeperator": "lblSeperator",
        "lblText": "lblText"
      };
      scope.view.filter.segOtherRequests.widgetDataMap = {
        "flxApprovalsAndRequestFilter": "flxApprovalsAndRequestFilter",
        "flxText": "flxText",
        "imgSelect": "imgSelect",
        "lblCounter": "lblCounter",
        "lblSeperator": "lblSeperator",
        "lblText": "lblText"
      };

      if(presenter.presentationController.isSingleApprovalsPendingAvailable) {
        var segSingleData = presenter.presentationController.singleApprovalsPending;
        var i = 0;
        for(i = 0; i < segSingleData.length; i++) {
          if(this.selectedFilter !== "") {
            if(segSingleData[i]["lblText"] === this.selectedFilter)
              segSingleData[i]["imgSelect"]["src"] = "tickmark_green.png";
            else
              segSingleData[i]["imgSelect"]["src"] = "transparent.png";
          }
          else {
            segSingleData[i]["imgSelect"]["src"] = "transparent.png";
          }
          //  segSingleData[i]["lblText"] =  segSingleData[i]["lblText"].substr(0, 35).trim();
        }
        scope.view.filter.segSingleTransactions.setData(segSingleData);
        scope.view.filter.segSingleTransactions.setVisibility(true);
        scope.view.filter.flxSingleTransactions.setVisibility(false);
      }
      else {
        scope.view.filter.flxSingleTransactions.setVisibility(false);
        scope.view.filter.segSingleTransactions.setVisibility(false);
      }

      if(presenter.presentationController.isBulkApprovalsPendingAvailable) {
        var segBulkData = presenter.presentationController.bulkApprovalsPending;
        var i = 0;
        for(i = 0; i < segBulkData.length; i++) {
          if(this.selectedFilter !== "") {
            if(segBulkData[i]["lblText"] === this.selectedFilter)
              segBulkData[i]["imgSelect"]["src"] = "tickmark_green.png";
            else
              segBulkData[i]["imgSelect"]["src"] = "transparent.png";
          }
          else {
            segBulkData[i]["imgSelect"]["src"] = "transparent.png";
          }
          //  segBulkData[i]["lblText"] =  segBulkData[i]["lblText"].substr(0, 35).trim();
        }
        scope.view.filter.segBulkTransactions.setData(segBulkData);
        scope.view.filter.segBulkTransactions.setVisibility(true);
        scope.view.filter.flxBulkTransactions.setVisibility(false);
      }
      else {
        scope.view.filter.flxBulkTransactions.setVisibility(false);
        scope.view.filter.segBulkTransactions.setVisibility(false);
      }

      if(presenter.presentationController.isOtherApprovalsPendingAvailable) {
        var segOtherData = presenter.presentationController.otherApprovalsPending;
        var i = 0;
        for(i = 0; i < segOtherData.length; i++) {
          if(this.selectedFilter !== "") {
            if(segOtherData[i]["lblText"] === this.selectedFilter)
              segOtherData[i]["imgSelect"]["src"] = "tickmark_green.png";
            else
              segOtherData[i]["imgSelect"]["src"] = "transparent.png";
          }
          else {
            segOtherData[i]["imgSelect"]["src"] = "transparent.png";
          }
          //segOtherData[i]["lblText"] =  segOtherData[i]["lblText"].substr(0, 35).trim();
        }
        scope.view.filter.segOtherRequests.setData(segOtherData);
        scope.view.filter.segOtherRequests.setVisibility(true);
        scope.view.filter.flxOtherRequests.setVisibility(false);
      }
      else {
        scope.view.filter.flxOtherRequests.setVisibility(false);
        scope.view.filter.segOtherRequests.setVisibility(false);
      }
      scope.view.filter.lblAllCounter = "("+presenter.presentationController.allApprovalsPendingCount+")";
      if (applicationManager.getDeviceUtilManager().isIPhone()) {
        scope.view.filter.top = "0dp";
      }
      else {
        scope.view.filter.top = "50dp";
      }
      this.view.filter.setVisibility(true);
      this.view.filter.btnAll.onClick = this.selectAll.bind(this);
      this.view.filter.segSingleTransactions.onRowClick = this.singleSegmentSelected.bind(this);
      this.view.filter.segBulkTransactions.onRowClick = this.bulkSegmentSelected.bind(this);
      this.view.filter.segOtherRequests.onRowClick = this.otherSegmentSelected.bind(this);
      this.view.forceLayout();
      this.hasFilterBeenSetup = true;
    },

    fetchCounts : function() {
      var presenter = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule('ApprovalsReqUIModule');
      presenter.presentationController.getAllCounts();
    },

    singleSegmentSelected : function(context1){
      //var selectedRowItem = context1["selectedRowItems"];
      this.view.filter.imgAll.src = "transparent.png";
      var data = this.view.filter.segSingleTransactions.data;
      var bulkTransactionData = this.view.filter.segBulkTransactions.data; 
      var otherTransactionData = this.view.filter.segOtherRequests.data;
      if(bulkTransactionData.length>0){
        for(var j =0 ;j<bulkTransactionData.length;j++){
          if(bulkTransactionData[j].imgSelect.src === "tickmark_green.png"){
            bulkTransactionData[j].imgSelect.src = "transparent.png"
          }
        }
        this.view.filter.segBulkTransactions.setData(bulkTransactionData);
      }
      if(otherTransactionData.length>0){
        for(var j =0 ;j<otherTransactionData.length;j++){
          if(otherTransactionData[j].imgSelect.src === "tickmark_green.png"){
            otherTransactionData[j].imgSelect.src = "transparent.png"
          }
        }
        this.view.filter.segOtherRequests.setData(otherTransactionData);
      }
      if(data.length>0){
        for(var j =0 ;j<data.length;j++){
          if(data[j].imgSelect.src === "tickmark_green.png"){
            data[j].imgSelect.src = "transparent.png"
          }
        }}
      if(data[context1["selectedRowIndices"][0][1][0]]["imgSelect"]["src"] === "transparent.png"){
        data[context1["selectedRowIndices"][0][1][0]]["imgSelect"]["src"] = "tickmark_green.png";
        var selectedData = this.view.filter.segSingleTransactions.selectedRowItems[0].lblText;
        var input = selectedData;
		var fields = input.split('(');
        var selectedDataName = fields[0];
        this.setupDataFromFilter(selectedDataName);
        this.view.filter.setVisibility(false);
      }else{
        data[context1["selectedRowIndices"][0][1][0]]["imgSelect"]["src"] = "transparent.png";
      }
      this.view.filter.segSingleTransactions.data = data;
      //this.setupDataFromFilter(data[context1["selectedRowIndices"][0][1][0]]["lblText"]);
    },

    bulkSegmentSelected : function(context1){
      this.view.filter.imgAll.src = "transparent.png";
      var data = this.view.filter.segBulkTransactions.data;
      var otherTransactionData = this.view.filter.segOtherRequests.data;
      var SingleTransactionsData = this.view.filter.segSingleTransactions.data;

      if(otherTransactionData.length>0){
        for(var j =0 ;j<otherTransactionData.length;j++){
          if(otherTransactionData[j].imgSelect.src === "tickmark_green.png"){
            otherTransactionData[j].imgSelect.src = "transparent.png"
          }
        } 
        this.view.filter.segOtherRequests.setData(otherTransactionData);
      }

      if(SingleTransactionsData.length>0){
        for(var j =0 ;j<SingleTransactionsData.length;j++){
          if(SingleTransactionsData[j].imgSelect.src === "tickmark_green.png"){
            SingleTransactionsData[j].imgSelect.src = "transparent.png"
          }
        }
        this.view.filter.segSingleTransactions.setData(SingleTransactionsData);
      }
      if(data.length>0){
        for(var j =0 ;j<data.length;j++){
          if(data[j].imgSelect.src === "tickmark_green.png"){
            data[j].imgSelect.src = "transparent.png"
          }
        }}
      if(data[context1["selectedRowIndices"][0][1][0]]["imgSelect"]["src"] === "transparent.png"){
        data[context1["selectedRowIndices"][0][1][0]]["imgSelect"]["src"] = "tickmark_green.png";
        var selectedData = this.view.filter.segBulkTransactions.selectedRowItems[0].lblText;
        var input = selectedData;
		var fields = input.split('(');
        var selectedDataName = fields[0];
        this.setupDataFromFilter(selectedDataName);
        this.view.filter.setVisibility(false);
      }
      else{
        data[context1["selectedRowIndices"][0][1][0]]["imgSelect"]["src"] = "transparent.png";
      }
      this.view.filter.segBulkTransactions.data = data;
      //this.setupDataFromFilter(data[context1["selectedRowIndices"][0][1][0]]["lblText"]);
    },

    otherSegmentSelected : function(context1){
      this.view.filter.imgAll.src = "transparent.png";
      var data = this.view.filter.segOtherRequests.data;
      var SingleTransactionsData = this.view.filter.segSingleTransactions.data;
      var bulkTransactionData = this.view.filter.segBulkTransactions.data;
      if (bulkTransactionData.length > 0) {
        for (var j = 0; j < bulkTransactionData.length; j++) {
          if (bulkTransactionData[j].imgSelect.src === "tickmark_green.png" ) {
            bulkTransactionData[j].imgSelect.src = "transparent.png"
          }

        }
        this.view.filter.segBulkTransactions.setData(bulkTransactionData);
      }
      if(SingleTransactionsData.length>0){
        for(var j =0 ;j<SingleTransactionsData.length;j++){
          if(SingleTransactionsData[j].imgSelect.src === "tickmark_green.png"){
            SingleTransactionsData[j].imgSelect.src = "transparent.png"
          }
        }
        this.view.filter.segSingleTransactions.setData(SingleTransactionsData);
      }
      if(data.length>0){
        for(var j =0 ;j<data.length;j++){
          if(data[j].imgSelect.src === "tickmark_green.png"){
            data[j].imgSelect.src = "transparent.png"
          }
        }}
      if(data[context1["selectedRowIndices"][0][1][0]]["imgSelect"]["src"] === "transparent.png"){
        data[context1["selectedRowIndices"][0][1][0]]["imgSelect"]["src"] = "tickmark_green.png";
        var selectedData = this.view.filter.segOtherRequests.selectedRowItems[0].lblText;
        var input = selectedData;
		var fields = input.split('(');
        var selectedDataName = fields[0];
        this.setupDataFromFilter(selectedDataName);
        this.view.filter.setVisibility(false);
      }
      else{
        data[context1["selectedRowIndices"][0][1][0]]["imgSelect"]["src"]= "transparent.png";

      }
      this.view.filter.segOtherRequests.data = data;
      //this.setupDataFromFilter(data[context1["selectedRowIndices"][0][1][0]]["lblText"]);
    },

    selectAll : function () {
      this.removeAllSelectedFromSegement();
      this.view.filter.imgAll.src = "tickmark_green.png";
      var requestData = {
        "sortByParam":"",
        "sortOrder": "", //createdts
        "searchString": "",
        "pageSize": "" ,
        "pageOffset": "",
        "filterByParam":"",
        "filterByValue": "",
        //"removeByParam": "featureActionId",
        //"removeByValue": "BULK_PAYMENT_REQUEST_SUBMIT"
      };
      this.fetchPendingApprovals(requestData);
      this.view.filter.setVisibility(false);
    },

    removeAllSelectedFromSegement : function() {
      this.view.filter.imgAll.src = "transparent.png";

      var data0 = this.view.filter.segOtherRequests.data;
      var data1 =  this.view.filter.segBulkTransactions.data;
      var data2 =  this.view.filter.segSingleTransactions.data;

      data0.forEach(function (entry) {
        entry["imgSelect"] = {
          "src" : "transparent.png"
        };
      });

      data1.forEach(function (entry) {
        entry["imgSelect"] = {
          "src" : "transparent.png"
        };
      });

      data2.forEach(function (entry) {
        entry["imgSelect"] = {
          "src" : "transparent.png"
        };
      });

      this.view.filter.segOtherRequests.data = data0;
      this.view.filter.segBulkTransactions.data = data1;
      this.view.filter.segSingleTransactions.data = data2;
    },

    setupDataFromFilter : function(selectedData) {
      var data = "";
      var datatype = "";
      if(kony.sdk.isNullOrUndefined(selectedData)) {
        data = "";
        datatype = "";
      }
      else {
        data = selectedData;
        datatype = "featureName";
      }
      this.selectedFilter = data;

      var requestData = {
        "sortByParam":"",
        "sortOrder": "", //createdts
        "searchString": "",
        "pageSize": "" ,
        "pageOffset": "",
        "filterByParam":datatype,
        "filterByValue": data,
        //  "removeByParam": "featureActionId",
        //"removeByValue": "BULK_PAYMENT_REQUEST_SUBMIT"
      };
      this.fetchPendingApprovals(requestData);
      //this.fetchPendingApprovals(datatype, data);
      //setupApprovalHistory : "filterByParam":datatype, "filterByValue":data
    },

    showToastPopup : function(response,successOrfailure,message)
    {
      try {   
        if(!kony.sdk.isNullOrUndefined(response)){
          var scopeObj=this;
          var statusMessage = "";

          if(successOrfailure === "success"){
            statusMessage = message === "" ? "Successfully executed" : message;
            this.view.flxPopup.skin = "sknFlxBg43ce6eTab";
            this.view.customPopup.imgPopup.src = "confirmation_tick.png";  
          }else if(successOrfailure === "failure"){
            if(!kony.sdk.isNullOrUndefined(response.errorMessage)){
              statusMessage= response.errorMessage;
            }
            else{
              statusMessage= "Something went wrong while making service call.";
            }
            this.view.flxPopup.skin = "sknflxff5d6e";
            this.view.customPopup.imgPopup.src = "errormessage.png";  
          }

          this.view.customPopup.lblPopup.text = statusMessage;    
          if(!kony.sdk.isNullOrUndefined(this._timerCounter)){
            this._timerCounter = parseInt(this._timerCounter)+1;
          }
          else{
            this._timerCounter = 1;
          }
          var timerId="timerPopupErrorACHTransactionDetail"+this._timerCounter;

          if(this.view.flxRejectMenu.isVisible){
            this.view.flxRejectMenu.isVisible = false;
          }
          this.view.flxPopup.setVisibility(true);
          kony.timer.schedule(timerId, function() {
            scopeObj.view.flxPopup.setVisibility(false);
            if(successOrfailure === "success"){
              //scopeObj.fetchGeneralTransactionApprovals();
              scopeObj._serviceCounter = 0;
              scopeObj.fetchDataBasedOnPermissions();
            }
          }, 2, false);            
        }

        applicationManager.getPresentationUtility().dismissLoadingScreen();
      }catch(error){
        kony.print("Exception in showToastMessage-->"+error);
        applicationManager.getPresentationUtility().dismissLoadingScreen();
      }      
    },
    searchApprovalOnEmpty: function() {
      try {
        var searchText = this.view.tbxSearch.text;
        if (searchText === "") {
          this.fetchDataBasedOnPermissions();
        }
      } catch (err) {
        kony.print("Error search---->" + err);
      }
    },
  };

});