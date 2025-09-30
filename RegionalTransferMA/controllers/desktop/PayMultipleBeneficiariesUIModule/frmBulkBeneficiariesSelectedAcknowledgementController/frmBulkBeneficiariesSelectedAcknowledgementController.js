/**
 * Description of Module representing a Confirm form.
 * @module frmBulkBillPayAcknowledgementController
 */
define(['CommonUtilities', 'OLBConstants', 'ViewConstants', 'FormControllerUtility'], function(CommonUtilities, OLBConstants, ViewConstants, FormControllerUtility) {
    var responsiveUtils = new ResponsiveUtils();
    var orientationHandler = new OrientationHandler();

    return /** @alias module:frmBulkPayeesController */ {
        init: function() {
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onDeviceBack = function() {};
            this.view.onBreakpointChange = this.onBreakpointChange;
            this.presenter = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayMultipleBeneficiariesUIModule").presentationController;
            if (kony.application.getCurrentBreakpoint() == 640 || kony.application.getCurrentBreakpoint() == 1024) {
                this.view.flxPrintBulkPay.setVisibility(false);
            }
            if (CommonUtilities.isPrintEnabled()) {
                this.view.lblPrintfontIcon.setVisibility(true);
                this.view.lblPrintfontIcon.onTouchStart = this.onClickPrint;
            } else {
                this.view.lblPrintfontIcon.setVisibility(false);
            }
        },
        onBreakpointChange: function(form, width) {
            var scope = this;
            this.view.CustomPopupLogout.onBreakpointChangeComponent(scope.view.CustomPopupLogout, width);
            this.view.CustomPopupCancel.onBreakpointChangeComponent(scope.view.CustomPopupCancel, width);
            FormControllerUtility.setupFormOnTouchEnd(width);
            responsiveUtils.onOrientationChange(this.onBreakpointChange);
            this.view.customheadernew.onBreakpointChangeComponent(width);
            this.view.customfooternew.onBreakpointChangeComponent(width);
        },
        preShow: function() {
            //       this.view.customheadernew.activateMenu("Bill Pay", "Pay a Bill");
            var self = this;
            this.view.btnMakeAnotherPayment.onClick = function() {
                self.presenter.showPayMultipleBeneficiaries({
                    "showManageBeneficiaries": true
                });
            }
            this.view.btnViewPaymentActivity.onClick = function () {
                applicationManager.getModulesPresentationController({ appName: 'UnifiedTransferMA', moduleName: 'ManageActivitiesUIModule' }).showTransferScreen({
                    context: "PastPayments"
                });
            };
        },
        postShow: function() {
            var scopeObj = this;
            this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.frame.height - this.view.flxFooter.frame.height + "dp";
            applicationManager.getNavigationManager().applyUpdates(this);
        },
        /**
         * updateFormUI - the entry point method for the form controller.
         * @param {Object} viewModel - it contains the set of view properties and keys.
         */
        updateFormUI: function(uiDataMap) {
            if (uiDataMap.isLoading) {
                FormControllerUtility.showProgressBar(this.view);
            } else {
                FormControllerUtility.hideProgressBar(this.view);
            }
            if (uiDataMap.paymentResponse) {
                this.showPaymentData(uiDataMap);
            }
            if (uiDataMap.serverError) {
                this.setServerError(uiDataMap.serverError);
            }
        },
        /**
         * method to print acknowledgement page
         */
        onClickPrint: function() {
            var scopeObj = this;
            var viewModel = {
                module: scopeObj.view.lblBulkBillPayAcknowledgement.text,
                details: scopeObj.view.segBill.data,
                printCallback: function() {
                    applicationManager.getNavigationManager().navigateTo("frmBulkBillPayAcknowledgement");
                }
            }
            scopeObj.presenter.showPrintPage({
                transactionList: viewModel
            });
        },

        setServerError: function(errorMessage) {
            this.view.rtxDowntimeWarning.text = errorMessage;
            this.view.flxDowntimeWarning.setVisibility(true);
            this.view.flxFormContent.forceLayout();
        },

        showPaymentData: function(data) {
            var beneficiaries = data.selectedBeneficiaries;
            var serviceResponse = data.paymentResponse.response;
            var widgetDataMap = {
                "flxHeaderBulkBeneficiaries": "flxHeaderBulkBeneficiaries",
                "imgAcknowledgement": "imgAcknowledgement",
                "lblRefernceNumber": "lblRefernceNumber",
                "lblPayee": "lblPayee",
                "lblPayeeAddress": "lblPayeeAddress",
                "lblSendOn": "lblSendOn",
                "lblAmountTransferred": "lblAmountTransferred",
                "lblDownload": "lblDownload"
            };
            var paymentData = beneficiaries.map(function(dataItem, index) {
                return {
                    "lblRefernceNumber": {
                        "text": serviceResponse[index].referenceId ? serviceResponse[index].referenceId : "N/A"
                    },
                    "imgAcknowledgement": {
                        "src": serviceResponse[index].referenceId ? "success_green.png" : "info.png"
                    },
                    "lblPayee": {
                        "text": dataItem.lblBeneficiaryName
                    },
                    "lblPayeeAddress": {
                        "text": dataItem.lblBankNameWithAccountNumber
                    },
                    "lblSendOn": {
                        "text": dataItem.paymentType
                    },
                    "lblAmountTransferred": {
                        "text": dataItem.lblAmount
                    }
                }
            });
            for (var index in serviceResponse) {
                if (serviceResponse[index].errcode || serviceResponse[index].errid) {
                    this.setServerError(kony.i18n.getLocalizedString("i18n.Transfers.OneOrMorePaymentsFailed"));
                }
            }
            this.view.lblAmountValue.text = data.totalAmount;
            this.view.segBill.widgetDataMap = widgetDataMap;
            this.view.segBill.setData(paymentData);
        }
    }
});