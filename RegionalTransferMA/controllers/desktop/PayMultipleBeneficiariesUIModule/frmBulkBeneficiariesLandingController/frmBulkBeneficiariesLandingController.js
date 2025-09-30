/**
 * Description of Module representing a Confirm form.
 * @module frmBulkPayeesController
 */
define(['CommonUtilities', 'OLBConstants', 'ViewConstants', 'FormControllerUtility'], function(CommonUtilities, OLBConstants, ViewConstants, FormControllerUtility) {
    var responsiveUtils = new ResponsiveUtils();
    var orientationHandler = new OrientationHandler();

    return /** @alias module:frmBulkPayeesController */ {
        /** updates the present Form based on required function.
         * @param {uiDataMap[]} uiDataMap
         */
        updateFormUI: function(uiDataMap) {
            if (uiDataMap.isLoading) {
                FormControllerUtility.showProgressBar(this.view);
            }
            if (!uiDataMap.isLoading) {
                FormControllerUtility.hideProgressBar(this.view);
            }
            if (uiDataMap.serverError) {
                this.setServerError(uiDataMap.serverError);
            } else {
                this.view.flxDowntimeWarning.setVisibility(false);
            }
            if (uiDataMap.manageBeneficiary) {
                this.bindManagePayeeData(uiDataMap.manageBeneficiary, uiDataMap.selectedBeneficiaries);
            }
        },
        init: function() {
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onDeviceBack = function() {};
            this.view.onBreakpointChange = this.onBreakpointChange;
            this.initActions();
        },
        preShow: function() {
            //this.view.customheadernew.activateMenu("Bill Pay", "Pay a Bill");
            this.view.txtSearch.text = "";
            CommonUtilities.disableButton(this.view.btnBulkConfirm);
        },
        /**
         * used perform the initialize activities.
         *
         */
        initActions: function() {
            var scopeObj = this;
            this.presenter = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayMultipleBeneficiariesUIModule").presentationController;
            this.view.txtSearch.onKeyUp = this.onTxtSearchKeyUp.bind(this);
            this.view.txtSearch.onDone = this.onSearchBtnClick.bind(this);
            this.view.flxClearBtn.onClick = this.onSearchClearBtnClick.bind(this);
            this.view.flxAddPayeeMakeOneTimePayment.onClick = function() {
                this.presenter.showPayMultipleBeneficiaries({
                    "showAddBeneficiary": true
                })
            }.bind(this);
            //scopeObj.setSorting();
        },
        /**
         * sorting configurations to beneficiaries
         */
        setSorting: function() {
            var scopeObj = this;
            scopeObj.beneficiaryNameSortMap = [{
                    name: 'beneficiaryName',
                    imageFlx: scopeObj.view.imgSortBeneficiaryName,
                    clickContainer: scopeObj.view.flxBeneficiaryNameWrapper
                },
                {
                    name: 'bankName',
                    imageFlx: scopeObj.view.imgSortBankName,
                    clickContainer: scopeObj.view.flxBankName
                },
                {
                    name: 'accountNumber',
                    imageFlx: scopeObj.view.imgSortAccountNumber,
                    clickContainer: scopeObj.view.flxAccountNumber
                },
            ];
            FormControllerUtility.setSortingHandlers(scopeObj.beneficiaryNameSortMap, scopeObj.onBeneficiaryNameClickHandler, scopeObj);
        },
        /**
         * used to perform the post show activities
         *
         */
        postShow: function() {
            //this.view.btnAllPayees.setFocus(true);
            this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.frame.height - this.view.flxFooter.frame.height + "dp";
            applicationManager.getNavigationManager().applyUpdates(this);
            applicationManager.executeAuthorizationFramework(this);
            this.accessibilityFocusSetup();
        },
        showAddBeneficiaryFlx: function() {
            this.view.flxRight.setVisibility(true);
        },
        hideAddBeneficiaryFlx: function() {
            this.view.flxRight.setVisibility(false);
        },
        /**
         * Set foucs handlers for skin of parent flex on input focus 
         */
        accessibilityFocusSetup: function() {
            let widgets = [
                [this.view.txtSearch, this.view.flxtxtSearchandClearbtn]
            ]
            for (let i = 0; i < widgets.length; i++) {
                CommonUtilities.setA11yFoucsHandlers(widgets[i][0], widgets[i][1], this)
            }
        },
        //UI Code
        /**
         * onBreakpointChange : Handles ui changes on .
         * @member of {frmConfirmtransferController}
         * @param {integer} width - current browser width
         * @return {}
         * @throws {}
         */
        onBreakpointChange: function(form, width) {
            var scope = this;
            FormControllerUtility.setupFormOnTouchEnd(width);
            responsiveUtils.onOrientationChange(this.onBreakpointChange);
            this.view.customheadernew.onBreakpointChangeComponent(width);
            this.view.customfooternew.onBreakpointChangeComponent(width);
            this.view.CustomPopupLogout.onBreakpointChangeComponent(scope.view.CustomPopupLogout, width);
            this.view.CustomPopupCancel.onBreakpointChangeComponent(scope.view.CustomPopupCancel, width);
        },

        /**
         * Manage payee biller name sorting handler
         * @param {object} event
         * @param {object} data
         */
        onBeneficiaryNameClickHandler: function(event, data) {
            FormControllerUtility.showProgressBar(this.view);
            this.presenter.manageBeneficiaryPagination(data);
        },
        /**
         * method used to enable or disable the clear button.
         * @param {object} event event
         */
        onTxtSearchKeyUp: function() {
            var scopeObj = this;
            var searchKeyword = scopeObj.view.txtSearch.text.trim();
            if (searchKeyword.length > 0) {
                scopeObj.view.flxClearBtn.setVisibility(true);
            } else {
                scopeObj.view.flxClearBtn.setVisibility(false);
            }
            this.view.flxSearchBeneficiaries.forceLayout();
        },
        /**
         * method to handle the search payee functionality
         */
        onSearchBtnClick: function() {
            var scopeObj = this;
            var searchKeyword = scopeObj.view.txtSearch.text.trim();
            var records = this.collectSelectedData();
            var allData = this.view.segmentBeneficiaries.data;
            scopeObj.presenter.searchBeneficiaries({
                'searchKeyword': searchKeyword
            }, records, allData);
        },
        /**
         * method used to call the service.
         */
        onSearchClearBtnClick: function() {
            var scopeObj = this;
            scopeObj.view.txtSearch.text = "";
            scopeObj.view.flxClearBtn.setVisibility(false);
            var records = this.collectSelectedData();
            var allData = this.view.segmentBeneficiaries.data;
            scopeObj.presenter.searchBeneficiaries({
                'searchKeyword': ""
            }, records, allData);
        },

        bindManagePayeeData: function(data, selectedData) {
            this.setManageBeneficiariesSegmentData({
                "manageBeneficiary": data.manageBeneficiary ? data.manageBeneficiary : data,
                "noOfRecords": data.noOfRecords,
                "selectedList": selectedData,
                "noHistory": data.noHistory
            });
            FormControllerUtility.updateSortFlex(this.beneficiaryNameSortMap, data.noOfRecords);
        },
        /**
         *  Method to set data for Manage Beneficiary Segment
         * @param {object}  data list of payees
         */
        setManageBeneficiariesSegmentData: function(data) {
            var scopeObj = this;
            this.view.btnBulkConfirm.onClick = this.onContinueClicked.bind(this, data.selectedList);
            beneficiariesData = data.manageBeneficiary;
            // beneficiariesData = beneficiariesData.filter(function (data) {
            //   return data.isInternationalAccount === false; 
            // })
            if (data.noHistory) {
                this.view.rtxNoPaymentMessage.text = "You have no domestic beneficiaries";
                this.view.flxSearchBeneficiaries.setVisibility(false);
                this.view.flxSegmentWithHeader.setVisibility(false);
                this.view.flxPagination.setVisibility(false);
                this.view.flxNoPayment.setVisibility(true);
                this.view.forceLayout();
                return;
            } else if (beneficiariesData.length === 0) {
                this.view.rtxNoPaymentMessage.text = "You have no domestic beneficiaries with the search criteria";
                this.view.flxSegmentWithHeader.setVisibility(false);
                this.view.flxPagination.setVisibility(false);
                this.view.flxSearchBeneficiaries.setVisibility(true);
                this.view.flxNoPayment.setVisibility(true);
                this.view.forceLayout();
            } else {
                this.view.lblChecbox.text = "D";
                this.view.flxNoPayment.setVisibility(false);
                this.view.flxSegmentWithHeader.setVisibility(true);
                this.view.flxPagination.setVisibility(true);
                this.view.flxSearchBeneficiaries.setVisibility(true);
                this.view.flxContainerNew.setVisibility(true);
                this.view.forceLayout();
            }
            var dataMap = {
                "flxBeneficiariesWrapper": "flxBeneficiariesWrapper",
                "flxCheckbox": "flxCheckbox",
                "lblChecbox": "lblChecbox",
                "lblPayeeName": "lblPayeeName",
                "lblBankName": "lblBankName",
                "lblAccountNumber": "lblAccountNumber",
                "lblSeparatorBottom": "lblSeparatorBottom",
                "lblBankNameWithAccountNumber": "lblBankNameWithAccountNumber",
                "id": "id",
                "isSelected": "isSelected",
                "isInstantPayAvailable": "isInstantPayAvailable"
            };
            if (data.manageBeneficiary.noMoreRecords) {
                scopeObj.view.imgPaginationNext.src = ViewConstants.IMAGES.PAGINATION_NEXT_INACTIVE;
                scopeObj.view.flxPaginationNext.onClick = null;
                kony.ui.Alert(kony.i18n.getLocalizedString("i18n.navigation.norecordsfound"));
                return;
            }
            if (data.noOfRecords) {
                scopeObj.setPagination({
                    'show': true,
                    'offset': data.noOfRecords.offset,
                    'limit': data.noOfRecords.limit,
                    'recordsLength': data.manageBeneficiary.length,
                    'text': ""
                }, scopeObj.prevManageBeneficiaries, scopeObj.nextManageBeneficiaries);
            } else {
                scopeObj.setPagination({
                    'show': false
                });
            }
            if (beneficiariesData.length > 0) {
                var manageBeneficiaries = beneficiariesData.map(function(dataItem, index) {
                    var manageBeneficiary = {
                        "lblSeparatorBottom": {
                            "text": ""
                        },
                        "lblPayeeName": {
                            "text": dataItem.beneficiaryName ? dataItem.beneficiaryName : (dataItem.nickName ? dataItem.nickName : dataItem.accountNumber),
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.beneficiaryName
                            }
                        },
                        "lblBankName": {
                            "text": dataItem.bankName ? dataItem.bankName : "",
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.bankName
                            }
                        },
                        "lblAccountNumber": {
                            "text": dataItem.accountNumber,
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.accountNumber
                            }
                        },
                        "lblBankNameWithAccountNumber": {
                            "text": dataItem.bankName ? (dataItem.bankName + " | " + dataItem.accountNumber) : dataItem.accountNumber,
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.bankName + " | " + dataItem.accountNumber
                            }
                        },
                        "lblChecbox": {
                            "text": "D"
                        },
                        "flxCheckbox": {
                            "height": "30dp",
                            "onClick": scopeObj.toggleCheckbox.bind(scopeObj, index)
                        },
                        "flxBeneficiariesWrapper": {
                            "height": "50dp",
                            "skin": "sknflxffffffnoborder"
                        },
                        "id": {
                            "text": dataItem.Id
                        },
                        "isSelected": false,
                        "isInstantPayAvailable": dataItem.isSameBankAccount === "false" && dataItem.isInternationalAccount === "false"
                    };
                    return manageBeneficiary;
                });
                this.view.flxCheckbox.onClick = this.checkAllBoxes.bind(this);
            }
            // if(beneficiariesData.length < 10)
            //   this.view.tablePagination.setVisibility(false);'
            this.view.segmentBeneficiaries.widgetDataMap = dataMap;
            this.view.segmentBeneficiaries.setData(manageBeneficiaries);
            if (data.selectedList.length > 0)
                this.showSelectedData(data.selectedList, beneficiariesData.length);
            FormControllerUtility.hideProgressBar(this.view);
            this.view.forceLayout();
        },

        /**
         * used to set pagination.
         * @param {obejct} data list of records
         * @param {function} previousCallBack -- previous button handler
         * @param {function}  nextCallBack -- next button handler
         */
        setPagination: function(data, previousCallBack, nextCallBack) {
            var scopeObj = this;
            if (data && data.show === true) {
                scopeObj.view.flxPagination.setVisibility(true);
                var offset = data.offset;
                var limit = data.limit || OLBConstants.PAGING_ROWS_LIMIT;
                var recordsLength = data.recordsLength;
                var start = 1 + (offset - 1) * 10;
                CommonUtilities.setText(this.view.lblPagination, (start) + " - " + (start + recordsLength - 1) + " " + data.text, CommonUtilities.getaccessibilityConfig());
                if (data.offset > 1) {
                    scopeObj.view.imgPaginationPrevious.src = ViewConstants.IMAGES.PAGINATION_BACK_ACTIVE;
                    scopeObj.view.flxPaginationPrevious.onClick = previousCallBack;
                } else {
                    scopeObj.view.imgPaginationPrevious.src = ViewConstants.IMAGES.PAGINATION_BACK_INACTIVE;
                    scopeObj.view.flxPaginationPrevious.onClick = null;
                }
                if (recordsLength >= OLBConstants.PAGING_ROWS_LIMIT) {
                    scopeObj.view.imgPaginationNext.src = ViewConstants.IMAGES.PAGINATION_NEXT_ACTIVE;
                    scopeObj.view.flxPaginationNext.onClick = nextCallBack;
                } else {
                    scopeObj.view.imgPaginationNext.src = ViewConstants.IMAGES.PAGINATION_NEXT_INACTIVE;
                    scopeObj.view.flxPaginationNext.onClick = null;
                }
            } else {
                scopeObj.view.flxPagination.setVisibility(false);
                scopeObj.view.flxPaginationPrevious.onClick = null;
                scopeObj.view.flxPaginationNext.onClick = null;
            }
        },
        /**
         * fetches the previous Beneficiaries records
         */
        prevManageBeneficiaries: function() {
            var scopeObj = this;
            var records = this.collectSelectedData();
            var allData = this.view.segmentBeneficiaries.data;
            scopeObj.presenter.fetchPreviousBeneficiaries(records, allData);
        },
        /**
         * fetches the next Beneficiaries records
         */
        nextManageBeneficiaries: function() {
            var scopeObj = this;
            var records = this.collectSelectedData();
            var allData = this.view.segmentBeneficiaries.data;
            scopeObj.presenter.fetchNextBeneficiaries(records, allData);
        },

        checkAllBoxes: function() {
            var data = this.view.segmentBeneficiaries.data;
            if (this.view.lblChecbox.text === "D") {
                this.view.lblChecbox.text = "C";
                CommonUtilities.enableButton(this.view.btnBulkConfirm);
                for (var record in data) {
                    data[record].lblChecbox.text = "C";
                    data[record].isSelected = true;
                }
            } else {
                this.view.lblChecbox.text = "D";
                CommonUtilities.disableButton(this.view.btnBulkConfirm);
                for (var record in data) {
                    data[record].lblChecbox.text = "D";
                    data[record].isSelected = false;
                }
            }
            this.view.segmentBeneficiaries.setData(data);
        },

        showSelectedData: function(selectedList, length) {
            var self = this;
            var data = this.view.segmentBeneficiaries.data;
            var count = 0;
            data.filter(function(value, index) {
                for (var record in selectedList) {
                    if (selectedList[record].id === value.id.text) {
                        count++;
                        value.lblChecbox.text = 'C';
                        value.isSelected = true;
                        self.view.segmentBeneficiaries.setDataAt(value, index);
                    }
                }
            });
            if (count === length) this.view.lblChecbox.text = "C";
        },

        toggleCheckbox: function(index) {
            var data = this.view.segmentBeneficiaries.data;
            CommonUtilities.disableButton(this.view.btnBulkConfirm);
            if (data[index].lblChecbox.text === 'D') {
                data[index].lblChecbox.text = 'C';
                data[index].isSelected = true;
            } else {
                data[index].lblChecbox.text = 'D';
                data[index].isSelected = false;
            }
            this.view.segmentBeneficiaries.setDataAt(data[index], index);
            for (var record in data) {
                if(data[record].lblChecbox.text === "C"){
                    CommonUtilities.enableButton(this.view.btnBulkConfirm);
                    break;
                }
            }
            this.view.forceLayout();
        },

        collectSelectedData: function() {
            var data = this.view.segmentBeneficiaries.data;
            var records = [];
            var self = this;
            var isInputSelected = false;
            for (var record in data) {
                if (data[record].lblChecbox.text === "C") {
                    isInputSelected = true;
                    records.push({
                        "lblBeneficiaryName": data[record].lblPayeeName.text,
                        "lblBankName": data[record].lblBankName.text,
                        "accountNumber": data[record].lblAccountNumber.text,
                        "lblBankNameWithAccountNumber": data[record].lblBankNameWithAccountNumber.text,
                        "id": data[record].id.text,
                        "isSelected": data[record].isSelected,
                        "isInstantPayAvailable": data[record].isInstantPayAvailable
                    });
                }
            }
            return records;
        },

        onContinueClicked: function(data) {
            var records = this.collectSelectedData();
            if (records.length > 0) {
                this.hideErrorFlex();
                var allData = this.view.segmentBeneficiaries.data;
                this.presenter.showPayMultipleBeneficiaries({
                    "selectedBeneficiaries": records,
                    "allData": allData
                });
            } else {
                if (data.length > 0) {
                    this.hideErrorFlex();
                    this.presenter.showPayMultipleBeneficiaries({
                        "selectedBeneficiaries": data
                    });
                } else {
                    var errMsg;
                    if (this.view.flxNoPayment.isVisible === true) errMsg = kony.i18n.getLocalizedString("i18n.TransfersEur.YouHaveNoSavedBeneficiaries");
                    else errMsg = kony.i18n.getLocalizedString("i18n.Transfers.PleaseSelectAtLeastOneBeneficiaryToContinue");
                    this.setServerError(errMsg);
                }
            }
        },

        setServerError: function(errorMessage) {
            this.view.rtxDowntimeWarning.text = errorMessage;
            this.view.flxDowntimeWarning.setVisibility(true);
            this.view.flxFormContent.forceLayout();
        },

        hideErrorFlex: function() {
            this.view.flxDowntimeWarning.setVisibility(false);
        }
    };
});