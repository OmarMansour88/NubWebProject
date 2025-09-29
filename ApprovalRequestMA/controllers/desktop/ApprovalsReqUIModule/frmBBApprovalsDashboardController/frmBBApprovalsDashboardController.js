define(['CommonUtilities', 'ViewConstants', 'FormControllerUtility', 'CampaignUtility'], function(CommonUtilities, ViewConstants, FormControllerUtility, CampaignUtility) {
  var orientationHandler = new OrientationHandler();
  return {

    /** Global Variables **/
    ApprovalsReqModule: null,
    defaultTab: kony.i18n.getLocalizedString("i18n.konybb.Common.Pending"),
        forms: {
      userDetails: "frmUserManagementDetails",
      ACHDashboard: "frmACHDashboard"
    },
        dashboardSortParams: {},
        fetchParams: {},
        filterParams: {},
        activeTab: null,
    
        updateFormUI: function(uiModel) {
            if (uiModel) {
                switch (uiModel) {
                    case BBConstants.DASHBOARD_DEFAULT_TAB:
            //this.setUpDefaultView();
            break;
                    case BBConstants.LOADING_INDICATOR:
            FormControllerUtility.showProgressBar(this.view);
            break;
                    case BBConstants.SERVICE_ERROR:
                        this.showDownTimeMessage(uiModel.responseData);
                        break;

        }
      }
      
      if(uiModel.approvalHistory){
        this.setApprovalHistoryData(uiModel.approvalHistory);
      }
      if(uiModel.approvalPending){
        this.setApprovalPendingData(uiModel.approvalPending);
      }
      if (uiModel.progressBar === true) {
        FormControllerUtility.showProgressBar(this.view);
      }
      else if (uiModel.progressBar === false) {
        FormControllerUtility.hideProgressBar(this.view);
      }
      if (uiModel.campaignRes) {
           this.campaignSuccess(uiModel.campaignRes);
         }
      if (uiModel.campaignError) {
          this.view.dbRightContainerNew.flxBannerWrapper.setVisibility(false);
		  if(!kony.sdk.isNullOrUndefined(this.view.flxBannerContainerDesktop)){
            this.view.flxBannerContainerDesktop.setVisibility(false);
          }
          if(!kony.sdk.isNullOrUndefined(this.view.flxBannerContainerMobile)){
            this.view.flxBannerContainerMobile.setVisibility(false);
          }
      }
          if(uiModel.boolVal){
            this.history = "history";
          }
          
    },
    initializeDashboardSortParams : function(){
      this.dashboardSortParams = {
        "Pending" : {
          "ApproveType" : "sortingfinal.png",
          "SentDate" : "sortingfinal.png",
          "SentBy" : "sortingfinal.png",
		  "RequestBy":"sortingfinal.png",
        },
        "History" : {
          "ApproveType" : "sortingfinal.png",
          "SentDate" : "sortingfinal.png",
          "SentBy" : "sortingfinal.png",
		  "ApproveDate" : "sortingfinal.png",
		  "Status":"sortingfinal.png",
        },
        "ACHFiles" : {
          "DebitAmount" : "sortingfinal.png",
          "CreditAmount" : "sortingfinal.png", 
          "FileStatus" : "sortingfinal.png"
        }
      };
    },
    	updateSortParamsHistory : function (sortByParam,sortOrder){
			 var searchData = {
                        "sortByParam": sortByParam,
						"sortOrder":sortOrder
                    };
          this.fetchParams.sortByParam = sortByParam ;
        this.fetchParams.sortOrder = sortOrder ;
         this.loadApprovalsReqModule().presentationController.fetchApprovalHistory(this.fetchParams);
		},
    updateSortParams : function (sortByParam,sortOrder){
			 var searchData = {
                        "sortByParam": sortByParam,
						"sortOrder":sortOrder
                    };
        this.fetchParams.sortByParam = sortByParam ;
        this.fetchParams.sortOrder = sortOrder ;
         this.loadApprovalsReqModule().presentationController.fetchApprovalPending(this.fetchParams);
		},

    setApprovalHistoryData : function(response){
      var width = kony.application.getCurrentBreakpoint();
      var scope = this ;
      this.view.onBreakpointChange = this.onBreakpointChange;
      this.history = "";
      var approvalHistory = response.records;
      if(width === 640 || orientationHandler.isMobile){
				var SectionData1 = {
					
				};
				this.view.TabPaneNew.TabBodyNew.setSectionData([SectionData1]);
				var defaultValues = {
					"flxDetilsHighlighterMain" : {
						isVisible : false
					},
					"flxMyApprovalsRowHeader" : {
						height : "60dp",
						skin : "slFboxffffff"
					},
					"flxMainContent" : {
						height : "60dp",
					},
					
					"imgDropDown":{
						skin : "sknLblFontTypeIcon1a98ff12pxOther",
						text : "O"
					},
                  
					"flxDropDown": {
                        onClick: function(eventObject, context) {
                            var secIndex = context["sectionIndex"];
                            var rowIndex = context["rowIndex"];
                            this.view.TabPaneNew.TabBodyNew.showOrHideMobile({
                                section: secIndex,
                                row: rowIndex,
                                direction: 1
                            });
                        }.bind(this)
                    },
                  
					"flxTemplateDetails": {
						isVisible : false
					},
					"flxBulkPaymentsDetails": {
						isVisible : false
					},
					"flxAChPayments": {
						isVisible : false
					},
					"flxACHFile" : {
						isVisible : false
					},
					"flxCheckBookRequest" : {
						isVisible : false
					},
					"flxTransactionTypes" : {
						isVisible : false
					},
					"flxActions" : {
						isVisible : false
					},
                   "flxReject" : {
						isVisible : false
					},
					"flxActionSeparator" : {
						isVisible : false
					},
					"flxViewDetails" : {
						width : "100%",
						onClick: function(eventobject, context) {
                            var selectedRowVal = this.view.TabPaneNew.TabBodyNew.segTemplates.selectedRowItems[0].featureActionId;
                            if (selectedRowVal === "ACH_PAYMENT_CREATE" || selectedRowVal === "ACH_COLLECTION_CREATE") {
                                var transaction = BBConstants.ACH_TRANSACTION_VIEW_DETAILS;
                                this.viewDetailsOfSelectedRecordHistory(eventobject, context, transaction);
                            } else if (selectedRowVal === "ACH_FILE_UPLOAD") {
                                var transaction = BBConstants.ACH_FILE_VIEW_DETAILS;
                                this.viewDetailsOfSelectedRecordHistory(eventobject, context, transaction);
                            } else if (selectedRowVal === "BULK_PAYMENT_FILES_SINGLE_UPLOAD_CSV" || selectedRowVal === "BULK_PAYMENT_REQUEST_SUBMIT") {
                                this.navigateToviewDetailsHistory(eventobject, context);
                            } else {
                                var transaction = BBConstants.GEN_TRANSACTION_VIEW_DETAILS;
                                this.viewDetailsOfSelectedRecordHistory(eventobject, context, transaction);
                            }
                        }.bind(this)
					},
					"lblBulkSentDate": {
						text: kony.i18n.getLocalizedString("konybb.Approvals.SentDate"),
					},
					"lblBPRequestType" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.RequestType")
					},
					"lblBPFromAccount" : {
						text: kony.i18n.getLocalizedString("i18n.transfers.fromAccount")
					},
					"lblOPTotalAmount" : {	
						text: kony.i18n.getLocalizedString("i18n.Transfers.TotalAmount")
					},
					"lblTotalTransactions" : {
						text: kony.i18n.getLocalizedString("i18n.bulkWire.totalTransactions")
					},
					"lblBPReferenceId" : {
						text : "Reference ID"
					},
					"lblBPDescription" : {	
						text: kony.i18n.getLocalizedString("i18n.kony.Bulkpayments.Description")
					},
					"lblBPFileName" : {
						text: kony.i18n.getLocalizedString("i18n.bulkWire.fileName")
					},
					"lblBPExecutionDate" : {
						text : "Execution Time"
					},
					"lblBPstatus" : {
						text : kony.i18n.getLocalizedString("i18n.ChequeManagement.Status")
					},
					"lblCustomerName" : {
						text: kony.i18n.getLocalizedString("i18n.accountDetail.customerName")
					},
					"lblApprovals" : {
						 text: kony.i18n.getLocalizedString("i18n.konybb.ACH.Approvals")
					},
					"lblProcessingMode" : {
						text: kony.i18n.getLocalizedString("i18n.kony.BulkPayments.ProcessingMode")
					},
					"lblBPReference" : {
						text : "Reference"
					},
					//ach 
					"lblACHSentDate" : {
						text: kony.i18n.getLocalizedString("konybb.Approvals.SentDate"),
					},
					"lblACHRequestType" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.RequestType")
					},
					"lblACHDebitAccount" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.DebitAccount")
					},
					"lblAchAmount" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.Amount")
					},
					"lblACHTemplateName" : {
						text: kony.i18n.getLocalizedString("i18n.bulkWire.templateName")
					},
					"lblACHapprovals" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.ACH.Approvals")
					},
					"lblAchCustomerName" : {
						text: kony.i18n.getLocalizedString("i18n.accountDetail.customerName")
					},
					"lblACHFileSentDate": {
						text: kony.i18n.getLocalizedString("konybb.Approvals.SentDate"),
					},
					"lblACFFileRequestType" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.RequestType")
					},
					"lblUploadDateTime" : {
						text :"Upload Date & Time"
					},
					"lblACHFileAmount" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.Amount")
					},
					"lblACHFileFileName" : {
						text: kony.i18n.getLocalizedString("i18n.bulkWire.fileName")
					},
					"lblNACHumberOfDebits" : {
						 text: kony.i18n.getLocalizedString("i18n.konybb.Files.NumbOfDebits")
					},
					"lblNoofCredits" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Files.NumbOfCredits")
					},
					"lblTotalDebitAmount" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.TotalDebitAmt")
					},
					"lblACHFileCreditAmount" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.TotalCreditAmt")
					},
					"lblACHFileApprovals" : {
						 text: kony.i18n.getLocalizedString("i18n.konybb.ACH.Approvals")
					},
					"lblCBSentDate" : {
						text: kony.i18n.getLocalizedString("konybb.Approvals.SentDate"),
					},
					"lblCBRequestType" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.RequestType")
					},
					"lblRequestAccount" : {
						text : "Request Account"
					},
					"lblNoofBooks" : {
						text : "Number of Books"
					},
					"lblFeesService" : {
						text : "Fees inclusive of Service Charges"
					},
					"lblRequestId" : {
						text : "Request ID"
					},
					"lblSentDateTransaction" : {
						text: kony.i18n.getLocalizedString("konybb.Approvals.SentDate"),
					},
					"lblRequestTypeTransaction" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.RequestType")
					},
					"lblTransactionDebitAccount" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.DebitAccount")
					},
					"lblTransactionAmount" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.Amount")
					},
					"lblTransactionPayee" : {
						text: kony.i18n.getLocalizedString("i18n.billPay.Payee")
					},
					"lblTransactionTransactionID" : {
						text: "Transaction ID"
					},
					"lblTransactionStatus" : {
						 text: kony.i18n.getLocalizedString("i18n.ChequeManagement.Status")
					},
					"lblTransactionApprovals" : {
						 text: kony.i18n.getLocalizedString("i18n.konybb.ACH.Approvals")
					},
					"lblTransactionFrequency" : {
						 text: kony.i18n.getLocalizedString("i18n.transfers.lblFrequency")
					},
					"lblTransactionRecurrence" : {
						text: kony.i18n.getLocalizedString("i18n.accounts.recurrence")
					},
					"lblTransactionCustomerName" : {
						text: kony.i18n.getLocalizedString("i18n.accountDetail.customerName")
					},
					"lblTransactionReference" : {
						text: "Reference",
					},
                    "lblTransactionServiceCharge": {
                        isVisible: false
                    },
                    "lblTransactionServiceChargeVal": {
                        isVisible: false
                    }
					
					
				};
				var rowdata ={
                  "lblTrStatus" : "lblTrStatus",
					"lblApprovetypeval":"featureName",
					"lblSentByVal": "sentBy",
					"lblBulkSentDateVal" : "sentDate",
					"lblBPRequestTypeVal": "requestType",
					"lblBPFromAccountVal":"accountId",
					"lblOPTotalAmountValue":"amount",
					 "lblTotalTransactionsVal": "totalTransactions",
					 "lblBPReferenceIdVal":"confirmationNumberVal",
					 "lblBPDecriptionValue" : "description",
					 "lblBPFileNameVal": "FileName",
					 "lblBPExecutionDateVal": "processingDate",
					 "lblBPstatusVal" : "status",
					 "lblCustomerNameValue" : "customerName",
					 "lblApprovalsVal": "approvals",
					 "lblProcessingModeVal":"processingMode",
					 "lblBPReferenceVal": "reference",
					 "lblACHSentDateVal": "sentDate" ,
					 "lblACHRequestTypeVal" : "requestType",
					 "lblACHDebitAccountVal" : "accountId",
					 "lblAchAmountVal": "amount",
					 "lblACHTemplateNameVal": "FileName",
					 "lblACHapprovalsVal" : "approvals",
					 "lblAchCustomerNameVal" : "customerName",
					 "lblACHFileSentDateVal" : "sentDate",
					 "lblACFFileRequestTypeVal" : "requestType",
					 "lblUploadDateTimeVal" : "processingDate",
					 "lblACHFileAmountVal" : "amount",
					 "lblACHFileFileNameVal": "FileName",
					 "lblACHFileNumberofDebits" : "numberOfDebits",
					 "blNoofCreditsVal" : "numberOfCredits",
					 "lblTotalDebitAmountVal" : "amount",
					 "lblACHFileCreditAmountVal" : "",
					 "lblACHFileApprovalsVal" : "approvals",
					 "lblCBSentDateVal" : "sentDate",
					 "lblCBRequestTypeVal" : "requestType",
					 "lblRequestAccountval" : "accountId",
					 "lblNoofBooksVal" : "noOfBooks",
					 "lblFeesServiceVal" : "amount",
					 "lblRequestIdVal" : "confirmationNumberVal",
					 "lblSentDateTransactionVal" : "sentDate",
					 "lblRequestTypeTransactionVal" : "requestType",
					 "lblTransactionDebitAccountVal" : "accountId",
					 "lblTransactionAmountVal" : "amount",
					 "lblTransactionPayeeVal" : "payee",
					 "lblTransactionTransactionIDVal" : "transactionIdVal",
					 "lblTransactionStatusVal" : "status",
					 "lblTransactionApprovalsVal" : "approvals",
					 "lblTransactionFrequencyVal" : "frequency",
					 "lblTransactionRecurrenceVal" : "recurrence",
					 "lblTransactionCustomerNameVal" : "customerName",
                     "lblTransactionServiceCharge" : "lblServiceCharge",
                     "lblTransactionServiceChargeVal" : "lblServiceChargeVal",
					 "lblTransactionReferenceVal" : "reference",
                     "lblTransactionExchangeRate" : "lblExchangeRate",
                     "lblTransactionExchangeRateVal" : "lblExchangeRateVal"
					 
					 
				};
        
         if (approvalHistory.length === 0) {
        this.view.TabPaneNew.PaginationContainer.isVisible = false;
		this.showNoHistoryTransactions();
            } else {
                this.view.TabPaneNew.TabBodyNew.setRowDataMap([rowdata]);
                this.view.TabPaneNew.TabBodyNew.setDefaultValues([defaultValues]);
                this.view.TabPaneNew.TabBodyNew.addDataForSections([approvalHistory]);
      
         this.view.TabPaneNew.PaginationContainer.isVisible = true;
          this.updatePaginationContainerUI(approvalHistory);
                if (approvalHistory.length === this.view.TabPaneNew.PaginationContainer.getPageSize() + 1) {
            approvalHistory.pop();
          }
      }
				
				
			}else{
            var SectionData1 = {

                "flxTransactions": {
                    isVisible: true
                },
                "flxApproevePendingTransaction": {
                    isVisible: false
                },
                "flxTopSeperator": {
                    skin: "lblSeparator"
                },
                "btnApproveType": {
                    skin: "sknBtnAccountSummaryUnselectedTransfer424242",
                    text: kony.i18n.getLocalizedString("i18n.accounts.TransactionType"),
                },
				"flxApproveType" :{	onClick : function(eveobject,content){
						var section = content.sectionIndex ;
						//var row = content.rowIndex ;
						//var valuetxt = JSON.parse(JSON.stringify(scope.view.TabPaneNew.TabBodyNew.segTemplates.data[section][1][row].featureActionName));
						var img = this.dashboardSortParams.History.ApproveType ;
						if(img === "sorting_next.png"){
							
							var order = "DESC";
						}else{
							
							var order = "ASC";
						}
						img = (img==="sorting_next.png")?"sorting_previous.png":"sorting_next.png";
						   this.dashboardSortParams.History.ApproveType = img;
							this.dashboardSortParams.History.SentDate = "sortingfinal.png";
						this.dashboardSortParams.History.SentBy = "sortingfinal.png";
						this.dashboardSortParams.History.ApproveDate = "sortingfinal.png";
						this.dashboardSortParams.History.Status = "sortingfinal.png";
						scope.updateSortParamsHistory("featureName",order);
						//scope.view.TabPaneNew.TabBodyNew.segTemplates.setSectionAt(dataObj1, section);
					}.bind(this)
                },
                "imgSortApproveType": {
                    src: this.dashboardSortParams.History.ApproveType,
                  accessibilityConfig: {
						"a11yLabel": (this.dashboardSortParams.History.ApproveType === "sorting_previous.png") ? kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("i18n.accounts.TransactionType")+" "+ kony.i18n.getLocalizedString("i18n.common.Ascending") : 
                    (this.dashboardSortParams.History.ApproveType === "sorting_next.png") ? kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("i18n.accounts.TransactionType")+" "+ kony.i18n.getLocalizedString("i18n.common.Descending") : 
                    kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("i18n.accounts.TransactionType")
					}
                },
                "btnSentDate": {
                    skin: "sknBtnAccountSummaryUnselectedTransfer424242",
                    text: kony.i18n.getLocalizedString("konybb.Approvals.SentDate"),
                },
              "flxSentDate" : {
					onClick : function(eveobject,content){
						var section = content.sectionIndex ;
						//var row = content.rowIndex ;
						//var valuetxt = JSON.parse(JSON.stringify(scope.view.TabPaneNew.TabBodyNew.segTemplates.data[section][1][row].featureActionName));
						var img = this.dashboardSortParams.History.SentDate ;
						if(img === "sorting_next.png"){
							
							var order = "DESC";
						}else{
							
							var order = "ASC";
						}
						img = (img==="sorting_next.png")?"sorting_previous.png":"sorting_next.png";
						this.dashboardSortParams.History.ApproveType = "sortingfinal.png";
							this.dashboardSortParams.History.SentDate = img;
						this.dashboardSortParams.History.SentBy = "sortingfinal.png";
						this.dashboardSortParams.History.ApproveDate = "sortingfinal.png";
						this.dashboardSortParams.History.Status = "sortingfinal.png";
						scope.updateSortParamsHistory("sentDate",order);
						//scope.view.TabPaneNew.TabBodyNew.segTemplates.setSectionAt(dataObj1, section);
					}.bind(this)
                },
                "imgSortSentDate": {
                    src: this.dashboardSortParams.History.SentDate,
                  accessibilityConfig: {
                    "a11yLabel": (this.dashboardSortParams.History.SentDate === "sorting_previous.png") ? kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("konybb.Approvals.SentDate")+" "+ kony.i18n.getLocalizedString("i18n.common.Ascending") :
                    (this.dashboardSortParams.History.SentDate === "sorting_next.png") ? kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("konybb.Approvals.SentDate")+" "+ kony.i18n.getLocalizedString("i18n.common.Descending"):
                    kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("konybb.Approvals.SentDate")
                  }
                },
                "btnSentBy": {
                    skin: "sknBtnAccountSummaryUnselectedTransfer424242",
                    text: kony.i18n.getLocalizedString("konybb.Approvals.SentBy"),
                },
              "flxSentBy" : {
					onClick : function(eveobject,content){
						var section = content.sectionIndex ;
						//var row = content.rowIndex ;
						//var valuetxt = JSON.parse(JSON.stringify(scope.view.TabPaneNew.TabBodyNew.segTemplates.data[section][1][row].featureActionName));
						var img = this.dashboardSortParams.History.SentBy ;
						if(img === "sorting_next.png"){
							
							var order = "DESC";
						}else{
							
							var order = "ASC";
						}
						img = (img==="sorting_next.png")?"sorting_previous.png":"sorting_next.png";
						this.dashboardSortParams.History.ApproveType = "sortingfinal.png";
							this.dashboardSortParams.History.SentDate = "sortingfinal.png";
						this.dashboardSortParams.History.SentBy = img;
						this.dashboardSortParams.History.ApproveDate = "sortingfinal.png";
						this.dashboardSortParams.History.Status = "sortingfinal.png";
						scope.updateSortParamsHistory("sentBy",order);
						//scope.view.TabPaneNew.TabBodyNew.segTemplates.setSectionAt(dataObj1, section);
					}.bind(this)
                },
                "imgSortSentBy": {
                    src: this.dashboardSortParams.History.SentBy,
                  accessibilityConfig: {
                    "a11yLabel": (this.dashboardSortParams.History.SentBy === "sorting_previous.png") ? kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("konybb.Approvals.SentBy")+" "+ kony.i18n.getLocalizedString("i18n.common.Ascending") :
                    (this.dashboardSortParams.History.SentBy === "sorting_next.png") ? kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("konybb.Approvals.SentBy")+" "+ kony.i18n.getLocalizedString("i18n.common.Descending") :
                    kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("konybb.Approvals.SentBy")
                  }
                },
                "btnApproveDate": {
                    skin: "sknBtnAccountSummaryUnselectedTransfer424242",
                    text: kony.i18n.getLocalizedString("konybb.Approvals.ApprovalDate"),
                },
                  "flxApproveDate" : {
					onClick : function(eveobject,content){
						var section = content.sectionIndex ;
						//var row = content.rowIndex ;
						//var valuetxt = JSON.parse(JSON.stringify(scope.view.TabPaneNew.TabBodyNew.segTemplates.data[section][1][row].featureActionName));
						var img = this.dashboardSortParams.History.ApproveDate ;
						if(img === "sorting_next.png"){
							
							var order = "DESC";
						}else{
							
							var order = "ASC";
						}
						img = (img==="sorting_next.png")?"sorting_previous.png":"sorting_next.png";
						  this.dashboardSortParams.History.ApproveType = "sortingfinal.png";
							this.dashboardSortParams.History.SentDate = "sortingfinal.png";
						this.dashboardSortParams.History.SentBy = "sortingfinal.png" ;
						this.dashboardSortParams.History.ApproveDate = img;
						this.dashboardSortParams.History.Status = "sortingfinal.png";
						scope.updateSortParamsHistory("approvalDate",order);
						//scope.view.TabPaneNew.TabBodyNew.segTemplates.setSectionAt(dataObj1, section);
					}.bind(this)
                },
                "imgSortApproveDate": {
                    src: this.dashboardSortParams.History.ApproveDate,
                  accessibilityConfig: {
                    "a11yLabel": (this.dashboardSortParams.History.ApproveDate === "sorting_previous.png") ? kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("i18n.konybb.myApproval.Approve")+kony.i18n.getLocalizedString("i18n.ChequeManagement.Date")+" "+ kony.i18n.getLocalizedString("i18n.common.Ascending") : 
                    (this.dashboardSortParams.History.ApproveDate === "sorting_next.png") ? kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("i18n.konybb.myApproval.Approve")+kony.i18n.getLocalizedString("i18n.ChequeManagement.Date")+" "+ kony.i18n.getLocalizedString("i18n.common.Descending") : 
                    kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("i18n.konybb.myApproval.Approve")+kony.i18n.getLocalizedString("i18n.ChequeManagement.Date")
                  }
                },
                "btnStatus": {
                    skin: "sknBtnAccountSummaryUnselectedTransfer424242",
                    text: kony.i18n.getLocalizedString("konybb.Approvals.Status"),
                },
              "flxStatus" :{
					onClick : function(eveobject,content){
						var section = content.sectionIndex ;
						//var row = content.rowIndex ;
						//var valuetxt = JSON.parse(JSON.stringify(scope.view.TabPaneNew.TabBodyNew.segTemplates.data[section][1][row].featureActionName));
						var img = this.dashboardSortParams.History.Status ;
						if(img === "sorting_next.png"){
							
							var order = "DESC";
						}else{
							
							var order = "ASC";
						}
						img = (img==="sorting_next.png")?"sorting_previous.png":"sorting_next.png";
						  this.dashboardSortParams.History.ApproveType = "sortingfinal.png";
							this.dashboardSortParams.History.SentDate = "sortingfinal.png";
						this.dashboardSortParams.History.SentBy = "sortingfinal.png" ;
						this.dashboardSortParams.History.ApproveDate = "sortingfinal.png";
						this.dashboardSortParams.History.Status = img;
						scope.updateSortParamsHistory("status",order);
						//scope.view.TabPaneNew.TabBodyNew.segTemplates.setSectionAt(dataObj1, section);
					}.bind(this)
                },
                "imgsortStatus": {
                  src: this.dashboardSortParams.History.Status,
                  accessibilityConfig: {
                    "a11yLabel": (this.dashboardSortParams.History.Status === "sorting_previous.png") ? kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("i18n.ChequeManagement.Status")+" "+ kony.i18n.getLocalizedString("i18n.common.Ascending") :
                    (this.dashboardSortParams.History.Status === "sorting_next.png") ? kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("i18n.ChequeManagement.Status")+" "+ kony.i18n.getLocalizedString("i18n.common.Descending") :
                    kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("i18n.ChequeManagement.Status")
                  }
                },
                "lblTrActions": {
                    text: kony.i18n.getLocalizedString("konybb.Approvals.Action")
                },
                "flxBottomSeperator": {
                    skin: "lblSeparator"
                },
      };

      this.view.TabPaneNew.TabBodyNew.setSectionData([SectionData1]);

      var defaultValues = {


                imgDropDown: {
                    skin: "sknLblFontTypeIcon1a98ff12pxOther",
                    text: "O"
                },
        		flxDropDown: {
                        onClick: function(eventObject, context) {
                            var secIndex = context["sectionIndex"];
                            var rowIndex = context["rowIndex"];
                            this.view.TabPaneNew.TabBodyNew.showOrHideDetails( {section:secIndex,row:rowIndex,direction:1});
							this.adjustScreen(-155);
                        }.bind(this)
				},
       flxTopSeparatorHeader : {
         skin :"lblSeparator"
       },
                flxBottomSeparatorApprovalRow: {
                    skin: "lblSeparator"
                },
                flxTrActions: {
                    onClick: function(eventobject, context) {
                      var selectedRowVal = this.view.TabPaneNew.TabBodyNew.segTemplates.selectedRowItems[0].featureActionId;
                        if (selectedRowVal === "ACH_PAYMENT_CREATE" || selectedRowVal === "ACH_COLLECTION_CREATE") {
                            var transaction = BBConstants.ACH_TRANSACTION_VIEW_DETAILS;
                            this.viewDetailsOfSelectedRecordHistory(eventobject, context, transaction);
                        } else if (selectedRowVal === "ACH_FILE_UPLOAD") {
                            var transaction = BBConstants.ACH_FILE_VIEW_DETAILS;
                            this.viewDetailsOfSelectedRecordHistory(eventobject, context, transaction);
                        } else if (selectedRowVal === "BULK_PAYMENT_FILES_SINGLE_UPLOAD_CSV" || selectedRowVal === "BULK_PAYMENT_REQUEST_SUBMIT") {
                           this.navigateToviewDetailsHistory(eventobject, context);
                        } else {
                            var transaction = BBConstants.GEN_TRANSACTION_VIEW_DETAILS;
                            this.viewDetailsOfSelectedRecordHistory(eventobject, context, transaction);
                        }
                    }.bind(this)
                },
                flxMain: {
                    isVisible: true,
                    height: "60dp"
                },
                flxTemplateDetails: {
                    isVisible: false
                },
                flxBulkPaymentsDetails: {
                    isVisible: false
                },
                flxBPOngoingPaymentsDetails: {
                    isVisible: true
                },
                flxApprovalHistoryRowTemplate: {
                    isVisible: true
                },
                flxHeader: {
                    isVisible: true,
                    skin: "slFboxffffff"
                },
                flxDetilsHighlighterMain: {
                    isVisible: false
                },
                lblTrStatus: {
                    text: kony.i18n.getLocalizedString("i18n.common.ViewDetails")
                },
                lblOPFromAccount: {
                    text: kony.i18n.getLocalizedString("i18n.transfers.fromAccount")
                },
                lblOPTotalTransactions: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.ACH.Approvals")
                },
                lblRequestType: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.RequestType")
                },
                lblOPTotalAmount: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.Amount")
                },
                lblOPPaymentID: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.ACH.Approvals")
                },
                lblOPInitiatedBy: {
                    text: kony.i18n.getLocalizedString("i18n.billPay.Payee")
                },
                lblFrequency: {
                    text: kony.i18n.getLocalizedString("i18n.transfers.lblFrequency")
                },
                lblTransactionID: {
                    text: kony.i18n.getLocalizedString("kony.i18n.common.transactionID")
                },
                lblRecurrence: {
                    text: kony.i18n.getLocalizedString("i18n.accounts.recurrence")
                },
				lblOPFromAccount : {
					text : kony.i18n.getLocalizedString("i18n.transfers.fromAccount")
				},
				lblOPTotalAmount : {
					text : kony.i18n.getLocalizedString("i18n.konybb.Common.Amount")
				},
				lblOPDecription : {
					text : "Description"
				},
				lblFileName :{
					text : kony.i18n.getLocalizedString("i18n.bulkWire.fileName")
				},
				lblExecutionDate : {
					text : "Execution Time"
				},
				lblTotalTransactions: {
                    text: kony.i18n.getLocalizedString("i18n.bulkWire.totalTransactions")
                },
				lblOPPaymentID : {
					text : "Reference ID"
				},
				lblCustomerName : {
					text : kony.i18n.getLocalizedString("i18n.accountDetail.customerName")
				},
				lblProcessingMode :{
					text : kony.i18n.getLocalizedString("i18n.kony.BulkPayments.ProcessingMode")
				},
				lblBulkStatus : {
					text : kony.i18n.getLocalizedString("i18n.ChequeManagement.Status")
				},
				lblBulkReference : {
					 text: "Reference",
                    isVisible : false
				},
				lblTransactionTypeDebit : {
					text : kony.i18n.getLocalizedString("i18n.konybb.Common.DebitAccount")
				},
				lblTransactionCustomerName : {
					text : kony.i18n.getLocalizedString("i18n.accountDetail.customerName")
				},
				lblTransactionAmount : {
					text: kony.i18n.getLocalizedString("i18n.konybb.Common.Amount")
				},
				lblTransactionApprovals : {
					text: kony.i18n.getLocalizedString("i18n.konybb.ACH.Approvals")
				},
				lblTransactionPayee : {
					text: kony.i18n.getLocalizedString("i18n.billPay.Payee")
				},
				lblTransactionFrequency : {
					text: kony.i18n.getLocalizedString("i18n.transfers.lblFrequency")
				},
				lblTransactionTransactionID : {
					text : "Transaction ID"
				},
				lblTransactionRecurrence : {
					 text: kony.i18n.getLocalizedString("i18n.accounts.recurrence")
				},
				lblUploadDateTime : {
					text : "Upload Date & Time"
				},
				lblNACHumberOfDebits : {
					 text: kony.i18n.getLocalizedString("i18n.konybb.Files.NumbOfDebits")
				},
				lblACHFileAmount : {
					text : kony.i18n.getLocalizedString("i18n.konybb.Common.Amount")
				},
				lblNoofCredits : {
					text: kony.i18n.getLocalizedString("i18n.konybb.Files.NumbOfCredits")
				},
				lblACHFileFileName: {
                    text: kony.i18n.getLocalizedString("i18n.bulkWire.fileName")
                },
                lblTotalDebitAmount: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.TotalDebitAmt")
                },
                lblACFFileRequestType: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.RequestType")
                },
                lblACHFileCreditAmount: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.TotalCreditAmt")
                },
				 lblACHDebitCredit: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.Debit/CreditAccount")
                },
                lblACHapprovals: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.ACH.Approvals")
                },
                lblACHFileApprovals: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.ACH.Approvals")
                },
                lblAchAmount: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.Amount")
                },
                lblAchCustomerName: {
                    text: kony.i18n.getLocalizedString("i18n.accountDetail.customerName")
                },
                lblACHTemplateName: {
                    text: kony.i18n.getLocalizedString("i18n.bulkWire.templateName")
                },
                lblACHRequestType: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.RequestType")
                },
				lblRequestAccount: {
                    text: "Request Account"
                },
                lblNoofBooks: {
                    text: "Number of Books"
                },
                lblFeesService: {
                    text: "Fees inclusive of service charges "
                },
                lblRequestId: {
                    text: "Request ID"
                },
				lblCustomerNameCheckBook : {
					text : kony.i18n.getLocalizedString("i18n.accountDetail.customerName")
				},
				lblCheckCreatedBY : {
					text : "Created By"
				},
				flxCheckBookRequest : {
					isVisible : false 
				},
				flxAChPayments  : {
					isVisible : false 
				},
				flxACHFile : {
					isVisible : false
				},
				flxTransactionTypes : {
					isVisible : false
				},
        	    flxTransactionIcon: {
					isVisible: applicationManager.getUserPreferencesManager().profileAccess === "both" ? true : false
				},
                lblTransactionServiceCharge: {
                  isVisible: false
                },
                lblTransactionServiceChargeVal: {
                  isVisible: false
                }
            };
            var rowdata = {
                "lblOpDescription": "featureName",
                "lblDate": "sentDate",
                "lblOpStatus": "sentBy",
                "lblApproveDate": "approvalDate",
                "lblStatus": "status",
                //"lblTrStatus":"featureActionId"
				 "lblOPFromAccountValue":"accountId",
				 "lblOPTotalTransactionsValue":"approvals",
				 "lblOPTotalAmountValue":"amount",
				 "lblOPPaymentIDValue":"confirmationNumberVal",
				 "lblOPDecriptionVal":"description",
				 "lblCustomerNameVal":"customerName",
				 "lblFileNameVal":"FileName",
				 "lblProcessingModeVal":"processingMode",
				 "lblRequestTypeVal":"requestType",
				 "lblExecutionDateVal":"processingDate",
				 "lblBulkStatusVal":"status",
				 //"lblBulkReferenceVal":"confirmationNumber",
				 "lblTransactionTypeDebitVal":"accountId",
				 "lblTransactionCustomerNameVal":"customerName",
				 "lblTransactionAmountVal":"amount",
				 "lblTransactionPayeeVal":"payee",
				 "lblTransactionFrequencyVal":"frequency",
				 "lblTransactionRecurrenceVal":"recurrence",
				 "lblUploadDateTimeVal":"TransactionDate",
                 "lblACHapprovalsVal" : "approvals",
				 "lblACHFileNumberofDebits":"numberOfDebits",
				 "lblACHFileAmountVal":"amount",
				 "blNoofCreditsVal":"numberOfCredits",
				 "lblACHFileFileNameVal":"FileName",
				 "lblTotalDebitAmountVal":"amount",
				 "lblACFFileRequestTypeVal":"requestType",
				 "lblACHFileCreditAmountVal":"TotalCreditAmount",
                 "lblACHFileApprovalsVal" : "approvals",
				 "lblACHDebitCreditVal":"accountId",
				 "lblAchAmountVal":"amount",
				 "lblAchCustomerNameVal":"customerName",
				 "lblACHTemplateNameVal":"templateName",
				 "lblACHRequestTypeVal": "requestType",
				 "lblRequestAccountval":"accountId",
				 "lblNoofBooksVal":"noOfBooks",
				 "lblFeesServiceVal":"amount",
				 "lblRequestIdVal":"transactionIdVal",
				 "lblCustomerNameValCheck":"customerName",
				 "lblCheckCreatedBYVal":"sentBy",
                "lblTransactionApprovalsVal": "approvals",
                "lblTransactionServiceCharge" : "lblServiceCharge",
                "lblTransactionServiceChargeVal" : "lblServiceChargeVal",
				"lblTransactionTransactionIDVal":"transactionIdVal",
                "lblTransactionExchangeRate" : "lblExchangeRate",
                "lblTransactionExchangeRateVal" : "lblExchangeRateVal"
            };
            if (approvalHistory.length === 0) {
        this.view.TabPaneNew.PaginationContainer.isVisible = false;
		this.showNoHistoryTransactions();
            } else {
      this.view.TabPaneNew.TabBodyNew.setRowDataMap([rowdata]);
      this.view.TabPaneNew.TabBodyNew.setDefaultValues([defaultValues]);


      this.view.TabPaneNew.TabBodyNew.addDataForSections([approvalHistory]);
      
         this.view.TabPaneNew.PaginationContainer.isVisible = true;
          this.updatePaginationContainerUI(approvalHistory);
                if (approvalHistory.length === this.view.TabPaneNew.PaginationContainer.getPageSize() + 1) {
            approvalHistory.pop();
          }
      }
            }
     this.adjustScreen(-155);
      // this.view.TabPaneNew.TabBodyNew.segTemplates.setData(SectionData1);
      this.view.forceLayout(); 
    },
    
        viewDetailsOfSelectedRecord: function(eventobject, context, transactionType) {
      var scopeObj = this;
      var row = context.rowIndex;
      var section = context.sectionIndex;
      var selectedRowData = this.view.TabPaneNew.TabBodyNew.getData()[section][1][row];
      FormControllerUtility.showProgressBar(this.view);
      var navObj = {
        requestData: {
          selectedRowData: selectedRowData,
          isApprovalData: true,
          isRequestData: false,
          isHistoty : false,
        },
        onSuccess: {
          form: this.forms.ACHDashboard,
          module: "ACHModule",
          context: {
            key: transactionType,
            responseData: {}
          }
        },
        onFailure: {
          form: "frmBBApprovalsDashboard",
          module: "ApprovalsReqUIModule",
          context: {
            key: BBConstants.SERVICE_ERROR,
            responseData: {}
          }
        }
      };
      scopeObj.ApprovalsReqModule.presentationController.noServiceNavigate(navObj);
    },	
     viewDetailsOfSelectedRecordHistory : function(eventobject, context, transactionType) {
      var scopeObj = this;
      var row = context.rowIndex;
      var section = context.sectionIndex;
      var selectedRowData = this.view.TabPaneNew.TabBodyNew.getData()[section][1][row];
      FormControllerUtility.showProgressBar(this.view);
      var navObj = {
        requestData: {
          selectedRowData: selectedRowData,
          isApprovalData: true,
          isRequestData: false,
          isHistory : true,
        },
        onSuccess: {
          form: this.forms.ACHDashboard,
          module: "ACHModule",
          context: {
            key: transactionType,
            responseData: {}
          }
        },
        onFailure: {
          form: "frmBBApprovalsDashboard",
          module: "ApprovalsReqUIModule",
          context: {
            key: BBConstants.SERVICE_ERROR,
            responseData: {}
          }
        }
      };
      scopeObj.ApprovalsReqModule.presentationController.noServiceNavigate(navObj);
    },	
    		  showNoHistoryTransactions: function() {
            var dataMap = {
              lblNoRecords: "lblMsg",
              imgInfoIcon: "imgInfoIcon"
            };
        var NODATAFLEXHEIGHT = "450dp";
            var defValues = {
                flxMain: {
                    "height": NODATAFLEXHEIGHT
                },
                flxHeader: {
                    "isVisible": false
                },
                flxTemplateDetails: {
                    "isVisible": false
                },
                flxNoRecords: {
                "isVisible": true
              },
                imgInfoIcon: {
                "src": "info_grey.png"                 
              }
            };
        this.view.TabPaneNew.TabBodyNew.setRowDataMap([dataMap]);
        this.view.TabPaneNew.TabBodyNew.setDefaultValues([defValues]);
            this.view.TabPaneNew.TabBodyNew.addRowsData([
                [{
                    "lblMsg": kony.i18n.getLocalizedString("i18n.konybb.myApproval.NoTransactions")
                }]
            ]);
    },
    navigateToviewDetails: function(eventobject, context) {
      var row = context.rowIndex;
      var section = context.sectionIndex;
      var selectedRowData = this.view.TabPaneNew.TabBodyNew.getData()[section][1][row];
      selectedRowData.isHistoryFlow = false;
      bulkpaymentModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "BulkPaymentsUIModule", "appName" : "BulkPaymentsMA"});
      bulkpaymentModule.presentationController.noServiceNavigateApproval({"appName" : "BulkPaymentsMA", "friendlyName" : "BulkPaymentsUIModule/frmBulkPaymentsReview"}, BBConstants.APPROVER_VIEW_PAYMENT, selectedRowData,'frmBulkPaymentsReview');
    },
        campaignSuccess: function(data) {
			  var CampaignManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule('CampaignManagement');
        CampaignManagementModule.presentationController.updateCampaignDetails(data);
            var self = this;
            if (data.length === 0) {
       
        this.view.dbRightContainerNew.flxBannerWrapper.setVisibility(false);
            } else {
            this.view.dbRightContainerNew.flxBannerWrapper.setVisibility(true);
           
        	this.view.dbRightContainerNew.imgBanner.src = data[0].imageURL;
                this.view.dbRightContainerNew.imgBanner.onTouchStart = function() {
              CampaignUtility.onClickofInAppCampaign(data[0].destinationURL); 
            };
        }
        
        this.adjustScreen(-155);
	},
    
      
    
    setApprovalPendingData : function(response){
     var pendingApprovals = response.records;
      var scope = this;
      this.view.onBreakpointChange = this.onBreakpointChange;
      //  this.view.TabPaneNew.TabBodyNew.segTemplates.widgetDataMap = this.getWidgetDataforAprovalsPending();
      var width = kony.application.getCurrentBreakpoint();
			if(width === 640 || orientationHandler.isMobile){
				var SectionData1 = {
					
				};
				this.view.TabPaneNew.TabBodyNew.setSectionData([SectionData1]);
				var defaultValues = {
					"flxDetilsHighlighterMain" : {
						isVisible : false
					},
					"flxMyApprovalsRowHeader" : {
						height : "60dp",
						skin : "slFboxffffff"
					},
					"flxMainContent" : {
						height : "60dp",
					},
					
					"imgDropDown":{
						skin : "sknLblFontTypeIcon1a98ff12pxOther",
						text : "O"
					},
                  	"flxDropDown": {
                        onClick: function(eventObject, context) {
                            var secIndex = context["sectionIndex"];
                            var rowIndex = context["rowIndex"];
                            this.view.TabPaneNew.TabBodyNew.showOrHideMobile({
                                section: secIndex,
                                row: rowIndex,
                                direction: 1
                            });
                        }.bind(this)
                    },
                   "flxTrActions": {
                        onClick: function(eveobject, content) {
                            var section = content.sectionIndex;
                            var row = content.rowIndex;
                            var valuetxt = JSON.parse(JSON.stringify(this.view.TabPaneNew.TabBodyNew.segTemplates.data[section][1][row].featureActionId));
                            if (valuetxt === "BULK_PAYMENT_REQUEST_SUBMIT" || valuetxt === "BULK_PAYMENT_FILES_SINGLE_UPLOAD_CSV") {
                                this.navigateToviewDetails(eveobject, content);
                            } else {
                                this.showPopup(eveobject, content);
                            }
                        }.bind(this)
                    },
					"flxReject": {
                        onClick: function(eveobject, content) {
                            var section = content.sectionIndex;
                            var row = content.rowIndex;
                            var valuetxt = JSON.parse(JSON.stringify(this.view.TabPaneNew.TabBodyNew.segTemplates.data[section][1][row].featureActionId));
                            if (valuetxt === "BULK_PAYMENT_REQUEST_SUBMIT" || valuetxt === "BULK_PAYMENT_FILES_SINGLE_UPLOAD_CSV") {
                                this.navigateToviewDetails(eveobject, content);
                            } else {
                                this.showRejectPopup(eveobject, content);
                            }
                        }.bind(this)
                    },
                    "flxViewDetails": {
                        onClick: function(eventobject, context) {
                            var selectedRowVal = this.view.TabPaneNew.TabBodyNew.segTemplates.selectedRowItems[0].featureActionId;
                            if (selectedRowVal === "ACH_PAYMENT_CREATE" || selectedRowVal === "ACH_COLLECTION_CREATE") {
                                var transaction = BBConstants.ACH_TRANSACTION_VIEW_DETAILS;
                                this.viewDetailsOfSelectedRecord(eventobject, context, transaction);
                            } else if (selectedRowVal === "ACH_FILE_UPLOAD") {
                                var transaction = BBConstants.ACH_FILE_VIEW_DETAILS;
                                this.viewDetailsOfSelectedRecord(eventobject, context, transaction);
                            } else if (selectedRowVal === "BULK_PAYMENT_FILES_SINGLE_UPLOAD_CSV" || selectedRowVal === "BULK_PAYMENT_REQUEST_SUBMIT") {
                                this.navigateToviewDetails(eventobject, context);
                            } else {
                                var transaction = BBConstants.GEN_TRANSACTION_VIEW_DETAILS;
                                this.viewDetailsOfSelectedRecord(eventobject, context, transaction);
                            }
                        }.bind(this),
                        isVisible: true,
                    },
					
					"flxTemplateDetails": {
						isVisible : false
					},
					"flxBulkPaymentsDetails": {
						isVisible : false
					},
					"flxAChPayments": {
						isVisible : false
					},
					"flxACHFile" : {
						isVisible : false
					},
					"flxCheckBookRequest" : {
						isVisible : false
					},
					"flxTransactionTypes" : {
						isVisible : false
					},
					"flxActions" : {
						isVisible : false
					},
					"lblBulkSentDate": {
						text: kony.i18n.getLocalizedString("konybb.Approvals.SentDate"),
					},
					"lblBPRequestType" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.RequestType")
					},
					"lblBPFromAccount" : {
						text: kony.i18n.getLocalizedString("i18n.transfers.fromAccount")
					},
					"lblOPTotalAmount" : {	
						text: kony.i18n.getLocalizedString("i18n.Transfers.TotalAmount")
					},
					"lblTotalTransactions" : {
						text: kony.i18n.getLocalizedString("i18n.bulkWire.totalTransactions")
					},
					"lblBPReferenceId" : {
						text : "Reference ID"
					},
					"lblBPDescription" : {	
						text: kony.i18n.getLocalizedString("i18n.kony.Bulkpayments.Description")
					},
					"lblBPFileName" : {
						text: kony.i18n.getLocalizedString("i18n.bulkWire.fileName")
					},
					"lblBPExecutionDate" : {
						text : "Execution Time"
					},
					"lblBPstatus" : {
						text : kony.i18n.getLocalizedString("i18n.ChequeManagement.Status")
					},
					"lblCustomerName" : {
						text: kony.i18n.getLocalizedString("i18n.accountDetail.customerName")
					},
					"lblApprovals" : {
						 text: kony.i18n.getLocalizedString("i18n.konybb.ACH.Approvals")
					},
					"lblProcessingMode" : {
						text: kony.i18n.getLocalizedString("i18n.kony.BulkPayments.ProcessingMode")
					},
					"lblBPReference" : {
						text : "Reference"
					},
					//ach 
					"lblACHSentDate" : {
						text: kony.i18n.getLocalizedString("konybb.Approvals.SentDate"),
					},
					"lblACHRequestType" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.RequestType")
					},
					"lblACHDebitAccount" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.DebitAccount")
					},
					"lblAchAmount" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.Amount")
					},
					"lblACHTemplateName" : {
						text: kony.i18n.getLocalizedString("i18n.bulkWire.templateName")
					},
					"lblACHapprovals" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.ACH.Approvals")
					},
					"lblAchCustomerName" : {
						text: kony.i18n.getLocalizedString("i18n.accountDetail.customerName")
					},
					"lblACHFileSentDate": {
						text: kony.i18n.getLocalizedString("konybb.Approvals.SentDate"),
					},
					"lblACFFileRequestType" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.RequestType")
					},
					"lblUploadDateTime" : {
						text :"Upload Date & Time"
					},
					"lblACHFileAmount" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.Amount")
					},
					"lblACHFileFileName" : {
						text: kony.i18n.getLocalizedString("i18n.bulkWire.fileName")
					},
					"lblNACHumberOfDebits" : {
						 text: kony.i18n.getLocalizedString("i18n.konybb.Files.NumbOfDebits")
					},
					"lblNoofCredits" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Files.NumbOfCredits")
					},
					"lblTotalDebitAmount" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.TotalDebitAmt")
					},
					"lblACHFileCreditAmount" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.TotalCreditAmt")
					},
					"lblACHFileApprovals" : {
						 text: kony.i18n.getLocalizedString("i18n.konybb.ACH.Approvals")
					},
					"lblCBSentDate" : {
						text: kony.i18n.getLocalizedString("konybb.Approvals.SentDate"),
					},
					"lblCBRequestType" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.RequestType")
					},
					"lblRequestAccount" : {
						text : "Request Account"
					},
					"lblNoofBooks" : {
						text : "Number of Books"
					},
					"lblFeesService" : {
						text : "Fees inclusive of Service Charges"
					},
					"lblRequestId" : {
						text : "Request ID"
					},
					"lblSentDateTransaction" : {
						text: kony.i18n.getLocalizedString("konybb.Approvals.SentDate"),
					},
					"lblRequestTypeTransaction" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.RequestType")
					},
					"lblTransactionDebitAccount" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.DebitAccount")
					},
					"lblTransactionAmount" : {
						text: kony.i18n.getLocalizedString("i18n.konybb.Common.Amount")
					},
					"lblTransactionPayee" : {
						text: kony.i18n.getLocalizedString("i18n.billPay.Payee")
					},
					"lblTransactionTransactionID" : {
						text: "Transaction ID"
					},
					"lblTransactionStatus" : {
						 text: kony.i18n.getLocalizedString("i18n.ChequeManagement.Status")
					},
					"lblTransactionApprovals" : {
						 text: kony.i18n.getLocalizedString("i18n.konybb.ACH.Approvals")
					},
					"lblTransactionFrequency" : {
						 text: kony.i18n.getLocalizedString("i18n.transfers.lblFrequency")
					},
					"lblTransactionRecurrence" : {
						text: kony.i18n.getLocalizedString("i18n.accounts.recurrence")
					},
					"lblTransactionCustomerName" : {
						text: kony.i18n.getLocalizedString("i18n.accountDetail.customerName")
					},
					"lblTransactionReference" : {
						text: "Reference",
					},
                    "lblTransactionServiceCharge": {
                        isVisible: false
                    },
                    "lblTransactionServiceChargeVal": {
                        isVisible: false
                    }
					
					
				};
				var rowdata ={
                  
					"lblApprovetypeval":"featureName",
					"lblSentByVal": "sentBy",
					"lblBulkSentDateVal" : "sentDate",
					"lblBPRequestTypeVal": "requestType",
					"lblBPFromAccountVal":"accountId",
					"lblOPTotalAmountValue":"amount",
					 "lblTotalTransactionsVal": "totalTransactions",
					 "lblBPReferenceIdVal":"confirmationNumberVal",
					 "lblBPDecriptionValue" : "description",
					 "lblBPFileNameVal": "FileName",
					 "lblBPExecutionDateVal": "processingDate",
					 "lblBPstatusVal" : "status",
					 "lblCustomerNameValue" : "customerName",
					 "lblApprovalsVal": "approvals",
					 "lblProcessingModeVal":"processingMode",
					 "lblBPReferenceVal": "reference",
					 "lblACHSentDateVal": "sentDate" ,
					 "lblACHRequestTypeVal" : "requestType",
					 "lblACHDebitAccountVal" : "accountId",
					 "lblAchAmountVal": "amount",
					 "lblACHTemplateNameVal": "FileName",
					 "lblACHapprovalsVal" : "approvals",
					 "lblAchCustomerNameVal" : "customerName",
					 "lblACHFileSentDateVal" : "sentDate",
					 "lblACFFileRequestTypeVal" : "requestType",
					 "lblUploadDateTimeVal" : "processingDate",
					 "lblACHFileAmountVal" : "amount",
					 "lblACHFileFileNameVal": "FileName",
					 "lblACHFileNumberofDebits" : "numberOfDebits",
					 "blNoofCreditsVal" : "numberOfCredits",
					 "lblTotalDebitAmountVal" : "amount",
					 "lblACHFileCreditAmountVal" : "",
					 "lblACHFileApprovalsVal" : "approvals",
					 "lblCBSentDateVal" : "sentDate",
					 "lblCBRequestTypeVal" : "requestType",
					 "lblRequestAccountval" : "accountId",
					 "lblNoofBooksVal" : "numberOfRecords",
					 "lblFeesServiceVal" : "amount",
					 "lblRequestIdVal" : "confirmationNumberVal",
					 "lblSentDateTransactionVal" : "sentDate",
					 "lblRequestTypeTransactionVal" : "requestType",
					 "lblTransactionDebitAccountVal" : "accountId",
					 "lblTransactionAmountVal" : "amount",
					 "lblTransactionPayeeVal" : "payee",
					 "lblTransactionTransactionIDVal" : "transactionIdVal",
					 "lblTransactionStatusVal" : "status",
					 "lblTransactionApprovalsVal" : "approvals",
					 "lblTransactionFrequencyVal" : "frequency",
					 "lblTransactionRecurrenceVal" : "recurrence",
					 "lblTransactionCustomerNameVal" : "customerName",
                     "lblTransactionServiceCharge" : "lblServiceCharge",
                     "lblTransactionServiceChargeVal" : "lblServiceChargeVal",
					 "lblTransactionReferenceVal" : "reference",
                     "lblTransactionExchangeRate" : "lblExchangeRate",
                     "lblTransactionExchangeRateVal" : "lblExchangeRateVal"
					 
					 
				};
               if (pendingApprovals.length === 0) {
     this.view.TabPaneNew.PaginationContainer.isVisible = false;
     this.showNoGeneralTransactions();
     
            } else {
     	this.view.TabPaneNew.TabBodyNew.setRowDataMap([rowdata]);
                this.view.TabPaneNew.TabBodyNew.setDefaultValues([defaultValues]);
                this.view.TabPaneNew.TabBodyNew.addDataForSections([pendingApprovals]);
      this.view.TabPaneNew.PaginationContainer.isVisible = true;
          this.updatePaginationContainerUI(pendingApprovals);
                if (pendingApprovals.length === this.view.TabPaneNew.PaginationContainer.getPageSize() + 1) {
            pendingApprovals.pop();
          }
   }
			
				
			}else {
              var SectionData = {
                "flxACHTransactions": "flxACHTransactions",
                "flxTransactions": {
                    isVisible: false
                },
                "flxApprovePendingTransaction": {
                    isVisible: false,
					onClick : function(eveobject,content){
						var section = content.sectionIndex ;
						var row = content.rowIndex ;
						var valuetxt = JSON.parse(JSON.stringify(scope.view.TabPaneNew.TabBodyNew.segTemplates.data[section][1][row].featureName));
						var img = JSON.parse(JSON.stringify(scope.view.TabPaneNew.TabBodyNew.segTemplates.data[section][1][row].imgApproveTypePending))
						if(img.src === "sorting_next.png"){
							img.src === "sorting_previous.png" ;
							var order = "DESC";
						}else{
							img.src === "sorting_next.png" ;
							var order = "ASC";
						}
						scope.updateSortParams(valuetxt,order);
					}.bind(this)
                },
                "flxTopSeparatorApprove": {
                    skin: "lblSeparator"
                },
              
                "btnApproveTypePending": {
                    skin: "sknBtnAccountSummaryUnselectedTransfer424242",
                    text: kony.i18n.getLocalizedString("i18n.accounts.TransactionType"),
                },
				"flxApproveTypePending":{	
                       onClick : function(eveobject,content){
						var section = content.sectionIndex ;
						//var row = content.rowIndex ;
						//var valuetxt = JSON.parse(JSON.stringify(scope.view.TabPaneNew.TabBodyNew.segTemplates.data[section][1][row].featureActionName));
						var img = this.dashboardSortParams.Pending.ApproveType ;
						if(img === "sorting_next.png"){
							
							var order = "DESC";
						}else{
							
							var order = "ASC";
						}
						img = (img==="sorting_next.png")?"sorting_previous.png":"sorting_next.png";
						  this.dashboardSortParams.Pending.ApproveType = img;
							this.dashboardSortParams.Pending.SentDate ="sortingfinal.png";
							this.dashboardSortParams.Pending.SentBy = "sortingfinal.png" ;
							this.dashboardSortParams.Pending.RequestBy = "sortingfinal.png" ;
						
						scope.updateSortParams("featureName",order);
						//scope.view.TabPaneNew.TabBodyNew.segTemplates.setSectionAt(dataObj1, section);
					}.bind(this)
                },
               "imgApproveTypePending": {
                    src: this.dashboardSortParams.Pending.ApproveType,
                 accessibilityConfig: {
                   "a11yLabel": (this.dashboardSortParams.Pending.ApproveType === "sorting_previous.png") ? kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("i18n.accounts.TransactionType")+" "+ kony.i18n.getLocalizedString("i18n.common.Ascending") :
                   (this.dashboardSortParams.Pending.ApproveType === "sorting_next.png") ? kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("i18n.accounts.TransactionType")+" "+ kony.i18n.getLocalizedString("i18n.common.Descending") : 
                   kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("i18n.accounts.TransactionType")
                 }
                },
                "btnSentDateApprovePending": {
                    skin: "sknBtnAccountSummaryUnselectedTransfer424242",
                    text: kony.i18n.getLocalizedString("konybb.Approvals.SentDate"),
                },
			   "flxSentDateApprovePending":{
                        onClick : function(eveobject,content){
						var section = content.sectionIndex ;
						//var row = content.rowIndex ;
						//var valuetxt = JSON.parse(JSON.stringify(scope.view.TabPaneNew.TabBodyNew.segTemplates.data[section][1][row].featureActionName));
						var img = this.dashboardSortParams.Pending.SentDate ;
						if(img === "sorting_next.png"){
							
							var order = "DESC";
						}else{
							
							var order = "ASC";
						}
						img = (img==="sorting_next.png")?"sorting_previous.png":"sorting_next.png";
						  this.dashboardSortParams.Pending.ApproveType = "sortingfinal.png";
							this.dashboardSortParams.Pending.SentDate = img;
							this.dashboardSortParams.Pending.SentBy = "sortingfinal.png" ;
							this.dashboardSortParams.Pending.RequestBy = "sortingfinal.png" ;
						scope.updateSortParams("sentDate",order);
						//scope.view.TabPaneNew.TabBodyNew.segTemplates.setSectionAt(dataObj1, section);
					}.bind(this)
                },
              "imgSentDateApprovePending": {
                src: this.dashboardSortParams.Pending.SentDate,
                accessibilityConfig: {
                  "a11yLabel": (this.dashboardSortParams.Pending.SentDate === "sorting_previous.png") ? kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("konybb.Approvals.SentDate")+" "+ kony.i18n.getLocalizedString("i18n.common.Ascending") :
                  (this.dashboardSortParams.Pending.SentDate === "sorting_next.png") ? kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("konybb.Approvals.SentDate")+" "+ kony.i18n.getLocalizedString("i18n.common.Descending") :
                  kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("konybb.Approvals.SentDate")
                }
              },
                "btnSentByApprovePending": {
                    skin: "sknBtnAccountSummaryUnselectedTransfer424242",
                    text: kony.i18n.getLocalizedString("konybb.Approvals.SentBy"),
                },
				flxSentByApprovePending : {
                  onClick : function(eveobject,content){
						var section = content.sectionIndex ;
						//var row = content.rowIndex ;
						//var valuetxt = JSON.parse(JSON.stringify(scope.view.TabPaneNew.TabBodyNew.segTemplates.data[section][1][row].featureActionName));
					var img = this.dashboardSortParams.Pending.SentBy ;
						if(img === "sorting_next.png"){
							
							var order = "DESC";
						}else{
							
							var order = "ASC";
						}
						img = (img==="sorting_next.png")?"sorting_previous.png":"sorting_next.png";
						  this.dashboardSortParams.Pending.ApproveType = "sortingfinal.png";
							this.dashboardSortParams.Pending.SentDate = "sortingfinal.png";
							this.dashboardSortParams.Pending.SentBy =  img ;
							this.dashboardSortParams.Pending.RequestBy = "sortingfinal.png" ;
						scope.updateSortParams("sentBy",order);
						//scope.view.TabPaneNew.TabBodyNew.segTemplates.setSectionAt(dataObj1, section);
					}.bind(this)
                },
              "imgSentByApprovePending": {
                src: this.dashboardSortParams.Pending.SentBy,
                accessibilityConfig: {
                  "a11yLabel": (this.dashboardSortParams.Pending.SentBy === "sorting_previous.png") ? kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("konybb.Approvals.SentBy")+" "+ kony.i18n.getLocalizedString("i18n.common.Ascending") : 
                  (this.dashboardSortParams.Pending.SentBy === "sorting_next.png")  ? kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("konybb.Approvals.SentBy")+" "+ kony.i18n.getLocalizedString("i18n.common.Descending") :
                  kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("konybb.Approvals.SentBy")
                }
              },
                "btnRequestTypeApprovePending": {
                    skin: "sknBtnAccountSummaryUnselectedTransfer424242",
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.RequestType"),
                },
              "flxRequestTypeApprovePending" :{
					onClick : function(eveobject,content){
						var section = content.sectionIndex ;
						//var row = content.rowIndex ;
						//var valuetxt = JSON.parse(JSON.stringify(scope.view.TabPaneNew.TabBodyNew.segTemplates.data[section][1][row].featureActionName));
						var img = this.dashboardSortParams.Pending.RequestBy ;
						if(img === "sorting_next.png"){
							
							var order = "DESC";
						}else{
							
							var order = "ASC";
						}
						img = (img==="sorting_next.png")?"sorting_previous.png":"sorting_next.png";
						 this.dashboardSortParams.Pending.ApproveType = "sortingfinal.png";
							this.dashboardSortParams.Pending.SentDate = "sortingfinal.png";
							this.dashboardSortParams.Pending.SentBy =  "sortingfinal.png" ;
							this.dashboardSortParams.Pending.RequestBy = img ;
						scope.updateSortParams("feactureActionName",order);
						//scope.view.TabPaneNew.TabBodyNew.segTemplates.setSectionAt(dataObj1, section);
					}.bind(this)
                },
              "imgRequestTypeApprovePending": {
                src: this.dashboardSortParams.Pending.RequestBy,
                accessibilityConfig: {
                  "a11yLabel": (this.dashboardSortParams.Pending.RequestBy === "sorting_previous.png") ? kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("i18n.common.RequestBy")+" "+ kony.i18n.getLocalizedString("i18n.common.Ascending") :
                  (this.dashboardSortParams.Pending.RequestBy === "sorting_next.png") ? kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("i18n.common.RequestBy")+" "+ kony.i18n.getLocalizedString("i18n.common.Descending"):
                  kony.i18n.getLocalizedString("i18n.Accounts.SortBy")+" "+ kony.i18n.getLocalizedString("i18n.common.RequestBy")
                }
              },
                "lblActionsApprovePending": {
                    text: kony.i18n.getLocalizedString("konybb.Approvals.Action")
                },
                "flxBootomSeparatorApprovePending": {
                    skin: "lblSeparator"
                },
                       };
      this.view.TabPaneNew.TabBodyNew.setSectionData([SectionData]);
       var defaultValues = {
                imgDropDown: {
                    skin: "sknLblFontTypeIcon1a98ff12pxOther",
                    text: "O"
                },
         		flxDropDown: {
                        onClick: function(eventObject, context) {
                            var secIndex = context["sectionIndex"];
                            var rowIndex = context["rowIndex"];
                            this.view.TabPaneNew.TabBodyNew.showOrHideDetailsHeader( {section:secIndex,row:rowIndex,direction:1});
							this.adjustScreen(-155);
                        }.bind(this)
                },
                flxBottomSeparatorApprovalRow: {
                    skin: "lblSeparator"
                },
                  flxTrActions: {
           onClick: function(eventobject, context) {														   												   
             var selectedRowVal = this.view.TabPaneNew.TabBodyNew.segTemplates.selectedRowItems[0].featureActionId;
             if (selectedRowVal === "ACH_PAYMENT_CREATE" || selectedRowVal === "ACH_COLLECTION_CREATE") {
               var transaction = BBConstants.ACH_TRANSACTION_VIEW_DETAILS;
               this.viewDetailsOfSelectedRecord(eventobject, context, transaction);
             } else if (selectedRowVal === "ACH_FILE_UPLOAD") {
               var transaction = BBConstants.ACH_FILE_VIEW_DETAILS;
               this.viewDetailsOfSelectedRecord(eventobject, context, transaction);
             } else if (selectedRowVal === "BULK_PAYMENT_FILES_SINGLE_UPLOAD_CSV" || selectedRowVal === "BULK_PAYMENT_REQUEST_SUBMIT") {
               this.navigateToviewDetails(eventobject, context);
             } else {
               var transaction = BBConstants.GEN_TRANSACTION_VIEW_DETAILS;
               this.viewDetailsOfSelectedRecord(eventobject, context, transaction);
             }
           }.bind(this),
           isVisible: true,
         },
                flxMainContent: {
                    isVisible: true
                },
                flxDetilsHighlighterMain: {
                    isVisible: false,
                    skin: "sknflxBg4a90e2op100NoBorder"
                },
                flxTemplateDetails: {
                    isVisible: false
                },
                flxMyApprovalsRowHeader: {
                    isVisible: true,
                    skin: "slFboxffffff"
                },
                flxBulkPaymentsDetails: {
                    isVisible: false
                },
                lblOPFromAccount: {
                    text: kony.i18n.getLocalizedString("i18n.transfers.fromAccount")
                },
                lblBPDescription: {
                    text: kony.i18n.getLocalizedString("i18n.kony.Bulkpayments.Description")
                },
                lblCustomerName: {
                    text: kony.i18n.getLocalizedString("i18n.accountDetail.customerName")
                },
                lblOPTotalAmount: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.Amount")
                },
                lblApprovals: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.ACH.Approvals")
                },
                lblBPstatus: {
                    text: kony.i18n.getLocalizedString("i18n.ChequeManagement.Status")
                },
                lblBPFileName: {
                    text: kony.i18n.getLocalizedString("i18n.bulkWire.fileName")
                },
                lblTotalTransactions: {
                    text: kony.i18n.getLocalizedString("i18n.bulkWire.totalTransactions")
                },
                lblProcessingMode: {
                    text: kony.i18n.getLocalizedString("i18n.kony.BulkPayments.ProcessingMode")
                },
                lblOPPaymentID: {
                    text: "Reference ID"
                },
                lblBPValueDate: {
                    text: "Value Date"
                },
                lblBPReference: {
                    text: "Reference",
                  isVisible : false
                },
                flxAChPayments: {
                    isVisible: false
                },
                flxACHFile: {
                    isVisible: false
                },
                flxCheckBookRequest: {
                    isVisible: false
                },
                lblReject: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.common.Approve")
                },

                
          flxReject: {
                    onClick: function(eveobject, content) {
                        var section = content.sectionIndex;
                        var row = content.rowIndex;
                        var valuetxt = JSON.parse(JSON.stringify(this.view.TabPaneNew.TabBodyNew.segTemplates.data[section][1][row].featureActionId));
                        if (valuetxt === "BULK_PAYMENT_REQUEST_SUBMIT"  || valuetxt === "BULK_PAYMENT_FILES_SINGLE_UPLOAD_CSV") {
                            this.navigateToviewDetails(eveobject, content);
                        } else {
                             this.showPopup(eveobject, content);
                        }
                    }.bind(this)

                },
         
         
                flxViewDetails: {
                    onClick: function(eveobject, content) {
					var section = content.sectionIndex;
					var row = content.rowIndex;
					var valuetxt = JSON.parse(JSON.stringify(this.view.TabPaneNew.TabBodyNew.segTemplates.data[section][1][row].featureActionId));																		   																		   
					if (valuetxt === "BULK_PAYMENT_REQUEST_SUBMIT" || valuetxt === "BULK_PAYMENT_FILES_SINGLE_UPLOAD_CSV") {
						this.navigateToviewDetails(eveobject, content);
					} else {
						this.showRejectPopup(eveobject, content);																		   																		   
					}												
				}.bind(this)																		
			},
           
                lblViewDetails: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.myApproval.Reject")
                },
                lblACHDebitCredit: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.Debit/CreditAccount")
                },
                lblACHapprovals: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.ACH.Approvals"),
                },
                lblAchAmount: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.Amount")
                },
                lblAchCustomerName: {
                    text: kony.i18n.getLocalizedString("i18n.accountDetail.customerName")
                },
                lblACHTemplateName: {
                    text: kony.i18n.getLocalizedString("i18n.bulkWire.templateName")
                },
                lblACHRequestType: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.RequestType")
                },
                lblRequestAccount: {
                    text: kony.i18n.getLocalizedString("i18n.topmenu.accounts")
                },
                lblTransactionTypeDebit: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.DebitAccount")
                },
                flxTransactionTypes: {
                    isVisible: false
                },
                lblTransactionReferenceNumber: {
                    text: "Person a Person Payement"
                },
                lblTransactionAmount: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.Amount")
                },
                lblTrStatus: {
                    text: kony.i18n.getLocalizedString("i18n.common.ViewDetails")
                },
                lblUploadDateTime: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Files.UploadDateTime")
                },
                lblNACHumberOfDebits: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Files.NumbOfDebits")
                },
                lblACHFileApprovals: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.ACH.Approvals")
                },
                lblACHFileAmount: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.Amount")
                },
                lblNoofCredits: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Files.NumbOfCredits")
                },
                lblACHFileFileName: {
                    text: kony.i18n.getLocalizedString("i18n.bulkWire.fileName")
                },
                lblTotalDebitAmount: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.TotalDebitAmt")
                },
                lblACFFileRequestType: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.RequestType")
                },
                lblACHFileCreditAmount: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.TotalCreditAmt")
                },
                lblRequestAccount: {
                    text: "Request Account"
                },
                lblNoofBooks: {
                    text: "Number of Books"
                },
                lblFeesService: {
                    text: "Fees inclusive of service charges "
                },
                lblRequestId: {
                    text: "Request ID"
                },
                lblTransactionTypeDebit: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.DebitAccount")
                },
                lblTransactionCustomerName: {
                    text: kony.i18n.getLocalizedString("i18n.accountDetail.customerName")
                },
                 lblTransactionReference: {
                   text: "Reference",
                   isVisible:false
                 },
                 lblTransactionReferenceVal:{ 
                   isVisible:false
                 },
                lblTransactionAmount: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.Common.Amount")
                },
                lblTransactionApprovals: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.ACH.Approvals")
                },
                lblTransactionPayee: {
                    text: kony.i18n.getLocalizedString("i18n.billPay.Payee")
                },
                lblTransactionFrequency: {
                    text: kony.i18n.getLocalizedString("i18n.transfers.lblFrequency")
                },
                lblTransactionReferenceNumber: {
                    text: kony.i18n.getLocalizedString("i18n.TransfersEur.PaymentReference")
                },
                lblTransactionRecurrence: {
                    text: kony.i18n.getLocalizedString("i18n.accounts.recurrence")
                },
                lblCustomerNameCheckBook: {
                    text: kony.i18n.getLocalizedString("i18n.accountDetail.customerName")
                },
                lblApprovalsCheck: {
                    text: kony.i18n.getLocalizedString("i18n.konybb.ACH.Approvals")
                },
         		flxTransactionIcon: {
					isVisible: applicationManager.getUserPreferencesManager().profileAccess === "both" ? true : false
				},
                lblTransactionServiceCharge: {
                 isVisible: false
               	},
                lblTransactionServiceChargeVal: {
                 isVisible: false
               	},
                flxBottomSeparatorTemplateDeatails : {
						bottom : "0dp"
					},
					flxTransactionMain : {
						isVisible: true
					},
				
         };
				if (width === 1024 || width === 768 || orientationHandler.isTablet){
					defaultValues.flxMyApprovalsRowHeader.height = "70dp";
					defaultValues.flxTransactionMain.height = "70dp";
					defaultValues.flxTransactionMain.top = "-1dp";
					
					
					  }
            var rowdata = {
                "lblApprovetypeval": "featureName", //"approveType",//"limitGroupId",
                "lblSentDateVal": "sentDate", //"processingDate",//"sentDate",//
                "lblSentByVal": "sentBy", //"createdby",//"status",
                "lblApprovalDateval": "txtVal",//"featureActionName", //"txtVal", //"requestType",//"status",
                //"lblTrStatus":"featureActionId"
				"lblOPFromAccountValue" : "accountId",
				"lblBPDecriptionValue": "description",//needed confluence
				"lblCustomerNameValue" : "customerName",
                "lblOPTotalAmountValue": "amount", //// amount need to start Dollar symbol
                "lblApprovalsVal": "approvals",
				"lblBPstatusVal" : "status",
				"lblBPFileNameVal":"FileName",
				"lblTotalTransactionsVal": "totalTransactions",//needed confluence
				"lblProcessingModeVal": "processingMode",//needed confluence
				"lblOPPaymentIDValue": "confirmationNumberVal",
				"lblBPValueDateVal":"processingDate",
			//	"lblBPReferenceVal":"recurrence",
				"lblACHDebitCreditVal":"accountId",
				"lblACHapprovalsVal":"approvals",
				"lblAchAmountVal":"amount",   // amount need to start Dollar symbol
				"lblAchCustomerNameVal":"customerName",
				"lblACHTemplateNameVal":"templateName",
				"lblACHRequestTypeVal":"requestType",
				"lblUploadDateTimeVal":"TransactionDate",//needed confluence
				"lblACHFileNumberofDebits":"numberOfDebits",
				"lblACHFileApprovalsVal":"approvals",
				"lblACHFileAmountVal":"amount",
				"blNoofCreditsVal":"numberOfCredits",
				"lblACHFileFileNameVal":"FileName",
				"lblTotalDebitAmountVal":"amount",
				"lblACFFileRequestTypeVal":"requestType",
				"lblACHFileCreditAmountVal":"TotalCreditAmount",
				"lblTransactionTypeDebitVal":"accountId",
				"lblTransactionCustomerNameVal":"customerName",
                "lblTransactionReferenceVal": "confirmationNumberVal",
				"lblTransactionAmountVal" : "amount",
				"lblTransactionApprovalsVal":"approvals",
                "lblTransactionPayeeVal": "payee",
                "lblTransactionFrequencyVal": "frequency",
				"lblTransactionReferenceNumberVal":"confirmationNumberVal",
				"lblTransactionRecurrenceVal":"recurrence",
				"lblRequestAccountval":"accountId",
                "lblNoofBooksVal":"noOfBooks",
                 "lblFeesServiceVal":"amount",
                 "lblRequestIdVal":"transactionIdVal",
                "lblCustomerNameValCheck":"customerName",
                "lblCheckApprovalsVal":"approvals",
				"flxCheckRequestIcon" : "flxCheckRequestIcon",
                "lblTransactionServiceCharge" : "lblServiceCharge",
                "lblTransactionServiceChargeVal" : "lblServiceChargeVal",
                "lblFontIconCheckRequest" : "lblRoleIcon",
                "lblTransactionExchangeRate" : "lblExchangeRate",
                "lblTransactionExchangeRateVal" : "lblExchangeRateVal",
              "flxBottomSeparatorTemplateDeatails" : "flxBottomSeparatorTemplateDeatails",
                "flxTransactionMain" : "flxTransactionMain",
			};

            this.view.TabPaneNew.TabBodyNew.setRowDataMap([rowdata]);
      this.view.TabPaneNew.TabBodyNew.setDefaultValues([defaultValues]);

            if (pendingApprovals.length === 0) {
     this.view.TabPaneNew.PaginationContainer.isVisible = false;
     this.showNoGeneralTransactions();
     
            } else {
      this.view.TabPaneNew.TabBodyNew.setRowDataMap([rowdata]);
      this.view.TabPaneNew.TabBodyNew.setDefaultValues([defaultValues]);
      this.view.TabPaneNew.TabBodyNew.addDataForSections([pendingApprovals]);
      this.view.TabPaneNew.PaginationContainer.isVisible = true;
          this.updatePaginationContainerUI(pendingApprovals);
                if (pendingApprovals.length === this.view.TabPaneNew.PaginationContainer.getPageSize() + 1) {
            pendingApprovals.pop();
          }
   }
            }
      this.adjustScreen(-155);
      // this.view.TabPaneNew.TabBodyNew.segTemplates.setData(SectionData);
      this.view.forceLayout();
    },
    navigateToviewDetailsHistory: function(eventobject, context) {
            var row = context.rowIndex;
            var section = context.sectionIndex;
            var selectedRowData = this.view.TabPaneNew.TabBodyNew.getData()[section][1][row];
            selectedRowData.isHistoryFlow = true;
      		bulkpaymentModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "BulkPaymentsUIModule", "appName" : "BulkPaymentsMA"});
            bulkpaymentModule.presentationController.noServiceNavigateApproval({"appName" : "BulkPaymentsMA", "friendlyName" : "BulkPaymentsUIModule/frmBulkPaymentsReview"}, BBConstants.APPROVER_VIEW_PAYMENT, selectedRowData,'frmBulkPaymentsReview');
        },
        viewDetailsOfSelectedRecord: function(eventobject, context, transactionType) {
            var scopeObj = this;
            var row = context.rowIndex;
            var section = context.sectionIndex;
            var selectedRowData = this.view.TabPaneNew.TabBodyNew.getData()[section][1][row];
            FormControllerUtility.showProgressBar(this.view);
            var navObj = {
                requestData: {
                    selectedRowData: selectedRowData,
                    isApprovalData: true,
                    isRequestData: false,
                },
                onSuccess: {
                    form: this.forms.ACHDashboard,
                    module: "ACHModule",
                    context: {
                        key: transactionType,
                        responseData: {}
                    }
                },
                onFailure: {
                    form: "frmBBMyApprovals",
                    module: "ApprovalsReqUIModule",
                    context: {
                        key: BBConstants.SERVICE_ERROR,
                        responseData: {}
                    }
                }
            };
            scopeObj.ApprovalsReqModule.presentationController.noServiceNavigate(navObj);
        },
    showNoGeneralTransactions: function() {
            var dataMap = {
              lblNoRecords: "lblMsg",
              imgInfoIcon: "imgInfoIcon"
            };
        var NODATAFLEXHEIGHT = "450dp";
            var defValues = {
                flxMain: {
                    "height": NODATAFLEXHEIGHT
                },
                flxMyApprovalsRowHeader: {
                    "isVisible": false
                },
                flxTemplateDetails: {
                    "isVisible": false
                },
                flxNoRecords: {
                "isVisible": true
              },
                imgInfoIcon: {
                "src": "info_grey.png"                 
              }
            };

        this.view.TabPaneNew.TabBodyNew.setRowDataMap([dataMap]);
        this.view.TabPaneNew.TabBodyNew.setDefaultValues([defValues]);
        this.view.TabPaneNew.TabBodyNew.addRowsData([[{"lblMsg":kony.i18n.getLocalizedString("i18n.konybb.myApproval.NoTransactions")}]]);
    },
    
    initActions : function () {
      this.ApprovalsReqModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ApprovalsReqUIModule");
      
      this.view.preShow = this.preShowactions ;
      this.view.postShow = this.postShowactions ;
      this.view.onBreakpointChange = this.onBreakpointChange ;
    },
    preShowactions : function () {
      var scopeObj = this ;
      this.hidePopup();
      this.ApprovalsReqModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ApprovalsReqUIModule");
      this.checkedValues = [];
      this.checkedParams = [];
      this.filterCheckedValue = "";
      this.filterCheckedTimeValue = "";
      this.statusApproved = "";
      this.statusRejected = "";
      this.statusPending = "";
      this.allStatus = false;
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['customheader','flxContentContainer','flxFooter','flxHeaderMain', 'flxMain','flxFormContent']);
      this.view.customheader.topmenu.flxMenu.skin = ViewConstants.SKINS.BLANK_SKIN_FLEX_POINTER;
      this.view.customheader.topmenu.flxaccounts.skin = ViewConstants.SKINS.BLANK_SKIN_FLEX_POINTER;
      this.view.customheader.topmenu.flxTransfersAndPay.skin = ViewConstants.SKINS.BLANK_SKIN_TOPMENU;

      this.view.customheader.topmenu.flxContextualMenu.setVisibility(false);
      this.view.customheader.forceCloseHamburger();


      this.view.customheader.customhamburger.activateMenu("Approvals Requests",kony.i18n.getLocalizedString("i18n.konybb.Common.MyApprovals"));

      this.view.TabPaneNew.TabsHeaderNew.btnTab1.text = kony.i18n.getLocalizedString("i18n.konybb.Common.Pending");
      this.view.TabPaneNew.TabsHeaderNew.btnTab1.toolTip = kony.i18n.getLocalizedString("i18n.konybb.Common.Pending");
      this.view.TabPaneNew.TabSearchBarNew.tbxSearch.onKeyUp = this.hideOrShowCloseIcon.bind(this);
      this.view.TabPaneNew.TabsHeaderNew.btnTab1.text = kony.i18n.getLocalizedString("i18n.konybb.Common.Pending");
      this.view.TabPaneNew.TabsHeaderNew.btnTab1.toolTip = kony.i18n.getLocalizedString("i18n.konybb.Common.Pending");
      this.view.TabPaneNew.TabsHeaderNew.btnTab1.hoverSkin = "sknBtn72727215pxLatoBgf8f7f8";
      this.view.TabPaneNew.TabsHeaderNew.btnTab1.onClick = this.onTabClick;

      this.view.TabPaneNew.TabsHeaderNew.btnTab2.text = kony.i18n.getLocalizedString("i18n.billPay.History");
      this.view.TabPaneNew.TabsHeaderNew.btnTab2.toolTip = kony.i18n.getLocalizedString("i18n.billPay.History");
      this.view.TabPaneNew.TabsHeaderNew.btnTab2.hoverSkin = "sknBtn72727215pxLatoBgf8f7f8";
      this.view.TabPaneNew.TabsHeaderNew.btnTab2.onClick = this.onTabClick;

      this.view.TabPaneNew.TabsHeaderNew.btnTab3.isVisible = false ;
      this.view.TabPaneNew.TabsHeaderNew.btnTab4.isVisible = false ;
      this.view.TabPaneNew.TabsHeaderNew.btnTab5.isVisible = false;
      this.view.TabPaneNew.TabsHeaderNew.btnTab6.isVisible = false;
      this.view.TabPaneNew.TabSearchBarNew.tbxSearch.skin="ICSknSSPRegular727272op10015px";
      this.view.TabPaneNew.TabSearchBarNew.tbxSearch.placeholderSkin="ICSknSSPRegular727272op10015px";
      this.view.TabPaneNew.TabSearchBarNew.tbxSearch.placeholder =  kony.i18n.getLocalizedString("i18n.konybb.SearchPlaceholder");
      this.view.onBreakpointChange = function() {
        scopeObj.onBreakpointChange(kony.application.getCurrentBreakpoint());
      };
      	this.view.TabPaneNew.TabSearchBarNew.tbxSearch.accessibilityConfig = {
             "a11yLabel" :  kony.i18n.getLocalizedString("i18n.billPay.Search")
             };
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxIphoneDropdown.flxImage.imgDropdown.src = "blue_downarrow.png";
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxIphoneDropdown.flxImage.imgDropdown.accessibilityConfig = {
        "a11yLabel" :  kony.i18n.getLocalizedString("i18n.Accessibility.dropdownClose")
      };
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxIphoneDropdown.onClick = function() {
        this.setDropdownVisiblility();
      }.bind(this);
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.flxApproveType.flxAll.lblAll.onTouchEnd = function() {
         this.setAllRecords();
       }.bind(this);
      if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile){
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.flxButtons.btnApplyFilter.bottom= "20Dp";}
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.flxButtons.btnApplyFilter.onClick = function() {
        this.applyFilterForHistory();
      }.bind(this);
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.flxButtons.btnCancelFilter.onClick = function() {
        this.cancelFilterForHistory();
      }.bind(this);
	  this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxIphoneDropdown.skin = "slFBox";
      this.initializeDashboardSortParams();
        },

    cancelFilterForHistory : function(){
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.setVisibility(false);
    },
    
    setAllRecords : function(){
      this.filterCheckedValue = "";
      this.filterCheckedTimeValue = "";
      this.statusApproved = "";
      this.statusRejected = "";
      this.statusPending = "";
      this.allStatus = false;
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxAll.lblAll.text = "M";
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxAll.lblAll.skin ="ICSknLblRadioBtnSelectedFontIcon003e7520px";
      var segData = this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segCurrency.data;
      segData.forEach(function(item){
        item[1].forEach(function(data){
          data.lblCheckFeature.text = "L";
          data.lblCheckFeature.skin = "sknLblOlbFontIconsA0A0A020Px";
        });

      });
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segCurrency.setData(segData);
      if(this.activeTab === kony.i18n.getLocalizedString("i18n.konybb.Common.Pending")){
         this.fetchParams.filterByParam ="";
        this.fetchParams.filterByValue = "";
        this.fetchParams.sortByParam = "sentDate";
        this.fetchParams.sortOrder = "DESC";
        this.fetchParams.timeParam = "";
        this.fetchParams.timeValue = "";
        this.fetchParams.searchString = "";
        this.updateFetchParams() ;
        this.loadApprovalsReqModule().presentationController.fetchApprovalPending(this.fetchParams);
      }
      else{
        this.fetchParams.filterByParam ="";
        this.fetchParams.filterByValue = "";
        this.fetchParams.sortByParam = "sentDate";
        this.fetchParams.sortOrder = "DESC";
        this.fetchParams.timeParam = "";
        this.fetchParams.timeValue = "";
        this.fetchParams.searchString = "";
        this.updateFetchParams() ;
        this.loadApprovalsReqModule().presentationController.fetchApprovalHistory(this.fetchParams);
      }
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.setVisibility(false);
    },
    
    postShowactions: function() {
      //this.setUpDefaultView();
      this.defaultTab = kony.i18n.getLocalizedString("i18n.konybb.Common.Pending");
      if(this.history === "history")
        this.view.TabPaneNew.TabsHeaderNew.focusTab(2);
      else
        this.view.TabPaneNew.TabsHeaderNew.focusTab(1);
      this.onTabClick({
        text: this.defaultTab
      });
     this.view.flxPopupNew.trComments.text = "" ;
        this.view.flxContentContainer.minHeight = kony.os.deviceInfo().screenHeight - (this.view.flxFooter.info.frame.height + this.view.flxHeaderMain.info.frame.height) + "dp";
        this.view.forceLayout();
    },
   onBreakpointChange: function(width){
      var scope = this;
      this.view.CustomPopup.onBreakpointChangeComponent(scope.view.CustomPopup,width);
      orientationHandler.onOrientationChange(this.onBreakpointChange);
      var responsiveFonts = new ResponsiveFonts();
      this.view.customheader.onBreakpointChangeComponent(width);
      if(width === 640 || orientationHandler.isMobile){
      //	this.view.TabPaneNew.TabSearchBarNew.tbxSearch.placeholder = kony.i18n.getLocalizedString("i18n.myapprovals.SearchTransactionOrTemplate");
        this.view.customheader.lblHeaderMobile.isVisible = true;
        this.view.TabPaneNew.TabBodyNew.segTemplates.sectionHeaderTemplate = "flxempty";
        this.view.TabPaneNew.TabBodyNew.segTemplates.rowTemplate = "flxApprovePendingRowMobile";
        this.view.TabPaneNew.TabSearchBarNew.listBoxViewType.skin = "sknlistbxMobile";
        this.view.TabPaneNew.TabSearchBarNew.flxDropDown.skin = "sknFlxffffffborderradE3E3E3";
        this.view.TabPaneNew.TabsHeaderNew.skin = "sknFlxscrollffffffShadowCustom";
        this.view.TabPaneNew.TabSearchBarNew.flxBoxSearch.skin = "sknFlxffffffborderradE3E3E3";
        this.view.TabPaneNew.TabSearchBarNew.flxDropDown.isVisible = true;
        this.view.customheader.lblHeaderMobile.text = kony.i18n.getLocalizedString("i18n.konybb.ACH.Approvals");
        this.view.TabPaneNew.TabSearchBarNew.skin = "bbsknf8f7f8WithoutBorder";
        this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxToaHeader.skin = "slFboxfffff";
        this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxCurrencyHeader.skin = "slFboxfffff";
        this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxTimePeriodHeader.skin = "slFboxfffff";
        responsiveFonts.setMobileFonts();
        var curr = kony.application.getCurrentForm();
        curr.forceLayout();
      }
      else{
      //  this.view.TabPaneNew.TabSearchBarNew.tbxSearch.placeholder = kony.i18n.getLocalizedString("i18n.konybb.Common.SearchTransPayeeCreatedBy");
        this.view.TabPaneNew.TabBodyNew.segTemplates.sectionHeaderTemplate = "flxACHMyApprovalsHeader";
        this.view.TabPaneNew.TabBodyNew.segTemplates.rowTemplate = "flxACHMyApprovalsRowTemplate";
        this.view.customheader.lblHeaderMobile.isVisible = false;
        this.view.TabPaneNew.TabSearchBarNew.listBoxViewType.skin = "bbSknListBox424242SSP15px";
        this.view.TabPaneNew.TabSearchBarNew.flxDropDown.skin = "skne3e3e3br3pxradius";
        this.view.TabPaneNew.TabsHeaderNew.skin = "slFSbox";
        this.view.TabPaneNew.TabSearchBarNew.flxBoxSearch.skin = "skne3e3e3br3pxradius";
        this.view.TabPaneNew.TabSearchBarNew.flxDropDown.isVisible = true;
        this.view.TabPaneNew.TabSearchBarNew.skin = "slFbox";
        this.view.TabPaneNew.TabSearchBarNew.tbxSearch.placeholderSkin="ICSknSSPRegular727272op10015px";
        this.view.flxPopupNew.trComments.placeholderSkin = "ICSknSSPRegular727272op10015px";
        this.view.customheader.topmenu.flxMenu.skin = ViewConstants.SKINS.BLANK_SKIN_FLEX_POINTER;
        this.view.customheader.topmenu.flxaccounts.skin = ViewConstants.SKINS.BLANK_SKIN_TOPMENU;
        this.view.customheader.topmenu.flxTransfersAndPay.skin = ViewConstants.SKINS.BLANK_SKIN_FLEX_POINTER;
        responsiveFonts.setDesktopFonts();
        this.view.customheader.lblHeaderMobile.text = " ";
        var curr = kony.application.getCurrentForm();
        curr.forceLayout();
      }
      //this.adjustScreen(-155);
     const configManager = applicationManager.getConfigurationManager();
     const isCampaignMAPresent = configManager.isMicroAppPresent('CampaignMA');
     if (isCampaignMAPresent) {
      	this.ApprovalsReqModule.presentationController.getApprovalsReqCampaigns();
     }
    },
    	adjustScreen: function(data) {
          	this.view.forceLayout();
            this.view.flxFooter.isVisible = true;
            var mainheight = 0;
            var screenheight = kony.os.deviceInfo().screenHeight;
            mainheight = this.view.customheader.info.frame.height + this.view.flxContentContainer.info.frame.height  ;
            var diff = screenheight - mainheight;
            if (mainheight < screenheight) {
                diff = diff - this.view.flxFooter.info.frame.height;
                if (diff > 0)
                    this.view.flxFooter.top = mainheight + diff + data + "dp";
                else
                    this.view.flxFooter.top = mainheight + data + "dp";
                this.view.forceLayout();
            } else {
                this.view.flxFooter.top = mainheight + data + "dp";
                this.view.forceLayout();
            }
        },
    hideOrShowCloseIcon: function () {
        if (this.view.TabPaneNew.TabSearchBarNew.tbxSearch.text.trim() === "") {
            this.view.TabPaneNew.TabSearchBarNew.imgClear.setVisibility(false);
        }
        else {
            this.view.TabPaneNew.TabSearchBarNew.imgClear.setVisibility(true);
        }
        this.view.TabPaneNew.TabSearchBarNew.forceLayout();
    },
    setDropdownVisiblility: function() {
      if (this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.origin) {
        this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.origin=false;
        return;
      }
      if (!this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.isVisible &&  this.activeTab === kony.i18n.getLocalizedString("i18n.konybb.Common.Pending") ) {
				//this.filterCheckedValue = "";
                this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.clipBounds = false;
                this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.clipBounds = false;
                this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.isVisible = true;
                this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.segViewTypes.setVisibility(true);
                this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxIphoneDropdown.flxImage.setVisibility(true);
				this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxStatus.setVisibility(false);
				this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxCurrencyHeader.setVisibility(false);
				this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxSeperatorCurrency.setVisibility(false);
				this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxApprovalTypeSeparator.setVisibility(false);
				this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxTimePeriod.setVisibility(false);
				this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxButtons.setVisibility(false);
                this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.imgDropdown.centerX = "50%";
                this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxIphoneDropdown.flxImage.imgDropdown.src = "blue_uparrow.png";
        this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxIphoneDropdown.flxImage.imgDropdown.accessibilityConfig = {
          "a11yLabel" :  kony.i18n.getLocalizedString("i18n.Accessibility.dropdownOpen")
        };
        this.setDropdownData(kony.i18n.getLocalizedString("i18n.konybb.Common.Pending"));
            } else if (!this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.isVisible && this.activeTab === kony.i18n.getLocalizedString("i18n.billPay.History")) {
              	//this.filterCheckedValue = "";
              this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.clipBounds = false;
                this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.clipBounds = false;
                this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.isVisible = true;
                this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.segViewTypes.setVisibility(true);
                this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxIphoneDropdown.flxImage.setVisibility(true);
				this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxStatus.setVisibility(true);
				this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxToaBody.setVisibility(true);
				this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxSeperatorToaTitle.setVisibility(true);
				this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.lblImage.text = "P";
				this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdownImage.onClick = function() {
                 if(this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxToaBody.isVisible){
					 this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxToaBody.setVisibility(false);
					 this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxSeperatorToaTitle.setVisibility(false);
					 this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.lblImage.text = "O";
				}	 
				else{
					this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxToaBody.setVisibility(true);
					this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxSeperatorToaTitle.setVisibility(true);
					this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.lblImage.text = "P";
				}	
				}.bind(this);
                this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxCurrencyHeader.setVisibility(true);
				this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxAll.setVisibility(true);
					 this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxCurrencyBody.setVisibility(true);
					 this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxSeperatorCurrency.setVisibility(true);
					 this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.lblImageCurrency.text = "P";
				this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdownCurrency.onClick = function() {
                 if(this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxAll.isVisible){
					 this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxAll.setVisibility(false);
					 this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxCurrencyBody.setVisibility(false);
					 this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxSeperatorCurrency.setVisibility(false);
					 this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.lblImageCurrency.text = "O";
				}	 
				else{
					this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxAll.setVisibility(true);
					 this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxCurrencyBody.setVisibility(true);
					 this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxSeperatorCurrency.setVisibility(true);
					 this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.lblImageCurrency.text = "P";
				}	
				}.bind(this);
                this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxApprovalTypeSeparator.setVisibility(true);
                this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxTimePeriod.setVisibility(true);
				this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxTimeperiodBody.setVisibility(true);
				this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxTimePeriodSeparator.setVisibility(true);
				this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.imgDropdownTimeperiod.text = "P";
				this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxTimePeriodDropdownImage.onClick = function() {
                 if(this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxTimeperiodBody.isVisible){
					 this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxTimeperiodBody.setVisibility(false);
					 this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxTimePeriodSeparator.setVisibility(false);
					 this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.imgDropdownTimeperiod.text = "O";
				}	 
				else{
					this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxTimeperiodBody.setVisibility(true);
					 this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxTimePeriodSeparator.setVisibility(true);
					 this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.imgDropdownTimeperiod.text = "P";
				}	
				}.bind(this);
				this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxButtons.setVisibility(true);
                this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.imgDropdown.centerX = "50%";
                this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxIphoneDropdown.flxImage.imgDropdown.src = "blue_uparrow.png";
              this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxIphoneDropdown.flxImage.imgDropdown.accessibilityConfig = {
                "a11yLabel" :  kony.i18n.getLocalizedString("i18n.Accessibility.dropdownOpen")
              };
        this.setDropdownData(kony.i18n.getLocalizedString("i18n.billPay.History"));
				
            } else {
        this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.isVisible = false;
        this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.segViewTypes.setVisibility(false);
        this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.imgDropdown.centerX = "50%";
        this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxIphoneDropdown.flxImage.imgDropdown.src = "blue_downarrow.png";
              this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxIphoneDropdown.flxImage.imgDropdown.accessibilityConfig = {
                "a11yLabel" :  kony.i18n.getLocalizedString("i18n.Accessibility.dropdownClose")
              };
      }
      this.adjustScreen(-155);
    },
    
          setDropdownData: function(tabName) {
          var scope= this;
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segCurrency.sectionHeaderTemplate = "flxACHMyApprovalsHeader";
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segCurrency.rowTemplate = "flxTimePeriodMain";
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segCurrency.widgetDataMap = this.dropdownDataMap();
            this.addOnlySectionHeaders(this.getSectionHeadersMonetaryFeaturesReadOnly(), tabName);
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTypeOfAccounts.rowTemplate = "flxAccountTypeList";
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTypeOfAccounts.widgetDataMap = this.statusDataMap();
      this.setStatusData();
      if(tabName === kony.i18n.getLocalizedString("i18n.billPay.History")){
        this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTimePeriod.setData([{
          "lblCheckFeature" :{
            text :"M",
            skin  :"ICSknLblRadioBtnSelectedFontIcon003e7520px",
            onTouchEnd : scope.checkTimePeriod.bind(this,0),
            accessibilityConfig : {
							"a11yLabel": kony.i18n.getLocalizedString("kony.filter.last1year") + " " + kony.i18n.getLocalizedString("i18n.accountSettings.checked")
						},
          } ,
          "lblFeatureName" : "Last One Year" ,
        },{
          "lblCheckFeature" :{
            text :"L",
            skin  :"sknLblOlbFontIconsA0A0A020Px",
            onTouchEnd : scope.checkTimePeriod.bind(this,1),
            accessibilityConfig : {
							"a11yLabel": kony.i18n.getLocalizedString("kony.filter.last6Months") + " " + kony.i18n.getLocalizedString("i18n.accountSettings.unchecked")
						},
          } ,
          "lblFeatureName" : "Last 6 months" ,
        },{
          "lblCheckFeature" :{
            text :"L",
            skin  :"sknLblOlbFontIconsA0A0A020Px",
            onTouchEnd : scope.checkTimePeriod.bind(this,2),
            accessibilityConfig : {
							"a11yLabel": kony.i18n.getLocalizedString("kony.filter.lastMonth")+ " " + kony.i18n.getLocalizedString("i18n.accountSettings.unchecked")
						},
          } ,
          "lblFeatureName" : "Last Month" ,
        },{
          "lblCheckFeature" :{
            text :"L",
            skin  :"sknLblOlbFontIconsA0A0A020Px",
            onTouchEnd : scope.checkTimePeriod.bind(this,3),
           accessibilityConfig : {
							"a11yLabel": kony.i18n.getLocalizedString("kony.filter.lastOneWeek")+ " " + kony.i18n.getLocalizedString("i18n.accountSettings.unchecked")
						},
          } ,
          "lblFeatureName" : "Last One Week" ,
        },{
          "lblCheckFeature" :{
            text :"L",
            skin  :"sknLblOlbFontIconsA0A0A020Px",
            onTouchEnd : scope.checkTimePeriod.bind(this,4),
           accessibilityConfig : {
							"a11yLabel": kony.i18n.getLocalizedString("kony.filter.today")+ " " + kony.i18n.getLocalizedString("i18n.accountSettings.unchecked")
						},
          } ,
          "lblFeatureName" : "Today" ,
        }]);
        
        if(this.filterCheckedTimeValue !== ""){
          var timePeriodData = this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTimePeriod.data;
          timePeriodData.forEach(function(item) {
            //item[1].forEach(function(data) {
              if (item.lblFeatureName === scope.filterCheckedTimeValue) {
                item.lblCheckFeature.text = "M";
                item.lblCheckFeature.skin = "ICSknLblRadioBtnSelectedFontIcon003e7520px";
              } else {
                item.lblCheckFeature.text = "L";
                item.lblCheckFeature.skin = "sknLblOlbFontIconsA0A0A020Px";
              }
            //});
          });
          this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTimePeriod.setData(timePeriodData);
        }
        
      }    
          
          
    },
    
    checkTimePeriod : function (data,scope){
			 var scopeObj = this;
			 var rowIndex = data ;
	  var segData = this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTimePeriod.data ;
	  
     
      
      for (var i = 0; i<segData.length;i++){
        if(i === rowIndex){
			
			 this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTimePeriod.setDataAt({
      "lblCheckFeature" : {
        text :"M",
        skin :"ICSknLblRadioBtnSelectedFontIcon003e7520px",
		onTouchEnd : scopeObj.checkTimePeriod.bind(this,i),
        accessibilityConfig : {
							"a11yLabel": segData[i].lblFeatureName + " " + kony.i18n.getLocalizedString("i18n.accountSettings.checked")
						},
      },
	  "lblFeatureName":segData[i].lblFeatureName,
      }, rowIndex, 0);
          
        }else{
			this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTimePeriod.setDataAt({
      "lblCheckFeature" : {
        text :"L",
        skin :"sknLblOlbFontIconsA0A0A020Px",
		onTouchEnd : scopeObj.checkTimePeriod.bind(this,i),
         accessibilityConfig : {
							"a11yLabel": segData[i].lblFeatureName + " " + kony.i18n.getLocalizedString("i18n.accountSettings.unchecked")
						},
      },
	  "lblFeatureName":segData[i].lblFeatureName,
      }, i, 0);
		}
      }
    },
    
        dropdownDataMap: function() {
      var obj = {};
      obj["flxHeaderTitle"] = "flxHeaderTitle",
        obj["lblHedaerContent"] = "lblHedaerContent",
        obj["flxTimePeriodMain"] = "flxTimePeriodMain",
        obj["flxFeatureRow"] = "flxFeatureRow",
        obj["lblCheckFeature"] = "lblCheckFeature",
        obj["lblFeatureName"] = "lblFeatureName"
      return obj;
    },
        statusDataMap: function() {
      var obj = {};
      obj["flxAccountTypeList"] = "flxAccountTypeList",
        obj["flxType1"] = "flxType1",
        obj["imgCheckBox"] = "imgCheckBox",
        obj["lblAccountType1"] = "lblAccountType1",
        obj["flxType2"] = "flxType2",
        obj["imgCheckBox2"] = "imgCheckBox2",
        obj["lblAccountType2"] = "lblAccountType2"
      return obj;
    },
   
    getSectionHeadersMonetaryFeaturesReadOnly: function() {
      var count = applicationManager.getConfigurationManager().CountResponse;
            //var count = data.records;
            var headerKeys = [];
			//var values ={};
            //var other = "Other";
            count.forEach(function(item) {
                if (item.limitgroupId === "SINGLE_PAYMENT") {
                    if (item.featureActions.length > 0) {
						
                        headerKeys.push({
							"limitgroupName":item.limitgroupName,
							"limitgroupId":item.limitgroupId
						});
                    }
                }
                if (item.limitgroupId === "BULK_PAYMENT") {
                    if (item.featureActions.length > 0) {
                        headerKeys.push({
							"limitgroupName":item.limitgroupName,
							"limitgroupId":item.limitgroupId
						});
                    }
                }
                if (item.limitgroupId === "OTHER") {
                    if (item.featureActions.length > 0) {
                        headerKeys.push({
							"limitgroupName":item.limitgroupName,
							"limitgroupId":item.limitgroupId
						});
                    }
                }
                if (item.limitgroupId !== "SINGLE_PAYMENT" && item.limitgroupId !== "BULK_PAYMENT" && item.limitgroupId !== "OTHER") {
                    if (item.featureActions.length > 0) {
                        headerKeys.push({
                            "limitgroupName": item.limitgroupName,
                            "limitgroupId": item.limitgroupId
                        });
          }
        }
        
      });
      var res = [];
      var template;
      if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
        //template = "flxAccountSelectionMobile";
      } else {
        template = "";
      }
      headerKeys.forEach(function(element) {
        res.push({
          "lblHedaerContent": {
            text: element.limitgroupName,
          },
          "limitgroupId": element.limitgroupId,
          "template": template
        });
      });
      
      return res;
    },
    
    addOnlySectionHeaders: function(sectionData, tabName) {
      var segData = [];
      for (var i = 0; i < sectionData.length; i++) {
        segData.push([
          sectionData[i],
          []
        ]);
      }
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segCurrency.setData(segData);
      for (var y = 0; y < sectionData.length; y++) {
        this.addRowsAndUpdateSection(this.getSectionHeadersMonetaryFeaturesReadOnlyValues(y, tabName), y);
        this.addOTHERData(this.getOTHERValues(tabName));
      }
      var segDataVal = this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segCurrency.data;
      for (var i = segDataVal.length-1; i >= 0; i--) {
        if (segDataVal[i][1].length === 0) {
          segDataVal.splice(i, 1);
        }
      }
      var data =this.rearrangeData(segDataVal);
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segCurrency.setData(data);
      //set selected filter value
      var scope=this;
      if(this.filterCheckedValue !== ""){
      var segData = this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segCurrency.data;
      segData.forEach(function(item) {
        item[1].forEach(function(data) {
          if (data.lblFeatureName.toolTip === scope.filterCheckedValue) {
            data.lblCheckFeature.text = "M";
            data.lblCheckFeature.skin = "ICSknLblRadioBtnSelectedFontIcon003e7520px";
          } else {
            data.lblCheckFeature.text = "L";
            data.lblCheckFeature.skin = "sknLblOlbFontIconsA0A0A020Px";
          }
        });
      });
      }
      else{
        this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxAll.lblAll.text = "M";
        this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxAll.lblAll.skin ="ICSknLblRadioBtnSelectedFontIcon003e7520px";
      }
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segCurrency.setData(segData);
      
      
//       var segData = this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTimePeriod.data ;
//       for (var i = 0; i<segData.length;i++){
//         if(i === rowIndex){

//           this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTimePeriod.setDataAt({
//             "lblCheckFeature" : {
//               text :"M",
//               skin :"ICSknLblRadioBtnSelectedFontIcon003e7520px",
//               onTouchEnd : scopeObj.checkTimePeriod.bind(this,i),
//             },
//             "lblFeatureName":segData[i].lblFeatureName,
//           }, rowIndex, 0);

//         }else{
//           this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTimePeriod.setDataAt({
//             "lblCheckFeature" : {
//               text :"L",
//               skin :"sknLblOlbFontIconsA0A0A020Px",
//               onTouchEnd : scopeObj.checkTimePeriod.bind(this,i),
//             },
//             "lblFeatureName":segData[i].lblFeatureName,
//           }, i, 0);
//         }
//       }
      //
    },
    
        getOTHERValues: function(tabName) {
      var scopeObj = this;
      var count = applicationManager.getConfigurationManager().CountResponse;
      var accountRowValues = [];
      var countVal;
            count.forEach(function(item) {
                if (item.limitgroupId !== "SINGLE_PAYMENT" && item.limitgroupId !== "BULK_PAYMENT" && item.limitgroupId !== "OTHER") {
                    if (item.featureActions.length > 0) {
                        item.featureActions.forEach(function(feature) {
                            if (tabName === kony.i18n.getLocalizedString("i18n.konybb.Common.Pending"))
                countVal = feature.myApprovalsPending;
              else
                countVal = feature.myApprovalsHistory;
                          if(countVal !== "0"){
                            accountRowValues.push({
                              "name": feature.featureName,
                              "featureActionId" : feature.featureActionId,
                              "count": countVal
                            })
                          }
            });
          }
        }
      });
          var truncateValue=30;
            if (kony.application.getCurrentBreakpoint() <= 1024) {
                    truncateValue = 20;
                }
        var segRowData = accountRowValues.map(function(item) {
          var dataMap = {
            "lblCheckFeature": {
              text: "L",
                        skin: "sknLblOlbFontIconsA0A0A020Px",
                        onTouchEnd: scopeObj.filterSelection.bind(this, item.featureActionId, "OTHER")
            },
            "lblFeatureName": {
                        "text": CommonUtilities.truncateStringWithGivenLength(item.name, truncateValue) + "(" + item.count + ")",
                        "toolTip": item.featureActionId
            }
          };
          return dataMap;
        });
        return segRowData;
    },
    
    addOTHERData: function(rowData) {
      var segData = this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segCurrency.data;
            if (!kony.sdk.isNullOrUndefined(this.index)) {
        segData[this.index].pop();
        segData[this.index].push(rowData);
      }
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segCurrency.setData(segData);
    },
    
          getSectionHeadersMonetaryFeaturesReadOnlyValues: function(index, tabName) {
        var scopeObj = this;
              var count = applicationManager.getConfigurationManager().CountResponse;
              var segData = this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segCurrency.data;
              var accountRowValues = [];
              var reqHeader = segData[index][0].limitgroupId;
             
            //  if (reqHeader === "Single Transaction") reqHeader = "Single Payment";
             // if (reqHeader === "Bulk Transaction") reqHeader = "Bulk Payment";
             // if (reqHeader === "Other Requests") {
            //     reqHeader = "Other";
             //    this.index = index;
            //  }
              var countVal;
              count.forEach(function(item) {
                  if (item.limitgroupId === reqHeader) {
                      if (item.featureActions.length > 0) {
                          item.featureActions.forEach(function(feature) {
                              if (tabName === kony.i18n.getLocalizedString("i18n.konybb.Common.Pending")) countVal = feature.myApprovalsPending;
                              else countVal = feature.myApprovalsHistory;
                              if (countVal !== "0") {
                                  accountRowValues.push({
                                      "name": feature.featureName,
                                     "featureActionId" : feature.featureActionId,
                                      "count": countVal
                                  })
                              }
                          });
                      }
                  }
              });
            var truncateValue=30;
            if (kony.application.getCurrentBreakpoint() === 1024) {
                    truncateValue = 20;
                }else if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile ) {
				 truncateValue = 45;
				
			}
              var segRowData = accountRowValues.map(function(item) {
                  var dataMap = {
                      "lblCheckFeature": {
                          text: "L",
                          skin: "sknLblOlbFontIconsA0A0A020Px",
                          onTouchEnd: scopeObj.filterSelection.bind(this, item.featureActionId, reqHeader)
                      },
                      "lblFeatureName": {
                          "text": CommonUtilities.truncateStringWithGivenLength(item.name, truncateValue) + "(" + item.count + ")",
                          "toolTip": item.featureActionId
                      }
                  };
                  return dataMap;
              });
              return segRowData;

      },
    addRowsAndUpdateSection: function(rowData, sectionIndex) {
      var segData = this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segCurrency.data;
      segData[sectionIndex].pop();
      segData[sectionIndex].push(rowData);
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segCurrency.setData(segData);
    },
    
        filterSelection: function(featureName, headerName) {
     var scopeObj = this;
            this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxAll.lblAll.text = "L";
            this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxAll.lblAll.skin = "sknLblOlbFontIconsA0A0A020Px";
            var segData = this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segCurrency.data;
           // if (headerName === "SINGLE_PAYMENT") headerName = "Single Transaction";
          ///  if (headerName === "BULK_PAYMENT") headerName = "Bulk Transaction";
            segData.forEach(function(item) {
                //if (item[0].limitgroupId === headerName) {
                    item[1].forEach(function(data) {
                        if (data.lblFeatureName.toolTip === featureName) {
                            data.lblCheckFeature.text = "M";
                            data.lblCheckFeature.skin = "ICSknLblRadioBtnSelectedFontIcon003e7520px";
                        } else {
                            data.lblCheckFeature.text = "L";
                            data.lblCheckFeature.skin = "sknLblOlbFontIconsA0A0A020Px";
                        }
                    });
                //}
            });
            this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segCurrency.setData(segData);
            if (this.activeTab === kony.i18n.getLocalizedString("i18n.konybb.Common.Pending")) {
                segData.forEach(function(item) {
                    item[1].forEach(function(data) {
                        if (data.lblCheckFeature.text === "M") {
                            scopeObj.checkedValues.push(data.lblFeatureName.toolTip);
                            scopeObj.checkedParams.push("featureActionId");
                        }
                    });
                });
                var filterParam;
                var filterValue;
                if (this.checkedValues.length > 0) {
                    filterValue = scopeObj.checkedValues.join();
                    filterParam = scopeObj.checkedParams.join();
                } else {
                    filterValue = scopeObj.checkedValues[0];
                    filterParam = scopeObj.checkedParams[0];
                }
                var filterData = {
                    "filterByParam": filterParam,
                    "filterByValue": filterValue
                };
                this.fetchParams.filterByParam = filterParam;
                this.fetchParams.filterByValue = filterValue;
                this.filterCheckedValue = filterValue;
                this.loadApprovalsReqModule().presentationController.fetchApprovalPending(this.fetchParams);
                this.checkedValues = [];
                this.checkedParams = [];
                this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.isVisible = false;
            }
            
    },
        applyFilterForHistory: function() {
          this.allStatus = true;
      var scopeObj = this;
      var segData = this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segCurrency.data;
      segData.forEach(function(item) {
        item[1].forEach(function(data) {
          if (data.lblCheckFeature.text === "M") {
            scopeObj.checkedValues.push(data.lblFeatureName.toolTip);
            scopeObj.checkedParams.push("featureActionId");
          }
        });
      });
      var filterParam;
      var filterValue;
      var filterData;
      if (this.checkedValues.length > 0) {
        filterValue = scopeObj.checkedValues.join();
        filterParam = scopeObj.checkedParams.join();
      } else {
        filterValue = scopeObj.checkedValues[0];
        filterParam = scopeObj.checkedParams[0];
      }
      filterData = {
        "filterByParam": filterParam,
        "filterByValue": filterValue
      };
          this.filterCheckedValue = filterValue;
      var statusData = this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTypeOfAccounts.data;
        if(statusData[0].imgCheckBox.text === "C" && statusData[0].imgCheckBox2.text === "C" && statusData[1].imgCheckBox.text === "C" ){
				
			}
            else {
				if (statusData[0].imgCheckBox.text === "C") {
                this.statusApproved = statusData[0].lblAccountType1.text;
                scopeObj.checkedValues.push(statusData[0].lblAccountType1.text);
                scopeObj.checkedParams.push("status");
            }
			if (statusData[0].imgCheckBox2.text === "C") {
                this.statusRejected = statusData[0].lblAccountType2.text;
                scopeObj.checkedValues.push(statusData[0].lblAccountType2.text);
                scopeObj.checkedParams.push("status");
            }
			 if (statusData[1].imgCheckBox.text === "C") {
                this.statusPending = statusData[1].lblAccountType1.text;
                scopeObj.checkedValues.push(statusData[1].lblAccountType1.text);
                scopeObj.checkedParams.push("status");
            }
			
			}
      if (this.checkedValues.length > 0) {
        filterValue = scopeObj.checkedValues.join();
        filterParam = scopeObj.checkedParams.join();
      } else {
        filterValue = scopeObj.checkedValues[0];
        filterParam = scopeObj.checkedParams[0];
      }
     var segData = this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTimePeriod.data ;
			var timeValue;
			segData.forEach(function(data){
				if(data.lblCheckFeature.text === "M" && data.lblCheckFeature.skin === "ICSknLblRadioBtnSelectedFontIcon003e7520px"){
					if(data.lblFeatureName   === "Last One Year"){
						timeValue = "1,YEAR";
					}else if(data.lblFeatureName   === "Last 6 months"){
						timeValue = "6,MONTH";
					}else if(data.lblFeatureName   === "Last Month"){
						timeValue = "1,MONTH";
					}else if(data.lblFeatureName   === "Last One Week"){
						timeValue = "1,WEEK";
					}else if(data.lblFeatureName   === "Today"){
						timeValue = "1,DAY";
					}
                  scopeObj.filterCheckedTimeValue = data.lblFeatureName;
				}
			});
			
            filterData = {
                "filterByParam": filterParam,
                "filterByValue": filterValue,
				"timeParam":"sentDate",
				"timeValue":timeValue
            };
          	 this.fetchParams.filterByParam = filterParam ;
             this.fetchParams.filterByValue = filterValue ;
            this.fetchParams.timeParam = "sentDate" ;
            this.fetchParams.timeValue = timeValue ;
          
          
      this.loadApprovalsReqModule().presentationController.fetchApprovalHistory(this.fetchParams);
      this.checkedValues = [];
      this.checkedParams = [];
          this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.setVisibility(false);
    },
