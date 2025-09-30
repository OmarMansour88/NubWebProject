/**
 * Description of Module representing a Confirm form.
 * @module frmMakePaymentController
 */
define(['CommonUtilities', 'OLBConstants', 'ViewConstants', 'FormControllerUtility'], function(CommonUtilities, OLBConstants, ViewConstants, FormControllerUtility) {
    var fromAccountSaerchTerm = '';
    var toAccountSearchTerm = '';
    var fromAccounts = [];
    var toAccounts = [];
    var filesToBeUploaded = [];
    var fileTypeArray = [];
    var base64Content = [];
    var count = 0;
    var attachments = [];
    var uploadedAttachments = [];
    var existingAttachments = [];
    var deletedAttachments = [];
    var editMode = false;
    var modifiedCurrency;
    var scheduledMode;
    var isOwnAccountsFlow = false;
    var preSelectAccountFrom = null;
    var preSelectAccountTo = null;
    var responsiveUtils = new ResponsiveUtils();
    var orientationHandler = new OrientationHandler();
    var isPaidBy = '';
    var new_benificiary = false;
    var oneTimeSameBank = false;
    var bank_name;
    var bank_country;
    var isSameBankAccount;
    var isInternationalAccount;
    var paymentType = '';
	var sameBankAccountCurrencyCode;
    var transactionCurrency;
	var fromScroll = false;
    var toScroll = false;
    var currency = {
        'EUR': "€ EURO",
        'GBP': "£ GBP",
        'USD': "$ USD",
        'JPY': "¥ JPY",
        'RUB': "₽ RUB",
        'LYD': "LYD",
    };
    var frequencies = {
        'Once': "i18n.transfers.frequency.once",
        'Daily': "i18n.Transfers.Daily",
        'Weekly': "i18n.Transfers.Weekly",
        'BiWeekly': "i18n.Transfers.EveryTwoWeeks",
        'Monthly': "i18n.Transfers.Monthly",
        'Quarterly': "i18n.Transfers.Quaterly",
        'Half Yearly': "i18n.Transfers.HalfYearly",
        'Yearly': "i18n.Transfers.Yearly"
    };
    var forHowLong = {
        ON_SPECIFIC_DATE: "i18n.transfers.lbxOnSpecificDate"
        // NO_OF_RECURRENCES: "i18n.transfers.lblNumberOfRecurrences"
    };
    var fromSeg = true,
        toSeg = true;
    return {
        bankDate: null,
        cutOffFlow: null,
        isSingleCustomerProfile: true,
        primaryCustomerId: [],
        profileAccess: "",
        init: function() {
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onDeviceBack = function() {};
            this.view.onBreakpointChange = this.onBreakpointChange;
            this.ManageActivitiesPresenter = applicationManager.getModulesPresentationController({"appName" : "UnifiedTransferMA", "moduleName" : "ManageActivitiesUIModule"});
            this.presenter = applicationManager.getModulesPresentationController({"appName" : "RegionalTransferMA", "moduleName" : "TransferEurUIModule"});
            this.initActions();
        },
        initActions: function() {
            var self = this;
            this.view.flxDialogs.setVisibility(false);
            this.view.txtTransferFrom.onKeyUp = this.onKeyUpFrom;
            this.view.txtTransferTo.onKeyUp = this.onKeyUpTo;
            this.view.txtAccountNumber.onEndEditing = this.validateIBAN.bind(this);
            this.view.txtAccountNumber.onBeginEditing = this.normalizeAccountTextbox.bind(this);
            this.view.flxPaymentActivities.onClick = function() {
                self.ManageActivitiesPresenter.showTransferScreen({
                    context: "ScheduledPayments"
                });
            };
            this.view.flxManageBeneficiaries.onClick = function() {
                self.ManageActivitiesPresenter.showTransferScreen({
                    context: "ManageBeneficiaries"
                });
            };
            this.view.imgAddAttachment.onTouchEnd = this.browseSupportingDoc;
            filesToBeUploaded = [];
            uploadedAttachments = [];
            attachments = [];
            this.view.flxAttachmentUploadError.setVisibility(false);
            this.renderCalendars();
            this.view.BtnLookup.onClick = function() {
                self.view.flxLookup.setVisibility(true);
                self.view.flxNoResults.setVisibility(false);
                self.view.txtBankName.text = '';
                self.view.txtCity1.text = '';
                self.view.txtCountry1.text = '';
                self.view.segResults.setData([]);
            }
            this.view.flxCross.onClick = function() {
                self.view.flxLookup.setVisibility(false);
            }
            this.view.btnModify.onClick = function() {
                if (editMode && scheduledMode) {
                    self.ManageActivitiesPresenter.showTransferScreen({
                        context: "ScheduledPayments"
                    });
                } else if (editMode && !scheduledMode) {
                    self.ManageActivitiesPresenter.showTransferScreen({
                        context: "PastPayments"
                    });
                } else {
                    var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AccountsUIModule", "appName" : "HomepageMA"});
                    accountsModule.presentationController.showAccountsDashboard();
                }
            };
            this.view.btnConfirm.onClick = function() {
                this.presenter.showConfirmation();
            }.bind(this);
            this.restrictSpecialCharacters();

            this.view.btnSearch.onClick = self.searchSwift;
            this.view.btnClearSearch.onClick = self.clearSearch;
            this.view.segResults.onRowClick = this.segRowClick;

        },



        setSkinToCalendar: function(widgetId) {
            widgetId.skin = ViewConstants.SKINS.COMMON_CALENDAR_NOERROR;
            // this.hideFieldError();
        },

        removeAttachments: function(data) {
            for (var i = 0; i < filesToBeUploaded.length; i++) {
                if (filesToBeUploaded[i] === data.filename.text) {
                    filesToBeUploaded.splice(i, 1);
                    if (data.fileID) {
                        deletedAttachments.push(data.fileID);
                    } else {
                        attachments.splice(i, 1);
                        uploadedAttachments.splice(i, 1);
                    }
                    break;
                }
            }
            this.view.flxAttachmentUploadError.setVisibility(false);
            this.setAttachmentsDataToSegment();
        },

        closeAttachmentsPopup: function() {
            this.view.flxDialogs.setVisibility(false);
            this.view.flxAttachmentsPopup.setVisibility(false);
        },

        closeDropDownOnTouchDevice: function() {
            if (kony.application.getCurrentBreakpoint() === 640 ||
                orientationHandler.isMobile ||
                kony.application.getCurrentBreakpoint() === 1024 ||
                orientationHandler.isTablet) {
                this.view.flxToSegment.setVisibility(false);
            }
        },

        preShow: function() {
            this.isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
            this.primaryCustomerId = applicationManager.getUserPreferencesManager().primaryCustomerId;
            this.profileAccess = applicationManager.getUserPreferencesManager().profileAccess;
            var self = this;
            this.accountToIsPreSelectedFlow = false;
            this.viewsVisibilityStore = null;
            fromAccountSaerchTerm = "";
            toAccountSearchTerm = "";
            editMode = false;
            this.selectedFromAccount = null;
            this.selectedToAccount = null;
            preSelectAccountFrom = null;
            preSelectAccountTo = null;
            attachments = [];
            filesToBeUploaded = [];
            uploadedAttachments = [];
            this.view.lblCount2.setVisibility(false);
            this.view.lblNew.setVisibility(false);
            this.hideLoanView();
            this.view.lbxFrequency.masterData = this.getFrequencies();
            this.view.flxFeePaidBy.setVisibility(false);
            this.view.lbxpay.masterData = this.getForHowLong();
            this.view.lbxpay.selectedKey = this.view.lbxpay.masterData[0][0];
            this.view.BtnLookup.setVisibility(false);
            this.view.calSendOnNew.onSelection = this.setSkinToCalendar.bind(this, this.view.calSendOnNew);
            this.view.lbxCurrency.masterData = this.onCurrencyChange();
            this.view.lblCount1.text = "140";
            this.view.lblCount2.text = "18";
            this.limitLengthAndUpdateIndicator(140, this.view.lblCount1, this.view.txtPaymentReference);
            this.limitLengthAndUpdateIndicator(18, this.view.lblCount2, this.view.txtBeneficiaryNickName);
            this.view.txtAccountNumber.onKeyUp = this.checkValidityMakeFastTransferForm.bind(this);
            this.view.txtSwift.onKeyUp = this.checkValidityMakeFastTransferForm.bind(this);
            this.onClickRadioButton(this.view.flxRadioBtn);
            this.view.segAddedDocuments.setData([]);
            this.view.flxRadioBtn1.onClick = this.onClickMeRadioButton.bind(this);
            this.view.flxRadioBtn2.onClick = this.onClickBeneficiaryRadioButton.bind(this);
            this.view.flxRadioBtn3.onClick = this.onClickShareRadioButton.bind(this);
            this.view.lblRadioBtn1.onTouchEnd = this.onClickMeRadioButton.bind(this);
            this.view.lblRadioBtn2.onTouchEnd = this.onClickBeneficiaryRadioButton.bind(this);
            this.view.lblRadioBtn3.onTouchEnd = this.onClickShareRadioButton.bind(this);

            this.view.flxRadioBtn4.onClick = this.onClickRadioButton;
            this.view.flxRadioBtn5.onClick = this.onClickRadioButton;
            this.view.flxInstantPayment.onClick = this.onClickRadioButtonPaymentCutoff;
            this.view.flxOptionTwo.onClick = this.onClickRadioButtonPaymentCutoff;
            this.view.lblNew.onTouchEnd = this.closeDropDownOnTouchDevice;

            this.view.lblradioButton1.onTouchStart = this.onInstantPaymentonTouchStart.bind(this);
            this.view.lblradioButton2.onTouchStart = this.onNextBankingDayPaymentonTouchStart.bind(this);
            //       this.view.lbxCurrency.onSelection = this.onCurrencyChange.bind(this);
            //       this.view.lbxForHowLong.onSelection = this.onHowLongChange.bind(this);
            this.view.lbxFrequency.onSelection = this.onFrequencyChanged.bind(this, true);
            this.view.lbxpay.onSelection = this.onHowLongChange.bind(this);
            this.makeTransferAmountField = FormControllerUtility.wrapAmountField(this.view.txtAmount)
                .onKeyUp(this.checkValidityMakeFastTransferForm);
            //       this.view.calSendOnNew.onSelection = this.setSkinToCalendar.bind(this,scopeObj.view.calSendOnNew);
            //       this.view.calEndingOnNew.onSelection = this.setSkinToCalendar.bind(this,scopeObj.view.calEndingOnNew);
            //       this.makeTransferAmountField = FormControllerUtility.wrapAmountField(this.view.tbxAmount).onKeyUp(this.checkValidityMakeFastTransferForm);
            //       this.makeTransferCreditCardAmountField = FormControllerUtility.wrapAmountField(this.view.tbxAmountValue).onKeyUp(this.checkValidityMakeFastTransferForm);
            //       this.view.tbxNoOfRecurrences.onKeyUp = this.checkValidityMakeFastTransferForm.bind(this);

            this.view.flxBankOption1.onClick = this.onClickBeneficiaryBankRadioButton.bind(this);
            this.view.flxBankOption2.onClick = this.onClickBeneficiaryBankRadioButton.bind(this);
            this.view.flxBeneficiaryBank.setVisibility(false);
            this.view.flxLoadingContainerTo.setVisibility(false);
            this.view.flxToIcon.setVisibility(true);
            this.view.segTransferFrom.widgetDataMap = {
                "flxTransfersFrom": "flxTransfersFrom",
                "flxAccountListItemWrapper": "flxAccountListItemWrapper",
                "lblAccountName": "lblAccountName",
                "flxAmount": "flxAmount",
                "flxSeparator": "flxSeparator",
                "lblAmount": "lblAmount",
                "lblCurrencySymbol": "lblCurrencySymbol",
                "flxTransfersFromHeader": "flxTransfersFromHeader",
                "lblTransactionHeader": "lblTransactionHeader"
            };
            this.view.segTransferTo.widgetDataMap = {
                "flxTransfersFrom": "flxTransfersFrom",
                "flxAccountListItemWrapper": "flxAccountListItemWrapper",
                "lblAccountName": "lblAccountName",
                "flxBankName": "flxBankName",
                "flxSeparator": "flxSeparator",
                "lblAmount": "lblAmount",
                "flxTransfersFromHeader": "flxTransfersFromHeader",
                "lblTransactionHeader": "lblTransactionHeader",
                "flxFastTransfersActivate": "flxFastTransfersActivate",
                "lblContent": "lblContent",
                "lblActivePayAPerson": "lblActivePayAPerson"
            };
            this.view.flxFrom.onClick = function() {
                if (self.view.txtTransferFrom.isVisible === false) {
                    self.view.txtTransferFrom.setVisibility(true);
                    self.view.txtTransferFrom.setFocus();
                    self.view.lblSelectAccount.setVisibility(false);
                    // self.view.flxIcon.setVisibility(false);
                    // self.view.lblFromAmount.setVisibility(false);
                    // self.view.flxCancelFilterFrom.setVisibility(true);
                    // self.view.segTransferFrom.selectedRowItems ? self.fetchFromAccountsBySearch(self, self.view.segTransferFrom.selectedRowItems[0].accountID) : self.fetchFromAccountsBySearch(self);
                    //self.view.segTransferFrom.setVisibility(true);
                    self.view.flxFromSegment.setVisibility(true);
					self.view.txtTransferFrom.text= "";
                }
            };
            this.view.segTransferFrom.onRowClick = this.segFromAccountRowClick.bind(this);
            this.view.segTransferTo.onRowClick = this.segToAccountRowClick.bind(this);
            this.view.txtTransferFrom.onTouchStart = function() {
                // if (self.view.txtTransferFrom.text === ""){
                //   self.fetchFromAccountsBySearch();
                // }
                // self.view.flxIcon.setVisibility(false);
                self.view.flxFromSegment.setVisibility(true);
              	self.view.txtTransferFrom.text= "";
                self.view.flxToSegment.setVisibility(false);
                self.view.forceLayout();
            };

            this.view.txtTransferTo.onTouchStart = function() {
                // if (self.view.txtTransferTo.text === ""){
                //   self.fetchToAccountsBySearch();
                // }
                // self.view.flxToIcon.setVisibility(false);
                self.view.flxToSegment.setVisibility(true);
                self.view.flxFromSegment.setVisibility(false);
                self.view.forceLayout();
            };
            this.view.flxTo.onClick = function() {
                if (self.view.txtTransferTo.isVisible === false) {
                    self.view.txtTransferTo.setVisibility(true);
                    self.view.txtTransferTo.setFocus();
                    self.view.lblSelectAccountTo.setVisibility(false);
                    // self.view.lblToAmount.setVisibility(false);
                    // self.view.flxToIcon.setVisibility(false);
                    // self.view.flxCancelFilterTo.setVisibility(true);
                    // self.view.segTransferTo.selectedRowItems ? self.fetchToAccountsBySearch(self, self.view.segTransferTo.selectedRowItems[0].accountID) : self.fetchToAccountsBySearch(self);
                    //self.view.segTransferTo.setVisibility(true);
                    self.view.flxToSegment.setVisibility(true);
                }
            };
            this.view.flxCancelFilterTo.onClick = function() {
                self.toggleNewBeneficiary(true);
            };                    
            this.view.flxFromSegment.onScrolling = function(){
                fromScroll =  true;
            };
            this.view.flxToSegment.onScrolling = function(){
                toScroll =  true;
            };
            this.view.txtPaymentReference.onKeyUp = this.limitLengthAndUpdateIndicator.bind(this, 140, this.view.lblCount1);
            this.view.txtBeneficiaryNickName.onKeyUp = this.limitLengthAndUpdateIndicator.bind(this, 18, this.view.lblCount2);

            this.view.btnConfirm.onClick = this.submitTransfersForm.bind(this);
            this.toggleNewBeneficiary(false);
            this.checkValidityMakeFastTransferForm();
        },
        showManageBeneficiaryFlx: function() {
            this.view.flxManageBeneficiaries.setVisibility(true);
        },
        hideManageBeneficiaryFlx: function() {
            this.view.flxManageBeneficiaries.setVisibility(false);
        },
        browseSupportingDoc: function() {
            this.view.flxAttachmentUploadError.setVisibility(false);
            var config = {
                selectMultipleFiles: false,
                filter: []
            };
            kony.io.FileSystem.browse(config, this.selectedFileCallback);
            count = filesToBeUploaded.length;
        },

        getBase64: function(file, successCallback) {
            var reader = new FileReader();
            reader.onloadend = function() {
                successCallback(reader.result);
            };
            reader.readAsDataURL(file);
        },

        selectedFileCallback: function(events, files) {
            var configManager = applicationManager.getConfigurationManager();
            var maxAttachmentsAllowed = configManager.maxAttachmentsAllowed;
            this.view.flxAttachmentUploadError.setVisibility(false);
            var fileNameRegex = new RegExp("^[a-zA-Z0-9]*[.][.a-zA-Z0-9]*[^.]$");
            if (count === filesToBeUploaded.length) {
                if (files.length > 0) {
                    var fileName = files[0].file.name;
                    var extension = files[0].file.name.split('.');
                    if (extension.length > 0 && extension[extension.length - 1] !== "jpeg" && extension[extension.length - 1] !== "pdf") {
                        this.view.flxAttachmentUploadError.setVisibility(true);
                        this.view.lblAttachmentUploadError.text = kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentTypeErrorMsg1") + " " + files[0].name + " " + kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentTypeErrorMsg2");
                        this.view.forceLayout();
                        return;
                    }
                    if (files[0].file.size >= 2000000) {
                        this.view.flxAttachmentUploadError.setVisibility(true);
                        this.view.lblAttachmentUploadError.text = kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentTypeErrorMsg1") + " " + files[0].name + " " + kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentSizeErrorMsg");
                        this.view.forceLayout();
                        return;
                    } else if (fileName !== null && (!fileNameRegex.test(fileName) || extension.length>2)) {
                        this.view.flxAttachmentUploadError.setVisibility(true);
                        this.view.lblAttachmentUploadError.text = kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentFileNameErrorMsg");
                        this.view.forceLayout();
                        return;
                    } else if (filesToBeUploaded.length >= maxAttachmentsAllowed) {
                        this.view.flxAttachmentUploadError.setVisibility(true);
                        this.view.lblAttachmentUploadError.text = kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentLimitExceededErrorMsg");
                        this.view.forceLayout();
                        return;
                    } else {
                        var fileData = {};
                        filesToBeUploaded.push(files[0].name);
                        fileTypeArray.push(files[0].file.type);
                        fileData.fileName = files[0].name;
                        fileData.fileType = files[0].file.type;
                        this.getBase64(files[0].file, function(base64String) {
                            attachments = [];
                            base64String = base64String.replace("data:;base64\,", "");
                            base64String = base64String.replace("data:application\/octet-stream;base64\,", "");
                            base64String = base64String.replace("data:image\/jpeg;base64\,", "");
                            fileData.fileContents = base64String.replace("data:application/pdf;base64\,", "");
                            attachments.push(fileData);
                            var fileDataItemParsed = attachments.map(function(item) {
                                return item['fileName'] + "-" + item['fileType'] + "-" + item['fileContents'];
                            });
                            uploadedAttachments.push(fileDataItemParsed);
                            base64Content.push(fileData.fileContents);
                        });
                    }
                }
            } else
                return;
            if (filesToBeUploaded.length <= maxAttachmentsAllowed) {
                this.setAttachmentsDataToSegment();
            }
            this.view.forceLayout();
        },

        setAttachmentsDataToSegment: function() {
            this.view.flxAttachmentsList.setVisibility(true);
            var attachmentsData = [];
            for (var i = 0; i < filesToBeUploaded.length; i++) {
                attachmentsData[i] = {};
                attachmentsData[i].filename = {
                    "text": CommonUtilities.truncateStringWithGivenLength(filesToBeUploaded[i], 32),
                    "toolTip": filesToBeUploaded[i]
                };
                if (existingAttachments[i] && (existingAttachments[i].fileName == filesToBeUploaded[i])) {
                    attachmentsData[i].fileID = existingAttachments[i].fileID;
                }
                attachmentsData[i]["imgRemoveAttachment"] = {
                    "src": "bbcloseicon.png"
                };
                attachmentsData[i]["imgRemoveAttachment"].onTouchEnd = this.removeAttachments.bind(this, attachmentsData[i]);
            }
            this.view.segAddedDocuments.widgetDataMap = {
                "lblAttachedDocument": "filename",
                "imgRemoveAttachment": "imgRemoveAttachment",
                "lblAttachedDocumentID": "fileID"
            };
            this.view.segAddedDocuments.setData(attachmentsData);
            this.view.forceLayout();
        },

        downloadAttachment: function(data) {
            if (data.fileID) {
                var requestParam = {};
                requestParam.fileID = data.fileID;
                requestParam.fileName = data.filename;
                FormControllerUtility.showProgressBar(this.view);
                var url = applicationManager.getTransactionManager().getDownloadAttachmentUrl(requestParam);
                this.downloadFileFromURL(url);
            } else {
                for (var index = 0; index < filesToBeUploaded.length; index++) {
                    if (data.filename.text === filesToBeUploaded[index]) {
                        var obj = document.createElement('object');
                        obj.type = fileTypeArray[index];
                        obj.data = 'data:' + fileTypeArray[index] + ';base64,' + base64Content[index];
                        document.body.appendChild(obj);
                        var link = document.createElement('a');
                        link.download = data.filename.text;
                        link.href = 'data:application/octet-stream;base64,' + base64Content[index];
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                }
            }
        },

        downloadFileFromURL: function(fileUrl) {
            var data = {
                "url": fileUrl
            };
            CommonUtilities.downloadFile(data);
            FormControllerUtility.hideProgressBar(this.view);
        },

        onRadioLoanListener: function(selectedAccount, button) {
            if (button === "lblLoan1") {
                this.showDueAmount(selectedAccount);
            } else {
                this.showOtherAmount(selectedAccount);
            }
        },

        validateData: function() {
            var formData = this.getFormDetails();
            var formatUtilManager = applicationManager.getFormatUtilManager();
            var sendOnDate = formatUtilManager.getDateObjectFromDateComponents(formData.sendOnDateComponent);
            var endOnDate = formatUtilManager.getDateObjectFromDateComponents(formData.endOnDateComponent);
            var currDateComponent = this.bankDateObj.currentWorkingDate ? this.getDateComponents(this.bankDateObj.currentWorkingDate) : CommonUtilities.getServerDateComponent();
            var currDate = formatUtilManager.getDateObjectFromDateComponents(currDateComponent);
            if (formData.fromAccount.accountID === formData.toAccount.accountID) {
                this.showFieldError("i18n.transfers.error.cannotTransferToSame");
                return false;
            } else if (formData.frequency !== 'Once') {
                if (endOnDate.getTime() < currDate.getTime()) {
                    this.showFieldError("i18n.transfers.errors.invalidEndOnDate");
                    this.view.calEndingOnNew.skin = ViewConstants.SKINS.SKNFF0000CAL;
                    return false;
                }
                if (endOnDate.getTime() === sendOnDate.getTime()) {
                    this.showFieldError("i18n.transfers.errors.sameEndDate");
                    this.view.calEndingOnNew.skin = ViewConstants.SKINS.SKNFF0000CAL;
                    return false;
                }
                if (endOnDate.getTime() < sendOnDate.getTime()) {
                    this.showFieldError("i18n.transfers.errors.beforeEndDate");
                    this.view.calEndingOnNew.skin = ViewConstants.SKINS.SKNFF0000CAL;
                    return false;
                }
            }
            this.view.tbxNoOfRecurrences.skin = ViewConstants.SKINS.TRANSFERS_TEXTBOX_NOERROR;
            this.view.calEndingOnNew.skin = ViewConstants.SKINS.COMMON_CALENDAR_NOERROR;
            this.view.calSendOnNew.skin = ViewConstants.SKINS.COMMON_CALENDAR_NOERROR;
            this.hideFieldError();
            return true;
        },

        showNewBenficiaryUI: function() {
          this.view.flxBeneficiaryBank.setVisibility(true);
          this.view.BtnLookup.setVisibility(true);
          if(this.isModify){
            this.view.BtnLookup.setVisibility(false);
          }
            //       if (!oneTimeSameBank) {
            //         FormControllerUtility.disableTextbox(this.view.txtSwift);
            //       }
        },
        resetFormForOneTimePayment: function() {
            this.selectedToAccount = '';
            this.selectedToAccount.nickName = this.view.txtTransferTo.text;
            if (oneTimeSameBank !== true) {
                this.view.lblBankRadioBtn01.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                this.view.lblBankRadioBtn01.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
                this.view.lblBankRadioBtn02.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
                this.view.lblBankRadioBtn02.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;

            } else {
                this.view.lblBankRadioBtn01.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
                this.view.lblBankRadioBtn01.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
                this.view.lblBankRadioBtn02.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                this.view.lblBankRadioBtn02.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
                this.view.txtSwift.text = "";
                this.view.txtSwift.placeholder = "";
            }
            FormControllerUtility.enableTextbox(this.view.txtBeneficiaryNickName);
            this.view.lbxFrequency.selectedKey = 'Once';
            this.view.lbxFrequency.setEnabled(false);
            this.view.lblpay.setVisibility(false);
            this.view.lbxpay.setVisibility(false);
            this.view.lblNoOfRecOrEndingOn.setVisibility(false);
            this.view.tbxNoOfRecurrences.setVisibility(false);
            this.view.tbxNoOfRecurrences.text = '';
            this.view.flxCalEndingOn.setVisibility(false);
            this.view.flxFeePaidBy.setVisibility(true);
            this.checkShowPaym(false);
        },

        toggleNewBeneficiary: function(flag) {
            if (flag === true) {
                this.showNewBenficiaryUI();
                new_benificiary = true;
                if (!this.isModify) {
                    this.resetFormForOneTimePayment()
                }
            } else {
                new_benificiary = false;
                this.view.flxBeneficiaryBank.setVisibility(false);
                this.view.BtnLookup.setVisibility(false);
                this.view.segTransferTo.setVisibility(true);
                this.view.flxNoResultsTo.setVisibility(false);
                this.view.lbxFrequency.setEnabled(true);
            }
            this.checkValidityMakeFastTransferForm();
        },
        showFieldError: function(errorKey) {
            this.view.lblWarning.setVisibility(true);
            CommonUtilities.setText(this.view.lblWarning, kony.i18n.getLocalizedString(errorKey), CommonUtilities.getaccessibilityConfig());
        },

        isCutOffFlow: function() {
            return this.view.flxPaymemtsCutOff.isVisible === true;
        },
        /**
         * Method to send transaction data to confirmation page
         */
        submitTransfersForm: function() {
            if (this.validateData()) {
                var data = this.getFormDetails();
                data.paymentMethod = this.getPaymentMethod(data.toAccount);
                if (isOwnAccountsFlow && data.toAccount.accountType === "CreditCard") {
                    this.presenter.showConfirmation(data);
                } else {
                    this.presenter.validateTransfer(data);
                }
            }      
        },


        limitLengthAndUpdateIndicator: function(noOfCharacters, widgetLengthIndicatorLabel, textWidget) {
            var text = (textWidget === this.view.lblCount2) ? " Characters Remaining" : "";
            var expression = /^[ A-Za-z0-9.?:+/()]*$/;
            if (textWidget.text.length <= noOfCharacters && expression.test(textWidget.text)) {
                widgetLengthIndicatorLabel.text = (noOfCharacters - textWidget.text.length) + text;
            } else {
              textWidget.text = textWidget.text.replace(/[^a-zA-Z0-9.?:/()+ ]/g, "");
            }
        },
	
        getPaymentMedium: function(toAccount, frequency) {
            if (this.isCutOffFlow() && this.cutOffFlow === "choice" && this.view.lblradioButton1.text === ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO) {
                return kony.i18n.getLocalizedString("i18n.TransfersEur.InstantPayment")
            } else {
                if (toAccount && toAccount.isInternationalAccount === "false" && toAccount.isSameBankAccount === "false" && frequency === "Once") {
                    return this.view.lblRadioBtn4.text === ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO ? kony.i18n.getLocalizedString("i18n.TransfersEur.InstantPayment") : kony.i18n.getLocalizedString("i18n.TransfersEur.NormalPayment");
                } else {
                    // Always falling back to Instant payment. 
                    return kony.i18n.getLocalizedString("i18n.TransfersEur.InstantPayment");
                }
            }
        },
        /**
         * Method to get Payment Method value
         * @param {Object} toAccount contains to Account details
         */
        getPaymentMethod: function(toAccount) {
            if (isOwnAccountsFlow) return "Within Bank";
            if (toAccount) {
                if (toAccount.isInternationalAccount === "false" && toAccount.isSameBankAccount === "false") {
                    return "Domestic";
                } else if (toAccount.isInternationalAccount === "true") {
                    return "International";
                } else {
                    return "Within Bank";
                }
            }
        },

        onClickRadioButtonPaymentCutoff: function(radioButton) {
            var self = this;
            var selectedButton;
            var allRadioButtions = ["lblradioButton1", "lblradioButton2"];
            if (radioButton && radioButton.widgets()) {
                selectedButton = radioButton.widgets()[0].id;
            } else {
                return;
            }
            var selectRadioButton = function(button) {
                var RadioBtn = self.view[button];
                RadioBtn.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
                RadioBtn.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
            }
            var unSelectRadioButton = function(button) {
                var RadioBtn = self.view[button];
                RadioBtn.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                RadioBtn.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
            }
            allRadioButtions.forEach(function(button) {
                if (button === selectedButton) {
                    selectRadioButton(button);
                } else {
                    unSelectRadioButton(button);
                }
            });
        },

        getNextWorkingDay: function() {
            return applicationManager.getFormatUtilManager().getDateObjectFromCalendarString(this.bankDate.nextWorkingDate, "yyyy-mm-dd").format("d/m/yy");
        },

        getSendOnDate: function() {
            if (this.isCutOffFlow() && (this.cutOffFlow === "nextday" || this.view.lblradioButton2.text === ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO)) {
                return this.getNextWorkingDay();
            } else {
                return this.view.calSendOnNew.formattedDate;
            }
        },
        getServiceName: function(isOneTimePayment,isOwnAccountsFlow, isInternationalAccount, isSameBankAccount) {
//             if (!isOneTimePayment) {
//                 return "";
//             }
			if(isOwnAccountsFlow){
                return "TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE"
            }
            if (isSameBankAccount === "true") {
                return "INTRA_BANK_FUND_TRANSFER_CREATE"
            }
            if (isInternationalAccount === "true") {
                return "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE"
            }
            return "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE";
        },

        getFormDetails: function() {
            var formDetails = {};
            var fileAttachments = uploadedAttachments.toString();
            if (this.selectedToAccount) {
                formDetails.toAccount = this.getToAccount(this.selectedToAccount.accountNumber || this.selectedToAccount.accountID);
            } else if (preSelectAccountTo) {
                formDetails.toAccount = preSelectAccountTo;
            } else {
                formDetails.toAccount = ({
                    nickName: this.view.txtBeneficiaryNickName.text.trim(),
                    accountNumber: this.view.txtAccountNumber.text.trim(),
                    accountType: "Savings",
                    beneficiaryName: this.view.txtTransferTo.text.trim(),
                    swiftCode: this.view.txtSwift.text,
                    IBAN: this.view.txtAccountNumber.text.trim(),
                    currencyCode: this.view.lbxCurrency.selectedKey,
                    bankCountry: bank_country,
                    bankName: bank_name
                });
                if (this.view.lblBankRadioBtn01.text === ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO) {
                    formDetails.toAccount["isSameBankAccount"] = "true";
                    formDetails.toAccount["isInternationalAccount"] = "false";
                } else {
                    formDetails.toAccount["isSameBankAccount"] = isSameBankAccount;
                    formDetails.toAccount["isInternationalAccount"] = isInternationalAccount;
                }
            }
            if (this.selectedFromAccount) {
                formDetails.fromAccount = this.getFromAccount(this.selectedFromAccount.accountID);
            } else if (preSelectAccountFrom) {
                formDetails.fromAccount = preSelectAccountFrom;
            }
            formDetails.accountNumber = this.view.txtAccountNumber.text.trim();
            formDetails.swiftCode = this.view.txtSwift.text;
            formDetails.currency = this.view.lbxCurrency.selectedKey;
            formDetails.amount = this.deFormatAmount(this.view.txtAmount.text);
            formDetails.frequency = this.view.lbxFrequency.selectedKey;
            formDetails.addressLine1 = this.view.txtAddressLine01.text.trim();
            formDetails.addressLine2 = this.view.txtAddressLine02.text.trim();
            formDetails.supportedDocuments = filesToBeUploaded;
            formDetails.supportedDocumentObjects = fileAttachments;
            formDetails.deletedDocuments = deletedAttachments.toString();
            formDetails.oneTimeSameBank = oneTimeSameBank;

            formDetails.paymentMedium = this.getPaymentMedium(formDetails.toAccount, formDetails.frequency);
            formDetails.city = this.view.txtCity.text.trim();
            if (isOwnAccountsFlow && formDetails.toAccount && (formDetails.toAccount.accountType === "Loan" || formDetails.toAccount.accountType === "CreditCard")) {
                formDetails.sendOnDate = this.view.calSendOnLoans.formattedDate;
                formDetails.paymentType = paymentType;
                formDetails.accountDetails = this.accountDetails;
            } else {
                formDetails.sendOnDate = this.getSendOnDate();
            }
            formDetails.sendOnDateComponent = this.view.calSendOnNew.dateComponents;
            formDetails.EndingVisbility = this.view.lbxFrequency.selectedKey !== "Once" ? true : false;
            formDetails.EndingOnDate = this.view.calEndingOnNew.formattedDate;
            formDetails.paymentReference = this.view.txtPaymentReference.text.trim();
            formDetails.postCode = this.view.txtPostCode.text.trim();
            formDetails.country = this.view.txtCountry.text.trim();
            formDetails.endOnDate = this.view.calEndingOnNew.formattedDate;
            formDetails.endOnDateComponent = this.view.calEndingOnNew.dateComponents;
            formDetails.isEditMode = editMode;
            formDetails.isScheduled = scheduledMode;
            formDetails.isInternational = isInternationalAccount;
            formDetails.isOwnAccount = isOwnAccountsFlow;
            formDetails.oneTimePayment = new_benificiary;
            formDetails.serviceName = this.getServiceName(new_benificiary, isOwnAccountsFlow,isInternationalAccount, isSameBankAccount);
            //add label paid to data 

            formDetails.isPaidBy = isPaidBy;
            return formDetails;
        },
        /** Manages the search in To Accounts
         * @param  {String} data search string in case of pre-selected accounts
         */
        fetchToAccountsBySearch: function(context, data) {
            if (this.view.txtTransferTo.text === "") {
                this.view.flxCancelFilterTo.setVisibility(false);
            } else {
                this.view.flxCancelFilterTo.setVisibility(true);
            }
            var searchString = this.view.txtTransferTo.text;
            if (data) {
                searchString = data;
            }
            if (this.view.segTransferFrom.selectedRowItems.length) {
                var accountId = this.view.segTransferFrom.selectedRowItems[0].accountID;
            }
            this.view.flxToSegment.setVisibility(true);
        },
        resetTransfersForm: function() {
            // Resetting From 
            if(!this.view.flxFromSegment.isVisible){
                this.view.lblSelectAccount.setVisibility(false);
                this.view.txtTransferFrom.setVisibility(true);
                this.view.txtTransferFrom.text = "";
                this.view.txtBeneficiaryNickName.text = "";
            }
            //Resetting TO
			this.view.flxToSegment.setVisibility(false);
            this.view.txtTransferTo.setVisibility(true);
            this.view.lblSelectAccountTo.setVisibility(false);
            this.view.txtTransferTo.text = "";
            // Resetting All fields
            this.view.lbxFrequency.masterData = this.getFrequencies();
            //       this.view.calSendOnNew.dateComponents = CommonUtilities.getServerDateComponent();
            //       this.view.calSendOnNew.validStartDate = CommonUtilities.getServerDateComponent();
            this.view.txtAccountNumber.text = "";
            this.view.lblWarning.setVisibility(false);
            this.view.txtSwift.text = "";
            FormControllerUtility.disableTextbox(this.view.txtAccountNumber);
            FormControllerUtility.enableTextbox(this.view.txtSwift);
            this.view.flxAttachmentUploadError.setVisibility(false);
            //       this.view.calEndingOnNew.dateComponents = CommonUtilities.getServerDateComponent();
            //       this.view.calEndingOnNew.validStartDate = CommonUtilities.getServerDateComponent();
            this.view.lbxFrequency.masterData = this.getFrequencies();
            this.view.lbxFrequency.selectedKey = this.view.lbxFrequency.masterData[0][0];
            this.view.lbxCurrency.masterData = this.onCurrencyChange();
            this.view.lbxCurrency.selectedKey = this.view.lbxCurrency.masterData[0][0];
            this.view.tbxNoOfRecurrences.text = "";
            this.view.txtPaymentReference.text = "";
            this.view.lblCount1.text = "140";
            this.view.txtAmount.text = "";
            this.view.txtAddressLine01.text = "";
            this.view.txtAddressLine02.text = "";
            this.view.txtCity.text = "";
            this.view.txtPostCode.text = "";
            this.view.txtCountry.text = "";
			this.view.calEndingOnNew.skin = ViewConstants.SKINS.COMMON_CALENDAR_NOERROR;
            this.view.calSendOnNew.skin = ViewConstants.SKINS.COMMON_CALENDAR_NOERROR;
            FormControllerUtility.enableTextbox(this.view.txtAmount);
            filesToBeUploaded = [];
            uploadedAttachments = [];
            attachments = [];
            this.setAttachmentsDataToSegment();
            this.hideTransferError();
            this.checkValidityMakeFastTransferForm();
            this.onFrequencyChanged();
            //put the default value to fees paid by
            this.view.lblRadioBtn1.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
            this.view.lblRadioBtn1.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
            this.view.lblRadioBtn2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
            this.view.lblRadioBtn2.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
            this.view.lblRadioBtn3.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
            this.view.lblRadioBtn3.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
        },
        /**
         * Method to restrict Special Characters entry in textbox
         */
        restrictSpecialCharacters: function() {
            var scopeObj = this;
            var specialCharactersSet = "~#^|$%&*!@()_-+=}{][/|?,.><`':;\"\\";
            var alphabetsSet = "abcdefghijklmnopqrstuvwxyz";
            var numbersSet = "0123456789";
            scopeObj.view.txtTransferFrom.restrictCharactersSet = specialCharactersSet;
            scopeObj.view.txtTransferTo.restrictCharactersSet = specialCharactersSet;
            scopeObj.view.txtAmount.restrictCharactersSet = specialCharactersSet.replace(',.', '') + alphabetsSet + alphabetsSet.toUpperCase();
            scopeObj.view.txtBankName.restrictCharactersSet = specialCharactersSet;
            scopeObj.view.txtCity1.restrictCharactersSet = specialCharactersSet + numbersSet;
            scopeObj.view.txtCountry1.restrictCharactersSet = specialCharactersSet + numbersSet;
        },
        hideFieldError: function() {
            // this.view.flxAmount.skin = ViewConstants.SKINS.COMMON_FLEX_NOERRORSKIN;
            this.view.lblWarning.setVisibility(false);
        },

        checkValidityMakeFastTransferForm: function() {
            var formData = this.getFormDetails();
            //On any field change we turn off payment cut off flex
            this.hidePaymentCutOff();
            if (formData.amount === null || formData.amount === "" || formData.amount === "NaN" || formData.amount === undefined) {
                CommonUtilities.disableButton(this.view.btnConfirm);
                return;
            }
            if (!this.selectedFromAccount && !preSelectAccountFrom) {
                CommonUtilities.disableButton(this.view.btnConfirm);
                return;
            }
            if (!this.selectedToAccount && !preSelectAccountTo && this.view.txtTransferTo.text === "") {
                CommonUtilities.disableButton(this.view.btnConfirm);
                return;
            }
            if (!isOwnAccountsFlow) {
                if (formData.accountNumber.trim().length === 0) {
                    CommonUtilities.disableButton(this.view.btnConfirm);
                    return;
                }
                if (formData.isInternational === "true" && formData.swiftCode.trim().length === 0) {
                    CommonUtilities.disableButton(this.view.btnConfirm);
                    return;
                }

            }

            var selected = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
            if (this.view.flxFeePaidBy.isVisible && (this.view.lblRadioBtn1.text !== selected && this.view.lblRadioBtn2.text !== selected && this.view.lblRadioBtn3.text !== selected)) {
                CommonUtilities.disableButton(this.view.btnConfirm);
                return;
            }
            CommonUtilities.enableButton(this.view.btnConfirm);
            this.hideFieldError();

            this.view.forceLayout();

        },
        formatAmount: function(amount) {
            if (amount === undefined || amount === null) return;
            return applicationManager.getFormatUtilManager().formatAmount(amount);
        },
        deFormatAmount: function(amount) {
            if (amount === undefined || amount === null) {
                return;
            }
            return applicationManager.getFormatUtilManager().deFormatAmount(amount);
        },

        getFromAccount: function(accountID) {
            return fromAccounts.filter(function(account) {
                return account.accountID === accountID
            })[0];
        },

        getToAccount: function(accountNumber, searchByAccountNumber) {
            if (isOwnAccountsFlow) {
                return fromAccounts.filter(function(account) {
                    return account.accountID === accountNumber
                })[0];
            } else {
                return toAccounts.filter(function(account) {
                    if (searchByAccountNumber) {
                        return account.accountNumber === accountNumber
                    } else {
                        return account.Id === accountNumber
                    }
                })[0];
            }
        },
        onKeyUpFrom: function(textWidget) {
            fromAccountSaerchTerm = textWidget.text;
            this.showFromAccounts();
        },
        onKeyUpTo: function(textWidget) {
            toAccountSearchTerm = textWidget.text;
            if (textWidget.text === "" || textWidget.text === this.view.txtTransferTo.text) {
                this.selectedToAccount = null;
                preSelectAccountTo = null;
                this.view.txtAccountNumber.text = "";
                this.view.txtSwift.text = "";
                this.view.txtBeneficiaryNickName.text = "";
                this.view.txtAddressLine01.text = "";
                this.view.txtAddressLine02.text = "";
                this.view.txtCity.text = "";
                this.view.txtPostCode.text = "";
                this.view.txtCountry.text = "";
                this.view.lblNew.setVisibility(true);
				this.view.flxToIcon.setVisibility(false);
                this.toggleNewBeneficiary(false);
                FormControllerUtility.enableTextbox(this.view.txtAccountNumber);
                FormControllerUtility.enableTextbox(this.view.txtSwift);
                FormControllerUtility.enableTextbox(this.view.txtBeneficiaryNickName);
                FormControllerUtility.enableTextbox(this.view.txtAddressLine01);
                FormControllerUtility.enableTextbox(this.view.txtCity);
                FormControllerUtility.enableTextbox(this.view.txtPostCode);
                FormControllerUtility.enableTextbox(this.view.txtCountry);
                FormControllerUtility.enableTextbox(this.view.txtAddressLine02);
                this.checkValidityMakeFastTransferForm();
            }
            this.view.flxToSegment.setVisibility(true);
            this.showToAccounts(toAccountSearchTerm);
        },


        /**call when frequency is changed in make transfer form - Resets the UI
         */
        onFrequencyChanged: function(resetCalendar) {
            this.getFrequencyAndFastTransferFormLayout(this.view.lbxFrequency.selectedKey);
            this.checkValidityMakeFastTransferForm();
            this.checkPaymentMedium();
            if (resetCalendar) this.resetCalendarForFrequency(this.view.lbxFrequency.selectedKey);
        },
        /**Call Back when for how long listbox value is changed - Resets UI based on selection
         */
        onHowLongChange: function() {
            this.getForHowLongandFormLayout(this.view.lbxpay.selectedKey);
            this.checkValidityMakeFastTransferForm();
        },
        /** sets the Frequency with i18 value
         */
        onCurrencyChange: function() {
            var list = [];
            for (var key in currency) {
                if (currency.hasOwnProperty(key)) {
                    list.push([key, currency[key]]);
                }
            }
            return list;
        },

        /** sets the Frequency with i18 value
         */
        getFrequencies: function() {
            var list = [];
            for (var key in frequencies) {
                if (frequencies.hasOwnProperty(key)) {
                    list.push([key, kony.i18n.getLocalizedString(frequencies[key])]);
                }
            }
            return list;
        },
        /** sets the duration of the transaction with i18 value
         */
        getForHowLong: function() {
            var list = []
            for (var key in forHowLong) {
                if (forHowLong.hasOwnProperty(key)) {
                    list.push([key, kony.i18n.getLocalizedString(forHowLong[key])]);
                }
            }
            return list;
        },
        getFrequencyAndFastTransferFormLayout: function(frequencyValue) {
            if (frequencyValue !== "Once") {
                this.makeLayoutfrequencyWeeklyDate();
            } else {
                this.makeLayoutfrequencyOnce();
            }
        },

        makeLayoutfrequencyWeeklyDate: function() {
            this.view.lblpay.setVisibility(true);
            this.view.lbxpay.setVisibility(true);
            this.view.lblNoOfRecOrEndingOn.setVisibility(true);
            this.view.flxCalEndingOn.setVisibility(true);
        },
        makeLayoutfrequencyOnce: function() {
            this.view.lblpay.setVisibility(false);
            this.view.lbxpay.setVisibility(false);
            this.view.lblNoOfRecOrEndingOn.setVisibility(false);
            this.view.flxCalEndingOn.setVisibility(false);
        },
        getForHowLongandFormLayout: function(value) {
            if (value === "ON_SPECIFIC_DATE") {
                this.makeLayoutfrequencySpecificDate();
            } else if (value === "NO_OF_RECURRENCES") {
                this.makeLayoutfrequencyWeeklyRecurrences();
            }
        },
        makeLayoutfrequencySpecificDate: function() {
            this.view.lblNoOfRecOrEndingOn.setVisibility(true);
            this.view.flxCalEndingOn.setVisibility(true);
            CommonUtilities.setText(this.view.lblNoOfRecOrEndingOn, kony.i18n.getLocalizedString("i18n.transfers.end_date"), CommonUtilities.getaccessibilityConfig());
            this.view.tbxNoOfRecurrences.setVisibility(false);
        },
        makeLayoutfrequencyWeeklyRecurrences: function() {
            this.view.lblNoOfRecOrEndingOn.setVisibility(true);
            this.view.flxCalEndingOn.setVisibility(false);
            this.view.tbxNoOfRecurrences.setVisibility(true);
            CommonUtilities.setText(this.view.lblNoOfRecOrEndingOn, kony.i18n.getLocalizedString("i18n.transfers.lblNumberOfRecurrences"), CommonUtilities.getaccessibilityConfig());
        },
        /**
         * Method to set the position of calendar widgets
         */
        renderCalendars: function() {
            var context1 = {
                "widget": this.view.flxCalSendOn,
                "anchor": "bottom"
            };
            this.view.calSendOnNew.setContext(context1);
            var context2 = {
                "widget": this.view.flxCalEndingOn,
                "anchor": "bottom"
            };
            this.view.calEndingOnNew.setContext(context2);
            var context3 = {
                "widget": this.view.flxCalLoans,
                "anchor": "bottom"
            };
            this.view.calSendOnLoans.setContext(context3);
        },
        /** Creates the segment data along with Section Headers
         * @param  {object} toAccounts list of accounts
         * @param  {string} type specifies either from or to accounts
         * @param  {boolean} p2pEnabledStatus specifies whether p2p is enabled or not
         * @param  {boolean} p2pServiceStatus specifies whether the p2p service has failed or not
         */
        segFromAccountRowClick: function() {

            if(!this.accountToIsPreSelectedFlow) {
                this.resetTransfersForm();
            }
            var selectedAccount = this.view.segTransferFrom.selectedRowItems[0];
            this.selectedFromAccount = selectedAccount;
            var accountId = selectedAccount.accountID;
			this.view.lbxCurrency.selectedKey = selectedAccount.currencyCode;
            this.selectFromAccount(selectedAccount);
            preSelectAccountFrom = null;
            let toAccountsList;

            if (isOwnAccountsFlow) {
                let filteredAccounts = fromAccounts.filter(function(account) {
                    return CommonUtilities.substituteforIncludeMethod(account.nickName.toLowerCase(), toAccountSearchTerm.toLowerCase()) ||
                        CommonUtilities.substituteforIncludeMethod(account.accountID.toLowerCase(), toAccountSearchTerm.toLowerCase())
                })
                filteredAccounts = this.removeFromAccount(filteredAccounts);
                toAccountsList = this.presenter.filterToAccountsByMembershipId(selectedAccount.Membership_id, filteredAccounts);
				toAccountsList = toAccountsList.concat(this.presenter.filterCreditCardAccount("CreditCard", filteredAccounts));
            } else {
                toAccountsList = this.presenter.filterToAccountsByMembershipId(selectedAccount.Membership_id, toAccounts);
            }

            if (toAccountsList.length == 0) {
                let widgetFromData;
                this.view.segTransferTo.setVisibility(false);
                this.view.flxNoResultsTo.setVisibility(true);
                this.view.txtTransferTo.text = "";
                this.view.lblToAmount.setVisibility(false);
                this.view.lblSelectAccountTo.setVisibility(false);
                this.view.txtAccountNumber.text = "";
                this.view.txtSwift.text = "";
            } else {
                this.view.segTransferTo.setVisibility(true);
                this.view.flxNoResultsTo.setVisibility(false);

                if (isOwnAccountsFlow) {
                    widgetFromData = this.isSingleCustomerProfile ? this.getDataWithAccountTypeSections(toAccountsList, "from") : this.getDataWithSections(toAccountsList, "from");
                    this.view.segTransferTo.setData(widgetFromData);
                    // this.selectToAccount(widgetFromData[0][1][0]);
                    // this.view.segTransferTo.selectedRowIndex = [0, 0];
                } else {
                    widgetFromData = this.mapToAccounts(toAccountsList);

                    // let prevPayee;
                    // for (let index in toAccountsList) {
                    //     if (toAccountsList[index].Id == this.prevPayeeId) {
                    //         prevPayee = parseInt(index);
                    //         break;
                    //     } else {
                    //         prevPayee = 0;
                    //     }
                    // }
                    this.view.segTransferTo.setData(widgetFromData);
                    // this.view.segTransferTo.selectedRowIndex = [0, prevPayee];
                    // this.selectToAccount(widgetFromData[prevPayee]);
                }
            }
        },

        selectFromAccount: function(selectedAccount) {
			this.selectedFromAccount = selectedAccount;
            CommonUtilities.setText(this.view.txtTransferFrom, selectedAccount.lblAccountName, CommonUtilities.getaccessibilityConfig());
            this.view.txtTransferFrom.setVisibility(false);
            CommonUtilities.setText(this.view.lblSelectAccount, selectedAccount.lblAccountName, CommonUtilities.getaccessibilityConfig());
            this.view.flxFromSegment.setVisibility(false);
            this.view.lblSelectAccount.setVisibility(true);
            this.onFrequencyChanged();
            if (!editMode) this.checkCurrency();
            if (isOwnAccountsFlow) {
                this.showToAccounts();
            }
        },
      segToAccountRowClick: function() {
        var selectedAccount = this.view.segTransferTo.selectedRowItems[0];
        this.selectedToAccount = selectedAccount;
        isSameBankAccount = selectedAccount.isSameBankAccount;
        isInternationalAccount = selectedAccount.isInternational
        this.toggleNewBeneficiary(false);
        this.selectToAccount(selectedAccount);
        this.view.flxCancelFilterTo.setVisibility(false);
        this.view.lblNew.setVisibility(false);
        this.view.flxToIcon.setVisibility(true);
        this.accountToIsPreSelectedFlow = false;
        if (!selectedAccount.hasOwnProperty("accountID")) {
          if (isSameBankAccount === "true") {
            this.presenter.getBeneficiaryName(selectedAccount.ExternalAccountNumber, this.view.id);
          }
        }
      },

        selectToAccount: function(selectedAccount) {
            CommonUtilities.setText(this.view.txtTransferTo, selectedAccount.lblAccountName, CommonUtilities.getaccessibilityConfig());
            this.view.txtTransferTo.setVisibility(false);
            CommonUtilities.setText(this.view.lblSelectAccountTo, selectedAccount.lblAccountName, CommonUtilities.getaccessibilityConfig());
            this.view.flxToSegment.setVisibility(false);
            this.view.lblSelectAccountTo.setVisibility(true);
            this.view.txtAccountNumber.text = selectedAccount.ExternalAccountNumber || "";
            this.view.txtAddressLine01.text = selectedAccount.addressLine1 || "";
            this.view.txtAddressLine02.text = selectedAccount.addressLine2 || "";
            this.view.txtCity.text = selectedAccount.city || "";
            this.view.txtPostCode.text = selectedAccount.zipcode || "";
            this.view.txtCountry.text = selectedAccount.country || "";
            this.view.txtSwift.text = selectedAccount.swiftCode || "";
            FormControllerUtility.disableTextbox(this.view.txtAccountNumber);
            FormControllerUtility.disableTextbox(this.view.txtSwift);
            FormControllerUtility.disableTextbox(this.view.txtBeneficiaryNickName);
            FormControllerUtility.disableTextbox(this.view.txtAddressLine01);
            FormControllerUtility.disableTextbox(this.view.txtCity);
            FormControllerUtility.disableTextbox(this.view.txtPostCode);
            FormControllerUtility.disableTextbox(this.view.txtCountry);
            FormControllerUtility.disableTextbox(this.view.txtAddressLine02);
            this.view.txtBeneficiaryNickName.text = selectedAccount.nickName || "";
            this.view.lblCount2.setVisibility(false);

            this.prevPayeeId = selectedAccount.Id || selectedAccount.accountNumber;

            if (selectedAccount.isInternational !== undefined)
                this.checkShowPaym(selectedAccount.isInternational === "false");

            this.onFrequencyChanged();
            this.checkPaymentMedium();
            this.checkCurrency();
            if (isOwnAccountsFlow) {
                this.showFromAccounts();
                var selectedAccountObject = this.getToAccount(selectedAccount.accountID)
                if (selectedAccountObject.accountType === "Loan") {
                    this.hideCreditCardView();
                    this.showLoanView(selectedAccountObject);
                    this.presenter.fetchAmountDueBalance(selectedAccount);
                } else if (selectedAccountObject.accountType === "CreditCard") {
                    this.hideLoanView();
                    this.showCreditCardView(selectedAccountObject);
                } else {
                    this.hideLoanView();
                    this.hideCreditCardView();
                    FormControllerUtility.enableTextbox(this.view.txtAmount);
                }
            } else {
                this.hideLoanView();
                this.hideCreditCardView();
                FormControllerUtility.enableTextbox(this.view.txtAmount);
            }
            this.checkValidityMakeFastTransferForm();
        },
        checkPaymentMedium: function() {
            var formData = this.getFormDetails();
            if (new_benificiary) {
                if (isInternationalAccount === "false" && isSameBankAccount === "false" && formData.frequency === "Once") {
                    this.view.flxPaymentMedium.setVisibility(true);
                    this.checkShowPaym(true);
                } else {
                    this.view.flxPaymentMedium.setVisibility(false);
                }
                return;
            }

            if (formData.toAccount && formData.toAccount.isInternationalAccount === "false" && formData.toAccount.isSameBankAccount === "false" && formData.frequency === "Once") {
                this.view.flxPaymentMedium.setVisibility(true);
                this.view.flxFeePaidBy.setVisibility(true);
            } else {
                this.view.flxPaymentMedium.setVisibility(false);
                //   this.view.flxFeePaidBy.setVisibility(false);
            }
        },

        showLoanView: function(selectedAccount) {
            this.view.flxLoan.setVisibility(true);
            this.view.lblSendOnLoans.setVisibility(true);
            this.view.flxCalLoans.setVisibility(true);
            this.view.lblFrequency.setVisibility(false);
            this.view.flxContainer5.setVisibility(false);
            this.view.lbxFrequency.setVisibility(false);
            this.view.lbxFrequency.selectedKey = "Once";
            this.view.flxRadioLoan1.onClick = this.onClickRadioButtonLoan.bind(this, this.onRadioLoanListener.bind(this, selectedAccount));
            this.view.flxRadioLoan2.onClick = this.onClickRadioButtonLoan.bind(this, this.onRadioLoanListener.bind(this, selectedAccount));
            if (this.view.lblLoan1.text === ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO) {
                this.showDueAmount(selectedAccount);
            } else {
                this.showOtherAmount(selectedAccount);
            }
        },

        hideLoanView: function() {
            this.view.flxLoan.setVisibility(false);
            this.view.lblSendOnLoans.setVisibility(false);
            this.view.flxCalLoans.setVisibility(false);
            this.view.flxContainer5.setVisibility(true);
            this.view.lblFrequency.setVisibility(true);
            this.view.lbxFrequency.setVisibility(true);
            if (this.clearAmount) {
                this.view.txtAmount.text = "";
                this.clearAmount = false;
            }
        },

        showDueAmount: function(selectedAccount) {
            this.clearAmount = true;
            paymentType = kony.i18n.getLocalizedString("i18n.Accounts.ContextualActions.payDueAmount");
            this.showLoanAccountDetails();
        },

        showOtherAmount: function(selectedAccount) {
            paymentType = kony.i18n.getLocalizedString("i18n.TransfersEur.PayOtherAmount");
            FormControllerUtility.enableTextbox(this.view.txtAmount);
            //this.view.txtAmount.text = ""
        },
        setFlowActions: function() {
            var scopeObj = this;
            this.view.flxtooltipFeesImg.onClick = function() {
                if (!scopeObj.view.Allforms.isVisible) {
                    scopeObj.view.Allforms.isVisible = true;
                } else {
                    scopeObj.view.Allforms.isVisible = false;
                }
            }
            this.view.Allforms.flxCross.onClick = function() {
                scopeObj.view.Allforms.isVisible = false;
            }
        },

        postShow: function() {
            this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.frame.height - this.view.flxFooter.frame.height + "dp";
            applicationManager.getNavigationManager().applyUpdates(this);
            applicationManager.executeAuthorizationFramework(this);
            this.hideLoanView();
            this.view.flxPaymentMedium.setVisibility(false);
            this.accessibilityFocusSetup();
            this.setFlowActions();
            applicationManager.executeAuthorizationFramework(this);
            this.viewsVisibilityStore = FormControllerUtility.getVisiblityStore([
                this.view.flxLoan,
                this.view.flxCreditCard,
                this.view.flxBeneficiaryBank,
                this.view.lblFrequency,
                this.view.lbxFrequency,
                this.view.flxCalLoans,
                this.view.flxCalEndingOn,
                this.view.flxFeePaidBy,
                this.view.flxPaymentMedium,
                this.view.flxPaymentReference,
                this.view.flxBeneficiaryNickName,
                this.view.flxAddress,
                this.view.flxAddress,
                this.view.flxAttachments,
                this.view.flxPaymemtsCutOff
            ])
        },

        /**
         * Set foucs handlers for skin of parent flex on input focus 
         */
        accessibilityFocusSetup: function() {
            let widgets = [
                [this.view.txtTransferFrom, this.view.flxFrom],
                [this.view.txtTransferTo, this.view.flxTo]
            ]
            for (let i = 0; i < widgets.length; i++) {
                CommonUtilities.setA11yFoucsHandlers(widgets[i][0], widgets[i][1], this)
            }
        },

        checkCurrency: function () {
            var formDetails = this.getFormDetails();
            var toAccountDetails = formDetails.toAccount;
            var fromAccountDetails = formDetails.fromAccount;
            if (!fromAccountDetails || !toAccountDetails) {
                this.enableCurrency();
                return;
            }
            if (isOwnAccountsFlow || (isSameBankAccount === "true")) {
                var toCurrencyCode = (isSameBankAccount === "true") ? sameBankAccountCurrencyCode : toAccountDetails.currencyCode;
                if (toCurrencyCode === fromAccountDetails.currencyCode) {
                    this.view.lbxCurrency.selectedKey = fromAccountDetails.currencyCode;
                    this.view.lbxCurrency.setEnabled(false);
                } else {
                    if ((!kony.sdk.isNullOrUndefined(toCurrencyCode) && toCurrencyCode !== "") && (!kony.sdk.isNullOrUndefined(fromAccountDetails.currencyCode) && fromAccountDetails.currencyCode !== "")) {
                        let list = [];
                        list.push([fromAccountDetails.currencyCode, currency[fromAccountDetails.currencyCode]]);
                        list.push([toCurrencyCode, currency[toCurrencyCode]]);
                        this.view.lbxCurrency.masterData = list;
                        this.view.lbxCurrency.selectedKey = (editMode && transactionCurrency) ? transactionCurrency : fromAccountDetails.currencyCode; //default selection
                        this.view.lbxCurrency.setEnabled(true);
                    }
                }
                return;
            }
            if (new_benificiary) {
                if (isInternationalAccount === "true") {
                    this.enableCurrency();
                    return;
                }
                if (isInternationalAccount === "false") {
                    this.disableAndLockCurrency();
                    return;
                }
            }
            if (toAccountDetails.isSameBankAccount === "false" && toAccountDetails.isInternationalAccount === "false") {
                this.disableAndLockCurrency();
            } else {
                this.enableCurrency();
            }
        },

        checkShowPaym: function(isDomestic) {
            var formData = this.getFormDetails();

            if (formData.toAccount && formData.toAccount.isSameBankAccount === "true") {
                isPaidBy = '';
                this.view.flxFeePaidBy.setVisibility(false);

            } else {
                if (isDomestic) {
                    this.view.lblRadioBtn1.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                    this.view.lblRadioBtn1.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
                    this.view.lblRadioBtn2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                    this.view.lblRadioBtn2.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
                    this.view.lblRadioBtn3.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
                    this.view.lblRadioBtn3.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
                    isPaidBy = 'SHA';
                    this.view.flxRadioBtn1.setEnabled(false);
                    this.view.flxRadioBtn2.setEnabled(false);
                    this.view.lblRadioBtn2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                    this.view.lblRadioBtn2.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
                    this.view.lblRadioBtn1.skin = "sknC0C0C020pxNotFontIconsMOD";
                    this.view.lblByMe.skin = "sknlbla0a0a015px";
                    this.view.lblRadioBtn2.skin = "sknC0C0C020pxNotFontIconsMOD";
                    this.view.lblByBeneficiary.skin = "sknlbla0a0a015px";
                } else {

                    this.view.flxRadioBtn1.setEnabled(true);
                    this.view.flxRadioBtn2.setEnabled(true);
                    isPaidBy = '';
                    this.view.lblRadioBtn1.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                    this.view.lblRadioBtn1.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
                    this.view.lblRadioBtn2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                    this.view.lblRadioBtn2.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
                    this.view.lblRadioBtn3.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                    this.view.lblRadioBtn3.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
                    this.view.lblRadioBtn1.skin = "sknlblOLBFontsE3E3E320pxOlbFontIcons";
                    this.view.lblByMe.skin = "sknLblSSP33333315px";
                    this.view.lblRadioBtn2.skin = "sknlblOLBFontsE3E3E320pxOlbFontIcons";
                    this.view.lblByBeneficiary.skin = "sknLblSSP33333315px";
                }
            }

            this.checkValidityMakeFastTransferForm();
        },

        disableAndLockCurrency: function() {
            this.view.lbxCurrency.selectedKey = 'EUR';
            this.view.lbxCurrency.setEnabled(false);
        },
        enableCurrency: function() {
            this.view.lbxCurrency.masterData = this.onCurrencyChange();
            if (editMode && transactionCurrency) {
                this.view.lbxCurrency.selectedKey = Object.keys(currency).includes(transactionCurrency) ? transactionCurrency : this.view.lbxCurrency.masterData[0][0];
            } else if (this.isModify) {
                this.view.lbxCurrency.selectedKey = modifiedCurrency;
            } else {
                this.view.lbxCurrency.selectedKey = this.view.lbxCurrency.masterData[0][0];
            }
            this.view.lbxCurrency.setEnabled(true);
        },

        onBreakpointChange: function(form, width) {
            // FormControllerUtility.setupFormOnTouchEnd(width);
            var scope = this;
            this.view.CustomPopup.onBreakpointChangeComponent(scope.view.CustomPopup, width);
            this.view.CustomPopupCancel.onBreakpointChangeComponent(scope.view.CustomPopupCancel, width);
            this.setupFormOnTouchEnd(width);
            responsiveUtils.onOrientationChange(this.onBreakpointChange);
            this.view.customheadernew.onBreakpointChangeComponent(width);
            this.view.customfooternew.onBreakpointChangeComponent(width);
            this.viewsVisibilityStore && this.viewsVisibilityStore.onBreakpointChange();
        },
        onClickBeneficiaryBankRadioButton: function(radioButton) {
            var RadioBtn1 = this.view.lblBankRadioBtn01;
            var RadioBtn2 = this.view.lblBankRadioBtn02;
            if (radioButton.id === "flxBankOption2") {
                RadioBtn1.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                RadioBtn1.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED_FONT;
                RadioBtn2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
                RadioBtn2.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
                this.view.txtAccountNumber.placeholder = kony.i18n.getLocalizedString("i18n.TransfersEur.EnterBeneficiaryLocalAccountNumberorIBAN");
                FormControllerUtility.enableTextbox(this.view.txtSwift);
                this.view.txtSwift.text = "";
                this.view.txtSwift.placeholder = kony.i18n.getLocalizedString("i18n.TransfersEur.EnterSWIFTBICCode");
                this.view.BtnLookup.setVisibility(true);
                this.view.flxFeePaidBy.setVisibility(true);
                this.view.lbxCurrency.setEnabled(true);
                oneTimeSameBank = false;
            } else {
                RadioBtn2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                RadioBtn2.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED_FONT;
                RadioBtn1.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
                RadioBtn1.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
                this.view.txtAccountNumber.placeholder = kony.i18n.getLocalizedString("i18n.TransfersEur.EnterBeneficiaryLocalAccountNumber");
                FormControllerUtility.disableTextbox(this.view.txtSwift);
                this.view.txtSwift.text = "";
                this.view.txtSwift.placeholder = "";
                this.view.BtnLookup.setVisibility(false);
                this.view.flxFeePaidBy.setVisibility(false);
                this.view.lbxCurrency.setEnabled(false);
                oneTimeSameBank = true;
                isPaidBy = '';
            }
            this.view.txtAccountNumber.text = "";
            this.normalizeAccountTextbox();
            this.checkValidityMakeFastTransferForm();
        },
        onClickMeRadioButton: function() {

            this.view.lblRadioBtn1.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
            this.view.lblRadioBtn1.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
            this.view.lblRadioBtn3.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
            this.view.lblRadioBtn3.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED_FONT;
            this.view.lblRadioBtn2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
            this.view.lblRadioBtn2.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED_FONT;
            isPaidBy = 'OUR';
            this.checkValidityMakeFastTransferForm();
        },

        onClickBeneficiaryRadioButton: function() {

            this.view.lblRadioBtn2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
            this.view.lblRadioBtn2.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
            this.view.lblRadioBtn3.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
            this.view.lblRadioBtn3.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED_FONT;
            this.view.lblRadioBtn1.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
            this.view.lblRadioBtn1.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED_FONT;
            isPaidBy = 'BEN';
            this.checkValidityMakeFastTransferForm();
        },

        onClickShareRadioButton: function() {

            this.view.lblRadioBtn3.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
            this.view.lblRadioBtn3.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
            this.view.lblRadioBtn2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
            this.view.lblRadioBtn2.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED_FONT;
            this.view.lblRadioBtn1.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
            this.view.lblRadioBtn1.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED_FONT;
            isPaidBy = 'SHA';
            this.checkValidityMakeFastTransferForm();
        },
        // COMMON
        onClickRadioButton: function(radioButton) {
            var self = this;
            var selectedButton;
            var allRadioButtions = ["lblRadioBtn4", "lblRadioBtn5"];
            if (radioButton && radioButton.widgets()) {
                selectedButton = radioButton.widgets()[0].id;
            } else {
                return;
            }
            var selectRadioButton = function(button) {
                var RadioBtn = self.view[button];
                RadioBtn.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
                RadioBtn.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
            }
            var unSelectRadioButton = function(button) {
                var RadioBtn = self.view[button];
                RadioBtn.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                RadioBtn.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
            }
            allRadioButtions.forEach(function(button) {
                if (button === selectedButton) {
                    selectRadioButton(button);
                } else {
                    unSelectRadioButton(button);
                }
            });
        },
        // COMMON
        onClickRadioButtonLoan: function(onChange, radioButton) {
            var self = this;
            var selectedButton;
            var allRadioButtions = ["lblRadioBtn4", "lblRadioBtn5", "lblLoan1", "lblLoan2"];
            if (radioButton && radioButton.widgets()) {
                selectedButton = radioButton.widgets()[0].id;
            } else {
                return;
            }
            var selectRadioButton = function(button) {
                if (onChange) {
                    onChange(button);
                }
                var RadioBtn = self.view[button];
                RadioBtn.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
                RadioBtn.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
            }
            var unSelectRadioButton = function(button) {
                var RadioBtn = self.view[button];
                RadioBtn.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                RadioBtn.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
            }
            allRadioButtions.forEach(function(button) {
                if (button === selectedButton) {
                    selectRadioButton(button);
                } else {
                    unSelectRadioButton(button);
                }
            });
        },
        /** @alias module:frmMakePaymentController */
        /** updates the present Form based on required function.
         * @param {list} viewModel used to load a view
         */
        updateFormUI: function(viewModel) {
            if (viewModel.isLoading === true) {
                FormControllerUtility.showProgressBar(this.view);
            } else if (viewModel.isLoading === false) {
                FormControllerUtility.hideProgressBar(this.view);
            }
            if (viewModel.bankDate) {
                this.bankDateObj = viewModel.bankDate;
                this.setBankDate(viewModel.bankDate);
            }
            if (viewModel.fromAccounts) {
                this.showUserAccounts(viewModel);
            }
            if (viewModel.accountDetails) {
                this.accountDetails = viewModel.accountDetails;
                this.showLoanAccountDetails();
            }
			if (viewModel.serverError) {
				this.showTransferError(viewModel.serverError);
			}
            if (viewModel.toAccounts) {
                toAccounts = this.sortToAccounts(viewModel.toAccounts)
                this.showToAccounts();
                if (viewModel.context.accountTo) {
                    this.preSelectToAccount(viewModel.context.accountTo);
                }
                if (viewModel.context.modifyTransaction) {
                    this.preSelectToAccount(viewModel.context.modifyTransaction.toAccount.Id);
                }
                if (viewModel.context.editTransaction) {
                    this.preSelectToAccount(viewModel.context.editTransaction.toAccountNumber, viewModel.context.editTransaction.isScheduled, true)
                } else {
                    editMode = false;
                    this.view.flxAttachments.setVisibility(true);
                }
                // this.checkShowPaym(selectedAccount.isInternational === "false");
            }
            if (viewModel.OwnAccounts) {
                isOwnAccountsFlow = true;
                isSameBankAccount = "false";
                this.showOwnAccountsPage(viewModel.modifyTransaction);
                if (viewModel.editTransaction) {
                    this.preFillTransactionForm(viewModel.editTransaction);
                } else {
                    editMode = false;
                    this.view.flxAttachments.setVisibility(true);
                }
            }
            if (viewModel.ExternalAccounts) {
                isOwnAccountsFlow = false;
                this.showExternalAccountsPage(viewModel.modifyTransaction);
                if (viewModel.editTransaction) {
                    this.preFillTransactionForm(viewModel.editTransaction);
                } else {
                    editMode = false;
                    this.view.flxAttachments.setVisibility(true);
                }
            }
            if (viewModel.validationSuccess) {
                this.cutOffFlow = null;
                this.presenter.confirmTransferDetails(viewModel);
            }
            if (viewModel.validationFailed) {
                this.cutOffFlow = viewModel.validationFailed.productOverride ? "choice" : "nextday";
                this.showPaymentCutOff();
            }
            if (viewModel.beneficiaryName) {
                this.populateBeneficiaryName(viewModel.beneficiaryName);
            }
            if (viewModel.BICdetails) {
                this.populateBIC(viewModel.BICdetails);
            }
            if (viewModel.transferError) {
                this.showTransferError(viewModel.transferError);
            }
        },

        /**
         * Method to populate Beneficiary name value
         * @param {Object} data object containing BIC value
         */
      populateBeneficiaryName: function(data) {
        var scopeObj = this;
        if (data.beneficiaryName === "") {
          scopeObj.view.lblWarning.setVisibility(true);
          scopeObj.view.txtTransferTo.text = "";
          scopeObj.view.txtAccountNumber.skin = ViewConstants.SKINS.BORDER;
          sameBankAccountCurrencyCode = "";
          CommonUtilities.setText(scopeObj.view.lblWarning, kony.i18n.getLocalizedString("i18n.TransferEur.inValidAccountNumber"), CommonUtilities.getaccessibilityConfig());
        } else {
          scopeObj.view.lblWarning.setVisibility(false);
          //beneficiary_name = data.beneficiaryName
          isSameBankAccount = "true";
          sameBankAccountCurrencyCode = data.currency;
          isInternationalAccount = "false"
          this.checkCurrency();
          CommonUtilities.setText(scopeObj.view.txtTransferTo, data.beneficiaryName, CommonUtilities.getaccessibilityConfig());
        }
      },
        populateBIC: function(data) {
            var scopeObj = this;
            CommonUtilities.setText(scopeObj.view.txtSwift, data.bic, CommonUtilities.getaccessibilityConfig());
            bank_name = data.bankName;
            bank_country = data.country;
            FormControllerUtility.disableTextbox(this.view.txtSwift);
            scopeObj.view.BtnLookup.setVisibility(false);
            if (data.sepaMember === undefined || data.sepaMember === "" || data.sepaMember === "Y") {
                isSameBankAccount = "false";
                isInternationalAccount = "false";
                this.checkCurrency();
                this.checkPaymentMedium();
            } else if (data.sepaMember === "N") {
                isSameBankAccount = "false";
                isInternationalAccount = "true";
                this.checkCurrency();
                this.checkPaymentMedium()
            }
        },
        /**
         * Normalize Account Number textbox
         */
        normalizeAccountTextbox: function() {
            var scopeObj = this;
            FormControllerUtility.enableTextbox(scopeObj.view.txtAccountNumber);
            scopeObj.view.lblWarning.setVisibility(false);
            scopeObj.view.flxFormContent.forceLayout();
        },
        showLoanAccountDetails: function() {
            if (this.accountDetails && !this.isModify) {
                var dueAmount = parseFloat(this.accountDetails.nextPaymentAmount ? this.accountDetails.nextPaymentAmount : 0) + parseFloat(this.accountDetails.paymentDue ? this.accountDetails.paymentDue : 0);
                if (dueAmount == "" || dueAmount == null || dueAmount == undefined || dueAmount == 0) {
                    dueAmount = "0.00";
                }
                this.view.txtAmount.text = applicationManager.getFormatUtilManager().formatAmount(dueAmount);
                FormControllerUtility.disableTextbox(this.view.txtAmount);
                this.view.lblDueDate.setVisibility(false);
                this.checkValidityMakeFastTransferForm();
            }
            this.isModify = false;
        },

        showUserAccounts: function(viewModel) {
            var modifyTransaction = viewModel.context.modifyTransaction;
            var editTransaction = viewModel.context.editTransaction;
            //From Quick Action
            var accountFrom = viewModel.context.accountFrom;
            var accountTo = null;
            var isScheduled;
            if (modifyTransaction) {
                accountFrom = modifyTransaction.fromAccount.accountID;
                if (isOwnAccountsFlow) {
                    accountTo = modifyTransaction.toAccount.accountID;
                }
            }
            if (editTransaction) {
                accountFrom = editTransaction.fromAccountNumber;
                if (isOwnAccountsFlow) {
                    accountTo = editTransaction.toAccountNumber;
                }
                isScheduled = editTransaction.isScheduled;
            } else {
                editMode = false;
            }
            this.showOwnAccounts(viewModel.fromAccounts, accountFrom, accountTo, isScheduled);
          	if (modifyTransaction) {
				this.view.lbxCurrency.selectedKey = modifyTransaction.currency;
			}
        },

        sortFromAccounts: function(fromAccounts) {
            var self = this;
            var fromAccountsNew = JSON.parse(JSON.stringify(fromAccounts));
            fromAccountsNew.sort(function compare(a, b) {
                if (self.getFromAccountName(a) < self.getFromAccountName(b)) {
                    return -1;
                }
                if (self.getFromAccountName(b) < self.getFromAccountName(a)) {
                    return 1;
                }
                return 0;
            })
            return fromAccountsNew;
        },
        sortToAccounts: function(toAccounts) {
            var self = this;
            var toAccountsNew = JSON.parse(JSON.stringify(toAccounts));
            toAccountsNew.sort(function compare(a, b) {
                if (self.getToAccountName(a) < self.getToAccountName(b)) {
                    return -1;
                }
                if (self.getToAccountName(b) < self.getToAccountName(a)) {
                    return 1;
                }
                return 0;
            })
            return toAccountsNew;
        },

        showOwnAccounts: function(userAccounts, fromAccountNumber, toAccountNumber, isScheduled) {
            fromAccounts = this.sortFromAccounts(userAccounts);

            if (fromAccountNumber) {
                this.accountFromPreSelected = fromAccounts.filter(x => x.accountID === fromAccountNumber)[0];
            }

            if (isOwnAccountsFlow) {
                this.showFromAccounts(fromAccountNumber);
                this.showToAccounts();
            } else {
                this.showFromAccounts();
            }
            this.preSelectFromAccount(fromAccountNumber);
            this.preSelectToAccount(toAccountNumber, isScheduled);
        },

        showOwnAccountsPage: function(modifyTransaction) {
            var scopeObj = this;
          	scopeObj.hidePopups();
            this.view.flxNewPayment.onClick = function() {
                scopeObj.presenter.showTransferScreen({
                    context: "MakePaymentOwnAccounts"
                })
            };
            this.view.lblNewPayment.text = kony.i18n.getLocalizedString("i18n.TransfersEur.NewTransferbetweenAccounts");
            this.view.customheadernew.activateMenu("EUROTRANSFERS", "Transfer Between Accounts");
            CommonUtilities.setText(scopeObj.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.hamburger.transfers"), CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblPaymentActivities, kony.i18n.getLocalizedString("i18n.FastTransfer.TransferActivities"), CommonUtilities.getaccessibilityConfig());
            this.view.flxManageBeneficiaries.setVisibility(false);
            this.view.flxContainer3.setVisibility(false);
            this.view.flxFeePaidBy.setVisibility(false);
            this.view.flxBeneficiaryNickName.setVisibility(false);
            this.view.lblTransfers.text = kony.i18n.getLocalizedString("i18n.hamburger.transfers");
            this.view.lblPaymentReference.text = kony.i18n.getLocalizedString("i18n.TransfersEur.TransferReferenceOptional");
            this.view.txtPaymentReference.placeholder = kony.i18n.getLocalizedString("i18n.TransfersEur.EnterTransferReferenceHere");
            this.view.flxLoan.setVisibility(false);
            this.view.flxCreditCard.setVisibility(false);
            this.view.flxAddress.setVisibility(false);
            this.view.flxAddress1.setVisibility(false);
            this.view.lblSelectAccount.setVisibility(false);
            this.view.flxPaymentMedium.setVisibility(false);
            this.view.lblNew.setVisibility(false);
            this.view.flxBeneficiaryBank.setVisibility(false);
            this.disableAndLockCurrency();
            CommonUtilities.setText(this.view.lbTransferTo, kony.i18n.getLocalizedString("i18n.common.To"), CommonUtilities.getaccessibilityConfig());
            this.view.txtTransferTo.placeholder = kony.i18n.getLocalizedString("i18n.TransfersEur.SelecttheToaccount");
            this.resetTransfersForm();
            if (modifyTransaction) {
                this.isModify = true;
                this.preFillFromFormData(modifyTransaction);
            } else {
                this.isModify = false;
            }
            this.view.forceLayout();
        },
        showExternalAccountsPage: function(modifyTransaction) {
            var scopeObj = this;
          	scopeObj.hidePopups();
            this.view.flxNewPayment.onClick = function() {
                scopeObj.presenter.showTransferScreen({
                    context: "MakePayment"
                })
            };
            this.view.lblNewPayment.text = kony.i18n.getLocalizedString("i18n.TransfersEur.NewPayment");
            this.view.customheadernew.activateMenu("EUROTRANSFERS", "Make a Payment");
            CommonUtilities.setText(scopeObj.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.AccountsDetails.PAYMENTS"), CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblPaymentActivities, kony.i18n.getLocalizedString("i18n.TransfersEur.PaymentActivities"), CommonUtilities.getaccessibilityConfig());
            this.view.flxManageBeneficiaries.setVisibility(true);
            this.view.flxContainer3.setVisibility(true);
            this.view.flxFeePaidBy.setVisibility(true);
            this.view.flxBeneficiaryNickName.setVisibility(true);
            this.view.flxAddress.setVisibility(true);
            this.view.flxAddress1.setVisibility(true);
            this.view.flxLoan.setVisibility(false);
            this.view.flxCreditCard.setVisibility(false);
            this.view.flxPaymentMedium.setVisibility(true);
            this.view.lblSelectAccount.setVisibility(false);
            this.view.lblNew.setVisibility(false);
            this.view.flxBeneficiaryBank.setVisibility(false);
            this.view.lblPaymentReference.text = kony.i18n.getLocalizedString("i18n.TransfersEur.PaymentReferenceOptional");
            this.view.txtPaymentReference.placeholder = kony.i18n.getLocalizedString("i18n.TransfersEur.EnterPaymentReferenceHere");
            CommonUtilities.setText(this.view.lbTransferTo, kony.i18n.getLocalizedString("i18n.TransfersEur.BeneficiaryName"), CommonUtilities.getaccessibilityConfig());
            this.view.txtTransferTo.placeholder = kony.i18n.getLocalizedString("i18n.TransfersEur.EnterBeneficiaryFullNameHere");
            this.view.lblTransfers.text = kony.i18n.getLocalizedString("i18n.AccountsDetails.PAYMENTS");
            this.resetTransfersForm();
            if (modifyTransaction) {
                this.isModify = true;
                this.preFillFromFormData(modifyTransaction);
            } else {
                this.isModify = false;
            }
            this.view.forceLayout();
        },

        preFillFromFormData: function(formDetails) {
            this.resetCalendarForFrequency(formDetails.frequency);
            this.view.txtAccountNumber.text = formDetails.accountNumber;
            this.view.txtSwift.text = formDetails.swiftCode;
            FormControllerUtility.disableTextbox(this.view.txtSwift);
            this.view.lbxCurrency.selectedKey = formDetails.currency;
            modifiedCurrency = formDetails.currency;
            this.view.txtAmount.text = applicationManager.getFormatUtilManager().formatAmount(formDetails.amount);
            this.view.lbxFrequency.selectedKey = formDetails.frequency
            this.view.calSendOnNew.dateComponents = formDetails.sendOnDateComponent;
            this.view.calEndingOnNew.dateComponents = formDetails.endOnDateComponent;
            this.view.txtPaymentReference.text = formDetails.paymentReference;
            this.view.lblCount1.text = 140 - this.view.txtPaymentReference.text.length+"";
            this.view.txtAddressLine01.text = formDetails.addressLine1;
            this.view.txtAddressLine02.text = formDetails.addressLine2;
            this.view.txtCity.text = formDetails.city;
            this.view.txtPostCode.text = formDetails.postCode;
            this.toggleNewBeneficiary(formDetails.oneTimePayment);
            if (formDetails.oneTimePayment === true) {
                this.view.txtTransferTo.text = formDetails.toAccount.beneficiaryName;
                this.view.txtBeneficiaryNickName.text = formDetails.toAccount.nickName;
            };
            if (formDetails.isPaidBy === "SHA") {
                this.onClickShareRadioButton();
            } else {
                if (formDetails.isPaidBy === "BEN") {
                    this.onClickBeneficiaryRadioButton();
                } else {
                    if (formDetails.isPaidBy === "OUR") {
                        this.onClickMeRadioButton();
                    } else {
                        this.view.flxFeePaidBy.setVisibility(false);
                    }
                }
            }
            if (formDetails.isOwnAccount && formDetails.toAccount.accountType === "CreditCard") {
                if (formDetails.paymentType === kony.i18n.getLocalizedString("i18n.Transfers.OtherAmount")) {
                    FormControllerUtility.enableTextbox(this.view.txtAmount);
                } else {
                    FormControllerUtility.disableTextbox(this.view.txtAmount);
                }
            }
            if (!editMode) {
                filesToBeUploaded = formDetails.supportedDocuments;
                if (!kony.sdk.isNullOrUndefined(formDetails.supportedDocumentObjects))
                    uploadedAttachments = formDetails.supportedDocumentObjects.split(",");
                else
                    uploadedAttachments = [];
                this.setAttachmentsDataToSegment();
            }
        },
        showTransferError: function(errorMsg) {
            this.view.flxFormContent.setContentOffset({ x: "0%", y: "0%" }, true);
            this.view.flxMakeTransferError.setVisibility(true);
            this.view.flxDialogs.setVisibility(false);
            this.view.flxLookup.setVisibility(false);
            this.view.imgMakeTransferError.setVisibility(false);
            this.view.rtxMakeTransferError.setVisibility(false);
            this.view.GenericMessageNew.setVisibility(true);
            this.view.GenericMessageNew.setContext(errorMsg);
            this.view.forceLayout();
        },
        hideTransferError: function() {
            this.view.flxMakeTransferError.setVisibility(false);
            this.view.forceLayout();
        },
        getDateObjectFromServer: function(dateString) {
            var formatUtilManager = applicationManager.getFormatUtilManager();
            return formatUtilManager.getDateObjectfromString(dateString, "YYYY-MM-DD");
        },

        getCurrDateString: function() {
            return CommonUtilities.getFrontendDateString(CommonUtilities.getServerDateObject().toUTCString());
        },
        /**
         * Method to get the date components
         * @param {object} dateString date string
         * @returns {object} date components
         */
        getDateComponents: function(dateString) {
            var dateObj = applicationManager.getFormatUtilManager().getDateObjectfromString(dateString, applicationManager.getFormatUtilManager().getDateFormat().toUpperCase());
            return [dateObj.getDate(), dateObj.getMonth() + 1, dateObj.getFullYear()];
        },
        /**
         * Method to populate fields for edit transaction scenario
         * @param {object} transaction contains the transaction data
         */
        preFillTransactionForm: function(transaction) {
            var scopeObj = this;
            editMode = true;
            this.resetCalendarForFrequency(transaction.frequencyType);
            transactionCurrency = transaction.transactionCurrency;
            this.view.lbxFrequency.selectedKey = transaction.frequencyType || "Once";
            this.view.flxTo.onClick = null;
            var dateFormat = applicationManager.getFormatUtilManager().getDateFormat();
            var bankDate = this.bankDateObj.currentWorkingDate || CommonUtilities.getServerDate();
            if (transaction.frequencyStartDate && this.getDateObjectFromServer(transaction.frequencyStartDate) > this.getDateObjectFromServer(bankDate)) {
                this.view.calSendOnNew.date = CommonUtilities.getFrontendDateString(transaction.frequencyStartDate, dateFormat);
                this.view.calSendOnNew.dateComponents = scopeObj.getDateComponents(transaction.frequencyStartDate);
            }
            if (transaction.frequencyEndDate && this.getDateObjectFromServer(transaction.frequencyEndDate) > this.getDateObjectFromServer(bankDate)) {
                this.view.calEndingOnNew.date = CommonUtilities.getFrontendDateString(transaction.frequencyEndDate, dateFormat);
                this.view.calEndingOnNew.dateComponents = scopeObj.getDateComponents(transaction.frequencyEndDate);
            }
            var amount = transaction.amount || 0;
            this.view.txtAmount.text = applicationManager.getFormatUtilManager().formatAmount(amount);
            this.view.txtPaymentReference.text = transaction.transactionsNotes || "";
            this.view.lblCount1.text = 140 - this.view.txtPaymentReference.text.length + "";
            if (transaction.serviceName === "INTRA_BANK_FUND_TRANSFER_CREATE") {
                this.view.flxFeePaidBy.setVisibility(false);
            } else {
                const chargeBearer = transaction.chargeBearer;
                if (chargeBearer) {
                    if (chargeBearer === "OUR") this.onClickMeRadioButton();
                    else if (chargeBearer === "BEN") this.onClickBeneficiaryRadioButton();
                    else if (chargeBearer === "SHA") this.onClickShareRadioButton();
                }
            }
            // this.view.flxAttachments.setVisibility(true);
            this.ManageActivitiesPresenter.retrieveAttachments(transaction.transactionId, this.preFillAttachmentsDataToSegment.bind(this));
        },

        preFillAttachmentsDataToSegment: function(response) {
            var attachmentsArray = (response && response.fileNames) ? response.fileNames : [];
            this.view.flxAttachmentsList.setVisibility(true);
            var attachmentsData = [];
            existingAttachments = attachmentsArray;
            for (var i = 0; i < attachmentsArray.length; i++) {
                attachmentsData[i] = {};
                attachmentsData[i].filename = {
                    "text": CommonUtilities.truncateStringWithGivenLength(attachmentsArray[i].fileName, 32),
                    "toolTip": attachmentsArray[i].fileName
                };
                attachmentsData[i].fileID = attachmentsArray[i].fileID;
                filesToBeUploaded.push(attachmentsArray[i].fileName);
                attachmentsData[i]["imgRemoveAttachment"] = {
                    "src": "bbcloseicon.png"
                };
            }
            this.view.segAddedDocuments.widgetDataMap = {
                "lblAttachedDocument": "filename",
                "imgRemoveAttachment": "imgRemoveAttachment",
                "lblAttachedDocumentID": "fileID"
            };
            this.view.segAddedDocuments.setData(attachmentsData);
            this.view.forceLayout();
        },

        preSelectFromAccount: function(fromAccountNumber) {
            if (fromAccountNumber) {
                var selectedAccount = fromAccounts.filter(function(fromAccount) {
                    return fromAccount.accountID === fromAccountNumber
                })[0];
                if (selectedAccount) {
                    preSelectAccountFrom = selectedAccount;
                    this.selectFromAccount({
						...selectedAccount,
                        lblAccountName: this.getFromAccountName(selectedAccount)
                    })
                }
            }
            this.view.forceLayout();
        },
        preSelectToAccount: function(toAccountNumber, isScheduled, searchByAccountNumber) {
            if (!toAccountNumber) {
                return;
            }
            if (isScheduled == "false") scheduledMode = false;
            else if (isScheduled == "true") {
                scheduledMode = true
            }
            if (isOwnAccountsFlow) {
                var selectedAccount = this.getToAccount(toAccountNumber);
                if (selectedAccount) {
                    preSelectAccountTo = selectedAccount;
                    this.selectedToAccount = null;
                    this.selectToAccount({
                        lblAccountName: this.getFromAccountName(selectedAccount),
                        nickName: selectedAccount.nickName,
                        accountNumber: selectedAccount.accountNumber,
                        swiftCode: selectedAccount.swiftCode,
                        nickName: selectedAccount.nickName,
                        accountID: selectedAccount.accountID,
                        currencyCode: selectedAccount.currencyCode,
                        cif: selectedAccount.cif,
                    })
                }
            } else {
                var selectedAccount = this.getToAccount(toAccountNumber, searchByAccountNumber);
                if (selectedAccount) {
                    preSelectAccountTo = selectedAccount;
                    this.selectedToAccount = null;
                    isSameBankAccount = selectedAccount.isSameBankAccount;
                    if (isSameBankAccount === "true") {
                        this.presenter.getBeneficiaryName(selectedAccount.accountNumber, this.view.id);
                    }
                    this.selectToAccount({
                        lblAccountName: this.getToAccountName(selectedAccount),
                        nickName: selectedAccount.nickName,
                        accountNumber: selectedAccount.accountNumber,
                        ExternalAccountNumber: selectedAccount.accountNumber,
                        swiftCode: selectedAccount.swiftCode,
                        nickName: selectedAccount.nickName,
                        addressLine1: selectedAccount.addressLine1,
                        country: selectedAccount.country,
                        city: selectedAccount.city,
                        zipcode: selectedAccount.zipcode,
                        cif: selectedAccount.cif,
                        Id: selectedAccount.Id
                    });
                }
            }

            if (selectedAccount) {
                this.accountToPreSelected = selectedAccount;
                this.accountToIsPreSelectedFlow = true;
                this.showFromAccounts();
            }
            this.view.forceLayout();
        },

        showFromAccounts: function() {
            this.view.segTransferFrom.rowTemplate = "flxFromAccountsList";
            this.view.segTransferFrom.sectionHeaderTemplate = "flxTransfersFromListHeader";
            this.view.segTransferFrom.widgetDataMap = {
                "flxFromAccountsList": "flxFromAccountsList",
                "flxAccountListItem": "flxAccountListItem",
                "lblAccountName": "lblAccountName",
                "flxTransfersFromListHeader": "flxTransfersFromListHeader",
                "lblTransactionHeader": "lblTransactionHeader",
                "imgDropDown": "imgDropDown",
                "flxDropDown": "flxDropDown",
                "flxAmount": "flxAmount",
                "flxSeparator": "flxSeparator",
                "lblSeparator": "lblSeparator",
                "lblTopSeparator": "lblTopSeparator",
                "lblAmount": "lblAmount",
                "lblCurrencySymbol": "lblCurrencySymbol",
                "flxIcons": "flxIcons",
                "imgIcon": "imgIcon",
                "imgBankIcon": "imgBankIcon",
                "flxBankIcon": "flxBankIcon",
                "lblAccType": "lblAccType",
                "flxTransfersFromListHeader": "flxTransfersFromListHeader",
                "lblTransactionHeader": "lblTransactionHeader",
                "imgDropDown": "imgDropDown",
                "flxDropDown": "flxDropDown"
            };
            var filteredAccounts = fromAccounts
                .filter(function(account) {
                    return account.accountType !== "Loan" && account.accountType !== "CreditCard" && account.accountType !== "Deposit" && account.externalIndicator !== "true"
                })
                .filter(function(account) {
                    return CommonUtilities.substituteforIncludeMethod(account.nickName.toLowerCase(), fromAccountSaerchTerm.toLowerCase()) ||
                        CommonUtilities.substituteforIncludeMethod(account.accountID.toLowerCase(), fromAccountSaerchTerm.toLowerCase())
                })

            var filteredAccounts = this.removeToAccount(filteredAccounts);

            if (this.accountToPreSelected && this.accountToPreSelected.cif) {

                // let toMemId = JSON.parse(this.accountToPreSelected.cif)[0].coreCustomerId.split(',');
                let toMemId = [];
                JSON.parse(this.accountToPreSelected.cif).forEach(x => toMemId.push(...x.coreCustomerId.split(',')));
                filteredAccounts = filteredAccounts.filter(x => toMemId.includes(x.Membership_id));

                delete this.accountToPreSelected;
            }

            if (filteredAccounts.length == 0) {
                this.view.segTransferFrom.setVisibility(false);
                this.view.flxNoResultsFrom.setVisibility(true);
                this.selectedFromAccount = null;
                this.resetTransfersForm()
            } else {
                this.view.segTransferFrom.setVisibility(true);
                this.view.flxNoResultsFrom.setVisibility(false);
                var widgetFromData = this.isSingleCustomerProfile ? this.getDataWithAccountTypeSections(filteredAccounts, "from") : this.getDataWithSections(filteredAccounts, "from");
                this.view.segTransferFrom.setData(widgetFromData);
            }
            this.view.forceLayout();
        },

        getFromAccountName: function(account) {
            var isMobileDevice = ((kony.application.getCurrentBreakpoint() === 640) || orientationHandler.isMobile);
            return (account.accountID || account.Account_id) ? (isMobileDevice ? CommonUtilities.truncateStringWithGivenLength(account.accountName + "....", 26) + CommonUtilities.getLastFourDigit(account.accountID) : CommonUtilities.getAccountDisplayName(account)) : (account.payPersonId ? account.nickName : account.nickName + " ...." + CommonUtilities.getLastFourDigit(account.accountNumber))
        },

        getDisplayAmount: function(account) {
            if (account.accountType === "Loan" || account.accountType === "CreditCard") {
                return CommonUtilities.formatCurrencyWithCommas(account.principalBalance, true, account.currencyCode);
            }
            return CommonUtilities.formatCurrencyWithCommas(account.availableBalance, true, account.currencyCode);
        },

        mapFromAccounts: function(fromAccounts) {
            return fromAccounts.map(function(account) {
                return {
                    "lblAccountName": this.getFromAccountName(account),
                    "lblAmount": this.getDisplayAmount(account),
                    "accountID": account.Account_id || account.accountID || account.accountNumber || account.payPersonId || account.PayPersonId,
                    "lblCurrencySymbol": applicationManager.getConfigurationManager().getCurrency(account.currencyCode),
                    "imgIcon": (account.isBusinessAccount === "true") ? "r" : "s",
                    "lblAccType": {
                      "text": account.accountType,
                      "left": this.profileAccess === "both" ? "7px" : "20px",
                    },
                    "lblSeparator": {
                        "isVisible": true
                    }
                };
            }.bind(this))
        },

        showToAccounts: function(accountTo) {
            this.view.segTransferTo.sectionHeaderTemplate = "flxTransfersFromListHeader";
            this.view.segTransferTo.widgetDataMap = {
                "flxFromAccountsList": "flxFromAccountsList",
                "flxAccountListItem": "flxAccountListItem",
                "lblAccountName": "lblAccountName",
                "flxAmount": "flxAmount",
                "flxSeparator": "flxSeparator",
                "lblSeparator": "lblSeparator",
                "lblTopSeparator": "lblTopSeparator",
                "lblAmount": "lblAmount",
                "lblCurrencySymbol": "lblCurrencySymbol",
                "lblBankName": "lblBankName",
                "flxIcons": "flxIcons",
                "imgIcon": "imgIcon",
                "imgBankIcon": "imgBankIcon",
                "lblAccType": "lblAccType",
                "flxTransfersFromListHeader": "flxTransfersFromListHeader",
                "lblTransactionHeader": "lblTransactionHeader",
                "imgDropDown": "imgDropDown",
                "flxDropDown": "flxDropDown"
            };
            if (isOwnAccountsFlow) {
                this.view.segTransferTo.rowTemplate = "flxTransfersFrom";
                var filteredAccounts = fromAccounts.filter(function(account) {
                    return CommonUtilities.substituteforIncludeMethod(account.accountName.toLowerCase(), toAccountSearchTerm.toLowerCase()) ||
                        CommonUtilities.substituteforIncludeMethod(account.accountID.toLowerCase(), toAccountSearchTerm.toLowerCase())
                })
                filteredAccounts = this.removeFromAccount(filteredAccounts);
                let toAccountsList = filteredAccounts;
                if (this.accountFromPreSelected) {
                    filteredAccounts = this.presenter.filterToAccountsByMembershipId(this.accountFromPreSelected.Membership_id, filteredAccounts);
                    delete this.accountFromPreSelected;
                } else if (this.selectedFromAccount && this.selectedFromAccount.Membership_id) {
                    filteredAccounts = this.presenter.filterToAccountsByMembershipId(this.selectedFromAccount.Membership_id, filteredAccounts);
                }
                filteredAccounts = filteredAccounts.concat(this.presenter.filterCreditCardAccount("CreditCard", toAccountsList));
                if (filteredAccounts.length == 0) {
                    this.view.segTransferTo.setVisibility(false);
                    this.view.flxNoResultsTo.setVisibility(true);
                } else {
                    this.view.segTransferTo.setVisibility(true);
                    this.view.flxNoResultsTo.setVisibility(false);
                    var widgetFromData = this.isSingleCustomerProfile ? this.getDataWithAccountTypeSections(filteredAccounts, "from") : this.getDataWithSections(filteredAccounts, "from");
                    this.view.segTransferTo.setData(widgetFromData);
                }
            } else {
               	this.view.segTransferTo.rowTemplate = (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) ? "flxTransfersToMobile" : "flxTransfersTo"
                var filteredAccounts = toAccounts.filter(function(account) {
                    var searchBy = account.beneficiaryName || "";
                    var searchByNickName = account.nickName || "";
                    return CommonUtilities.substituteforIncludeMethod(searchBy.toLowerCase(), toAccountSearchTerm.toLowerCase()) || CommonUtilities.substituteforIncludeMethod(searchByNickName.toLowerCase(), toAccountSearchTerm.toLowerCase())
                });

                if (this.accountFromPreSelected) {
                    filteredAccounts = this.presenter.filterToAccountsByMembershipId(this.accountFromPreSelected.Membership_id, filteredAccounts);
                    delete this.accountFromPreSelected;
                } else if (this.selectedFromAccount && this.selectedFromAccount.Membership_id) {
                    filteredAccounts = this.presenter.filterToAccountsByMembershipId(this.selectedFromAccount.Membership_id, filteredAccounts);
                }

                if (filteredAccounts.length == 0) {
                    this.view.segTransferTo.setVisibility(false);
                    this.view.flxNoResultsTo.setVisibility(true);
                } else {
                    this.view.segTransferTo.setVisibility(true);
                    this.view.flxNoResultsTo.setVisibility(false);

                    this.view.segTransferTo.setData(this.mapToAccounts(filteredAccounts));
                }
                if (this.view.txtTransferTo.text !== "") {
                    this.view.flxCancelFilterTo.setVisibility(true);
                    this.view.lblNew.setVisibility(true);
					this.view.flxToIcon.setVisibility(false);
                    this.toggleNewBeneficiary(true);
                    this.view.lblRadioBtn1.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                    this.view.lblRadioBtn1.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
                    this.view.lblRadioBtn2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                    this.view.lblRadioBtn2.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
                    this.view.lblRadioBtn3.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
                    this.view.lblRadioBtn3.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;

                }
            }
            this.view.forceLayout();
        },
        removeToAccount: function(accounts) {
            var toAccount = this.getFormDetails().toAccount;
            if (toAccount) {
                return accounts.filter(function(account) {
                    return account.accountID != toAccount.accountID
                })
            }
            return accounts;
        },
        removeFromAccount: function(accounts) {
            var fromAccount = this.getFormDetails().fromAccount;
            if (fromAccount) {
                return accounts.filter(function(account) {
                    return account.accountID != fromAccount.accountID
                })
            }
            return accounts;
        },
        /**
         * Method to check valid IBAN & get BIC
         */
        validateIBAN: function() {
            var scopeObj = this;
            var validationUtilityManager = applicationManager.getValidationUtilManager();
            var IBAN = scopeObj.view.txtAccountNumber.text.trim();
            if (IBAN !== "") {
                if (scopeObj.view.lblBankRadioBtn01.text === ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO) {
                    if (!validationUtilityManager.isValidAccountNumber(IBAN)) {
                        scopeObj.view.txtAccountNumber.skin = ViewConstants.SKINS.BORDER;
                        CommonUtilities.setText(scopeObj.view.lblWarning, kony.i18n.getLocalizedString("i18n.TransfersEur.InvalidAccountNumberMessage"), CommonUtilities.getaccessibilityConfig());
                        scopeObj.view.lblWarning.setVisibility(true);
                    } else {
                        scopeObj.validateExistingorNot(IBAN);
                    }
                } else {
                    //scopeObj.toggleRadioButton2();
                    scopeObj.view.BtnLookup.setVisibility(true);
                    if (validationUtilityManager.isValidIBAN(IBAN)) {
                        // isSameBankAccount = false;
                        // isInternationalAccount = true;
                        scopeObj.validateExistingorNot(IBAN)

                    } else if (!validationUtilityManager.isValidAccountNumber(IBAN)) {
                        CommonUtilities.setText(scopeObj.view.lblWarning, kony.i18n.getLocalizedString("i18n.TransfersEur.InvalidIBANMessage"), CommonUtilities.getaccessibilityConfig());
                        scopeObj.view.txtAccountNumber.skin = ViewConstants.SKINS.BORDER;
                        scopeObj.view.lblWarning.setVisibility(true);
                    } else {
                        scopeObj.validateExistingorNot(IBAN)
                        //By default considering the account as international
                        isInternationalAccount = "true";
                        isSameBankAccount = "false";
                        this.checkCurrency();
                        this.checkPaymentMedium();
                        this.view.txtSwift.text = "";
                        FormControllerUtility.enableTextbox(this.view.txtSwift);
                    }
                }
            }
            scopeObj.view.flxFormContent.forceLayout();
        },
        /**
         * Method to check existed accountnumber or not 
         */
        validateExistingorNot: function(IBAN) {
            var scopeObj = this;
            if (scopeObj.view.lblBankRadioBtn01.text === ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO) {
                scopeObj.presenter.getBeneficiaryName(IBAN, this.view.id);
            } else {
                scopeObj.presenter.isValidIBAN(IBAN, this.view.id);
            }
        },

        hidePopups: function() {
            var currFormObj = kony.application.getCurrentForm();
            if ((currFormObj.flxFromSegment.isVisible === true && fromSeg === true) || (currFormObj.flxToSegment.isVisible === true && toSeg === true)) {
                fromSeg = false;
                toSeg = false;
            } else if ((currFormObj.flxFromSegment.isVisible === true && fromSeg === false) || (currFormObj.flxToSegment.isVisible === true && toSeg === false)) {
                if (this.view.txtTransferFrom.text !== "" && currFormObj.flxFromSegment.isVisible === true) {
                    // this.view.txtTransferFrom.text = "";
                    // this.view.flxCancelFilterFrom.setVisibility(false);
                    //this.fetchFromAccountsBySearch();
                }
                setTimeout(function() {
                    if(!fromScroll){
                        currFormObj.flxFromSegment.setVisibility(false);
                        fromSeg = true;
                    }
                    fromScroll = false;
                }, "17ms");
                if (this.view.txtTransferTo.text !== "" && currFormObj.flxToSegment.isVisible === true) {
                    // this.view.txtTransferTo.text = "";
                    // this.view.flxCancelFilterTo.setVisibility(false);
                    this.fetchToAccountsBySearch();
                    //this.toggleCreditCardFlexes(true);
                }
                setTimeout(function() {
                    if(!toScroll){
                    currFormObj.flxToSegment.setVisibility(false);
                    toSeg = true;
                    }
                    toScroll = false;
                }, "17ms")
            } else if ((currFormObj.flxFromSegment.isVisible === false && fromSeg === false) || (currFormObj.flxToSegment.isVisible === false && toSeg === false)) {
                fromSeg = true;
                toSeg = true;
            }
            if (currFormObj.customheadernew.flxContextualMenu.isVisible === true) {
                setTimeout(function() {
                    currFormObj.customheadernew.flxContextualMenu.setVisibility(false);
                    currFormObj.customheadernew.flxTransfersAndPay.skin = ViewConstants.SKINS.BLANK_SKIN_TOPMENU;
                    currFormObj.customheadernew.imgLblTransfers.text = "O";
                }, "17ms")
            }
        },

        setupFormOnTouchEnd: function(width) {
            var self = this;
            if (width == 640) {
                this.view.onTouchEnd = function() {}
                // this.nullifyPopupOnTouchStart();
            } else {
                if (width == 1024) {
                    this.view.onTouchEnd = function() {}
                    // this.nullifyPopupOnTouchStart();
                } else {
                    this.view.onTouchEnd = function() {
                        self.hidePopups();
                    }
                }
                var userAgent = kony.os.deviceInfo().userAgent;
                if (userAgent.indexOf("iPad") != -1) {
                    this.view.onTouchEnd = function() {}
                    // this.nullifyPopupOnTouchStart();
                } else if (userAgent.indexOf("Android") != -1 && userAgent.indexOf("Mobile") == -1) {
                    this.view.onTouchEnd = function() {}
                    // this.nullifyPopupOnTouchStart();
                }
            }
        },


        getToAccountName: function(toAccount) {
            var accountName = toAccount.beneficiaryName || toAccount.nickName;
            var nameToShow = "";
            if (accountName) {
                nameToShow = accountName + "...." + CommonUtilities.getLastFourDigit(toAccount.accountNumber);
            } else {
                nameToShow = toAccount.accountNumber;
            }
            return nameToShow;
        },

        mapToAccounts: function(toAccounts) {
            return toAccounts.map(function(toAccount) {
                return {
                    "lblAccountName": this.getToAccountName(toAccount),
                    "lblSeparator": {
                        "isVisible": true
                    },
                    "accountNumber": toAccount.Id || toAccount.accountID,
                    "ExternalAccountNumber": toAccount.accountNumber,
                  	"isSameBankAccount": toAccount.isSameBankAccount,
                    "swiftCode": toAccount.swiftCode,
                    "nickName": toAccount.nickName,
                    "isInternational": toAccount.isInternationalAccount,
                    "addressLine1": toAccount.addressLine1,
                    "addressLine2": toAccount.addressLine2,
                    "country": toAccount.country,
                    "city": toAccount.city,
                    "zipcode": toAccount.zipcode,
                    "lblBankName":toAccount.bankName ? toAccount.bankName:applicationManager.getUserPreferencesManager().getUserObj().bankName
                };
            }.bind(this))
        },

        SetRadioBtnInstantNextDay: function(RadioBtnSelected, RadioBtnUnselected) {

            RadioBtnSelected.text = "M";
            RadioBtnSelected.skin = "sknlblOLBFonts0273E420pxOlbFontIcons";
            RadioBtnUnselected.text = "L";
            RadioBtnUnselected.skin = "sknlblOLBFontsE3E3E320pxOlbFontIcons";
            //scopeObj.setValidationErrorMessageState(false);
        },

        onInstantPaymentonTouchStart: function(event) {
            var scopeObj = this;
            scopeObj.SetRadioBtnInstantNextDay(this.view.lblradioButton1, this.view.lblradioButton2);

        },

        onNextBankingDayPaymentonTouchStart: function(event) {
            var scopeObj = this;
            scopeObj.SetRadioBtnInstantNextDay(this.view.lblradioButton2, this.view.lblradioButton1);

        },
        /**
         * Method to set the current working bank date
         * @param {Object} bankDateObj object containing bank date
         */
        setBankDate: function(bankDateObj) {
            if (this.isModify) return;
            var scopeObj = this;
            scopeObj.bankDate = bankDateObj;
            var bankDate = bankDateObj.currentWorkingDate || CommonUtilities.getServerDate();
            scopeObj.disableOldDaySelection(scopeObj.view.calSendOnNew, bankDate);
            scopeObj.disableOldDaySelection(scopeObj.view.calEndingOnNew, bankDate);
            scopeObj.disableOldDaySelection(scopeObj.view.calSendOnLoans, bankDate);
        },
        /**
         * Method to disable the selection of past dates and sets the date range for a calendar widget.
         * @param {String} widgetId - calendar widget ID
         * @param {String} bankDate - calendar widget's date selection will be disabled for backdated dates of bankDate
         */
        disableOldDaySelection: function(widgetId, bankDate) {
            var numberOfYearsAllowed = OLBConstants.CALENDAR_ALLOWED_FUTURE_YEARS;
            var today = new Date(bankDate);
            var futureDate = new Date(today.getTime() + (1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * 365 /*days*/ * numberOfYearsAllowed));
            widgetId.enableRangeOfDates([today.getDate(), today.getMonth() + 1, today.getFullYear()], [futureDate.getDate(), futureDate.getMonth() + 1, futureDate.getFullYear()], "skn", true);
            widgetId.dateComponents = [today.getDate(), today.getMonth() + 1, today.getFullYear()];
        },
        /**
         * Method to toggle credit card payment type radio buttons
         * @param {function} onChange - call back function to handle amount field
         * @param {Object} radioButton - widget to be toggled
         */
        onClickRadioButtonCreditCard: function(onChange, radioButton) {
            var scopeObj = this;
            var selectedButton;
            var allRadioButtons = ["lblCCRadioBtn1", "lblCCRadioBtn2", "lblCCRadioBtn3", "lblCCRadioBtn4"];
            if (radioButton && radioButton.widgets()) {
                selectedButton = radioButton.widgets()[0].id;
            } else {
                return;
            }
            var selectRadioButton = function(button) {
                if (onChange) {
                    onChange(button);
                }
                var RadioBtn = scopeObj.view[button];
                RadioBtn.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
                RadioBtn.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
            }
            var unSelectRadioButton = function(button) {
                var RadioBtn = scopeObj.view[button];
                RadioBtn.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                RadioBtn.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
            }
            allRadioButtons.forEach(function(button) {
                button === selectedButton ? selectRadioButton(button) : unSelectRadioButton(button);
            });
        },
        /**
         * Method to handle amount field in credit card payments
         * @param {Object} selectedAccount - object containing selected credit card account data
         * @param {Object} button - widget on basis which amount value is assigned
         */
        onRadioCreditCardListener: function(selectedAccount, button) {
            this.clearAmount = true;
            FormControllerUtility.disableTextbox(this.view.txtAmount);
            switch (button) {
                case "lblCCRadioBtn1":
                    this.view.txtAmount.text = applicationManager.getFormatUtilManager().formatAmount(selectedAccount.minimumDue);
                    paymentType = kony.i18n.getLocalizedString("i18n.TransfersEur.MinimumDue");
                    break;
                case "lblCCRadioBtn2":
                    this.view.txtAmount.text = applicationManager.getFormatUtilManager().formatAmount(selectedAccount.paymentDue);
                    paymentType = kony.i18n.getLocalizedString("i18n.TransfersEur.StatementDue");
                    break;
                case "lblCCRadioBtn3":
                    this.view.txtAmount.text = applicationManager.getFormatUtilManager().formatAmount(selectedAccount.outstandingBalance);
                    paymentType = kony.i18n.getLocalizedString("i18n.TransfersEur.OutstandingBalance");
                    break;
                case "lblCCRadioBtn4":
                    this.view.txtAmount.text = "";
                    FormControllerUtility.enableTextbox(this.view.txtAmount);
                    paymentType = kony.i18n.getLocalizedString("i18n.Transfers.OtherAmount");
                    break;
            }
            this.checkValidityMakeFastTransferForm();
        },
        /**
         * Method to show Credit Card payment view
         * @param {Object} selectedAccount - object containing selected credit card account data
         */
        showCreditCardView: function(selectedAccount) {
            this.view.flxCreditCard.setVisibility(true);
            this.view.lblSendOnLoans.setVisibility(true);
            this.view.flxCalLoans.setVisibility(true);
            this.view.lblFrequency.setVisibility(false);
            this.view.flxContainer5.setVisibility(false);
            this.view.lbxFrequency.setVisibility(false);
            this.view.lbxFrequency.selectedKey = "Once";
            this.view.lblDueDateValue.text = this.getDateComponents(selectedAccount.dueDate).join('/');
            this.view.flxMinimumDue.onClick = this.onClickRadioButtonCreditCard.bind(this, this.onRadioCreditCardListener.bind(this, selectedAccount));
            this.view.flxStatementDue.onClick = this.onClickRadioButtonCreditCard.bind(this, this.onRadioCreditCardListener.bind(this, selectedAccount));
            this.view.flxOutstandingBalance.onClick = this.onClickRadioButtonCreditCard.bind(this, this.onRadioCreditCardListener.bind(this, selectedAccount));
            this.view.flxPayOtherAmount.onClick = this.onClickRadioButtonCreditCard.bind(this, this.onRadioCreditCardListener.bind(this, selectedAccount));
            if (!this.isModify) {
                this.onClickRadioButtonCreditCard(this.onRadioCreditCardListener.bind(this, selectedAccount), this.view.flxMinimumDue);
            }
            this.isModify = false;
        },
        /**
         * Method to hide Credit Card payment view
         */
        hideCreditCardView: function() {
            this.view.flxCreditCard.setVisibility(false);
            this.view.lblSendOnLoans.setVisibility(false);
            this.view.flxCalLoans.setVisibility(false);
            this.view.flxContainer5.setVisibility(true);
            this.view.lblFrequency.setVisibility(true);
            this.view.lbxFrequency.setVisibility(true);
            if (this.clearAmount) {
                this.view.txtAmount.text = "";
                this.clearAmount = false;
            }
        },

        showPaymentCutOff: function(viewModel) {
            this.view.flxPaymemtsCutOff.setVisibility(true);
            if (this.cutOffFlow === "choice") {
                this.view.flxPaymentSelection.setVisibility(true);
                this.view.flxPaymentCutOffNote.setVisibility(false);
                CommonUtilities.setText(this.view.lblCutOff, kony.i18n.getLocalizedString("i18n.TransfersEur.CutOffNote"), CommonUtilities.getaccessibilityConfig());
            } else {
                this.view.flxPaymentCutOffNote.setVisibility(true);
                CommonUtilities.setText(this.view.lblCutOff, kony.i18n.getLocalizedString("i18n.TransfersEur.CutOffNote"), CommonUtilities.getaccessibilityConfig());
                this.view.flxPaymentSelection.setVisibility(false);
            }
        },

        hidePaymentCutOff: function() {
            this.cutOffFlow = false;
            this.view.flxPaymemtsCutOff.setVisibility(false);
        },
        hideNewPayment: function() {
            this.view.flxNewPayment.setVisibility(false)
        },
        hidePaymentActivities: function() {
            this.view.flxNewPayment.setVisibility(false);
        },
        hideManageBeneficiaries: function() {
            this.view.flxManageBeneficiaries.setVisibility(false);
        },
        showNewPayment: function() {
            this.view.flxNewPayment.setVisibility(true);
        },
        showPaymentActivities: function() {
            this.view.flxNewPayment.setVisibility(true);

        },
        showManageBeneficiaries: function() {
            this.view.flxManageBeneficiaries.setVisibility(true);
        },

        searchSwift: function() {
            var searchData = [];
            if (this.view.txtCountry1.text && this.view.txtCountry1.text.length > 0) {
                searchData.country = this.view.txtCountry1.text;
            }
            if (this.view.txtCity1.text && this.view.txtCity1.text.length > 0) {
                searchData.city = this.view.txtCity1.text;
            }
            if (this.view.txtBankName.text && this.view.txtBankName.text.length > 0) {
                searchData.bankName = this.view.txtBankName.text;
            }
            var transferMod = applicationManager.getModulesPresentationController("TransferEurUIModule");
            transferMod.searchAllSwiftBICCode(searchData, "frmMakePayment");

            //   this.setSegmentData(searchData);
        },


        setSegmentData: function(data) {

            if (data && data.length > 0) {
                this.view.segResults.widgetDataMap = this.getWidgetDataMap();
                this.view.segResults.setData(data);

                this.view.segResults.setVisibility(true);
                this.view.flxNoResults.setVisibility(false);
            } else {
                this.view.flxNoResults.setVisibility(true);
                this.view.segResults.setVisibility(false);
            }
        },

        segRowClick: function() {
            var rowindex;
            rowindex = Math.floor(this.view.segResults.selectedRowIndex[1]);
            selectedAccount = this.view.segResults.data[rowindex];
            this.view.txtSwift.text = selectedAccount.bic;
            bank_country = selectedAccount.country;
            bank_name = selectedAccount.bankName;
            isSameBankAccount = "false";
            isInternationalAccount = "true";
            this.view.flxLookup.setVisibility(false);
        },

        getWidgetDataMap: function() {
            var dataMap = {
                lblSwiftCodeValue: "bic",
                lblBankValue: "bankName",
                lblCityNameValue: "city",
                lblCountryNameValue: "country",
            };
            return dataMap;
        },

        clearSearch: function() {
            this.view.txtBankName.text = '';
            this.view.txtCity1.text = '';
            this.view.txtCountry1.text = '';
            this.view.segResults.setData([]);

        },

        /**
         * creates segment with account numbers and other details with particular header values
         * @param typeOfTransfer - differentiate whether it is "to" or "from" account transaction
         */
        getDataWithSections: function(accounts, typeOfTransfer) {
            var scopeObj = this;
            var finalData = {};
            var prioritizeAccountTypes = ["Personal Accounts"];
            accounts.forEach(function(account) {
                var accountType = "Personal Accounts";
                var accountTypeIcon = "";
                var primaryCustomerId = applicationManager.getUserPreferencesManager().primaryCustomerId;
                var isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
                if (account.isBusinessAccount === "false") {
                    //                     if(!kony.sdk.isNullOrUndefined(primaryCustomerId)){
                    if (scopeObj.primaryCustomerId.id === account.Membership_id && scopeObj.primaryCustomerId.type === 'personal') {
                        accountType = "Personal Accounts";
                        accountTypeIcon = "s";
                    }
                    //                      }
                    else {
                        accountType = account.Membership_id;
                        accountTypeIcon = "s";
                    }
                } else {
                    accountType = account.Membership_id;
                    accountTypeIcon = "r";
                }
                if (finalData.hasOwnProperty(accountType) && account.Membership_id === finalData[accountType][0]["membershipId"]) {
                    if (finalData[accountType][1][finalData[accountType][1].length - 1].length === 0) {
                        finalData[accountType][1].pop();
                    }
                    finalData[accountType][1].push(scopeObj.createSegmentData(account, typeOfTransfer));
                } else {
                  if(accountType!="Personal Accounts")
                  {
                    prioritizeAccountTypes.push(accountType);
                  }
                    finalData[accountType] = [{
                            lblTransactionHeader: accountType === "Personal Accounts" ? accountType : account.MembershipName,
                            lblSeparator: {
                                "isVisible": true
                            },
                            imgDropDown: "P",
                            flxDropDown: {
                                "onClick": function(context) {
                                    scopeObj.showOrHideAccountRows(context);
                                }.bind(this)
                            },
                            template: "flxTransfersFromListHeader",
                            membershipId: account.Membership_id
                        },
                        [scopeObj.createSegmentData(account, typeOfTransfer)]
                    ];
                }
            });
            var data = [];

            for (var key in prioritizeAccountTypes) {
                var accountType = prioritizeAccountTypes[key];
                if (finalData.hasOwnProperty(accountType)) {
                    data.push(finalData[accountType]);
                }
            }
            return data;
        },

        /*create segment data with account type grouping
         */
        getDataWithAccountTypeSections: function(accounts, typeOfTransfer) {
            var scopeObj = this;
            var finalData = {};
            var isCombinedUser = applicationManager.getConfigurationManager().getConfigurationValue('isCombinedUser') === "true";
            var prioritizeAccountTypes = applicationManager.getTypeManager().getAccountTypesByPriority();
            accounts.forEach(function(account) {
                var accountType = applicationManager.getTypeManager().getAccountType(account.accountType);
                if (finalData.hasOwnProperty(accountType)) {
                    finalData[accountType][1].push(scopeObj.createSegmentData(account, typeOfTransfer));
                    var totalAccount = finalData[accountType][1].length;
                    finalData[accountType][0].lblAccountTypeNumber = {
                        "text": "(" + totalAccount + ")"
                    }
                } else {
                    finalData[accountType] = [{

                            lblTransactionHeader: {
                                text: accountType,
                                left: "10dp"
                            },
                            lblSeparator: {
                                "isVisible": true
                            },
                            imgDropDown: "P",
                            flxDropDown: {
                                "onClick": function(context) {
                                    scopeObj.showOrHideAccountRows(context);
                                }.bind(this),
                                "isVisible": false
                            },
                            template: "flxTransfersFromListHeader",

                        },
                        [scopeObj.createSegmentData(account, typeOfTransfer)]
                    ];
                }
            });
            this.sectionData = [];
            var data = [];
            for (var key in prioritizeAccountTypes) {
                var accountType = prioritizeAccountTypes[key];
                if (finalData.hasOwnProperty(accountType)) {
                    data.push(finalData[accountType]);
                    this.sectionData.push(accountType);
                }
            }
            return data;
        },

        /*create segment data grouped by membership name
         */
        getToDataWithSections: function(accounts) {
            var scopeObj = this;
            var finalData = {};
            var prioritizeAccountTypes = [];
            accounts.forEach(function(account) {
                var accountType = "Personal Accounts";
                var accountTypeIcon = "";
                var primaryCustomerId = applicationManager.getUserPreferencesManager().primaryCustomerId;
                var isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
                if (account.isBusinessAccount === "false") {
                    //                     if(!kony.sdk.isNullOrUndefined(primaryCustomerId)){
                    if (scopeObj.primaryCustomerId.id === account.Membership_id && scopeObj.primaryCustomerId.type === 'personal') {
                        accountType = "Personal Accounts";
                        accountTypeIcon = "s";
                    }
                    //                      }
                    else {
                        accountType = account.Membership_id;
                        accountTypeIcon = "s";
                    }
                } else {
                    accountType = account.Membership_id;
                    accountTypeIcon = "r";
                }
                if (finalData.hasOwnProperty(accountType) && account.Membership_id === finalData[accountType][0]["membershipId"]) {
                    if (finalData[accountType][1][finalData[accountType][1].length - 1].length === 0) {
                        finalData[accountType][1].pop();
                    }
                    finalData[accountType][1].push(scopeObj.createSegmentDataTo(account));
                } else {
                    prioritizeAccountTypes.push(accountType);
                    finalData[accountType] = [{
                            lblTransactionHeader: account.MembershipNam,
                            lblSeparator: {
                                "isVisible": true
                            },
                            imgDropDown: "P",
                            flxDropDown: {
                                "onClick": function(context) {
                                    scopeObj.showOrHideAccountRows(context);
                                }.bind(this)
                            },
                            template: "flxTransfersFromListHeader",
                            membershipId: account.Membership_id
                        },
                        [scopeObj.createSegmentDataTo(account)]
                    ];
                }
            });
            var data = [];

            for (var key in prioritizeAccountTypes) {
                var accountType = prioritizeAccountTypes[key];
                if (finalData.hasOwnProperty(accountType)) {
                    data.push(finalData[accountType]);
                }
            }
            return data;
        },

        getToDataWithAccountTypeSections: function(accounts) {
            var scopeObj = this;
            var finalData = {};
            var isCombinedUser = applicationManager.getConfigurationManager().getConfigurationValue('isCombinedUser') === "true";
            var prioritizeAccountTypes = applicationManager.getTypeManager().getAccountTypesByPriority();
            accounts.forEach(function(account) {
                var accountType = applicationManager.getTypeManager().getAccountType(account.accountType);
                if (finalData.hasOwnProperty(accountType)) {
                    finalData[accountType][1].push(scopeObj.createSegmentDataTo(account, typeOfTransfer));
                } else {
                    finalData[accountType] = [{

                            lblTransactionHeader: {
                                text: accountType,
                                left: "10dp"
                            },
                            lblSeparator: {
                                "isVisible": true
                            },
                            imgDropDown: "P",
                            flxDropDown: {
                                "onClick": function(context) {
                                    scopeObj.showOrHideAccountRows(context);
                                }.bind(this),
                                "isVisible": false
                            },
                            template: "flxTransfersFromListHeader",

                        },
                        [scopeObj.createSegmentDataTo(account, typeOfTransfer)]
                    ];
                }
            });
            this.sectionData = [];
            var data = [];
            for (var key in prioritizeAccountTypes) {
                var accountType = prioritizeAccountTypes[key];
                if (finalData.hasOwnProperty(accountType)) {
                    data.push(finalData[accountType]);
                    this.sectionData.push(accountType);
                }
            }
            return data;
        },
        /**
         *  creates the row template with account number and other details
         *  @param typeOfTransfer - differentiate whether it is "to" or "from" account transaction 
         */

        createSegmentData: function(account, typeOfTransfer) {
            var isSingleCustomerProfile = applicationManager.getUserPreferencesManager().singleCustomerProfile;
            //var combineduser = applicationManager.getConfigurationManager().isCombinedUser;
            var fromOrToAccountNumber = (typeOfTransfer === "from") ? account.fromAccountNumber : account.toAccountNumber;
            var fromOrToAccountName = (typeOfTransfer === "from") ? account.fromAccountName : account.toAccountName;
            var dataObject = {
                //"lblAccountName": (account.accountID || account.Account_id) ? CommonUtilities.getAccountDisplayName(account) : (account.nickName ? account.nickName : account.name),
                "lblAccountName": (account.accountID || account.Account_id) ? CommonUtilities.truncateStringWithGivenLength(account.accountName + "....", 26) + CommonUtilities.getLastFourDigit(account.accountID) : (kony.sdk.isNullOrUndefined(CommonUtilities.getAccountDisplayName(account)) ? CommonUtilities.getAccountDisplayName(account) : fromOrToAccountName),
                "lblAmount": ((account.accountType !== "CreditCard") && (account.accountType !== "Loan")) ? (account.availableBalance ? CommonUtilities.formatCurrencyWithCommas(account.availableBalance, false, account.currencyCode) : (account.bankName || account.phone || account.email)) : (CommonUtilities.formatCurrencyWithCommas(account.outstandingBalance, false, account.currencyCode)),
                "accountID": account.Account_id || account.accountID || account.accountNumber || account.payPersonId || account.PayPersonId || fromOrToAccountNumber,
                "currencyCode": account.currencyCode,
                "Membership_id": account.Membership_id,
                "imgIcon": {
                    "text": account.isBusinessAccount === "true" ? "r" : "s",
                    "isVisible": this.profileAccess === "both" ? true : false,
                },
                "lblSeparator": {
                    "isVisible": true
                },
                "lblAccType": {
                      "text": account.accountType,
                      "left": this.profileAccess === "both" ? "7px" : "20px",
                 },
                "flxIcons": {
                    "left": this.profileAccess === "both" ? "15px" : "0px"
                },
                "flxBankIcon": {
                    "isVisible": account.externalIndicator === "true" ? true : false,
                },
                "imgBankIcon": {
                    "src": "bank_icon_hdfc.png"
                },
                "flxAccountListItem": {
                    "isVisible": true
                },
				"lblCurrencySymbol":{
					"isVisible":false
				},
                "flxFromAccountsList":{
                    "height": "76dp"
                }

            };
            //} 
            return dataObject;
        },

        createSegmentDataTo: function(toAccount) {
            var data = {
                "lblAccountName": this.getToAccountName(toAccount),
                "lblSeparator": {
                    "isVisible": true
                },
                "accountNumber": toAccount.Id || toAccount.accountID,
                "ExternalAccountNumber": toAccount.accountNumber,
              	"isSameBankAccount": toAccount.isSameBankAccount,
                "swiftCode": toAccount.swiftCode,
                "nickName": toAccount.nickName,
                "isInternational": toAccount.isInternationalAccount,
                "addressLine1": toAccount.addressLine1,
                "country": toAccount.country,
                "city": toAccount.city,
                "zipcode": toAccount.zipcode
            }
            return data;
        },

        /**
         * It shows or hides the particular section 
         */
      showOrHideAccountRows: function(context) {
        fromScroll = true;
        var section = this.view.segTransferFrom.selectedRowIndex[0];
        var segData = this.view.segTransferFrom.data;
        var isRowVisible = true;
        if (segData[section][0].imgDropDown.text === "O") {
          segData[section][0]["imgDropDown"] = {
            text: "P"
          };
          isRowVisible = true;
        } else {
          segData[section][0]["imgDropDown"] = {
            text: "O"
          };
          isRowVisible = false;
        }
        for (var i = 0; i < segData[section][1].length; i++) {
          var flxFromAccountsList = JSON.parse(JSON.stringify(segData[section][1][i].flxFromAccountsList));
          flxFromAccountsList["isVisible"] = isRowVisible;
          flxFromAccountsList["height"] = isRowVisible ? "76dp" : "0dp";
          this.updateKeyAt("flxFromAccountsList", flxFromAccountsList, i, section);
        }
        segData = this.view.segTransferFrom.data;
        this.view.segTransferFrom.setSectionAt(segData[section], section);
        this.setFromAccountsDropdownHeight(segData);
      },
      setFromAccountsDropdownHeight: function(data){
        var totalHeight = 0;
        for (var i = 0; i < data.length; i++) {
          if (data[i][1][0]["flxFromAccountsList"].height !== "0dp") {
            totalHeight += data[i][1].length * 76;
          }
        }
        if(totalHeight === 0){ totalHeight += data.length * 40;}
        this.view.flxFromSegment.height = totalHeight >= 300 ? "300dp" : totalHeight + "dp";
      },

        updateKeyAt: function(widgetName, value, row, section) {
            var data = this.view.segTransferFrom.data;
            var rowDataTobeUpdated = data[section][1][row];
            rowDataTobeUpdated[widgetName] = value;
            this.view.segTransferFrom.setDataAt(rowDataTobeUpdated, row, section);
        },
        resetCalendarForFrequency: function(frequencyValue) {
            if (!frequencyValue) return;
            var scopeObj = this;
            var startDate = new Date(this.bankDateObj.currentWorkingDate || CommonUtilities.getServerDate());
            if (frequencyValue !== "Once") {
                startDate = new Date(startDate.getFullYear() , startDate.getMonth(), startDate.getDate() + 1);
            }
            scopeObj.view.calSendOnNew.dateComponents = null;
            scopeObj.view.calEndingOnNew.dateComponents = null;
            scopeObj.disableOldDaySelection(scopeObj.view.calSendOnNew, startDate);
            scopeObj.disableOldDaySelection(scopeObj.view.calEndingOnNew, startDate);
        }
    };
});