//     setStatusData: function() {
//       var scopeObj = this;
//       var statusData = this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTypeOfAccounts.data;
//       var segRowData = statusData.map(function() {
//         var dataMap = {
//           "imgCheckBox": {
//             text: "C",
//             onTouchEnd: scopeObj.statusSelection.bind(this, "Approved")
//           },
//           "lblAccountType1": {
//             "text": "Approved"
//           },
//           "imgCheckBox2": {
//             text: "C",
//             onTouchEnd: scopeObj.statusSelection.bind(this, "Rejected")
//           },
//           "lblAccountType2": {
//             "text": "Rejected"
//           },
//         };
//         return dataMap;
//       });
//       this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTypeOfAccounts.setData(segRowData);
//     },
    
    setStatusData: function() {
      var scopeObj = this;
      var statusData = this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTypeOfAccounts.data;

      var dataMap = [{
        "imgCheckBox": {
          text: "C",
          onTouchEnd: scopeObj.statusSelection.bind(this, "Approved")
        },
        "lblAccountType1": {
          "text": "Approved"
        },
        "imgCheckBox2": {
          text: "C",
          onTouchEnd: scopeObj.statusSelection.bind(this, "Rejected")
        },
        "lblAccountType2": {
          "text": "Rejected"
        },
      },
                     {
                       "imgCheckBox": {
                         text: "C",
                         onTouchEnd: scopeObj.statusSelection.bind(this, "Pending")
                       },
                       "lblAccountType1": {
                         "text": "Pending"
                       },
                       "flxType2": {
                         isVisible: false
                       },
                       "imgCheckBox2": {
                         text: "C",
                         onTouchEnd: scopeObj.statusSelection.bind(this, "Rejected"),
                         isVisible: false
                       },
                       "lblAccountType2": {
                         "text": "Rejected",
                         isVisible: false
                       },
                     }
                    ];


      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTypeOfAccounts.setData(dataMap);
      if(this.allStatus){
        var scopeObj = this;
        var statusData = this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTypeOfAccounts.data;
        if (this.statusApproved !== "") {
          statusData[0].imgCheckBox.text = "C";
        }
        else
          statusData[0].imgCheckBox.text = "D";
        if (this.statusRejected !== "") {
          statusData[0].imgCheckBox2.text = "C";
        }
        else
          statusData[0].imgCheckBox2.text = "D";
        if (this.statusPending !== "") {
          statusData[1].imgCheckBox.text = "C";
        }
        else
          statusData[1].imgCheckBox.text = "D";
        this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTypeOfAccounts.setData(statusData);
        this.statusApproved = "";
        this.statusRejected = "";
        this.statusPending = "";
      }
    },

        statusSelection: function(statusVal) {
            var statusData = this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTypeOfAccounts.data;
            if (statusVal === "Approved") {
                if (statusData[0].imgCheckBox.text === "D") {
                    statusData[0].imgCheckBox.text = "C";
                } else {
                    statusData[0].imgCheckBox.text = "D";
                }
            } else if (statusVal === "Pending") {
                if (statusData[1].imgCheckBox.text === "D") {
                    statusData[1].imgCheckBox.text = "C";
                } else {
                    statusData[1].imgCheckBox.text = "D";
                }
            } else {
                if (statusData[0].imgCheckBox2.text === "D") {
                    statusData[0].imgCheckBox2.text = "C";
                } else {
                    statusData[0].imgCheckBox2.text = "D";

                }
            }
            this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.segTypeOfAccounts.setData(statusData);
        },
//         setUpDefaultView: function() {
//       this.defaultTab = kony.i18n.getLocalizedString("i18n.konybb.Common.Pending");
//      this.view.TabPaneNew.TabsHeaderNew.focusTab(1);
//             this.onTabClick({
//                 text: this.defaultTab
//             });
//     },
    onTabClick: function(eventobject) {
      this.filterCheckedValue = "";
      this.filterCheckedTimeValue = "";
      this.allStatus = false;
      var scopeObj = this;
      var tabName;
      tabName = eventobject.text;
      if(this.history === "history")
        tabName = kony.i18n.getLocalizedString("i18n.billPay.History");
      if (kony.sdk.isNullOrUndefined(eventobject)) return;
      if (kony.sdk.isNullOrUndefined(eventobject.text)) return;
      this.initializeFetchParams();

      this.view.TabPaneNew.TabSearchBarNew.tbxSearch.text = "";
      this.view.TabPaneNew.TabsHeaderNew.clickTab(eventobject);
      if (tabName === kony.i18n.getLocalizedString("i18n.konybb.Common.Pending")) {
        this.activeTab = kony.i18n.getLocalizedString("i18n.konybb.Common.Pending");
        this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.isVisible = false;
        this.changeHeaderRowTemplates();

        this.invokeFetchApprovePending();
      } else if (tabName === kony.i18n.getLocalizedString("i18n.billPay.History")) {
        this.activeTab = kony.i18n.getLocalizedString("i18n.billPay.History");
        this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.isVisible = false;
        this.changeHeaderRowTemplates();
        this.invokeFetchApproveHistory();

      }
      var count = applicationManager.getConfigurationManager().CountResponse;
      var countVal;
      var accountRowValues = [];

      count.forEach(function(item) {
        if (item.featureActions.length > 0) {
          item.featureActions.forEach(function(feature) {
            if (scopeObj.activeTab === kony.i18n.getLocalizedString("i18n.konybb.Common.Pending"))
              countVal = feature.myApprovalsPending;
            else
              countVal = feature.myApprovalsHistory;
            accountRowValues.push(countVal)
          });
        }

      });
      var allCount = 0;
      accountRowValues.forEach(function(item) {
        allCount += parseInt(item);
      });
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.lblViewType.text = "All" + "(" + allCount + ")";
      this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.lblViewType.skin = "slLabel0d8a72616b3cc47";
      //this.view.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.lblViewType.left = "14%";
      this.adjustScreen(-155);

    },
        initializeFetchParams: function() {
       this.fetchParams = {
                "searchString": "",
                "sortByParam": "",
                "sortOrder": "",
                "pageSize": "",
                "pageOffset": "",
                "filterByParam": "",
                "filterByValue": "",
                "timeParam":"",
                "timeValue":""
            };
    },
    
        invokeFetchApprovePending: function() {
      this.updateFetchParams();
      this.setPaginationComponentForRequestPending();
      this.fetchRequestPending();
    },

        invokeFetchApproveHistory: function() {
      this.updateFetchParams();
      this.setPaginationComponentForRequestHistory();
      this.fetchRequestHistory();
    },

        updateFetchParams: function() {
      this.fetchParams.searchString = CommonUtilities.validateSearchString(this.view.TabPaneNew.TabSearchBarNew.tbxSearch.text);
      this.fetchParams.pageSize =  this.view.TabPaneNew.PaginationContainer.getPageSize();
      this.fetchParams.pageOffset = this.view.TabPaneNew.PaginationContainer.getPageOffset();
    },

        setPaginationComponentForRequestPending: function() {
      this.view.TabPaneNew.PaginationContainer.setPageSize(BBConstants.PAGE_SIZE);
      this.view.TabPaneNew.PaginationContainer.setLowerLimit(1);
      this.view.TabPaneNew.PaginationContainer.setPageHeader(kony.i18n.getLocalizedString("i18n.konybb.Common.Pending"));
      this.view.TabPaneNew.PaginationContainer.setServiceDelegate(this.fetchRequestPending);
      this.view.TabPaneNew.PaginationContainer.setIntervalHeader();
    },

        setPaginationComponentForRequestHistory: function() {
      this.view.TabPaneNew.PaginationContainer.setPageSize(BBConstants.PAGE_SIZE);
      this.view.TabPaneNew.PaginationContainer.setLowerLimit(1);
      this.view.TabPaneNew.PaginationContainer.setPageHeader(kony.i18n.getLocalizedString("i18n.billPay.History"));
      this.view.TabPaneNew.PaginationContainer.setServiceDelegate(this.fetchRequestHistory);
      this.view.TabPaneNew.PaginationContainer.setIntervalHeader();
    },

        updatePaginationContainerUI: function(responseData) {
      var isMaxLimitReached = responseData.length < BBConstants.PAGE_SIZE;
      this.view.TabPaneNew.PaginationContainer.setIsMaxLimitReached(isMaxLimitReached);
      this.view.TabPaneNew.PaginationContainer.updateUI();
    },

    fetchRequestPending: function() {
      this.updateFetchParams();
      this.fetchParams.sortByParam = "sentDate";
      this.fetchParams.sortOrder = "DESC";
      this.dashboardSortParams.Pending.ApproveType = "sortingfinal.png";
      this.dashboardSortParams.Pending.SentDate = "sorting_previous.png";
      this.dashboardSortParams.Pending.SentBy = "sortingfinal.png";
      this.dashboardSortParams.Pending.RequestBy = "sortingfinal.png";
      this.ApprovalsReqModule.presentationController.fetchApprovalPending(this.fetchParams);
    },

      fetchRequestHistory: function() {
      this.updateFetchParams();
      this.fetchParams.sortByParam = "sentDate";
       this.fetchParams.sortOrder = "DESC";
	   this.dashboardSortParams.History.ApproveType = "sortingfinal.png";
            this.dashboardSortParams.History.SentDate = "sorting_previous.png";
            this.dashboardSortParams.History.SentBy = "sortingfinal.png";
            this.dashboardSortParams.History.ApproveDate = "sortingfinal.png";
            this.dashboardSortParams.History.Status = "sortingfinal.png";
      this.ApprovalsReqModule.presentationController.fetchApprovalHistory(this.fetchParams);
    },

        showPopup: function(eventObject, context) {
				var scope = this;
          var width = kony.application.getCurrentBreakpoint();
            if (width === 640 || orientationHandler.isMobile) {
				this.view.flxPopupConfirmation.height = "100%" ;
			}else {
            this.view.flxPopupConfirmation.height = this.view.customheader.info.frame.height + this.view.flxContentContainer.info.frame.height + this.view.flxFooter.info.frame.height + 50;
           
			}
        //this.view.flxPopupConfirmation.height = "1000dp";
        this.view.flxPopupNew.lblHeader.text = kony.i18n.getLocalizedString("konybb.Approvals.ApprovalsRequest");
            this.view.flxPopupNew.lblPopupMsg.skin = "sknlblUserName";
        this.view.flxPopupNew.lblPopupMsg.text = kony.i18n.getLocalizedString("konybb.Approval.AreYouSureApprove");
        this.view.flxPopupNew.flxComments.isVisible = false;
            var comments = this.view.flxPopupNew.trComments.text;
        this.view.flxPopupNew.formActionsNew.btnNext.text = kony.i18n.getLocalizedString("i18n.common.yes");
        this.view.flxPopupNew.formActionsNew.btnCancel.text = kony.i18n.getLocalizedString("i18n.common.no");
        //this.view.flxPopupNew.formActionsNew.btnNext.onClick = this.approveTransaction(eventObject,context,comments);
       //this.view.flxPopupNew.formActionsNew.btnCancel.onClick = this.hidePopup;
	   this.view.flxPopupNew.formActionsNew.btnNext.onClick = function() {
                scope.approveTransaction(eventObject, context, comments);
      }.bind(this);
	  this.view.flxPopupNew.formActionsNew.btnCancel.onClick = function() {
                scope.hidePopup();
      }.bind(this);
        this.view.flxPopupNew.flxClose.isVisible = true;
      	this.view.flxPopupNew.flxClose.cursorType = "pointer";
        this.view.flxPopupNew.flxClose.onClick = this.hidePopup;
      	this.view.flxPopupConfirmation.isVisible = true;
           this.view.flxPopupNew.formActionsNew.top = 60 + "dp";
         
	    //this.view.flxPopupNew.trComments.onKeyUp = function(){
          //if(this.view.flxPopupNew.trComments.text.trim() !== "" && this.view.flxPopupNew.trComments.text !== null){
           	//CommonUtilities.enableButton(this.view.flxPopupNew.formActionsNew.btnNext);
          //}
          //else{
        	//CommonUtilities.disableButton(this.view.flxPopupNew.formActionsNew.btnNext);    
         // }
       // }.bind(this);
        //CommonUtilities.disableButton(this.view.flxPopupNew.formActionsNew.btnNext);
        this.view.forceLayout();
    },
    
        approveTransaction: function(eventObject, context, comments) {
      this.hidePopup();
            var row = context.rowIndex;
      	var section = context.sectionIndex;
      	var selectedRowData = this.view.TabPaneNew.TabBodyNew.getData()[section][1][row];
      	var requestId = selectedRowData["requestId"];
        var transactionId = selectedRowData["transactionId"];
      	var featureActionId = selectedRowData["featureActionId"];
      	var scopeObj = this;
      	var params = {
                    "requestId": requestId,
                    "featureActionId": featureActionId,
                    "comments": comments
        };
            if (featureActionId === "ACH_PAYMENT_CREATE" || featureActionId === "ACH_COLLECTION_CREATE") {
                this.approveACHTransaction(params, BBConstants.APPROVED_ACH_TRANSACTION_ACK);
            } else if (featureActionId === "ACH_FILE_UPLOAD") {
                this.approveACHFile(params, BBConstants.APPROVED_ACH_FILE_ACK);
            } else if(featureActionId ===  BBConstants.CHEQUE_BOOK_REQUEST_CREATE) {
             	this.approveChequeBookRequest(params, BBConstants.APPROVED_TRANSACTION_ACK,selectedRowData);
            }else{
              	this.approveGeneralTransaction(params, BBConstants.APPROVED_TRANSACTION_ACK,selectedRowData);
            }
    },
    
        hidePopup: function() {
		this.view.flxPopupConfirmation.isVisible = false;
		this.view.forceLayout();
	},
    loadApprovalsReqModule: function() {
      return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ApprovalsReqUIModule");
    },
    
    
        searchApprovalPending: function() {
      var searchText = this.view.TabPaneNew.TabSearchBarNew.tbxSearch.text;
           if(searchText.includes("/")){
            searchText = CommonUtilities.getBackendDateFormat(searchText,"mm/dd/yyyy");
          }
            if (searchText === "") {
              this.fetchParams.searchString = searchText ;
        this.loadApprovalsReqModule().presentationController.fetchApprovalPending(this.fetchParams);
            } else {
                this.fetchParams.searchString = searchText ;
          var searchData = {
                        "searchString": searchText
          };
          this.loadApprovalsReqModule().presentationController.fetchApprovalPending(this.fetchParams);
        
      }
    },

        searchApprovalHistory: function() {
      var searchText = this.view.TabPaneNew.TabSearchBarNew.tbxSearch.text;
          if(searchText.includes("/")){
            searchText = CommonUtilities.getBackendDateFormat(searchText,"mm/dd/yyyy");
          }
            if (searchText === "") {
              this.fetchParams.searchString = searchText ;
        this.loadApprovalsReqModule().presentationController.fetchApprovalHistory(this.fetchParams);
            } else {
              this.fetchParams.searchString = searchText ;
                
          var searchData = {
                        "searchString": searchText
          };
          this.loadApprovalsReqModule().presentationController.fetchApprovalHistory(this.fetchParams);
        
      }
    },
    
    
      changeHeaderRowTemplates: function() {
            var width = kony.application.getCurrentBreakpoint();
            if (this.activeTab === kony.i18n.getLocalizedString("i18n.konybb.Common.Pending")) {
                if (width === 640 || orientationHandler.isMobile) {
                    this.view.TabPaneNew.TabBodyNew.segTemplates.sectionHeaderTemplate = "flxempty";
                    this.view.TabPaneNew.TabBodyNew.segTemplates.rowTemplate = "flxApprovePendingRowMobile";
                    this.view.TabPaneNew.TabSearchBarNew.tbxSearch.onDone = function() {
                        this.updateFetchParams();
                        this.searchApprovalPending();
                    }.bind(this);
					this.view.TabPaneNew.TabSearchBarNew.imgClear.onTouchStart = function() {
                        this.view.TabPaneNew.TabSearchBarNew.tbxSearch.text = "";
                        this.filterParams.OngoingPaymentSearch = "";
						this.updateFetchParams();
                        this.hideOrShowCloseIcon();
                        this.searchApprovalPending();
                    }.bind(this);
                } else {
                    this.view.TabPaneNew.TabBodyNew.segTemplates.sectionHeaderTemplate = "flxPendingApprove";
                    this.view.TabPaneNew.TabBodyNew.segTemplates.rowTemplate = "flxApprovePendingRowTemplate";
                    // this.loadApprovalsReqModule().presentationController.fetchApprovalPending("");
                    this.view.TabPaneNew.TabSearchBarNew.tbxSearch.onDone = function() {
                        this.updateFetchParams();
                        this.searchApprovalPending();
                    }.bind(this);
                    this.view.TabPaneNew.TabSearchBarNew.imgClear.onTouchStart = function() {
                        this.view.TabPaneNew.TabSearchBarNew.tbxSearch.text = "";
                        this.filterParams.OngoingPaymentSearch = "";
						this.updateFetchParams();
                        this.hideOrShowCloseIcon();
                        this.searchApprovalPending();
                    }.bind(this);
                }
                //var data = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ApprovalsReqUIModule");
                //var dataval = data.presentationController.getApprovalsData();
                //this.setApprovalPendingData(dataval.pendingApprovals);
            } else {
                if (width === 640 || orientationHandler.isMobile) {
                    this.view.TabPaneNew.TabBodyNew.segTemplates.sectionHeaderTemplate = "flxempty";
                    this.view.TabPaneNew.TabBodyNew.segTemplates.rowTemplate = "flxApprovePendingRowMobile";
                    this.view.TabPaneNew.TabSearchBarNew.tbxSearch.onDone = function() {
                        this.updateFetchParams();
                        this.searchApprovalHistory();
                    }.bind(this);
					 this.view.TabPaneNew.TabSearchBarNew.imgClear.onTouchStart = function() {
                        this.view.TabPaneNew.TabSearchBarNew.tbxSearch.text = "";
                        this.filterParams.OngoingPaymentSearch = "";
						this.updateFetchParams();
                        this.hideOrShowCloseIcon();
                        this.searchApprovalHistory();
                    }.bind(this);
                } else {
                    this.view.TabPaneNew.TabBodyNew.segTemplates.sectionHeaderTemplate = "flxHistoryApprovals";
                    this.view.TabPaneNew.TabBodyNew.segTemplates.rowTemplate = "flxApprovalHistoryRowTemplate";
                    // this.loadApprovalsReqModule().presentationController.fetchApprovalHistory("");
                    this.view.TabPaneNew.TabSearchBarNew.tbxSearch.onDone = function() {
                        this.updateFetchParams();
                        this.searchApprovalHistory();
                    }.bind(this);
                    this.view.TabPaneNew.TabSearchBarNew.imgClear.onTouchStart = function() {
                        this.view.TabPaneNew.TabSearchBarNew.tbxSearch.text = "";
                        this.filterParams.OngoingPaymentSearch = "";
						this.updateFetchParams();
                        this.hideOrShowCloseIcon();
                        this.searchApprovalHistory();
                    }.bind(this);
                }
                // var data = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ApprovalsReqUIModule");
                //var dataval = data.presentationController.getApprovalsData();
                //var data = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ApprovalsReqUIModule");
                //var dataval = data.presentationController.getApprovalsData();
                //this.setApprovalHistoryData(dataval.approvalHistory);
            }
        },
        showDownTimeMessage: function(errorData) {
      this.view.flxContentContainer.setVisibility(false);
      this.view.flxDowntimeWarning.setVisibility(true);
      this.view.lblDowntimeWarning.text = errorData.errorMessage;
      this.view.imgCloseDowntimeWarning.setVisibility(false);
      this.view.flxDowntimeWarning.skin = "sknFFFFFFmodbr3px";
      this.view.lblDowntimeWarning.skin = "bbSknLblFF001FLatoBold15Px";
      FormControllerUtility.hideProgressBar(this.view);
      this.view.forceLayout();      
      this.adjustScreen(-155);
    },  
        getWidgetDataforAprovalsPending: function() {
      
    },
        showRejectPopup: function(eventObject, context) {
      var scope = this;
            var data = this.view.TabPaneNew.TabBodyNew.segTemplates.selectedRowItems[0];
          
            var width = kony.application.getCurrentBreakpoint();
            if (width === 640 || orientationHandler.isMobile) {
				this.view.flxPopupConfirmation.height = "100%" ;
			}else {
            this.view.flxPopupConfirmation.height = this.view.customheader.info.frame.height + this.view.flxContentContainer.info.frame.height + this.view.flxFooter.info.frame.height;
			}
      this.view.flxPopupNew.lblHeader.text = "Reject Request";
            this.view.flxPopupNew.lblPopupMsg.skin = "sknlblUserName";
            this.view.flxPopupNew.lblPopupMsg.text = "Are you sure you want to reject this request?";
      this.view.flxPopupNew.flxComments.isVisible = true;
      var comments = this.view.flxPopupNew.trComments.text;
      this.view.flxPopupNew.formActionsNew.btnNext.text = kony.i18n.getLocalizedString("i18n.common.yes");
      this.view.flxPopupNew.formActionsNew.btnCancel.text = kony.i18n.getLocalizedString("i18n.common.no");
      //this.view.flxPopupNew.formActionsNew.btnNext.onClick = this.rejectTransaction(eventObject,context,comments);
      //this.view.flxPopupNew.formActionsNew.btnCancel.onClick = this.hidePopup;
      this.view.flxPopupNew.formActionsNew.btnNext.onClick = function() {
                  var comments = this.view.flxPopupNew.trComments.text;
                scope.rejectTransaction(eventObject, context, comments);
      }.bind(this);
	  this.view.flxPopupNew.formActionsNew.btnCancel.onClick = function() {
                scope.hidePopup();
      }.bind(this);
      this.view.flxPopupNew.flxClose.isVisible = true;
      this.view.flxPopupNew.flxClose.cursorType = "pointer";
            this.view.flxPopupNew.flxClose.onClick = this.hidePopup;
      this.view.flxPopupConfirmation.isVisible = true;
      this.view.flxPopupNew.formActionsNew.top = 0 + "dp";
         
      //this.view.flxPopupNew.trComments.onKeyUp = function(){
      //if(this.view.flxPopupNew.trComments.text.trim() !== "" && this.view.flxPopupNew.trComments.text !== null){
      //CommonUtilities.enableButton(this.view.flxPopupNew.formActionsNew.btnNext);
      //}
      //else{
      //CommonUtilities.disableButton(this.view.flxPopupNew.formActionsNew.btnNext);    
      // }
      // }.bind(this);
      //CommonUtilities.disableButton(this.view.flxPopupNew.formActionsNew.btnNext);
      this.view.forceLayout();
    },
    
    
        rejectTransaction: function(eventObject, context, comments) {
      this.hidePopup();
            var row = context.rowIndex;
      var section = context.sectionIndex;
      var selectedRowData = this.view.TabPaneNew.TabBodyNew.getData()[section][1][row];
      var requestId = selectedRowData["requestId"];
      var transactionId = selectedRowData["transactionId"];
      var featureActionId = selectedRowData["featureActionId"];
      var scopeObj = this;
      var params = {
        "requestId": requestId,
        "featureActionId": featureActionId,
        "comments": comments
            };
            if (featureActionId === "ACH_PAYMENT_CREATE" || featureActionId === "ACH_COLLECTION_CREATE") {
                this.rejectACHTransaction(params, BBConstants.REJECTED_ACH_TRANSACTION_ACK);
            } else if (featureActionId === "ACH_FILE_UPLOAD") {
                this.rejectACHFile(params, BBConstants.REJECTED_ACH_FILE_ACK);
            } 
          else if(featureActionId === BBConstants.CHEQUE_BOOK_REQUEST_CREATE){
            	this.rejectChequeBookRequest(params, BBConstants.REJECTED_TRANSACTION_ACK, selectedRowData);
          }
          else {
                this.rejectGeneralTransaction(params, BBConstants.REJECTED_TRANSACTION_ACK, selectedRowData);
            }
        },

    	approveChequeBookRequest: function(params, keyValue, recordData) {
            FormControllerUtility.showProgressBar(this.view);
            var navObj = {
                requestData: params,
                onSuccess: {
                    form: "frmACHDashboard",
                    module: "ACHModule",
                    context: {
                        key: keyValue, //BBConstants.APPROVED_TRANSACTION_ACK, 
                        responseData: recordData
                    }
                },
                onFailure: {
                    form: "frmBBMyApprovals",
                    module: "ApprovalsReqUIModule",
                    context: {
                        key: BBConstants.SERVICE_ERROR,
                        responseData: {}
                    }
                }
            };
            this.ApprovalsReqModule.presentationController.approveChequeBookRequest(navObj);
        },
    
        approveGeneralTransaction: function(params, keyValue, recordData) {
            FormControllerUtility.showProgressBar(this.view);
            var navObj = {
                requestData: params,
                onSuccess: {
                    form: "frmACHDashboard",
                    module: "ACHModule",
                    context: {
                        key: keyValue, //BBConstants.APPROVED_TRANSACTION_ACK, 
                        responseData: recordData
                    }
                },
                onFailure: {
                    form: "frmBBMyApprovals",
                    module: "ApprovalsReqUIModule",
                    context: {
                        key: BBConstants.SERVICE_ERROR,
                        responseData: {}
                    }
                }
            };
            this.ApprovalsReqModule.presentationController.approveTransactions(navObj);
        },

        approveACHTransaction: function(params, keyValue) {
            FormControllerUtility.showProgressBar(this.view);
            var navObj = {
                requestData: params,
                onSuccess: {
                    form: "frmACHDashboard",
                    module: "ACHModule",
                    context: {
                        key: keyValue, //BBConstants.APPROVED_ACH_TRANSACTION_ACK,
                        responseData: {}
                    }
                },
                onFailure: {
                    form: "frmBBMyApprovals",
                    module: "ApprovalsReqUIModule",
                    context: {
                        key: BBConstants.SERVICE_ERROR,
                        responseData: {}
                    }
                }
            };
            this.ApprovalsReqModule.presentationController.approveACHTransactions(navObj);
        },

        approveACHFile: function(param, keyValue) {
            FormControllerUtility.showProgressBar(this.view);
            var navObj = {
                requestData: param,
                onSuccess: {
                    form: "frmACHDashboard",
                    module: "ACHModule",
                    context: {
                        key: keyValue, //BBConstants.APPROVED_ACH_FILE_ACK,
                        responseData: {}
                    }
                },
                onFailure: {
                    form: "frmBBMyApprovals",
                    module: "ApprovalsReqUIModule",
                    context: {
                        key: BBConstants.SERVICE_ERROR,
                        responseData: {}
                    }
                }
            };
            this.ApprovalsReqModule.presentationController.approveACHFiles(navObj);
        },

        rejectGeneralTransaction: function(params, keyValue, selectedRowData) {
            this.hidePopup();
            FormControllerUtility.showProgressBar(this.view);
            var navObj = {
                requestData: params,
                onSuccess: {
                    form: "frmACHDashboard",
                    module: "ACHModule",
                    context: {
                        key: keyValue,
                        responseData: selectedRowData
                    }
                },
                onFailure: {
                    form: "frmBBMyApprovals",
                    module: "ApprovalsReqUIModule",
                    context: {
                        key: BBConstants.SERVICE_ERROR,
                        responseData: {}
                    }
                }
            };
            this.ApprovalsReqModule.presentationController.rejectTransactions(navObj);
        },
    
    	rejectChequeBookRequest: function(params, keyValue, recordData) {
            this.hidePopup();
            FormControllerUtility.showProgressBar(this.view);
            var navObj = {
                requestData: params,
                onSuccess: {
                    form: "frmACHDashboard",
                    module: "ACHModule",
                    context: {
                        key: keyValue, //BBConstants.APPROVED_TRANSACTION_ACK, 
                        responseData: recordData
                    }
                },
                onFailure: {
                    form: "frmBBMyApprovals",
                    module: "ApprovalsReqUIModule",
                    context: {
                        key: BBConstants.SERVICE_ERROR,
                        responseData: {}
                    }
                }
            };
            this.ApprovalsReqModule.presentationController.rejectChequeBookRequest(navObj);
        },

        rejectACHTransaction: function(params, keyValue) {
            this.hidePopup();
            FormControllerUtility.showProgressBar(this.view);
            var navObj = {
                requestData: params,
                onSuccess: {
                    form: "frmACHDashboard",
                    module: "ACHModule",
                    context: {
                        key: keyValue,
                        responseData: {}
                    }
                },
                onFailure: {
                    form: "frmBBMyApprovals",
                    module: "ApprovalsReqUIModule",
                    context: {
                        key: BBConstants.SERVICE_ERROR,
                        responseData: {}
                    }
                }
            };
            this.ApprovalsReqModule.presentationController.rejectACHTransactions(navObj);
        },

          rejectACHFile: function(params, keyValue) {
            this.hidePopup();
            FormControllerUtility.showProgressBar(this.view);
            var navObj = {
                requestData: params,
                onSuccess: {
                    form: "frmACHDashboard",
                    module: "ACHModule",
                    context: {
                        key: keyValue,
                        responseData: {}
                    }
                },
                onFailure: {
                    form: "frmBBMyApprovals",
                    module: "ApprovalsReqUIModule",
                    context: {
                        key: BBConstants.SERVICE_ERROR,
                        responseData: {}
                    }
                }
            };
            this.ApprovalsReqModule.presentationController.rejectACHFiles(navObj);
        },
       rearrangeData:function(segData)
      {
        var data=segData;
        var index=[];
        for(i=0;i<data.length;i++)
        {
           if (data[i][0].limitgroupId == "BULK_PAYMENT") {
                    index["Bulk Payment"] = i;
                }
                if (data[i][0].limitgroupId == "SINGLE_PAYMENT") {
                    index["Single Payment"] = i;
                }
                if (data[i][0].limitgroupId == "OTHER") {
                    index["Other"] = i;
                }
        };
        var newData=[];
        if(index["Single Payment"]!==undefined)
        {
          newData.push(data[index["Single Payment"]]);
        }
        if(index["Bulk Payment"]!==undefined)
        {
          newData.push(data[index["Bulk Payment"]]);
        }
        if(index["other"]!==undefined)
        {
          newData.push(data[index["Other"]]);
        }
        return newData;
      }

    };


  

  //Type your controller code here 

});