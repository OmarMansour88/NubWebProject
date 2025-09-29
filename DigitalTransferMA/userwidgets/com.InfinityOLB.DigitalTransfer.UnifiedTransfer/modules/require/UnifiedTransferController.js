define(['./UnifiedTransferStore', './UnifiedTransferBusinessController', 'DataValidationFramework/DataValidationHandler'], function (UnifiedTransferStore, BusinessController, DataValidationHandler) {

  return {
    constructor: function (baseConfig, layoutConfig, pspConfig) {
      this._serviceParameters = {};
      this._dataFormatting = {};
      this._dataMapping = {};
      this._breakpoints = {};
      this._conditionalMappingKey = {};
      this._conditionalMapping = {};
      this.businessController = new BusinessController();
      this.dataValidationHandler = new DataValidationHandler();
      this.documentCount = 0;
      this.filesToBeUploaded = [];
      this.uploadedAttachments = [];
      this.base64Content = [];
      this.attachments = [];
      this.FromRecords = [];
      this.groupedFromRecords = [];
      this.ToRecords = [];
      this.groupedToRecords = [];
      this.FromSearchApplied = false;
      this.ToSearchApplied = false;
      this.groupIdentifier = {
        "internal": {
          "identifier": "accountType"
        },
        "segregation": {
          "Checking": "Checking Account",
          "CreditCard": "Credit Card Account",
          "Deposit": "Deposit Account",
          "Loan": "Loan Account",
          "Savings": "Saving Account",
          "default": "All Payees"
        }
      };
      this.isNewAccountNumberValid = true;
      this.isSwiftValid = true;
      this.serviceCurrency = ""
      this.transferFlow1 = "";
      this.transferFlow2 = "";
      this.bankDateObj = {};
    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function () {
      defineGetter(this, 'serviceParameters', () => {
        return this._serviceParameters;
      });
      defineSetter(this, 'serviceParameters', value => {
        this._serviceParameters = value;
      });
      defineGetter(this, 'dataMapping', () => {
        return this._dataMapping;
      });
      defineSetter(this, 'dataMapping', value => {
        this._dataMapping = value;
      });
      defineGetter(this, 'dataFormatting', () => {
        return this._dataFormatting;
      });
      defineSetter(this, 'dataFormatting', value => {
        this._dataFormatting = value;
      });
      defineGetter(this, 'breakpoints', () => {
        return this._breakpoints;
      });
      defineSetter(this, 'breakpoints', value => {
        this._breakpoints = value;
      });
      defineGetter(this, 'conditionalMappingKey', () => {
        return this._conditionalMappingKey;
      });
      defineSetter(this, 'conditionalMappingKey', value => {
        this._conditionalMappingKey = value;
      });
      defineGetter(this, 'conditionalMapping', () => {
        return this._conditionalMapping;
      });
      defineSetter(this, 'conditionalMapping', value => {
        this._conditionalMapping = value;
      });
    },
    /**
    * @api : preShow
    * Gets invoked initially before rendering of UI
    * @return : NA
    */
    preShow: function () {
      var scope = this;
      try {
        this.businessController.setProperties(this.serviceParameters, this.dataMapping, this.dataFormatting, this.breakpoints);
        this.businessController.getMetaDataForAllObjects(scope.context.transferType);
      }
      catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "preShow",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
  * @api : postShow
    * Gets invoked initially after rendering of UI
  * @return : NA
  */
    postShow: function () {
      var scope = this;
      try {
        this.businessController.invokeCustomVerbforGetAccountsAndPayees(scope.context.transferType);
        this.businessController.invokeCustomVerbforGetBankDate();
        this.businessController.invokeCustomVerbforGetAllCountries();
        this.businessController.invokeCustomVerbforGetAllRegions();
        this.initActions();
        this.performValidation();
        this.setConditionalMappingKey();
        if (scope.context.transferFlow !== "Modify") {
          var serviceName = ""
          if (scope.context.transferType === "Same Bank") {
            serviceName = "INTRA_BANK_FUND_TRANSFER_CREATE";
          } else if (scope.context.transferType === "Domestic Transfer") {
            serviceName = "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE";
          } else if (scope.context.transferType === "International Transfer") {
            serviceName = "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE";
          }
          this.businessController.storeInCollection({
            "frequencyType": "Once",
            "isScheduled": "0",
            "payeeType": "Existing Payee",
            "transferType": scope.context.transferType,
            "serviceName": serviceName
          });
          this.initComponentUI();
          this.setUIBasedOnTransferType();
          this.setComponentUILabelText();
          this.setComponentUITextboxPlaceholder();
          this.setComponentUIButtonTextAndTooltip();
        }
        if (scope.context.transferFlow === "Repeat") {
          scope.prefillComponentData();
        }
      }
      catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "postShow",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
    * @api : onBreakPointChange
    * Gets invoked on change of breakpoint in UI
    * @return : NA
    */
    onBreakPointChange: function () {
      var scope = this;
      try {
      }
      catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "onBreakpointChange",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * @api : setContext
     * Method to set the context value 
     * @return : NA
     */
    setContext: function (context) {
      var scope = this;
      try {
        this.unsubscribe = UnifiedTransferStore.subscribe(this.render.bind(this));
        this.store = UnifiedTransferStore;
        this.businessController.store = this.store;
        this.collectionObj = UnifiedTransferStore.getState();
        this.context = context;
        if (!scope.isEmptyNullOrUndefined(context["ErrorDetails"])) {
          scope.showErrorMessage(context["ErrorDetails"]);
        }
        if (context.transferFlow === "Repeat") {
          scope.transferFlow1 = "Repeat";
          scope.transferFlow2 = "Repeat";
        }
        if (!scope.isEmptyNullOrUndefined(scope.collectionObj.Collection["Transaction"]) && !scope.isEmptyNullOrUndefined(scope.collectionObj.Collection["Transaction"]["errorDetails"])) {
          scope.showErrorMessage(scope.collectionObj.Collection["Transaction"]["errorDetails"]);
        }
        if (context.transferFlow !== "Modify") {
          scope.businessController.resetCollection();
          scope.resetComponentData();
        } else {
          scope.businessController.resetValidateCallResponse();
        }
      }
      catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "SetContext",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * @api : unsubscribeStore
     * Method to unsubscribe the store's listener
     * @return : NA
     */
    unsubscribeStore: function() {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    },
    /**
    * @api : render
    * This method will be invoked when collection is updated to refresh UI
    * @return : NA
    */
    render: function () {
      var scope = this;
      try {
        this.collectionObj = UnifiedTransferStore.getState();
        var dvfError = "";
        var widgetId;
        if (!scope.isEmptyNullOrUndefined(scope.collectionObj.Collection["ErrorDetails"])) {
          var form = kony.application.getCurrentForm();
          form.remove(kony.application.getCurrentForm().flxLookups);
          scope.showErrorMessage(scope.collectionObj.Collection.ErrorDetails);
          scope.businessController.resetCollection("ErrorDetails");
        }
        if (!scope.isEmptyNullOrUndefined(scope.collectionObj.Collection.Transaction) && !scope.isEmptyNullOrUndefined(scope.collectionObj.Collection.Transaction["validateSuccess"])) {
          if (scope.collectionObj.Collection.Transaction["validateSuccess"] === true) {
            scope.createTransfer(scope.collectionObj);
          } else if (scope.collectionObj.Collection.Transaction["validateSuccess"] === false) {
            scope.showErrorMessage(scope.collectionObj.Collection["Transaction"]["errorDetails"]);
            scope.businessController.resetValidateCallResponse();
          }
        }
        scope.validateData();
        if (!scope.isEmptyNullOrUndefined(scope.collectionObj.Collection["bankDate"])) {
          this.bankDateObj = scope.collectionObj.Collection["bankDate"];
          scope.businessController.resetCollection("bankDate");
          scope.setBankDate();
        }
        if (scope.view.segFromAccounts.data.length == 0 && !scope.isEmptyNullOrUndefined(scope.collectionObj.Collection["fromAccounts"])) {
          scope.setFromAccountsList();
        }
        if (scope.view.segToAccounts.data.length == 0 && !scope.isEmptyNullOrUndefined(scope.collectionObj.Collection["toAccounts"])) {
          scope.setToAccountsList();
        }
        if (scope.view.segLookupRecords.data.length == 0 && !kony.sdk.isNullOrUndefined(scope.collectionObj.Collection["swiftCodeLookup"])) {
          scope.setSwiftLookUp();
        }
        if (!scope.isEmptyNullOrUndefined(scope.collectionObj.Collection["SwiftCode"])) {
          scope.setSwiftCodeDetailFields();
        }
        if (!scope.isEmptyNullOrUndefined(scope.collectionObj.Collection["accountDetails"])) {
          scope.setAccountDetailsResponse();
        }
        if (!scope.isEmptyNullOrUndefined(scope.collectionObj.Collection["beneficiaryDetails"])) {
          scope.setBeneficiaryDetailsResponse();
        }
        if (scope.view.segFromAccounts.data.length != 0 && scope.transferFlow1 === "Repeat") {
          scope.transferFlow1 = "";
          scope.prefillAccountFields("From");
        }
        if (scope.view.segToAccounts.data.length != 0 && scope.transferFlow2 === "Repeat") {
          scope.transferFlow2 = "";
          scope.prefillAccountFields("To");
        }
        if (scope.collectionObj.Collection["Transaction"]["payeeType"] === "New Payee" && !scope.isEmptyNullOrUndefined(scope.collectionObj.Collection["countries"])) {
          scope.setCountryAndStateMasterData();
        }
        if (!scope.isEmptyNullOrUndefined(scope.collectionObj.Collection["beneficiaryCurrency"])) {
          scope.serviceCurrency = scope.collectionObj.Collection["beneficiaryCurrency"];
          scope.businessController.resetCollection("beneficiaryCurrency");
          scope.setTransferCurrencyFieldFromAccounts(true);
        }
        scope.enableOrDisableContinueButton();
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "render",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    initComponentUI: function () {
      var scope = this;
      try {
        this.view.tbxAccountNumber.secureTextEntry = true;
        this.view.txtNotes.maxTextLength = 140;
        this.view.lblNoToRecordAction.setVisibility(scope.context.transferType !== "Pay a Person");
        this.setDropdownValues(this.view.segFrequencyList, scope.dataMapping["frequencies"], this.view.lblSelectedFrequency);
        this.setDropdownValues(this.view.segTransferDurationList, scope.dataMapping["transferDurations"], this.view.lblSelectedTransferDuration);
        if (scope.context.transferType === "Domestic Transfer" || scope.context.transferType === "International Transfer") {
          this.setCurrencyDropdownValues(this.view.segTransferCurrencyList, scope.dataMapping["currencies"]);
        } else if (scope.context.transferType === "Pay a Person") {
          var baseCurrency = applicationManager.getConfigurationManager().getDeploymentGeography() === "EUROPE" ? "EUR" : "USD";
          scope.view.lblSelectedCurrencySymbol.text = scope.businessController.getCurrencySymbol(baseCurrency);
          scope.view.lblSelectedTransferCurrency.text = scope.view.lblSelectedCurrencySymbol.text + " " + baseCurrency;
          scope.view.flxTransferCurrencyDropdown.setEnabled(false);
          scope.view.flxTransferCurrencyDropdown.skin = "ICSknFlxDisabled";
          scope.businessController.storeInCollection({ "transactionCurrency": baseCurrency });
        }
        scope.view.flxPayeeType2.setVisibility(scope.context.transferType !== "Pay a Person");
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "initComponentUI",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
    * @api : initActions
    * Actions of buttons are initialized
    * @return : NA
    */
    initActions: function () {
      var scope = this;
      try {
        this.view.flxPayeeTypeOption1.onClick = this.setPayeeField.bind(this, "Existing Payee");
        this.view.flxPayeeTypeOption2.onClick = this.setPayeeField.bind(this, "New Payee");
        this.view.lblNoToRecordAction.onTouchEnd = this.setPayeeField.bind(this, "New Payee");
        this.view.imgPaymentMethodInfoIcon.onTouchEnd = this.showInfoPopup.bind(this, this.view.flxPaymentMethodInfo);
        this.view.imgFeesPaidByInfoIcon.onTouchEnd = this.showInfoPopup.bind(this, this.view.flxFeesPaidByInfo);
        this.view.imgSupportingDocumentsInfoIcon.onTouchEnd = this.showInfoPopup.bind(this, this.view.flxSupportingDocumentsInfo);
        this.view.imgPaymentMethodInfoCloseIcon.onTouchEnd = this.hideInfoPopup.bind(this, this.view.flxPaymentMethodInfo);
        this.view.imgFeesPaidByCloseIcon.onTouchEnd = this.hideInfoPopup.bind(this, this.view.flxFeesPaidByInfo);
        this.view.imgSupportingDocumentInfoCloseIcon.onTouchEnd = this.hideInfoPopup.bind(this, this.view.flxSupportingDocumentsInfo);
        this.view.flxPaymentTypeOption1.onClick = this.onPaymentAmountTypeSelect.bind(this, 1);
        this.view.flxPaymentTypeOption2.onClick = this.onPaymentAmountTypeSelect.bind(this, 2);
        this.view.flxPaymentTypeOption3.onClick = this.onPaymentAmountTypeSelect.bind(this, 3);
        this.view.flxPaymentTypeOption4.onClick = this.onPaymentAmountTypeSelect.bind(this, 4);
        this.view.flxPaymentMethodOption1.onClick = this.onPaymentMethodSelect.bind(this, 1);
        this.view.flxPaymentMethodOption2.onClick = this.onPaymentMethodSelect.bind(this, 2);
        this.view.flxPaymentMethodOption3.onClick = this.onPaymentMethodSelect.bind(this, 3);
        this.view.flxPaymentMethodOption4.onClick = this.onPaymentMethodSelect.bind(this, 4);
        this.view.flxFeesPaidByOption1.onClick = this.onFeesPaidBySelect.bind(this, 1);
        this.view.flxFeesPaidByOption2.onClick = this.onFeesPaidBySelect.bind(this, 2);
        this.view.flxFeesPaidByOption3.onClick = this.onFeesPaidBySelect.bind(this, 3);
        this.view.tbxIntermediaryBic.onKeyUp = this.setFormattedBicDetails.bind(this, "tbxIntermediaryBic");
        this.view.txtNotes.onKeyUp = this.updateNotesLengthIndicator.bind(this);
        this.view.flxFrequencyDropdown.onClick = this.toggleDropdownVisibility.bind(this, this.view.flxFrequencyDropdown, this.view.flxFrequencyList, this.view.lblFrequencyDropdownIcon);
        this.view.flxTransferDurationDropdown.onClick = this.toggleDropdownVisibility.bind(this, this.view.flxTransferDurationDropdown, this.view.flxTransferDurationList, this.view.lblTransferDurationDropdownIcon);
        this.view.flxTransferCurrencyDropdown.onClick = this.toggleDropdownVisibility.bind(this, this.view.flxTransferCurrencyDropdown, this.view.flxTransferCurrencyList, this.view.lblTransferCurrencyDropdownIcon);
        this.view.segFrequencyList.onRowClick = this.onFrequencySelection.bind(this);
        this.view.segTransferDurationList.onRowClick = this.onTransferDurationSelection.bind(this);
        this.view.segTransferCurrencyList.onRowClick = this.onCurrencySelection.bind(this);
        this.view.flxPayeeAddressDetailIcon.onClick = this.togglePayeeAddressVisibility.bind(this, this.view.flxPayeeAddress, this.view.imgPayeeAddressDetailIcon);
        this.view.flxAttachDocumentsIcon.onClick = this.browseSupportingDocument.bind(this);
        this.view.lbxAddressField7.onSelection = this.updateStateList.bind(this);
        this.view.lbxAddressField6.onSelection = this.selectState.bind(this);
        this.view.flxFromTextBox.onTouchStart = this.toggleAccountsDropdown.bind(this, "From");
        this.view.flxToTextBox.onTouchStart = this.toggleAccountsDropdown.bind(this, "To");
        this.view.segFromAccounts.onRowClick = this.onFromAccountSelection.bind(this);
        this.view.segToAccounts.onRowClick = this.onToAccountSelection.bind(this);
        this.view.tbxFromAccount.onKeyUp = this.filterAccounts.bind(this, "From");
        this.view.tbxToAccount.onKeyUp = this.filterAccounts.bind(this, "To");
        this.view.flxClearFromText.onTouchStart = this.clearAccountTextboxTexts.bind(this, "From");
        this.view.flxClearToText.onTouchStart = this.clearAccountTextboxTexts.bind(this, "To");
        if (scope.context.transferFlow !== "Modify") this.setPayeeField("Existing Payee");
        this.renderCalendars();
        this.restrictSpecialCharacters();
        this.view.btn1.onClick = this.showCancelPopup.bind(this);
        this.view.btn2.onClick = this.validateInputDataAndCallAPI.bind(this);
        this.view.lblLookUp.onTouchStart = this.showLookupPopup.bind(this);
        if (scope.context.transferType === "Domestic Transfer" || scope.context.transferType === "International Transfer") {
          this.view.tbxAccountNumber.onKeyUp = this.resetSwiftCodeFields.bind(this);
          this.view.tbxReEnterAccountNumber.onKeyUp = this.resetSwiftCodeFields.bind(this);
          this.view.tbxPayeeDetail1.onKeyUp = this.setFormattedBicDetails.bind(this, "tbxPayeeDetail1");
        } else {
          this.view.tbxAccountNumber.onKeyUp = null;
          this.view.tbxReEnterAccountNumber.onKeyUp = null;
          this.view.tbxPayeeDetail1.onKeyUp = null;
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "initActions",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    setUIBasedOnTransferType: function () {
      var scope = this;
      try {
        if (this.context.transferType === "Same Bank") {
          this.view.flxPayeeField.setVisibility(false);
          this.view.flxPayeeAddressField.setVisibility(true);
          this.view.flxPaymentMethodField.setVisibility(false);
          this.view.flxFeesPaidByField.setVisibility(false);
          this.view.flxIntermediaryBicAndE2ERefField.setVisibility(false);
        } else if (this.context.transferType === "Domestic Transfer") {
          this.view.flxPayeeField.setVisibility(true);
          this.view.flxPayeeAddressField.setVisibility(true);
          this.view.flxPayeeDetailRow2.setVisibility(true);
          this.view.flxPaymentMethodField.setVisibility(true);
          this.view.flxFeesPaidByField.setVisibility(true);
          this.onFeesPaidBySelect(3);
          this.view.flxIntermediaryBicAndE2ERefField.setVisibility(true);
          this.view.flxIntermediaryBic.setVisibility(true);
          this.view.flxE2EReference.setVisibility(true);
        } else if (this.context.transferType === "International Transfer") {
          this.view.flxPayeeField.setVisibility(true);
          this.view.flxPayeeAddressField.setVisibility(true);
          this.view.flxPayeeDetailRow2.setVisibility(true);
          this.view.flxPaymentMethodField.setVisibility(false);
          this.view.flxFeesPaidByField.setVisibility(true);
          this.onFeesPaidBySelect(1);
          this.view.flxIntermediaryBicAndE2ERefField.setVisibility(true);
          this.view.flxIntermediaryBic.setVisibility(true);
          this.view.flxE2EReference.setVisibility(false);
        } else if (this.context.transferType === "Pay a Person") {
          this.view.flxPayeeAddressField.setVisibility(false);
          this.view.flxPayeeField.setVisibility(true);
          this.view.flxPayeeDetailRow2.setVisibility(false);
          this.view.flxPaymentMethodField.setVisibility(false);
          this.view.flxFeesPaidByField.setVisibility(true);
          this.onFeesPaidBySelect(1);
          this.view.flxIntermediaryBicAndE2ERefField.setVisibility(false);
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setUIBasedOnTransferType",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    setComponentUILabelText: function () {
      var scope = this;
      try {
        this.view.lblFromKey.text = this.businessController.getDataBasedOnDataMapping("lblFromKey") + ":";
        this.view.lblToKey.text = this.businessController.getDataBasedOnDataMapping("lblToKey") + ":";
        this.view.lblNoFromRecordMessage.text = this.businessController.getDataBasedOnDataMapping("lblNoFromRecordMessage");
        this.view.lblNoFromRecordAction.text = this.businessController.getDataBasedOnDataMapping("lblNoFromRecordAction");
        this.view.lblNoToRecordMessage.text = this.businessController.getDataBasedOnDataMapping("lblNoToRecordMessage");
        this.view.lblNoToRecordAction.text = this.businessController.getDataBasedOnDataMapping("lblNoToRecordAction");
        this.view.lblAccountNumberKey.text = this.businessController.getDataBasedOnDataMapping("lblAccountNumberKey") + ":";
        this.view.lblReEnterAccountNumberKey.text = this.businessController.getDataBasedOnDataMapping("lblReEnterAccountNumberKey") + ":";
        this.view.lblPayeeDetail1.text = this.businessController.getDataBasedOnDataMapping("lblPayeeDetail1") + ":";
        this.view.lblPayeeDetail2.text = this.businessController.getDataBasedOnDataMapping("lblPayeeDetail2") + ":";
        this.view.lblPayeeDetail3.text = this.businessController.getDataBasedOnDataMapping("lblPayeeDetail3") + ":";
        this.view.lblPayeeDetail4.text = this.businessController.getDataBasedOnDataMapping("lblPayeeDetail4") + ":";
        this.view.lblTransferCurrency.text = this.businessController.getDataBasedOnDataMapping("lblTransferCurrency") + ":";
        this.view.lblAmount.text = this.businessController.getDataBasedOnDataMapping("lblAmount") + ":";
        this.view.lblFXRate.text = this.businessController.getDataBasedOnDataMapping("lblFXRate") + ":";
        this.view.lblPaymentMethod.text = this.businessController.getDataBasedOnDataMapping("lblPaymentMethod") + ":";
        this.view.lblFrequency.text = this.businessController.getDataBasedOnDataMapping("lblFrequency") + ":";
        this.view.lblTransferDuration.text = this.businessController.getDataBasedOnDataMapping("lblTransferDuration");
        this.view.lblStartDate.text = this.businessController.getDataBasedOnDataMapping("lblStartDate") + ":";
        this.view.lblEndDate.text = this.businessController.getDataBasedOnDataMapping("lblEndDate") + ":";
        this.view.lblRecurrences.text = this.businessController.getDataBasedOnDataMapping("lblRecurrences") + ":";
        this.view.lblFeesPaidBy.text = this.businessController.getDataBasedOnDataMapping("lblFeesPaidBy") + ":";
        this.view.lblIntermediaryBic.text = this.businessController.getDataBasedOnDataMapping("lblIntermediaryBic");
        this.view.lblE2EReference.text = this.businessController.getDataBasedOnDataMapping("lblE2EReference");
        this.view.lblNotes.text = this.businessController.getDataBasedOnDataMapping("lblNotes");
        this.view.lblAddressField1.text = this.businessController.getDataBasedOnDataMapping("lblAddressField1") + ":";
        this.view.lblAddressField2.text = this.businessController.getDataBasedOnDataMapping("lblAddressField2") + ":";
        this.view.lblAddressField3.text = this.businessController.getDataBasedOnDataMapping("lblAddressField3") + ":";
        this.view.lblAddressField4.text = this.businessController.getDataBasedOnDataMapping("lblAddressField4") + ":";
        this.view.lblAddressField5.text = this.businessController.getDataBasedOnDataMapping("lblAddressField5") + ":";
        this.view.lblAddressField6.text = this.businessController.getDataBasedOnDataMapping("lblAddressField6") + ":";
        this.view.lblAddressField7.text = this.businessController.getDataBasedOnDataMapping("lblAddressField7") + ":";
        this.view.lblAddressField8.text = this.businessController.getDataBasedOnDataMapping("lblAddressField8") + ":";
        this.view.lblPayeeAddressDetail.text = this.businessController.getDataBasedOnDataMapping("lblPayeeAddressDetail");
        this.view.lblSupportingDocuments.text = this.businessController.getDataBasedOnDataMapping("lblSupportingDocuments");
        this.view.lblPayeeOptional.text = this.businessController.getDataBasedOnDataMapping("lblPayeeOptional");
        this.view.lblSupportingOptional.text = this.businessController.getDataBasedOnDataMapping("lblSupportingOptional");
        this.view.lblLookupTitle.text = this.businessController.getDataBasedOnDataMapping("lblLookupTitle");
        this.view.lblLookupDescription.text = this.businessController.getDataBasedOnDataMapping("lblLookupDescription");
        this.view.lblSearchField1.text = this.businessController.getDataBasedOnDataMapping("lblSearchField1") + ":";
        this.view.lblSearchField2.text = this.businessController.getDataBasedOnDataMapping("lblSearchField2") + ":";
        this.view.lblSearchField3.text = this.businessController.getDataBasedOnDataMapping("lblSearchField3") + ":";
        this.view.lblSearchField4.text = this.businessController.getDataBasedOnDataMapping("lblSearchField4") + ":";
        this.view.lblSupportingDocumentsInfoHeader.text = this.businessController.getDataBasedOnDataMapping("lblSupportingDocumentsInfoHeader");
        this.view.lblSupportingDocumentInfo1.text = this.businessController.getDataBasedOnDataMapping("lblSupportingDocumentInfo1");
        this.view.lblSupportingDocumentInfo2.text = this.businessController.getDataBasedOnDataMapping("lblSupportingDocumentInfo2");
        this.view.lblSupportingDocumentInfo3.text = this.businessController.getDataBasedOnDataMapping("lblSupportingDocumentInfo3");
        this.view.lblSupportingDocumentInfo4.text = this.businessController.getDataBasedOnDataMapping("lblSupportingDocumentInfo4");
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setComponentUILabelText",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    setComponentUITextboxPlaceholder: function () {
      var scope = this;
      try {
        this.view.tbxFromAccount.placeholder = this.businessController.getDataBasedOnDataMapping("tbxFromAccount", "placeHolder");
        this.view.tbxToAccount.placeholder = this.businessController.getDataBasedOnDataMapping("tbxToAccount", "placeHolder");
        this.view.tbxAccountNumber.placeholder = this.businessController.getDataBasedOnDataMapping("tbxAccountNumber", "placeHolder");
        this.view.tbxReEnterAccountNumber.placeholder = this.businessController.getDataBasedOnDataMapping("tbxReEnterAccountNumber", "placeHolder");
        this.view.tbxPayeeName.placeholder = this.businessController.getDataBasedOnDataMapping("tbxPayeeName", "placeHolder");
        this.view.tbxPayeeDetail1.placeholder = this.businessController.getDataBasedOnDataMapping("tbxPayeeDetail1", "placeHolder");
        this.view.tbxPayeeDetail2.placeholder = this.businessController.getDataBasedOnDataMapping("tbxPayeeDetail2", "placeHolder");
        this.view.tbxPayeeDetail3.placeholder = this.businessController.getDataBasedOnDataMapping("tbxPayeeDetail3", "placeHolder");
        this.view.tbxPayeeDetail4.placeholder = this.businessController.getDataBasedOnDataMapping("tbxPayeeDetail4", "placeHolder");
        this.view.tbxAmount.placeholder = this.businessController.getDataBasedOnDataMapping("tbxAmount", "placeHolder");
        this.view.tbxPaymentAmount4.placeholder = this.businessController.getDataBasedOnDataMapping("tbxPaymentAmount4", "placeHolder");
        this.view.tbxRecurrences.placeholder = this.businessController.getDataBasedOnDataMapping("tbxRecurrences", "placeHolder");
        this.view.tbxIntermediaryBic.placeholder = this.businessController.getDataBasedOnDataMapping("tbxIntermediaryBic", "placeHolder");
        this.view.tbxE2EReference.placeholder = this.businessController.getDataBasedOnDataMapping("tbxE2EReference", "placeHolder");
        this.view.txtNotes.placeholder = this.businessController.getDataBasedOnDataMapping("txtNotes", "placeHolder");
        this.view.tbxAddressField1.placeholder = this.businessController.getDataBasedOnDataMapping("tbxAddressField1", "placeHolder");
        this.view.tbxAddressField2.placeholder = this.businessController.getDataBasedOnDataMapping("tbxAddressField2", "placeHolder");
        this.view.tbxAddressField3.placeholder = this.businessController.getDataBasedOnDataMapping("tbxAddressField3", "placeHolder");
        this.view.tbxAddressField4.placeholder = this.businessController.getDataBasedOnDataMapping("tbxAddressField4", "placeHolder");
        this.view.tbxAddressField5.placeholder = this.businessController.getDataBasedOnDataMapping("tbxAddressField5", "placeHolder");
        this.view.tbxAddressField8.placeholder = this.businessController.getDataBasedOnDataMapping("tbxAddressField8", "placeHolder");
        this.view.txtBoxSearchField1.placeholder = this.businessController.getDataBasedOnDataMapping("txtBoxSearchField1", "placeHolder");
        this.view.txtBoxSearchField2.placeholder = this.businessController.getDataBasedOnDataMapping("txtBoxSearchField2", "placeHolder");
        this.view.txtBoxSearchField3.placeholder = this.businessController.getDataBasedOnDataMapping("txtBoxSearchField3", "placeHolder");
        this.view.txtBoxSearchField4.placeholder = this.businessController.getDataBasedOnDataMapping("txtBoxSearchField4", "placeHolder");
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setComponentUITextboxPlaceholder",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    setComponentUIButtonTextAndTooltip: function () {
      var scope = this;
      try {
        scope.view.btn1.text = scope.businessController.getDataBasedOnDataMapping("btn1", "text");
        scope.view.btn1.toolTip = scope.businessController.getDataBasedOnDataMapping("btn1", "toolTip");
        scope.view.btn2.text = scope.businessController.getDataBasedOnDataMapping("btn2", "text");
        scope.view.btn2.toolTip = scope.businessController.getDataBasedOnDataMapping("btn2", "toolTip");
        scope.view.btnSearch.text = scope.businessController.getDataBasedOnDataMapping("btnSearch", "text");
        scope.view.btnSearch.toolTip = scope.businessController.getDataBasedOnDataMapping("btnSearch", "toolTip");
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setComponentUIButtonTextAndTooltip",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
    * setDropdownValues
    * @api : setDropdownValues
    * set values in dropdown
    * @return : NA
    */
    setDropdownValues: function (seg, listValues, lblSelectedValue) {
      var scope = this;
      try {
        var segmentData = [];
        if (listValues) {
          seg.widgetDataMap = {
            "lblListValue": "value",
            "selectedKey": "key"
          };
          for (key in listValues) {
            segmentData.push({
              "key": key,
              "value": scope.businessController.getDataBasedOnDataMapping(key)
            });
          }
          lblSelectedValue.text = segmentData[0]["value"];
          seg.setData(segmentData);
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setDropdownValues",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    setCurrencyDropdownValues: function (seg, listValues) {
      var scope = this;
      try {
        var scope = this;
        scope.view.flxTransferCurrencyDropdown.setEnabled(true);
        scope.view.flxTransferCurrencyDropdown.skin = "ICSknFlxffffffBordere3e3e31pxRadius3px";
        var segmentData = [];
        if (!scope.isEmptyNullOrUndefined(listValues)) {
          seg.widgetDataMap = {
            "lblListValue": "value",
            "selectedKey": "key"
          };
          for (key in listValues) {
            var currSymbol = scope.businessController.getCurrencySymbol(listValues[key]);
            segmentData.push({
              "key": key,
              "value": currSymbol + " " + listValues[key],
              "symbol": currSymbol
            })
          }
          seg.setData(segmentData);
          if (Object.keys(listValues).length === 1 && scope.context.transferFlow !== "Repeat") {
            scope.context.transferFlow = "";
            scope.view.flxTransferCurrencyDropdown.setEnabled(false);
            scope.view.flxTransferCurrencyDropdown.skin = "ICSknFlxDisabled";
            scope.view.lblSelectedTransferCurrency.text = segmentData[0].value;
            scope.view.lblSelectedCurrencySymbol.text = segmentData[0].symbol;
            scope.businessController.storeInCollection({ "transactionCurrency": segmentData[0].key });
          }
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setCurrencyDropdownValues",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * @api : setPayeeField
     * used to show the payee type fields
     * @return : NA
     */
    setPayeeField: function (payeeType) {
      var scope = this;
      try {
        if (payeeType === "Existing Payee") {
          this.view.lblPayeeTypeOption1.text = "M";
          this.view.lblPayeeTypeOption2.text = "L";
          this.view.lblPayeeTypeOption1.skin = "ICSknLblRadioBtnSelectedFontIcon003e7520px";
          this.view.lblPayeeTypeOption2.skin = "ICSknLblRadioBtnUnelectedFontIcona0a0a020px";
          this.view.flxToList.setVisibility(true);
          this.view.flxPayeeNameTextBox.setVisibility(false);
          this.view.flxAccountNumberField.setVisibility(false);
          this.view.flxPayeeField.skin = "slFbox";
          this.view.flxPayeeDetailWarning.setVisibility(false);
          this.view.lblLookUp.setVisibility(false);
          this.view.flxPayeeDetails.left = "0%";
          this.view.flxPayeeDetails.width = "100%";
          for (i = 1; i <= 4; i++) {
            scope.view["tbxPayeeDetail" + i].setEnabled(false);
            if (kony.application.getCurrentBreakpoint() === 640) {
              scope.view["tbxPayeeDetail" + i].skin = "ICSknTbxDisabledSSPreg42424213px";
            } else {
              scope.view["tbxPayeeDetail" + i].skin = "ICSknTbxDisabledSSPreg42424215px";
            }
            scope.view["tbxPayeeDetail" + i].text = "";
          }
          for (i = 1; i <= 8; i++) {
            if (i === 6 || i === 7) continue;
            scope.view["tbxAddressField" + i].setEnabled(false);
            if (kony.application.getCurrentBreakpoint() === 640) {
              scope.view["tbxAddressField" + i].skin = "ICSknTbxDisabledSSPreg42424213px";
            } else {
              scope.view["tbxAddressField" + i].skin = "ICSknTbxDisabledSSPreg42424215px";
            }
            scope.view["tbxAddressField" + i].text = "";
          }
          scope.view.lbxAddressField6.setEnabled(false);
          scope.view.lbxAddressField6.skin = "ICSknLbxSSP42424215PxBordere3e3e3Disabled";
          scope.view.lbxAddressField6.selectedKey = null;
          scope.view.lbxAddressField7.setEnabled(false);
          scope.view.lbxAddressField7.skin = "ICSknLbxSSP42424215PxBordere3e3e3Disabled";
          scope.view.lbxAddressField7.selectedKey = null;
          scope.view.lblToRecordField1.setVisibility(false);
          scope.view.lblToRecordField2.setVisibility(false);
          scope.view.tbxToAccount.text = "";
          scope.view.tbxToAccount.setVisibility(true);
          scope.view.flxToAccountSegment.setVisibility(false);
          scope.view.flxNoToRecords.setVisibility(false);
          scope.view.flxPayeeDetail2.setVisibility(scope.context.transferType === "Pay a Person");
        } else if (payeeType === "New Payee") {
          this.view.lblPayeeTypeOption1.text = "L";
          this.view.lblPayeeTypeOption2.text = "M";
          this.view.lblPayeeTypeOption1.skin = "ICSknLblRadioBtnUnelectedFontIcona0a0a020px";
          this.view.lblPayeeTypeOption2.skin = "ICSknLblRadioBtnSelectedFontIcon003e7520px";
          this.view.flxToList.setVisibility(false);
          this.view.tbxPayeeName.text = "";
          this.view.tbxAccountNumber.text = "";
          this.view.tbxReEnterAccountNumber.text = "";
          this.view.flxPayeeNameTextBox.setVisibility(true);
          this.view.flxAccountNumberField.setVisibility(true);
          this.view.flxPayeeField.skin = "slFboxBGf8f7f8B0";
          this.view.flxPayeeDetailWarning.setVisibility(true);
          this.view.lblLookUp.setVisibility(scope.context.transferType === "Domestic Transfer" || scope.context.transferType === "International Transfer");
          this.view.flxPayeeDetails.left = "1.5%";
          this.view.flxPayeeDetails.width = "97%";
          for (i = 1; i <= 4; i++) {
            scope.view["tbxPayeeDetail" + i].setEnabled(true);
            if (kony.application.getCurrentBreakpoint() === 640) {
              scope.view["tbxPayeeDetail" + i].skin = "ICSknTxtE3E3E3Border1pxRad2px424242SSPRegular13px";
            } else {
              scope.view["tbxPayeeDetail" + i].skin = "ICSknTxtE3E3E3Border1px424242SSPRegular15px";
            }
            scope.view["tbxPayeeDetail" + i].text = "";
          }
          for (i = 1; i <= 8; i++) {
            if (i === 6 || i === 7) continue;
            scope.view["tbxAddressField" + i].setEnabled(true);
            if (kony.application.getCurrentBreakpoint() === 640) {
              scope.view["tbxAddressField" + i].skin = "ICSknTxtE3E3E3Border1pxRad2px424242SSPRegular13px";
            } else {
              scope.view["tbxAddressField" + i].skin = "ICSknTxtE3E3E3Border1px424242SSPRegular15px";
            }
            scope.view["tbxAddressField" + i].text = "";
          }
          scope.view.lbxAddressField6.setEnabled(true);
          scope.view.lbxAddressField6.selectedKey = null;
          scope.view.lbxAddressField6.skin = "sknlbxaltoffffffB1R2";
          scope.view.lbxAddressField7.setEnabled(true);
          scope.view.lbxAddressField7.selectedKey = null;
          scope.view.lbxAddressField7.skin = "sknlbxaltoffffffB1R2";
          scope.view.flxPayeeDetail2.setVisibility(true);
        }
        scope.view.flxPaymentAmountTypeField.setVisibility(false);
        scope.view.lblSelectedTransferCurrency.text = "";
        scope.view.lblSelectedCurrencySymbol.text = "";
        scope.enableOrDisableContinueButton(true);
        scope.businessController.storeInCollection({ 
          "payeeType": payeeType,
          "tbxPayeeName": "",
          "toAccountNumber": "",
          "toAccountCurrency": "",
          "formattedToAccount": "",
          "beneficiaryName": "",
          "tbxPayeeDetail1": "",
          "tbxPayeeDetail2": "",
          "tbxPayeeDetail3": "",
          "tbxPayeeDetail4": "",
          "tbxAddressField1": "",
          "tbxAddressField2": "",
          "tbxAddressField3": "",
          "tbxAddressField4": "",
          "tbxAddressField5": "",
          "lbxAddressField6": "",
          "lbxAddressField7": "",
          "tbxAddressField8": "",
          "transactionCurrency": "",
          "transactionType": payeeType === "New Payee" ? "ExternalTransfer" : "",
          "tbxAccountNumber": "",
          "tbxReEnterAccountNumber": ""
        });
        if (scope.context.transferType === "Same Bank") {
          scope.setTransferCurrencyFieldFromAccounts(payeeType === "Existing Payee");
        }
        scope.view.flxPayeeDetail3.setVisibility(false);
        scope.view.lblPayeeDetail4.left = "0dp";
        scope.view.tbxPayeeDetail4.left = "0dp";
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setPayeeField",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * @api : showInfoPopup
     * turns on flxInfoWidget
     * @return : NA
     */
    showInfoPopup: function (flxInfoWidget) {
      flxInfoWidget.isVisible = true;
    },
    /**
     * @api : hideInfoPopup
     * turns off flxInfoWidget
     * @return : NA
     */
    hideInfoPopup: function (flxInfoWidget) {
      flxInfoWidget.isVisible = false;
    },
    /**
    * @api : enableContinueButton
    * enables the button
    * @return : NA
    */
    enableButton: function (btnWidget) {
      btnWidget.setEnabled(true);
      btnWidget.skin = "sknbtnSSPffffff0278ee15pxbr3px";
    },
    /**
    * @api : disableButton
    * disables the button
    * @return : NA
    */
    disableButton: function (btnWidget) {
      btnWidget.setEnabled(false);
      btnWidget.skin = "ICSknbtnDisablede2e9f036px";
    },
    restrictSpecialCharacters: function () {
      var scope = this;
      try {
        var specialCharactersSet = "~#^|$%&*!@()_-+=}{][/|?,.><`':;\"\\";
        var alphabetsSet = "abcdefghijklmnopqrstuvwxyz";
        var numbersSet = "0123456789";
        this.view.tbxPayeeName.restrictCharactersSet = specialCharactersSet;
        if (this.context.transferType === "Same Bank") {
          this.view.tbxAccountNumber.restrictCharactersSet = specialCharactersSet + alphabetsSet + alphabetsSet.toUpperCase();
          this.view.tbxReEnterAccountNumber.restrictCharactersSet = specialCharactersSet + alphabetsSet + alphabetsSet.toUpperCase();
        } else {
          this.view.tbxAccountNumber.restrictCharactersSet = specialCharactersSet;
          this.view.tbxReEnterAccountNumber.restrictCharactersSet = specialCharactersSet;
        }
        if (this.context.transferType !== "Pay a Person") {
          this.view.tbxPayeeDetail1.restrictCharactersSet = specialCharactersSet;
        }
        this.view.tbxIntermediaryBic.restrictCharactersSet = specialCharactersSet;
        this.view.tbxAmount.restrictCharactersSet = specialCharactersSet.replace(',.', '') + alphabetsSet + alphabetsSet.toUpperCase();
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "restrictSpecialCharacters",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
    * @api : setBankDate
    * sets the bank date for calendar widget
    * @return : NA
    */
    setBankDate: function () {
      var scope = this;
      try {
        if (!scope.isEmptyNullOrUndefined(this.bankDateObj.currentWorkingDate)) {
          this.disableOldDaySelection(this.view.calStartDate, this.bankDateObj.currentWorkingDate);
          this.disableOldDaySelection(this.view.calEndDate, this.bankDateObj.currentWorkingDate);
        }
        var startDate = scope.businessController.getDateObjectFromCalendarString(scope.view.calStartDate.formattedDate, scope.view.calStartDate.dateFormat);
        scope.businessController.storeInCollection({
          "scheduledDate": startDate.toISOString(),
          "frequencyStartDate": startDate.toISOString(),
          "formattedSendOnDate": scope.view.calStartDate.formattedDate
        });
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setBankDate",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
    * @api : disableOldDaySelection
    * disables the old day selection for calendar widget
    * @return : NA
    */
    disableOldDaySelection: function (calWidgetId, bankDate) {
      var scope = this;
      try {
        var numberOfYearsAllowed = 3;
        var startDate = new Date(bankDate);
        var futureDate = new Date(startDate.getTime() + (1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * 365 /*days*/ * numberOfYearsAllowed));
        calWidgetId.enableRangeOfDates([startDate.getDate(), startDate.getMonth() + 1, startDate.getFullYear()], [futureDate.getDate(), futureDate.getMonth() + 1, futureDate.getFullYear()], "skn", true);
        if (scope.context.transferFlow !== "Modify") {
          calWidgetId.dateComponents = [startDate.getDate(), startDate.getMonth() + 1, startDate.getFullYear()];
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "disableOldDaySelection",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * toggleDropdownVisibility
     * @api : toggleDropdownVisibility
     * toggle dropdown visibility
     * @return : NA
     */
    toggleDropdownVisibility: function (flxDropdown, flxDropdwonList, lblDropdownIcon) {
      if (flxDropdwonList.isVisible) {
        flxDropdwonList.isVisible = false;
        lblDropdownIcon.text = "O";
      } else {
        flxDropdwonList.isVisible = true;
        lblDropdownIcon.text = "P";
      }
    },
    onFrequencySelection: function () {
      var scope = this;
      try {
        var selectedData = this.view.segFrequencyList.selectedRowItems[0];
        this.view.lblSelectedFrequency.text = selectedData["value"];
        this.view.flxFrequencyList.isVisible = false;
        this.view.lblFrequencyDropdownIcon.text = "O";
        if (selectedData["key"] === "Once") {
          this.view.flxStartDate.setVisibility(true);
          this.view.flxTransferDuration.setVisibility(false);
          this.view.flxEndDate.setVisibility(false);
          this.view.flxRecurrences.setVisibility(false);
          this.view.lblStartDate.text = kony.i18n.getLocalizedString("i18n.transfers.send_on") + ":";
          scope.view.tbxRecurrences.text = "";
          if (!scope.isEmptyNullOrUndefined(this.bankDateObj) && !scope.isEmptyNullOrUndefined(this.bankDateObj.currentWorkingDate)) {
            var bankDate = this.bankDateObj.currentWorkingDate;
          } else {
            var bankDate = this.view.calStartDate.formattedDate;
          }
          scope.businessController.storeInCollection({
            "frequencyType": selectedData["key"],
            "frequencyEndDate": "",
            "formattedEndOnDate": "",
            "tbxRecurrences": "",
            "isScheduled": scope.view.calStartDate.formattedDate !== scope.businessController.getFormattedDate(bankDate) ? "1" : "0"
          });
        } else {
          this.view.flxStartDate.setVisibility(true);
          this.view.flxDueDate.setVisibility(false);
          this.view.flxTransferDuration.setVisibility(true);
          if (!scope.view.flxEndDate.isVisible && !scope.view.flxRecurrences.isVisible) {
            scope.view.lblSelectedTransferDuration.text = scope.view.segTransferDurationList.data[0]["value"];
            scope.view.lblStartDate.text = kony.i18n.getLocalizedString("i18n.transfers.start_date") + ":";
            scope.view.flxEndDate.setVisibility(true);
            scope.view.flxRecurrences.setVisibility(false);
            scope.view.tbxRecurrences.text = "";
          }
          var endDate = scope.businessController.getDateObjectFromCalendarString(scope.view.calEndDate.formattedDate , scope.view.calEndDate.dateFormat);
          scope.businessController.storeInCollection({
            "frequencyType": selectedData["key"],
            "frequencyEndDate": scope.view.flxEndDate.isVisible ? endDate.toISOString() : "",
            "formattedEndOnDate": scope.view.flxEndDate.isVisible ? scope.view.calEndDate.formattedDate : "",
            "tbxRecurrences": scope.view.flxRecurrences.isVisible ? scope.view.tbxRecurrences.text : "",
            "isScheduled": "1"
          });
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "onFrequencySelection",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    onTransferDurationSelection: function () {
      var scope = this;
      try {
        var selectedData = this.view.segTransferDurationList.selectedRowItems[0];
        this.view.lblSelectedTransferDuration.text = selectedData["value"];
        this.view.flxTransferDurationList.isVisible = false;
        this.view.lblTransferDurationDropdownIcon.text = "O";
        if (selectedData["key"] === "NO_OF_RECURRENCES") {
          this.view.lblStartDate.text = kony.i18n.getLocalizedString("i18n.transfers.send_on") + ":";
          this.view.flxEndDate.setVisibility(false);
          this.view.flxRecurrences.setVisibility(true);
          scope.businessController.storeInCollection({
            "frequencyEndDate": "",
            "formattedEndOnDate": ""
          });
        } 
        else if (selectedData["key"] === "UNTIL_I_CANCEL") {
          this.view.lblStartDate.text = kony.i18n.getLocalizedString("i18n.transfers.send_on") + ":";
          this.view.flxEndDate.setVisibility(false);
          this.view.flxRecurrences.setVisibility(false);
          scope.businessController.storeInCollection({
            "frequencyEndDate": "",
            "formattedEndOnDate": "Until I cancel",
			"tbxRecurrences": ""
          });
        } 
        else {
          this.view.lblStartDate.text = kony.i18n.getLocalizedString("i18n.transfers.start_date") + ":";
          this.view.flxEndDate.setVisibility(true);
          this.view.flxRecurrences.setVisibility(false);
          scope.view.tbxRecurrences.text = "";
          var endDate = scope.businessController.getDateObjectFromCalendarString(scope.view.calEndDate.formattedDate, scope.view.calEndDate.dateFormat);
          scope.businessController.storeInCollection({
            "frequencyEndDate": endDate.toISOString(),
            "formattedEndOnDate": this.view.calEndDate.formattedDate,
            "tbxRecurrences": "" 
          });
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "onTransferDurationSelection",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    onCurrencySelection: function () {
      var scope = this;
      try {
        let selectedData = this.view.segTransferCurrencyList.selectedRowItems[0];
        this.view.lblSelectedTransferCurrency.text = selectedData["value"];
        this.view.lblSelectedCurrencySymbol.text = selectedData["symbol"];
        this.view.flxTransferCurrencyList.setVisibility(false);
        this.view.lblTransferCurrencyDropdownIcon.text = "O";
        var paymentType = "";
        if (scope.context.transferType === "Domestic Transfer") {
          let paymentMethod = scope.dataMapping["paymentMethods"][selectedData["key"]];
          for (let i = 1; i <= paymentMethod.length; i++) {
            this.view["flxPaymentMethod" + i].setVisibility(true);
            this.view["lblPaymentMethod" + i].text = paymentMethod[i - 1];
            if (i === 1) {
              this.view["lblPaymentMethodOption" + i].text = "M";
              this.view["lblPaymentMethodOption" + i].skin = "ICSknLblRadioBtnSelectedFontIcon003e7520px";
              if (this.view["lblPaymentMethod" + i].text === "SEPA" || this.view["lblPaymentMethod" + i].text === "INSTANT") {
                this.view.flxE2EReference.setVisibility(true);
              } else {
                scope.view.tbxE2EReference.text = "";
                this.view.flxE2EReference.setVisibility(false);
              }
              paymentType = this.view["lblPaymentMethod" + i].text;
            } else {
              this.view["lblPaymentMethodOption" + i].text = "L";
              this.view["lblPaymentMethodOption" + i].skin = "ICSknLblRadioBtnUnelectedFontIcona0a0a020px";
            }
          }
          for (let i = paymentMethod.length + 1; i <= 4; i++) {
            this.view["flxPaymentMethod" + i].setVisibility(false);
          }
        }
        if (paymentType === "INSTANT") paymentType = "INSTPAY";
        scope.businessController.storeInCollection({
          "transactionCurrency": selectedData["key"],
          "paymentMethod": scope.context.transferType === "Domestic Transfer" ? scope.view["lblPaymentMethod1"].text : "",
          "paymentType": paymentType,
          "tbxE2EReference": scope.view.tbxE2EReference.text
        });
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "onCurrencySelection",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    onPaymentMethodSelect: function (idx) {
      var scope = this;
      try {
        for (let i = 1; i <= 4; i++) {
          if (this.view["flxPaymentMethod" + i].isVisible) {
            if (i === idx) {
              this.view["lblPaymentMethodOption" + i].text = "M";
              this.view["lblPaymentMethodOption" + i].skin = "ICSknLblRadioBtnSelectedFontIcon003e7520px";
            } else {
              this.view["lblPaymentMethodOption" + i].text = "L";
              this.view["lblPaymentMethodOption" + i].skin = "ICSknLblRadioBtnUnelectedFontIcona0a0a020px";
            }
          }
        }
        if (scope.view["lblPaymentMethod" + idx].text === "SEPA" || scope.view["lblPaymentMethod" + idx].text === "INSTANT") {
          scope.view.flxE2EReference.setVisibility(true);
        } else {
          scope.view.tbxE2EReference.text = "";
          scope.view.flxE2EReference.setVisibility(false);
        }
        var paymentType = this.view["lblPaymentMethod" + idx].text;
        if (paymentType === "INSTANT") paymentType = "INSTPAY";
        scope.businessController.storeInCollection({
          "paymentMethod": scope.view["lblPaymentMethod" + idx].text,
          "paymentType": paymentType,
          "tbxE2EReference": scope.view.tbxE2EReference.text
        });
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "onPaymentMethodSelect",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    onFeesPaidBySelect: function (idx) {
      var scope = this;
      try {
        for (let i = 1; i <= 3; i++) {
          if (i === idx) {
            this.view["lblFeesPaidByOption" + i].text = "M";
            this.view["lblFeesPaidByOption" + i].skin = "ICSknLblRadioBtnSelectedFontIcon003e7520px";
          } else {
            this.view["lblFeesPaidByOption" + i].text = "L";
            this.view["lblFeesPaidByOption" + i].skin = "ICSknLblRadioBtnUnelectedFontIcona0a0a020px";
          }
        }
        var paidBy = idx === 1 ? "OUR" : idx === 2 ? "BEN" : "SHA";
        scope.businessController.storeInCollection({
          "feesPaidBy": scope.view["lblFeesPaidBy" + idx].text,
          "paidBy": paidBy
        });
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "onFeesPaidBySelect",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    renderCalendars: function () {
      var context1 = {
        "widget": this.view.flxCalStartDate,
        "anchor": "bottom"
      };
      this.view.calStartDate.setContext(context1);
      var context2 = {
        "widget": this.view.flxCalEndDate,
        "anchor": "bottom"
      };
      this.view.calEndDate.setContext(context2);
    },
    updateNotesLengthIndicator: function () {
      this.view.lblNotesLength.text = this.view.txtNotes.text.length + "/140";
    },
    /**
     * method to set the formatted BIC details
     * @param {object} tbxWidget textbox widget
     */
    setFormattedBicDetails: function (tbxWidget) {
      var value = this.view[tbxWidget].text;
      if (value) {
        this.view[tbxWidget].text = value.toUpperCase();
      }
    },
    /**
     * method to validate the BIC details
     * @param {object} tbxWidget textbox widget
     */
    validateBicDetails: function (tbxWidget) {
      var scope = this;
      try {
        var value = scope.view[tbxWidget].text;
        scope.isSwiftValid = true;
        if (value) {
          var isBicValid = scope.businessController.isValidSwiftCode(value);
          if (isBicValid) {
            scope.resetTextBoxSkin(scope.view[tbxWidget]);
            if (tbxWidget === "tbxIntermediaryBic") {
              scope.businessController.invokeCustomVerbforValidateIntermediaryBicCode(tbxWidget);
            } else {
              scope.businessController.invokeCustomVerbforValidateSwiftCode(tbxWidget);
            }
          } else {
            scope.isSwiftValid = false;
            scope.setErrorTextBoxSkin(scope.view[tbxWidget]);
            scope.view.rtxErrorMessage.text = kony.i18n.getLocalizedString("i18n.UnifiedTransfer.InvalidBIC");
            scope.view.flxErrorMessage.setVisibility(true);
          }
          scope.enableOrDisableContinueButton();
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "validateBicDetails",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    browseSupportingDocument: function () {
      var scope = this;
      scope.view.flxAttachDocumentError.setVisibility(false);
      var config = {
        selectMultipleFiles: false,
        filter: []
      };
      kony.io.FileSystem.browse(config, scope.selectedFileCallback.bind(scope));
      scope.documentCount = scope.filesToBeUploaded.length;
    },
    getBase64: function (file, successCallback) {
      var reader = new FileReader();
      reader.onloadend = function () {
        successCallback(reader.result);
      };
      reader.readAsDataURL(file);
    },
    selectedFileCallback: function (events, files) {
      var scope = this;
      try {
        var maxAttachmentsAllowed = 5;
        scope.view.flxAttachDocumentError.setVisibility(false);
        var fileNameRegex = new RegExp("^[a-zA-Z0-9]*[.][.a-zA-Z0-9]*[^.]$");
        if (this.documentCount === scope.filesToBeUploaded.length) {
          if (files.length > 0) {
            var fileName = files[0].file.name;
            var extension = files[0].file.name.split('.');
            if (extension.length > 0 && extension[extension.length - 1] !== "jpeg" && extension[extension.length - 1] !== "pdf") {
              scope.view.flxAttachDocumentError.setVisibility(true);
              scope.view.lblAttachDocumentError.text = kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentTypeErrorMsg1") + " " + files[0].name + " " + kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentTypeErrorMsg2");
              scope.view.forceLayout();
              return;
            }
            if (files[0].file.size >= 2000000) {
              scope.view.flxAttachDocumentError.setVisibility(true);
              scope.view.lblAttachDocumentError.text = kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentTypeErrorMsg1") + " " + files[0].name + " " + kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentSizeErrorMsg");
              scope.view.forceLayout();
              return;
            } else if (fileName !== null && (!fileNameRegex.test(fileName) || extension.length>2)) {
              scope.view.flxAttachDocumentError.setVisibility(true);
              scope.view.lblAttachDocumentError.text = kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentFileNameErrorMsg");
              scope.view.forceLayout();
              return;
            } else if (scope.filesToBeUploaded.length >= maxAttachmentsAllowed) {
              scope.view.flxAttachDocumentError.setVisibility(true);
              scope.view.lblAttachDocumentError.text = kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentLimitExceededErrorMsg");
              scope.view.forceLayout();
              return;
            } else {
              var fileData = {};
              scope.filesToBeUploaded.push([files[0].name, (extension[extension.length - 1]  === "pdf") ? "pdf_image.png" : "jpeg_image.png"]);
              fileData.fileName = files[0].name;
              fileData.fileType = files[0].file.type;
              scope.getBase64(files[0].file, function (base64String) {
                scope.attachments = [];
                base64String = base64String.replace("data:;base64\,", "");
                base64String = base64String.replace("data:application\/octet-stream;base64\,", "");
                base64String = base64String.replace("data:image\/jpeg;base64\,", "");
                fileData.fileContents = base64String.replace("data:application/pdf;base64\,", "");
                scope.attachments.push(fileData);
                var fileDataItemParsed = scope.attachments.map(function (item) {
                  return item['fileName'] + "-" + item['fileType'] + "-" + item['fileContents'];
                });
                scope.uploadedAttachments.push(fileDataItemParsed);
                scope.base64Content.push(fileData.fileContents);
                scope.businessController.storeAttachmentDataInCollection(scope.uploadedAttachments, scope.filesToBeUploaded);
              });
            }
          }
        } else
          return;
        if (scope.filesToBeUploaded.length <= maxAttachmentsAllowed) {
          scope.setAttachmentsDataToSegment();
        }
        scope.view.forceLayout();
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "selectedFileCallback",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    setAttachmentsDataToSegment: function () {
      var scope = this;
      try {
        scope.view.flxDocumentList.setVisibility(true);
        var attachmentsData = [];
        for (var i = 0; i < scope.filesToBeUploaded.length; i++) {
          attachmentsData[i] = {
            "imgDocumentTypeIcon": {
              "src": scope.filesToBeUploaded[i][1]
            },
            "filename": scope.filesToBeUploaded[i][0],
            "imgRemoveAttachment": {
              "src": "bbcloseicon.png"
            },
            "removeAction": {
              "onClick": scope.showRemoveAttachment.bind(scope)
            }
          };
        }
        scope.view.segDocumentList.widgetDataMap = {
          "imgDocumentTypeIcon": "imgDocumentTypeIcon",
          "lblDocumentName": "filename",
          "imgRemoveAttachment": "imgRemoveAttachment",
          "flxRemoveAttachment": "removeAction"
        };
        scope.view.segDocumentList.setData(attachmentsData);
        scope.view.forceLayout();
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setAttachmentsDataToSegment",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    showRemoveAttachment: function () {
      var scope = this;
      try {
        var form = kony.application.getCurrentForm();
        var popupObj = scope.view.flxPopup.clone();
        form.add(popupObj);
        popupObj.isVisible = true;
        popupObj.top = "0dp";
        popupObj.left = "0dp";
        popupObj.height = "100%";
        popupObj.flxCancelPopup.centerX = "50%";
        popupObj.flxCancelPopup.centerY = "50%";
        popupObj.flxCancelPopup.flxPopupHeader.lblPopupHeading.text = "Remove Attachment";
        popupObj.flxCancelPopup.lblPopupMessage.text = "Are you sure you want to remove this attachment?";
        popupObj.flxCancelPopup.flxPopupHeader.flxClosePopup.onClick = () => {
          form.remove(popupObj);
        }
        popupObj.flxCancelPopup.btnNo.onClick = () => {
          form.remove(popupObj);
        }
        popupObj.flxCancelPopup.btnYes.onClick = () => {
          form.remove(popupObj);
          scope.deleteAttachment();
        }
        scope.view.forceLayout();
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "showRemoveAttachment",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    deleteAttachment: function () {
      var scope = this;
      try {
        var index = scope.view.segDocumentList.selectedRowIndex;
        var sectionIndex = index[0];
        var rowIndex = index[1];
        var deletedAttachment = scope.view.segDocumentList.data[rowIndex];
        scope.view.segDocumentList.removeAt(rowIndex, sectionIndex);
        scope.removeAttachments(deletedAttachment);
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "deleteAttachment",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    removeAttachments: function (data) {
      var scope = this;
      try {
        for (var i = 0; i < scope.filesToBeUploaded.length; i++) {
          if (scope.filesToBeUploaded[i][0] === data.filename) {
            scope.filesToBeUploaded.splice(i, 1);
            scope.attachments.splice(i, 1);
            scope.uploadedAttachments.splice(i, 1);
            break;
          }
        }
        scope.view.flxAttachDocumentError.setVisibility(false);
        scope.setAttachmentsDataToSegment();
        scope.businessController.storeAttachmentDataInCollection(scope.uploadedAttachments, scope.filesToBeUploaded);
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "removeAttachments",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    togglePayeeAddressVisibility: function (flxWidget, imgWidget) {
      if (flxWidget.isVisible) {
        flxWidget.setVisibility(false);
        imgWidget.src = "minus_blue.png";
      } else {
        flxWidget.setVisibility(true);
        imgWidget.src = "plus_blue.png";
      }
    },
    /**
    * @api : setCountryAndStateMasterData
    * sets countries and states into list box
    * @return : NA
    */
    setCountryAndStateMasterData: function () {
      var scope = this;
      try {
        if (scope.view.lbxAddressField7.selectedKey !== null) {
          scope.view.lbxAddressField7.selectedKey = scope.view.lbxAddressField7.selectedKeyValue[0];
          if (scope.view.lbxAddressField7.selectedKeyValue[0] === "0") {
            scope.view.lbxAddressField6.masterData = [["0", "Select a State"]];
            scope.view.lbxAddressField6.selectedKey = scope.view.lbxAddressField6.masterData[0][0];
            scope.view.lbxAddressField6.setEnabled(false);
          }
        }
        if (scope.view.lbxAddressField7.selectedKey === null) {
          scope.view.lbxAddressField7.masterData = scope.collectionObj.Collection.countries;
          scope.view.lbxAddressField7.selectedKey = scope.collectionObj.Collection.countries[0][0];
          scope.view.lbxAddressField6.masterData = [["0", "Select a State"]];
          scope.view.lbxAddressField6.selectedKey = scope.view.lbxAddressField6.masterData[0][0];
          scope.view.lbxAddressField6.setEnabled(false);
        }
        if (!scope.isEmptyNullOrUndefined(scope.collectionObj.Collection.regions)) {
          scope.view.lbxAddressField6.masterData = scope.collectionObj.Collection.regions.states;
          scope.view.lbxAddressField6.selectedKey = (scope.view.lbxAddressField6.selectedKey != null) ? scope.view.lbxAddressField6.selectedKeyValue[0] : scope.view.lbxAddressField6.masterData[0][0];
          scope.businessController.resetCollection("regions");
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setCountryAndStateMasterData",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
    * @api : updateStateList
    * updates state list based on the selected country
    * @return : NA
    */
    updateStateList: function () {
      var scope = this;
      try {
        if (scope.view.lbxAddressField7.selectedKeyValue[0] === "0") {
          scope.view.lbxAddressField6.masterData = [["0", "Select a State"]];
          scope.view.lbxAddressField6.selectedKey = scope.view.lbxAddressField6.masterData[0][0];
          scope.view.lbxAddressField7.selectedKey = scope.view.lbxAddressField7.selectedKeyValue[0];
          scope.view.lbxAddressField6.setEnabled(false);
          scope.businessController.storeInCollection({
            "lbxAddressField6": "",
            "lbxAddressField7": ""
          });
        } else {
          scope.view.lbxAddressField6.selectedKey = null;
          scope.view.lbxAddressField6.setEnabled(true);
          scope.view.lbxAddressField7.selectedKey = scope.view.lbxAddressField7.selectedKeyValue[0];
          scope.businessController.getSpecifiedStates(scope.view.lbxAddressField7.selectedKeyValue[0]);
          scope.businessController.storeInCollection({
            "lbxAddressField6": "",
            "lbxAddressField7": scope.view.lbxAddressField7.selectedKeyValue[1]
          });
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "updateStateList",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
    * @api : selectState
    * updates the selected state
    * @return : NA
    */
    selectState: function () {
      var scope = this;
      try {
        scope.businessController.storeInCollection({
          "lbxAddressField6": scope.view.lbxAddressField6.selectedKeyValue[0] === "0" ? "" : scope.view.lbxAddressField6.selectedKeyValue[1]
        });
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "selectState",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
    * @api : performValidation
    * performs data validation for text boxes in tab 2
    * @return : NA
    */
    performValidation: function () {
      var scope = this;
      var form = kony.application.getCurrentForm();
      try {
        this.view.tbxFromAccount.onBeginEditing = function () {
          scope.setFlexFocusSkin(scope.view.flxFromTextBox);
        };
        this.view.tbxFromAccount.onEndEditing = function () {
          scope.resetFlexFocusSkin(scope.view.flxFromTextBox);
        };
        this.view.tbxToAccount.onBeginEditing = function () {
          scope.setFlexFocusSkin(scope.view.flxToTextBox);
        };
        this.view.tbxToAccount.onEndEditing = function () {
          scope.resetFlexFocusSkin(scope.view.flxToTextBox);
        };
        this.view.tbxPayeeName.onEndEditing = function () {
          scope.resetTextBoxSkin(scope.view.tbxPayeeName);
          scope.processDataValidation(scope.view.tbxPayeeName, "tbxPayeeName");
        };
        this.view.tbxAccountNumber.onEndEditing = function () {
          scope.resetTextBoxSkin(scope.view.tbxAccountNumber);
          scope.isAccountNumbersMatch(scope.view.tbxAccountNumber, scope.view.tbxReEnterAccountNumber);
          scope.processDataValidation(scope.view.tbxAccountNumber, "tbxAccountNumber");
        };
        this.view.tbxReEnterAccountNumber.onEndEditing = function () {
          scope.resetTextBoxSkin(scope.view.tbxReEnterAccountNumber);
          scope.isAccountNumbersMatch(scope.view.tbxReEnterAccountNumber, scope.view.tbxAccountNumber);
          scope.processDataValidation(scope.view.tbxReEnterAccountNumber, "tbxReEnterAccountNumber");
        };
        this.view.tbxAmount.onBeginEditing = function () {
          scope.setFlexFocusSkin(scope.view.flxAmountTextBox);
        };
        this.view.tbxAmount.onEndEditing = function () {
          scope.resetFlexFocusSkin(scope.view.flxAmountTextBox);
          scope.view.tbxAmount.text = scope.businessController.getFormattedAmount(scope.view.tbxAmount.text);
          scope.processDataValidation(scope.view.tbxAmount, "tbxAmount");
        };
        this.view.tbxPaymentAmount4.onBeginEditing = function () {
          scope.setFlexFocusSkin(scope.view.flxPaymentAmount4TextBox);
        };
        this.view.tbxPaymentAmount4.onEndEditing = function () {
          scope.resetFlexFocusSkin(scope.view.flxPaymentAmount4TextBox);
          scope.view.tbxPaymentAmount4.text = scope.businessController.getFormattedAmount(scope.view.tbxPaymentAmount4.text);
          scope.processDataValidation(scope.view.tbxPaymentAmount4, "tbxPaymentAmount4");
        };
        this.view.tbxAddressField1.onEndEditing = function () {
          scope.resetTextBoxSkin(scope.view.tbxAddressField1);
          scope.processDataValidation(scope.view.tbxAddressField1, "tbxAddressField1");
        };
        this.view.tbxAddressField2.onEndEditing = function () {
          scope.resetTextBoxSkin(scope.view.tbxAddressField2);
          scope.processDataValidation(scope.view.tbxAddressField2, "tbxAddressField2");
        };
        this.view.tbxAddressField3.onEndEditing = function () {
          scope.resetTextBoxSkin(scope.view.tbxAddressField3);
          scope.processDataValidation(scope.view.tbxAddressField3, "tbxAddressField3");
        };
        this.view.tbxAddressField4.onEndEditing = function () {
          scope.resetTextBoxSkin(scope.view.tbxAddressField4);
          scope.processDataValidation(scope.view.tbxAddressField4, "tbxAddressField4");
        };
        this.view.tbxAddressField5.onEndEditing = function () {
          scope.resetTextBoxSkin(scope.view.tbxAddressField5);
          scope.processDataValidation(scope.view.tbxAddressField5, "tbxAddressField5");
        };
        this.view.tbxAddressField8.onEndEditing = function () {
          scope.resetTextBoxSkin(scope.view.tbxAddressField8);
          scope.processDataValidation(scope.view.tbxAddressField8, "tbxAddressField8");
        };
        this.view.txtBoxSearchField1.onEndEditing = function () {
          scope.resetTextBoxSkin(form.txtBoxSearchField1);
          scope.processDataValidation(form.txtBoxSearchField1, "txtBoxSearchField1");
        };
        this.view.txtBoxSearchField2.onEndEditing = function () {
          scope.resetTextBoxSkin(form.txtBoxSearchField2);
          scope.processDataValidation(form.txtBoxSearchField2, "txtBoxSearchField2");
        };
        this.view.txtBoxSearchField3.onEndEditing = function () {
          scope.resetTextBoxSkin(form.txtBoxSearchField3);
          scope.processDataValidation(form.txtBoxSearchField3, "txtBoxSearchField3");
        };
        this.view.txtBoxSearchField4.onEndEditing = function () {
          scope.resetTextBoxSkin(form.txtBoxSearchField4);
          scope.processDataValidation(form.txtBoxSearchField4, "txtBoxSearchField4");
        };
        this.view.tbxPayeeDetail1.onEndEditing = function () {
          scope.resetTextBoxSkin(scope.view.tbxPayeeDetail1);
          if (scope.context.transferType !== "Pay a Person") {
            scope.businessController.storeInCollection({ "tbxPayeeDetail1": scope.view.tbxPayeeDetail1.text });
            scope.validateBicDetails("tbxPayeeDetail1");
          } else {
            scope.processDataValidation(scope.view.tbxPayeeDetail1, "tbxPayeeDetail1");
          }
        };
        this.view.tbxPayeeDetail2.onEndEditing = function () {
          scope.resetTextBoxSkin(scope.view.tbxPayeeDetail2);
          scope.processDataValidation(scope.view.tbxPayeeDetail2, "tbxPayeeDetail2");
        };
        this.view.tbxPayeeDetail3.onEndEditing = function () {
          scope.resetTextBoxSkin(scope.view.tbxPayeeDetail3);
          scope.processDataValidation(scope.view.tbxPayeeDetail3, "tbxPayeeDetail3");
        };
        this.view.tbxPayeeDetail4.onEndEditing = function () {
          scope.resetTextBoxSkin(scope.view.tbxPayeeDetail4);
          scope.processDataValidation(scope.view.tbxPayeeDetail4, "tbxPayeeDetail4");
        };
        this.view.tbxIntermediaryBic.onEndEditing = function () {
          scope.resetTextBoxSkin(scope.view.tbxIntermediaryBic);
          scope.businessController.storeInCollection({ "tbxIntermediaryBic": scope.view.tbxIntermediaryBic.text });
          scope.validateBicDetails("tbxIntermediaryBic");
        };
        this.view.tbxE2EReference.onEndEditing = function () {
          scope.resetTextBoxSkin(scope.view.tbxE2EReference);
          scope.businessController.storeInCollection({ "tbxE2EReference": scope.view.tbxE2EReference.text });
        };
        this.view.tbxRecurrences.onEndEditing = function () {
          scope.resetTextBoxSkin(scope.view.tbxRecurrences);
          scope.businessController.storeInCollection({ "tbxRecurrences": scope.view.tbxRecurrences.text });
        };
        this.view.txtNotes.onEndEditing = function () {
          scope.businessController.storeInCollection({ "txtNotes": scope.view.txtNotes.text });
        };
        this.view.calStartDate.onSelection = function () {
          var startDate = scope.businessController.getDateObjectFromCalendarString(scope.view.calStartDate.formattedDate, scope.view.calStartDate.dateFormat);
          scope.businessController.storeInCollection({
            "scheduledDate": startDate.toISOString(),
            "frequencyStartDate": startDate.toISOString(),
            "formattedSendOnDate": scope.view.calStartDate.formattedDate
          });
          scope.enableOrDisableContinueButton();
        };
        this.view.calEndDate.onSelection = function () {
          var endDate = scope.businessController.getDateObjectFromCalendarString(scope.view.calEndDate.formattedDate, scope.view.calEndDate.dateFormat);
          scope.businessController.storeInCollection({
            "frequencyEndDate": endDate.toISOString(),
            "formattedEndOnDate": scope.view.calEndDate.formattedDate
          });
          scope.enableOrDisableContinueButton();
        };
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "performValidation",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
    * @api : processDataValidation
    * makes data ready for performing data valodation
    * @return : NA
    */
    processDataValidation: function (widgetScope, widgetName) {
      var scope = this;
      try {
        var mappedValueForWidget = scope.getMappedValueForWidget(widgetName, scope.dataMapping);
        var inputData = widgetScope.text;
        if (inputData) {
          scope.businessController.performDataValidation(inputData, mappedValueForWidget, widgetName);
        } else {
          scope.businessController.storeInCollection({
            [widgetName]: inputData
          });
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "processDataValidation",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
    * @api : resetTextBoxSkin
    * reset the original skin of the textbox after validation success
    * @return : NA
    */
    resetTextBoxSkin: function (widgetScope) {
      if (kony.application.getCurrentBreakpoint() === 640) {
        widgetScope.skin = "ICSknTxtE3E3E3Border1pxRad2px424242SSPRegular13px";
      } else {
        widgetScope.skin = "ICSknTxtE3E3E3Border1px424242SSPRegular15px";
      }
    },
    /**
    * @api : setErrorTextBoxSkin
    * set the error skin of the textbox after validation fails
    * @return : NA
    */
    setErrorTextBoxSkin: function (widgetScope) {
      widgetScope.skin = "ICSknTextBoxEE0005";
    },
    /**
    * @api : setFlexFocusSkin
    * set the skin of flex when focused
    * @return : NA
    */
    setFlexFocusSkin: function (flxWidget) {
      flxWidget.skin = kony.application.getCurrentBreakpoint() === 640 ? "ICSknFlxffffffBorder003e751pxRadius2px" : "ICSknFlxffffffBorder003e751pxRadius3px";
    },
    /**
    * @api : resetFlexFocusSkin
    * reset the skin of flex when focus is removed
    * @return : NA
    */
    resetFlexFocusSkin: function (flxWidget) {
      flxWidget.skin = kony.application.getCurrentBreakpoint() === 640 ? "ICSknFlxffffffBordere3e3e31pxRadius2px" : "ICSknFlxffffffBordere3e3e31pxRadius3px";
    },
    /**
    * @api : setErrorFlexSkin
    * set the error skin of the flex after validation fails
    * @return : NA
    */
    setErrorFlexSkin: function (flxWidget) {
      flxWidget.skin = "sknborderff0000error";
    },
    /**
     * @api : getMappedValueForWidget
     * Get mapped data of the corresponding widget
     * @return : mapped value
     */
    getMappedValueForWidget: function (widget, dataMapping) {
      var scope = this;
      try {
        for (var record in dataMapping) {
          var keyValues = dataMapping[record];
          if (!(widget in keyValues)) continue;
          for (var key in keyValues) {
            if (widget === key) {
              if (dataMapping[record][widget].mapping) {
                var fieldMapping = dataMapping[record][widget].mapping;
                fieldMapping = fieldMapping.split(".")[2].replace("}", "");
                return fieldMapping;
              } else {
                var fieldValue = dataMapping[record][widget];
                fieldValue = fieldValue.split(".")[3].replace("}", "");
                return fieldValue;
              }
            }
          }
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "getMappedValueForWidget",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    toggleAccountsDropdown: function (fieldType) {
      var scope = this;
      try {
        scope.view["flxClear" + fieldType + "Text"].setVisibility(false);
        if (!(scope.view["flx" + fieldType + "AccountSegment"].isVisible) && !(scope.view["flxNo" + fieldType + "Records"].isVisible)) {
          scope.view["tbx" + fieldType + "Account"].setVisibility(true);
          scope.view["tbx" + fieldType + "Account"].setFocus(true);
          var segData = scope.view["seg" + fieldType + "Accounts"].data;
          if (segData.length != 0) {
            this.view["flx" + fieldType + "AccountSegment"].setVisibility(true);
          } else {
            this.view["flxNo" + fieldType + "Records"].setVisibility(true);
          }
          this.view["lbl" + fieldType + "RecordField1"].setVisibility(false);
        } else {
          this.view["flx" + fieldType + "AccountSegment"].setVisibility(false);
          this.view["flxNo" + fieldType + "Records"].setVisibility(false);
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "toggleAccountsDropdown",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    setFromAccountsList: function () {
      this.collectionObj = UnifiedTransferStore.getState();
      var scope = this;
      try {
        scope.setAccountsSegmentTemplateAndWidgetMap(scope.view.segFromAccounts);
        var segData = scope.performSegmentDataMapping("segFromAccounts");
        var icon1Visibility = scope.hasMixAccounts(segData);
        for (var i = 0; i < segData.length; i++) {
          segData[i]["flxRecordFieldTypeIcon1"] = {
            "isVisible": icon1Visibility
          };
          segData[i]["flxRecordFieldTypeIcon2"] = {
            "isVisible": false
          };
          segData[i]["lblRecordFieldTypeIcon1"] = {
            "text": (segData[i].isBusinessAccount === "true") || (segData[i].isBusinessPayee === "1") ? "r" : "s"
          };
          segData[i]["imgRecordFieldTypeIcon2"] = {
            "src": ""
          };
          segData[i]["flxAccountsDropdownList"] = {
            "height": "60dp"
          };
          segData[i]["flxAccountsDropdownListMobile"] = {
            "height": "60dp"
          };
        }
        scope.FromRecords = segData;
        if (!scope.isEmptyNullOrUndefined(scope.groupIdentifier)) {
          scope.groupedFromRecords = scope.prepareAccountsSegmentData(segData, "From");
        } else {
          scope.groupedFromRecords = segData;
        }
        scope.view.segFromAccounts.setData(scope.groupedFromRecords);
        scope.setAccountsDropdownHeight("From");
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setFromAccountsList",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    setAccountsSegmentTemplateAndWidgetMap: function (segWidget) {
      var scope = this;
      try {
        if (kony.application.getCurrentBreakpoint() === 640) {
          segWidget.sectionHeaderTemplate = "flxAccountsDropdownHeaderMobile";
          segWidget.rowTemplate = "flxAccountsDropdownListMobile";
        } else {
          segWidget.sectionHeaderTemplate = "flxAccountsDropdownHeader";
          segWidget.rowTemplate = "flxAccountsDropdownList";
        }
        segWidget.widgetDataMap = {
          "lblRecordType": "lblRecordType",
          "lblDropdownIcon": "lblDropdownIcon",
          "flxRecordFieldType": "flxRecordFieldType",
          "lblRecordField1": "lblRecordField1",
          "lblRecordField2": "lblRecordField2",
          "flxRecordFieldTypeIcon1": "flxRecordFieldTypeIcon1",
          "flxRecordFieldTypeIcon2": "flxRecordFieldTypeIcon2",
          "lblRecordFieldTypeIcon1": "lblRecordFieldTypeIcon1",
          "imgRecordFieldTypeIcon2": "imgRecordFieldTypeIcon2",
          "lblRecordField3": "lblRecordField3",
          "flxAccountsDropdownList": "flxAccountsDropdownList",
          "flxAccountsDropdownListMobile": "flxAccountsDropdownListMobile",
          "flxDropdownIcon": "flxDropdownIcon"
        };
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setAccountsSegmentTemplateAndWidgetMap",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    hasBuisnessAccounts: function (data) {
      var scope = this;
      try {
        var businessAccountFlag = false;
        for (var i = 0; i < data.length; i++) {
          if (!(scope.isEmptyNullOrUndefined(data[i]["isBusinessAccount"]))) {
            if (data[i]["isBusinessAccount"] == "true") {
              businessAccountFlag = true;
              break;
            }
          }
        }
        return businessAccountFlag;
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "hasBuisnessAccounts",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    hasMixAccounts: function (data) {
      var scope = this;
      try {
        var businessAccountFlag = false, personalAccountFlag = false;
        for (var i = 0; i < data.length; i++) {
          if (!(scope.isEmptyNullOrUndefined(data[i]["isBusinessAccount"]))) {
            if (data[i]["isBusinessAccount"] == "true") {
              businessAccountFlag = true;
            } else {
              personalAccountFlag = true;
            }
          }
        }
        return businessAccountFlag && personalAccountFlag;
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "hasMixAccounts",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    setToAccountsList: function () {
      this.collectionObj = UnifiedTransferStore.getState();
      var scope = this;
      try {
        scope.setAccountsSegmentTemplateAndWidgetMap(scope.view.segToAccounts);
        var segData = scope.performSegmentDataMapping("segToAccounts");
        var icon1Visibility = scope.hasMixAccounts(segData);
        for (var i = 0; i < segData.length; i++) {
          segData[i]["lblRecordField3"]["isVisible"] = !segData[i]["isExternalAccount"],
          segData[i]["flxRecordFieldTypeIcon1"] = {
            "isVisible": icon1Visibility && !segData[i]["isExternalAccount"]
          };
          segData[i]["flxRecordFieldTypeIcon2"] = {
            "isVisible": false
          };
          segData[i]["lblRecordFieldTypeIcon1"] = {
            "text": (segData[i].isBusinessAccount === "true") || (segData[i].isBusinessPayee === "1") ? "r" : "s"
          };
          segData[i]["imgRecordFieldTypeIcon2"] = {
            "src": ""
          };
          segData[i]["flxAccountsDropdownList"] = {
            "height": "60dp"
          };
          segData[i]["flxAccountsDropdownListMobile"] = {
            "height": "60dp"
          };
        }
        scope.ToRecords = segData;
        if (!scope.isEmptyNullOrUndefined(scope.groupIdentifier)) {
          scope.groupedToRecords = scope.prepareAccountsSegmentData(segData, "To");
        } else {
          scope.groupedToRecords = segData;
        }
        scope.view.segToAccounts.setData(scope.groupedToRecords);
        scope.setAccountsDropdownHeight("To");
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setToAccountsList",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    setSwiftLookUp: function(){
      this.collectionObj = UnifiedTransferStore.getState();
      var scope = this;
      try {
        if(kony.application.getCurrentBreakpoint() ===640){
          this.view.segLookupRecords.rowTemplate = "flxMobLookupRecord";
          this.view.flxMobLookupHeader.setVisibility(true);
          this.view.flxLookupHeader.setVisibility(false);
          this.view.segLookupRecords.widgetDataMap  =  {
            "lblLookupColumn1Value" : "lblLookupColumn1Value",
            "lblLookupColumnValue2" : "lblLookupColumnValue2",
            "lblLookupColumnValue3" : "lblLookupColumnValue3",
            "lblColumn1" : "lblColumn1",
            "lblColumn2" : "lblColumn2",
            "flxLookupRow" : "flxLookupRow"
          };
        }else{
          this.view.segLookupRecords.rowTemplate =  "flxLookupRecordList";
          this.view.flxMobLookupHeader.setVisibility(false);
          this.view.flxLookupHeader.setVisibility(true);
          this.view.segLookupRecords.widgetDataMap  =  {
            "lblLookupColumn1Value" : "lblLookupColumn1Value",
            "lblLookupColumnValue2" : "lblLookupColumnValue2",
            "lblLookupColumnValue3" : "lblLookupColumnValue3",
            "flxColumn3Value":"flxColumn3Value",
            "flxLookupRecordList":"flxLookupRecordList",
            "flxLookupRecordValues":"flxLookupRecordValues",
            "flxColumn1Value":"flxColumn1Value",
            "flxColumn2Value":"flxColumn2Value",
            "flxColumn3Value":"flxColumn3Value"
          };
        }
        var segData = scope.performSegmentDataMapping("segLookupRecords");
        for (var i = 0; i < segData.length; i++) {
          segData[i]["flxColumn3Value"] = {
            "onClick": scope.getSwiftData.bind(scope.view.segLookupRecords.selectedRowItems)
          };
          segData[i]["lblLookupColumnValue2"] = {
            "text":segData[i].bankName + ", " + segData[i].city + ", " + segData[i].country
          };
          
        }
        kony.application.getCurrentForm().segLookupRecords.setData(segData);
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setSwiftLookUp",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
       /**
     * getSwiftData
     * @api : getSwiftData
     * Method to get selected data from lookup table once row cliked in look up table
     * @return : NA
     */
    getSwiftData : function(scope,args){
      var form = kony.application.getCurrentForm();
      var selectedRowItem = form.segLookupRecords.data[args.rowIndex]
      var bankAddress = selectedRowItem.lblLookupColumnValue2.text;
      var bic = selectedRowItem.bic;
      form.remove(kony.application.getCurrentForm().flxLookups);
      this.view.tbxPayeeDetail4.text = bankAddress || "";
      this.view.tbxPayeeDetail4.skin = "ICSknTbxDisabledSSPreg42424215px";
      this.view.tbxPayeeDetail1.text = bic || "";
      this.businessController.storeInCollection({
        "tbxPayeeDetail4": this.view.tbxPayeeDetail4.text,
        "tbxPayeeDetail1": this.view.tbxPayeeDetail1.text
      });
      if (!scope.isEmptyNullOrUndefined(bic)) {
        scope.businessController.invokeCustomVerbforValidateSwiftCode("tbxPayeeDetail1");
      }
    },
    prepareAccountsSegmentData: function (recordsList, fieldType) {
      var scope = this;
      try {
        var data = [];
        var groupedRecordsList = this.groupAccountsData(recordsList);
        var types = Object.keys(groupedRecordsList);
        if (types.length != 0) {
          for (var i = 0; i < types.length; i++) {
            var displayText;
            if (types[i] != "undefined") {
              displayText = this.groupIdentifier["segregation"][types[i]];
            } else {
              displayText = this.groupIdentifier["segregation"]["default"];
            }
            if (scope.isEmptyNullOrUndefined(displayText)) {
              displayText = types[i];
            }
            data[i] = [{
              "lblRecordType": {
                "text": displayText + " (" + groupedRecordsList[types[i]].length + ")"
              },
              "lblDropdownIcon": {
                "text": "P"
              },
              "flxDropdownIcon": {
                "onClick": scope.showOrHideAccountSection.bind(scope, fieldType)
              }
            },
            groupedRecordsList[types[i]]]
          }
        }
        return data;
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "prepareAccountsSegmentData",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    groupAccountsData: function (data) {
      var scope = this;
      try {
        var internalContract = this.groupIdentifier["internal"];
        if (!scope.isEmptyNullOrUndefined(internalContract)) {
          var interalKey = internalContract.identifier;
        }
        var externalContract = this.groupIdentifier["external"];
        if (!scope.isEmptyNullOrUndefined(externalContract)) {
          var externalKey = externalContract.identifier;
        }
        if (data !== undefined) {
          var hasBuisnessAccounts = this.hasBuisnessAccounts(data);
          if (hasBuisnessAccounts) {
            return data.reduce(function (value, obj) {
              if (obj.isBusinessAccount == "true") {
                (value[obj["MembershipName"]] = value[obj["MembershipName"]] || []).push(obj);
                return value;
              } else {
                if (!(obj.isBusinessAccount === null || obj.isBusinessAccount === undefined || obj.isBusinessAccount === "")) {
                  (value[obj["otherAccounts"]] = value[obj["otherAccounts"]] || []).push(obj);
                  return value;
                } else {
                  (value[obj["GroupField"]] = value[obj["GroupField"]] || []).push(obj);
                  return value;
                }
              }
            }, {});
          } else {
            return data.reduce(function (value, obj) {
              if (obj.isExternalAccount == false) {
                if (!(interalKey === null || interalKey === undefined || interalKey === "")) {
                  (value[obj[interalKey]] = value[obj[interalKey]] || []).push(obj);
                  return value;
                } else {
                  (value[obj["GroupField"]] = value[obj["GroupField"]] || []).push(obj);
                  return value;
                }
              } else {
                if (!(externalKey === null || externalKey === undefined || externalKey === "")) {
                  if (!externalKey.includes(",")) {
                    (value[obj[externalKey]] = value[obj[externalKey]] || []).push(obj);
                    return value;
                  } else {
                    var indentifierKey = externalKey.split(",");
                    for (var i = 0; i < indentifierKey.length; i++) {
                      if (obj[indentifierKey[i]]) {
                        (value[obj[indentifierKey[i]]] = value[obj[indentifierKey[i]]] || []).push(obj);
                        return value;
                      }
                    }
                  }
                } else {
                  (value[obj["GroupField"]] = value[obj["GroupField"]] || []).push(obj);
                  return value;
                }
              }
            }, {});
          }
        }
        else return {};
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "groupAccountsData",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    onFromAccountSelection: function () {
      var scope = this;
      try {
        var selectedRecord = this.view["segFromAccounts"].selectedRowItems[0];
        scope.view["flxClearFromText"].setVisibility(false);
        scope.view["tbxFromAccount"].setVisibility(false);
        scope.view["lblFromRecordField1"].setVisibility(true);
        scope.view["lblFromRecordField2"].setVisibility(true);
        scope.view["tbxFromAccount"].text = selectedRecord.lblRecordField1.text || "";
        scope.view["lblFromRecordField1"].text = selectedRecord.lblRecordField1.text || "";
        scope.view["lblFromRecordField2"].text = selectedRecord.lblRecordField2.text || "";
        scope.view.flxFromAccountSegment.setVisibility(false);
        if (scope.FromSearchApplied) {
          scope.view["segFromAccounts"].removeAll();
          scope.view["segFromAccounts"].setData(scope["groupedFromRecords"]);
        }
        scope.businessController.storeSelectedAccountDataInCollection(selectedRecord, "From");
        if (scope.context.transferType === "Same Bank") {
          scope.view.segToAccounts.removeAll();
          scope.businessController.filterAccountRecordsOnSelection(selectedRecord, scope.context.transferType, "From");
        }
        if (scope.context.transferType === "Same Bank") {
          scope.setTransferCurrencyFieldFromAccounts(true);
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "onFromAccountSelection",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    onToAccountSelection: function () {
      var scope = this;
      try {
        var selectedRecord = this.view["segToAccounts"].selectedRowItems[0];
        scope.view["flxClearToText"].setVisibility(false);
        scope.view["tbxToAccount"].setVisibility(false);
        scope.view["lblToRecordField1"].setVisibility(true);
        scope.view["lblToRecordField2"].setVisibility(true);
        scope.view["tbxToAccount"].text = selectedRecord.lblRecordField1.text || "";
        scope.view["lblToRecordField1"].text = selectedRecord.lblRecordField1.text || "";
        scope.view["lblToRecordField2"].text = selectedRecord.lblRecordField2.text || "";
        scope.view.flxToAccountSegment.setVisibility(false);
        scope.businessController.storeSelectedAccountDataInCollection(selectedRecord, "To");
        if (selectedRecord.isExternalAccount === true) {
          scope.setPayeeDetailFields(selectedRecord);
          if (scope.context.transferType !== "Pay a Person") {
            scope.setPayeeAddressDetailsFields(selectedRecord);
          } else {
            scope.view.flxPayeeAddressField.setVisibility(false);
          }
        } else {
          scope.view.flxPayeeAddressField.setVisibility(false);
        }
        this.resetFrequencyFieldVisibility();
        if (scope.context.transferType === "Same Bank") {
          if (selectedRecord.accountType == "CreditCard" || selectedRecord.accountType == "Loan") {
            this.view.tbxAmount.text = "";
            this.setCreditCardOrLoanView(selectedRecord);
            this.onPaymentAmountTypeSelect(1);
          } else {
            this.view.flxPaymentAmountTypeField.setVisibility(false);
            this.view.flxAmountField.setVisibility(true);
            this.view.flxFrequencyField.setVisibility(true);
            this.view.flxEndDate.setVisibility(false);
            this.view.flxRecurrences.setVisibility(false);
            this.view.flxDueDate.setVisibility(false);
          }
          if (scope.context.transferFlow !== "Repeat") {
            scope.businessController.storeInCollection({
              "frequencyType": "Once",
              "frequencyEndDate": "",
              "formattedEndOnDate": "",
              "tbxRecurrences": ""
            });
          }
          if (selectedRecord.accountType === "Savings" || selectedRecord.accountType === "Checking") {
            scope.view.segFromAccounts.removeAll();
            scope.businessController.filterAccountRecordsOnSelection(selectedRecord, scope.context.transferType, "To");
          }
        }
        if (scope.ToSearchApplied) {
          scope.view["segToAccounts"].removeAll();
          scope.view["segToAccounts"].setData(scope["groupedToRecords"]);
        }
        if (scope.context.transferType === "Same Bank") {
          if (selectedRecord.accountType === "External") {
            scope.businessController.invokeCustomVerbforGetBeneficiaryCurrency();
          } else {
            scope.setTransferCurrencyFieldFromAccounts(true);
          }
        }
        if (!scope.isEmptyNullOrUndefined(selectedRecord.swiftCode)) {
          scope.businessController.invokeCustomVerbforValidateSwiftCode();
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "onToAccountSelection",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    filterAccounts: function (fieldType) {
      var scope = this;
      try {
        this.view["flxClear" + fieldType + "Text"].setVisibility(true);
        var searchText = this.view["tbx" + fieldType + "Account"].text.toLowerCase();
        this[fieldType + "searchApplied"] = false;
        if (searchText != "") {
          var result = [];
          var data = this[fieldType + "Records"];
          for (var i = 0; i < data.length; i++) {
            if ((data[i].lblRecordField1.text && data[i].lblRecordField1.text.toLowerCase().indexOf(searchText) != -1) || (data[i].lblRecordField2.text && data[i].lblRecordField2.text.toLowerCase().indexOf(searchText) != -1) || (data[i].lblRecordField3.text && data[i].lblRecordField3.text.toLowerCase().indexOf(searchText) != -1)) {
              result.push(data[i]);
            }
          }
          if (!(result.length > 0)) {
            this.view["flx" + fieldType + "AccountSegment"].setVisibility(false);
            this.view["flxNo" + fieldType + "Records"].setVisibility(true);
          } else {
            this[fieldType + "searchApplied"] = true;
            result = this.prepareAccountsSegmentData(result, fieldType);
            this.view["seg" + fieldType + "Accounts"].removeAll();
            this.view["seg" + fieldType + "Accounts"].setData(result);
            this.view["flx" + fieldType + "AccountSegment"].setVisibility(true);
            this.view["flxNo" + fieldType + "Records"].setVisibility(false);
          }
        } else {
          this[fieldType + "searchApplied"] = false;
          this.view["seg" + fieldType + "Accounts"].removeAll();
          this.view["seg" + fieldType + "Accounts"].setData(this["grouped" + fieldType + "Records"]);
          this.view["flx" + fieldType + "AccountSegment"].setVisibility(true);
          this.view["flxNo" + fieldType + "Records"].setVisibility(false);
          this.view["flxClear" + fieldType + "Text"].setVisibility(false);
          this.view["lbl" + fieldType + "RecordField1"].text = "";
          this.view["lbl" + fieldType + "RecordField2"].text = "";
        }
        scope.enableOrDisableContinueButton();
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "filterAccounts",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    clearAccountTextboxTexts: function (fieldType) {
      var scope = this;
      try {
        scope.view["tbx" + fieldType + "Account"].text = "";
        scope.view["flxClear" + fieldType + "Text"].setVisibility(false);
        scope[fieldType + "searchApplied"] = false;
        scope.view["seg" + fieldType + "Accounts"].removeAll();
        scope.view["seg" + fieldType + "Accounts"].setData(this["grouped" + fieldType + "Records"]);
        scope.view["flx" + fieldType + "AccountSegment"].setVisibility(true);
        scope.view["flxNo" + fieldType + "Records"].setVisibility(false);
        scope.enableOrDisableContinueButton();
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "clearAccountTextboxTexts",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
    * @api : validateData
    * responsible for performing data validation
    * @return : NA
    */
    validateData: function (dataValidator, widgetId) {
      var scope = this;
      var form = kony.application.getCurrentForm();
      try {
        var dataValidator, widgetId;
        if (!scope.isEmptyNullOrUndefined(scope.collectionObj.Collection.dvfError)) {
          dataValidator = scope.collectionObj.Collection.dvfError.dvfError;
          widgetId = scope.collectionObj.Collection.dvfError.widgetId;
        }
        if (widgetId && widgetId === "tbxPayeeDetail1") {
          scope.resetTextBoxSkin(scope.view[widgetId]);
        }
        if (scope.isEmptyNullOrUndefined(dataValidator)) {
          if (scope.isNewAccountNumberValid && scope.isSwiftValid) scope.view.flxErrorMessage.setVisibility(false);
          if ("flxLookupErrorMessage" in form) form.flxLookupErrorMessage.setVisibility(false);
        } else if (!scope.isEmptyNullOrUndefined(dataValidator)) {
          this.invokedvfFieldErrorParser(dataValidator);
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "validateData",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * invokedvfFieldErrorParser
     * @api : invokedvfFieldErrorParser
     * gets invoked when validation fails
     * @return : NA
     */
    invokedvfFieldErrorParser: function (dvfError) {
      var scope = this;
      try {
        var txtField;
        var form = kony.application.getCurrentForm();
        for (var iterator in dvfError) {
          switch (iterator) {
            case "tbxPayeeName":
              scope.setErrorTextBoxSkin(scope.view.tbxPayeeName);
              txtField = kony.i18n.getLocalizedString("i18n.StopCheckPayments.PayeeName");
              break;
            case "tbxAccountNumber":
              scope.setErrorTextBoxSkin(scope.view.tbxAccountNumber);
              txtField = kony.i18n.getLocalizedString("i18n.common.accountNumber");
              break;
            case "tbxReEnterAccountNumber":
              scope.setErrorTextBoxSkin(scope.view.tbxReEnterAccountNumber);
              txtField = kony.i18n.getLocalizedString("i18n.common.accountNumber");
              break;
            case "tbxAddressField1":
              scope.setErrorTextBoxSkin(scope.view.tbxAddressField1);
              txtField = kony.i18n.getLocalizedString("i18n.konybb.manageUser.PhoneNo");
              break;
            case "tbxAddressField2":
              scope.setErrorTextBoxSkin(scope.view.tbxAddressField2);
              txtField = kony.i18n.getLocalizedString("i18n.konybb.manageUser.EmailID");
              break;
            case "tbxAddressField3":
              scope.setErrorTextBoxSkin(scope.view.tbxAddressField3);
              txtField = kony.i18n.getLocalizedString("i18n.TransfersEur.AddressLine01");
              break;
            case "tbxAddressField4":
              scope.setErrorTextBoxSkin(scope.view.tbxAddressField4);
              txtField = kony.i18n.getLocalizedString("i18n.TransfersEur.AddressLine02");
              break;
            case "tbxAddressField5":
              scope.setErrorTextBoxSkin(scope.view.tbxAddressField5);
              txtField = kony.i18n.getLocalizedString("i18n.TransfersEur.City");
              break;
            case "tbxAddressField8":
              scope.setErrorTextBoxSkin(scope.view.tbxAddressField8);
              txtField = kony.i18n.getLocalizedString("i18n.common.zipcode");
              break;
            case "tbxPayeeDetail1":
              scope.setErrorTextBoxSkin(scope.view.tbxPayeeDetail1);
              txtField = (scope.context.transferType === "Pay a Person") ? kony.i18n.getLocalizedString("i18n.konybb.manageUser.PhoneNo") : kony.i18n.getLocalizedString("i18n.TransfersEur.BICSWIFT");
              if (scope.context.transferType !== "Pay a Person") scope.isSwiftValid = false;
              break;
            case "tbxPayeeDetail2":
              scope.setErrorTextBoxSkin(scope.view.tbxPayeeDetail2);
              txtField = (scope.context.transferType === "Pay a Person") ? kony.i18n.getLocalizedString("i18n.konybb.manageUser.EmailID") : kony.i18n.getLocalizedString("i18n.UnifiedTransfer.ClearingCode2");
              break;
            case "tbxPayeeDetail3":
              scope.setErrorTextBoxSkin(scope.view.tbxPayeeDetail3);
              txtField = kony.i18n.getLocalizedString("i18n.UnifiedTransfer.ClearingCode2");
              break;
            case "tbxPayeeDetail4":
              scope.setErrorTextBoxSkin(scope.view.tbxPayeeDetail4);
              txtField = kony.i18n.getLocalizedString("i18n.transfers.bankName");
              break;
            case "tbxIntermediaryBic":
              scope.setErrorTextBoxSkin(scope.view.tbxIntermediaryBic);
              txtField = kony.i18n.getLocalizedString("i18n.UnifiedTransfer.IntermediaryBIC");
              if (scope.context.transferType !== "Pay a Person") scope.isSwiftValid = false;
              break;
            case "tbxE2EReference":
              scope.setErrorTextBoxSkin(scope.view.tbxE2EReference);
              txtField = kony.i18n.getLocalizedString("i18n.UnifiedTransfer.E2EReference");
              break;
            case "txtBoxSearchField1":
              scope.setErrorTextBoxSkin(form.txtBoxSearchField1);
              txtField = kony.i18n.getLocalizedString("i18n.transfers.bankName");
              break;
            case "txtBoxSearchField2":
              scope.setErrorTextBoxSkin(form.txtBoxSearchField2);
              txtField = kony.i18n.getLocalizedString("i18n.LocateUs.BranchName");
              break;
            case "txtBoxSearchField3":
              scope.setErrorTextBoxSkin(form.txtBoxSearchField3);
              txtField = kony.i18n.getLocalizedString("i18n.TransfersEur.Country");
              break;
            case "txtBoxSearchField4":
              scope.setErrorTextBoxSkin(form.txtBoxSearchField4);
              txtField = kony.i18n.getLocalizedString("i18n.TransfersEur.City");
              break;
            case "tbxAmount":
              scope.setErrorFlexSkin(scope.view.flxAmountTextBox);
              txtField = kony.i18n.getLocalizedString("i18n.konybb.Common.Amount");
              break;
            case "tbxPaymentAmount4":
              scope.setErrorFlexSkin(scope.view.flxPaymentAmount4TextBox);
              txtField = kony.i18n.getLocalizedString("i18n.konybb.Common.Amount");
              break;
          }
        }
        var errorTxt = dvfError[iterator];
        errorTxt = errorTxt.replace(iterator, txtField);
        if (iterator === "txtBoxSearchField1" || iterator === "txtBoxSearchField2" || iterator === "txtBoxSearchField3" || iterator === "txtBoxSearchField4") {
          form.rtxLookupErrorMessage.text = errorTxt;
          form.flxLookupErrorMessage.setVisibility(true);
        } else {
          this.view.rtxErrorMessage.text = errorTxt;
          this.view.flxErrorMessage.setVisibility(true);
        }
        scope.enableOrDisableContinueButton(false);
        scope.businessController.resetCollection("dvfError");
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "invokedvfFieldErrorParser",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
    * @api : isAccountNumbersMatch
    * validates whether account number and re-enter account number matches
    * @return : NA
    */
    isAccountNumbersMatch: function (tbx1Widget, tbx2Widget) {
      var scope = this;
      try {
        if (tbx1Widget.text !== "" && tbx2Widget.text !== "") {
          scope.isNewAccountNumberValid = true;
          if (tbx2Widget.text !== tbx1Widget.text) {
            scope.view.rtxErrorMessage.text = kony.i18n.getLocalizedString("i18n.UnifiedTransfer.AccountNumberMismatchMessage");
            scope.view.flxErrorMessage.setVisibility(true);
            scope.isNewAccountNumberValid = false;
          } else {
            if (scope.context.transferType === "Same Bank") {
              var isAccountNumberValid = scope.businessController.isValidAccountNumber(tbx1Widget.text);
              if (isAccountNumberValid) {
                var isExistingAccount = scope.businessController.checkExistingAccount(tbx1Widget.text);
                if (isExistingAccount) {
                  scope.view.rtxErrorMessage.text = kony.i18n.getLocalizedString("i18n.UnifiedTransfer.AccountAlreadyExistMessage");
                  scope.view.flxErrorMessage.setVisibility(true);
                  scope.isNewAccountNumberValid = false;
                } else {
                  scope.businessController.invokeCustomVerbforGetBeneficiaryName();
                }
              } else {
                scope.view.rtxErrorMessage.text = kony.i18n.getLocalizedString("i18n.UnifiedTransfer.InvalidAccountNumberFormatMessage");
                scope.view.flxErrorMessage.setVisibility(true);
                scope.isNewAccountNumberValid = false;
              }
            } else if (scope.context.transferType === "Domestic Transfer" || scope.context.transferType === "International Transfer") {
              var isAccountNumberValid = scope.businessController.isValidAccountNumber(tbx1Widget.text);
              var isIbanValid = scope.businessController.isValidIBAN(tbx1Widget.text);
              if (isAccountNumberValid || isIbanValid) {
                var isExistingAccount = scope.businessController.checkExistingAccount(tbx1Widget.text);
                if (isExistingAccount) {
                  scope.view.rtxErrorMessage.text = kony.i18n.getLocalizedString("i18n.UnifiedTransfer.AccountAlreadyExistMessage");
                  scope.view.flxErrorMessage.setVisibility(true);
                  scope.isNewAccountNumberValid = false;
                } else {
                  scope.businessController.invokeCustomVerbforValidateIban();
                }
              } else {
                scope.view.rtxErrorMessage.text = kony.i18n.getLocalizedString("i18n.UnifiedTransfer.InvalidIBANFormatMessage");
                scope.view.flxErrorMessage.setVisibility(true);
                scope.isNewAccountNumberValid = false;
              }
            }
          }
          if (scope.isNewAccountNumberValid) {
            scope.resetTextBoxSkin(tbx1Widget);
            scope.resetTextBoxSkin(tbx2Widget);
          } else {
            scope.setErrorTextBoxSkin(tbx1Widget);
            scope.setErrorTextBoxSkin(tbx2Widget);
          }
          scope.enableOrDisableContinueButton();
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "isAccountNumbersMatch",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    setSwiftCodeDetailFields: function () {
      var scope = this;
      try {
        scope.collectionObj = UnifiedTransferStore.getState();
        var swiftCodeObj = scope.collectionObj.Collection["SwiftCode"];
        if(scope.collectionObj.Collection["Transaction"]["payeeType"]==="New Payee"){
          if (!scope.isEmptyNullOrUndefined(swiftCodeObj["bankName"])) {
            scope.view.tbxPayeeDetail4.text = swiftCodeObj["bankName"];
            scope.view.tbxPayeeDetail4.setEnabled(false);
            scope.view.tbxPayeeDetail4.skin = "ICSknTbxDisabledSSPreg42424215px";
          } else {
            scope.view.tbxPayeeDetail4.text = "";
            scope.view.tbxPayeeDetail4.setEnabled(true);
          }
          if (!scope.isEmptyNullOrUndefined(swiftCodeObj["swiftCode"])) {
            scope.view.tbxPayeeDetail1.text = swiftCodeObj["swiftCode"];
            if (scope.isEmptyNullOrUndefined(swiftCodeObj["countryCode"])) {
              scope.businessController.invokeCustomVerbforValidateSwiftCode("tbxPayeeDetail1");
            }
          }
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setSwiftCodeDetailFields",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    setCreditCardOrLoanView: function (selectedRecord) {
      var scope = this;
      try {
        var transactionCurrency = selectedRecord["currencyCode"];
        var currencySymbol = scope.businessController.getCurrencySymbol(selectedRecord["currencyCode"]);
        var accountType = selectedRecord["accountType"];
        if (accountType === "Loan") {
          this.view.lblPaymentAmount1.text = currencySymbol + scope.businessController.getFormattedAmount(selectedRecord["outstandingBalance"]);
          this.view.lblPaymentAmount2.text = currencySymbol + scope.businessController.getFormattedAmount(selectedRecord["paymentDue"]);
          this.view.lblPaymentAmount3.text = currencySymbol + scope.businessController.getFormattedAmount(selectedRecord["currentAmountDue"]);
        } else {
          this.view.lblPaymentAmount1.text = currencySymbol + scope.businessController.getFormattedAmount(selectedRecord["outstandingBalance"]);
          this.view.lblPaymentAmount2.text = currencySymbol + scope.businessController.getFormattedAmount(selectedRecord["paymentDue"]);
          this.view.lblPaymentAmount3.text = currencySymbol + scope.businessController.getFormattedAmount(selectedRecord["minimumDue"]);
        }
        this.view.lblPaymentAmount4Currency.text = currencySymbol;
        if (accountType == "CreditCard") {
          if (!scope.isEmptyNullOrUndefined(selectedRecord["dueDate"])) {
            var dueDate = scope.businessController.getFormattedDate(selectedRecord["dueDate"]);
            this.view.lblDueDate.text = "(" + "Due Date: " + dueDate + ")";
            this.view.flxEndDate.setVisibility(false);
            this.view.flxRecurrences.setVisibility(false);
            this.view.flxDueDate.setVisibility(true);
          } else {
            this.view.flxEndDate.setVisibility(false);
            this.view.flxRecurrences.setVisibility(false);
            this.view.flxDueDate.setVisibility(false);
          }
        } else {
          scope.businessController.invokeCustomVerbforGetAccountDetails();
        }
        this.view.flxPaymentAmountTypeField.setVisibility(true);
        this.view.flxAmountField.setVisibility(false);
        this.view.flxFrequencyField.setVisibility(false);
        scope.businessController.storeInCollection({ "transactionCurrency": transactionCurrency });
        scope.enableOrDisableContinueButton();
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setCreditCardOrLoanView",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    setAccountDetailsResponse: function () {
      this.collectionObj = UnifiedTransferStore.getState();
      var scope = this;
      try {
        if (!scope.isEmptyNullOrUndefined(scope.collectionObj.Collection["accountDetails"])) {
          var accDetails = scope.collectionObj.Collection["accountDetails"];
          if (!scope.isEmptyNullOrUndefined(accDetails["nextPaymentDate"])) {
            var dueDate = scope.businessController.getFormattedDate(accDetails["nextPaymentDate"]);
            this.view.lblDueDate.text = "(" + "Due Date:" + dueDate + ")";
            this.view.flxEndDate.setVisibility(false);
            this.view.flxRecurrences.setVisibility(false);
            this.view.flxDueDate.setVisibility(true);
          } else {
            this.view.flxEndDate.setVisibility(false);
            this.view.flxRecurrences.setVisibility(false);
            this.view.flxDueDate.setVisibility(false);
          }
          scope.businessController.resetCollection("accountDetails");
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setAccountDetailsResponse",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    onPaymentAmountTypeSelect: function (idx) {
      var scope = this;
      try {
        for (let i = 1; i <= 4; i++) {
          if (i === idx) {
            this.view["lblPaymentTypeOption" + i].text = "M";
            this.view["lblPaymentTypeOption" + i].skin = "ICSknLblRadioBtnSelectedFontIcon003e7520px";
          } else {
            this.view["lblPaymentTypeOption" + i].text = "L";
            this.view["lblPaymentTypeOption" + i].skin = "ICSknLblRadioBtnUnelectedFontIcona0a0a020px";
          }
        }
        this.view.tbxPaymentAmount4.setEnabled(idx === 4);
        var amount = idx !== 4 ? scope.businessController.getFormattedAmount(scope.view["lblPaymentAmount" + idx].text) : "";
        scope.businessController.storeInCollection({
          "tbxPaymentAmount4": amount
        });
        scope.enableOrDisableContinueButton();
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "onPaymentAmountTypeSelect",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    setPayeeDetailFields: function (selectedRecord) {
      var scope = this;
      try {
        if (scope.context.transferType === "Domestic Transfer" || scope.context.transferType === "International Transfer") {
          scope.view.tbxPayeeDetail1.text = selectedRecord.swiftCode || "";
          scope.view.tbxPayeeDetail4.text = selectedRecord.bankName || "";
          scope.businessController.storeInCollection({
            "tbxPayeeDetail1": scope.view.tbxPayeeDetail1.text,
            "tbxPayeeDetail4": scope.view.tbxPayeeDetail4.text
          });
        } else if (scope.context.transferType === "Pay a Person") {
          scope.view.tbxPayeeDetail1.text = selectedRecord.phone || "";
          scope.view.tbxPayeeDetail2.text = selectedRecord.email || "";
          scope.businessController.storeInCollection({
            "tbxPayeeDetail1": scope.view.tbxPayeeDetail1.text,
            "tbxPayeeDetail2": scope.view.tbxPayeeDetail2.text
          });
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setPayeeDetailFields",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    setPayeeAddressDetailsFields: function (selectedRecord) {
      var scope = this;
      try {
        scope.view.flxPayeeAddressField.setVisibility(true);
        scope.view.tbxAddressField1.text = selectedRecord.phone || "";
        scope.view.tbxAddressField2.text = selectedRecord.email || "";
        scope.view.tbxAddressField3.text = selectedRecord.addressLine1 || "";
        scope.view.tbxAddressField4.text = selectedRecord.addressLine2 || "";
        scope.view.tbxAddressField5.text = selectedRecord.city || "";
        scope.view.lbxAddressField6.masterData = selectedRecord.state ? [["0", selectedRecord.state]] : [["0", ""]];
        scope.view.lbxAddressField6.selectedKey = scope.view.lbxAddressField6.masterData[0][0];
        scope.view.lbxAddressField7.masterData = selectedRecord.country ? [["0", selectedRecord.country]] : [["0", ""]];
        scope.view.lbxAddressField7.selectedKey = scope.view.lbxAddressField7.masterData[0][0];
        scope.view.tbxAddressField8.text = selectedRecord.zipcode || "";
        scope.businessController.storeInCollection({
          "tbxAddressField1": scope.view.tbxAddressField1.text,
          "tbxAddressField2": scope.view.tbxAddressField2.text,
          "tbxAddressField3": scope.view.tbxAddressField3.text,
          "tbxAddressField4": scope.view.tbxAddressField4.text,
          "tbxAddressField5": scope.view.tbxAddressField5.text,
          "lbxAddressField6": scope.view.lbxAddressField6.selectedKeyValue[1],
          "lbxAddressField7": scope.view.lbxAddressField7.selectedKeyValue[1],
          "tbxAddressField8": scope.view.tbxAddressField8.text 
        })
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setPayeeAddressDetailsFields",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    resetFrequencyFieldVisibility: function () {
      var scope = this;
      try {
        var frequencyData = scope.view.segFrequencyList.data;
        scope.view.lblSelectedFrequency.text = frequencyData[0]["value"];
        scope.view.flxTransferDuration.setVisibility(false);
        scope.view.flxEndDate.setVisibility(false);
        scope.view.flxRecurrences.setVisibility(false);
        if (!scope.isEmptyNullOrUndefined(this.bankDateObj) && !scope.isEmptyNullOrUndefined(this.bankDateObj.currentWorkingDate)) {
          var bankDate = this.bankDateObj.currentWorkingDate;
        } else {
          var bankDate = this.view.calStartDate.formattedDate;
        }
        scope.businessController.storeInCollection({ 
          "frequencyType": "Once",
          "frequencyEndDate": "",
          "formattedEndOnDate": "",
          "tbxRecurrences": "",
          "isScheduled": this.view.calStartDate.formattedDate !== scope.businessController.getFormattedDate(bankDate) ? "1" : "0"
        });
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "resetFrequencyFieldVisibility",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    setBeneficiaryDetailsResponse: function() {
      var scope = this;
      this.collectionObj = UnifiedTransferStore.getState();
      try {
        if (!scope.isEmptyNullOrUndefined(scope.collectionObj.Collection["beneficiaryDetails"])) {
          var beneficiaryDetails = scope.collectionObj.Collection["beneficiaryDetails"];
          scope.view.tbxPayeeName.text = beneficiaryDetails.beneficiaryName;
          scope.businessController.resetCollection("beneficiaryDetails");
          scope.businessController.storeInCollection({ "tbxPayeeName": scope.view.tbxPayeeName.text });
          if (scope.isEmptyNullOrUndefined(beneficiaryDetails.beneficiaryName)) {
            scope.view.rtxErrorMessage.text = kony.i18n.getLocalizedString("i18n.TransferEur.inValidAccountNumber");
            scope.view.flxErrorMessage.setVisibility(true);
            scope.isNewAccountNumberValid = false;
          } else {
            scope.isNewAccountNumberValid = true;
            scope.serviceCurrency = beneficiaryDetails.beneficiaryCurrency;
            scope.setTransferCurrencyFieldFromAccounts();
          }
        }
        scope.enableOrDisableContinueButton();
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setBeneficiaryDetailsResponse",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
    * @api : setConditionalMappingKey
    * Set the conditional mapping in global variable
    * @return : NA
    */
    setConditionalMappingKey: function () {
      var scope = this;
      try {
        var conditionalMappingKey = this.conditionalMappingKey;
        for (key in conditionalMappingKey) {
          conditionalMappingKey[key] = conditionalMappingKey[key].split(".");
          conditionalMappingKey[key] = conditionalMappingKey[key][conditionalMappingKey[key].length - 1].replace("}", "");
        }
        this.conditionalMappingKey = conditionalMappingKey;
      }
      catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setConditionalMappingKey",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
    * @api : performSegmentDataMapping
    * This method will do segment data mapping with collection
    * @return : NA
    */
    performSegmentDataMapping: function (segWidget) {
      var scope = this;
      try {
        var dataMapping = this.dataMapping;
        var conditionalDataMapping = this.conditionalMapping;
        var conditionalDataMappingKey = this.conditionalMappingKey;
        for (key in dataMapping) {
          if (key === "segments") {
            var widgets = dataMapping[key];
            for (key in widgets) {
              if (segWidget === key) {
                var widgetId = key;
                var segData = scope.getSegmentDataFromMapping(widgets[widgetId], conditionalDataMapping[widgetId], conditionalDataMappingKey[widgetId], widgetId);
                return segData;
              }
            }
          }
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "performSegmentDataMapping",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
    * @api : getSegmentDataFromMapping
    * This method will return the segement data from data mapping property
    * @return : Array
    */
    getSegmentDataFromMapping: function (segDataJSON, conditionalMapping, conditionalMappingKey, segId) {
      var scope = this;
      try {
        var segData = [];
        var segMasterDataToken = segDataJSON.segmentMasterData;
        segMasterDataToken = segMasterDataToken.split(".");
        if (segMasterDataToken[0].indexOf("Collection") != -1) {
          var segMasterData = [];
          var key = segMasterDataToken[1].replace("}", "");
          if (this.collectionObj.Collection[key]) {
            segMasterData = this.collectionObj.Collection[key];
          }
          segMasterData.map((record) => {
            var segRecord = JSON.parse(JSON.stringify(segDataJSON.segmentUI));
            for (key in segRecord) {
              segRecord[key] = {
                "text": scope.getFieldValueFromMapping(key, segRecord[key], conditionalMapping, conditionalMappingKey, record)
              };
            }
            segData.push(Object.assign(record, segRecord));
          });
        }
        return segData;
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "getSegmentDataFromMapping",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
    * @api : getFieldValueFromMapping
    * Returns the data in collection using data mapping and conditional data mapping
    * @return : String
    */
    getFieldValueFromMapping: function (widget, fieldMapping, conditionalMapping, conditionalMappingKey, record) {
      var scope = this;
      try {
        var conditionalfieldMapping;
        if (conditionalMappingKey) {
          if (conditionalMapping[record[conditionalMappingKey]] != undefined) {
            conditionalfieldMapping = conditionalMapping[record[conditionalMappingKey]][widget];
          }
        }
        if (conditionalfieldMapping) {
          fieldMapping = conditionalfieldMapping;
        }
        if (typeof fieldMapping === "string") {
          if (fieldMapping.indexOf("$") !== -1) {
            if (fieldMapping.indexOf("${i18n") !== -1) {
               return kony.i18n.getLocalizedString(fieldMapping.substring(fieldMapping.indexOf("${i18n{") + 7, fieldMapping.length - 2));
            } else {
              fieldMapping = fieldMapping.split(".");
              fieldMapping = fieldMapping[fieldMapping.length - 1].replace("}", "");
              return record[fieldMapping];
            }
          } else {
            return fieldMapping;
          }
        } else if (typeof fieldMapping === "object") {
          var keys = Object.keys(fieldMapping);
          if (JSON.stringify(keys).indexOf("BP1") != -1 || JSON.stringify(keys).indexOf("BP2") != -1 || JSON.stringify(keys).indexOf("BP3") != -1) {
            var fieldValue = this.getBreakpointBasedValue(fieldMapping, kony.application.getCurrentBreakpoint());
            return this.getFieldValueFromMapping(widget, fieldValue, {}, "", record);
          } else {
            for (key in fieldMapping) {
              if (typeof fieldMapping[key] === "string") {
                if (fieldMapping[key].indexOf("${") !== -1) {
                  fieldMapping[key] = this.getFieldValueFromMapping(widget, fieldMapping[key], {}, "", record);
                }
              }
            }
          }
          return fieldMapping;
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "getFieldValueFromMapping",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * @api : enableOrDisableContinueButton
     * enable or disable the continue button based on error identifier
     * @return : NA
     */
    enableOrDisableContinueButton: function (isdvfValidated = true) {
      var scope = this;
      try {
        var collectionObj = UnifiedTransferStore.getState();
        var transactionObj = collectionObj.Collection["Transaction"];
        if (scope.isEmptyNullOrUndefined(transactionObj)) {
          scope.disableButton(scope.view.btn2);
          return;
        }
        if (transactionObj["frequencyType"] !== "Once") {
          if (scope.view.flxEndDate.isVisible === true) {
            var startDate = scope.businessController.getDateObjectFromDateComponents(scope.view.calStartDate.dateComponents);
            var endDate = scope.businessController.getDateObjectFromDateComponents(scope.view.calEndDate.dateComponents);
            if (endDate.getTime() === startDate.getTime()) {
              this.view.rtxErrorMessage.text = kony.i18n.getLocalizedString("i18n.transfers.errors.sameEndDate");
              this.view.flxErrorMessage.setVisibility(true);
              isdvfValidated = false;
            } else if (endDate.getTime() < startDate.getTime()) {
              this.view.rtxErrorMessage.text = kony.i18n.getLocalizedString("i18n.transfers.errors.beforeEndDate");
              this.view.flxErrorMessage.setVisibility(true);
              isdvfValidated = false;
            }
          }
          if (scope.view.flxRecurrences.isVisible === true) {
            if (scope.isEmptyNullOrUndefined(transactionObj["numberOfRecurrences"])) isdvfValidated = false;
          }
        }
        if (scope.view["tbxFromAccount"].text === "" || scope.isEmptyNullOrUndefined(transactionObj["fromAccountNumber"])) isdvfValidated = false;
        if (transactionObj["payeeType"] === "Existing Payee") {
          if (scope.view["tbxToAccount"].text === "") isdvfValidated = false;
          if (transactionObj["transferType"] === "Pay a Person" && scope.isEmptyNullOrUndefined(transactionObj["personId"])) isdvfValidated = false;
          if (transactionObj["transferType"] !== "Pay a Person" && scope.isEmptyNullOrUndefined(transactionObj["toAccountNumber"]))  isdvfValidated = false;
        } else {
          if (scope.view["tbxPayeeName"].text === "" || scope.view["tbxAccountNumber"].text === "" || scope.view["tbxReEnterAccountNumber"].text === "") isdvfValidated = false;
          if (transactionObj["transferType"] === "Domestic Transfer" && scope.view.tbxPayeeDetail1.text === "") isdvfValidated = false;
          if (transactionObj["transferType"] === "International Transfer" && scope.view.tbxPayeeDetail1.text === "") isdvfValidated = false;
        }
        if (scope.isEmptyNullOrUndefined(transactionObj["transactionCurrency"]) || scope.isEmptyNullOrUndefined(transactionObj["amount"])) isdvfValidated = false;
        if (!scope.isNewAccountNumberValid || !scope.isSwiftValid) isdvfValidated = false;
        if (isdvfValidated) {
          scope.enableButton(scope.view.btn2);
        } else {
          scope.disableButton(scope.view.btn2);
        }
        scope.view.forceLayout();
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "enableOrDisableContinueButton",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * @api : showCancelPopup
     * displays popup on click of cancel button
     * @return : NA
     */
    showCancelPopup: function () {
      var scope = this;
      try {
        var form = kony.application.getCurrentForm();
        var popupObj = scope.view.flxPopup.clone();
        form.add(popupObj);
        popupObj.isVisible = true;
        popupObj.top = "0dp";
        popupObj.left = "0dp";
        popupObj.height = "100%";
        popupObj.flxCancelPopup.centerX = "50%";
        popupObj.flxCancelPopup.centerY = "50%";
        popupObj.flxCancelPopup.flxPopupHeader.lblPopupHeading.text = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
        popupObj.flxCancelPopup.lblPopupMessage.text = kony.i18n.getLocalizedString("i18n.PayAPerson.CancelAlert");
        popupObj.flxCancelPopup.flxPopupHeader.flxClosePopup.onClick = () => {
          form.remove(popupObj);
        }
        popupObj.flxCancelPopup.btnNo.onClick = () => {
          form.remove(popupObj);
        }
        popupObj.flxCancelPopup.btnYes.onClick = () => {
          form.remove(popupObj);
          scope.onCancelTransfer();
        }
        scope.view.forceLayout();
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "showCancelPopup",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * @api : validateInputDataAndCallAPI
     * validate the data & call validate transaction API
     */
    validateInputDataAndCallAPI: function () {
      var scope = this;
      try {
        var paymentMethod = scope.collectionObj.Collection["Transaction"]["paymentMethod"];
        if (scope.context.transferType === "Domestic Transfer" && paymentMethod !== "SEPA" && paymentMethod !== "INSTANT" || scope.context.transferType === "Pay a Person") {
          scope.businessController.validateCallSuccess();
        } else {
          scope.businessController.invokeCustomVerbforValidateTransaction(scope.context.transferType);
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "validateInputDataAndCallAPI",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * @api : prefillComponentData
     * prefill the component for Repeat transaction flow
     * @return : NA
     */
    prefillComponentData: function () {
      try {
        var scope = this;
        var transObj = scope.context.transactionObject;
        scope.view.tbxAmount.text = scope.businessController.getFormattedAmount(transObj.amount);
        if (scope.context.transferType === "Same Bank") {
          scope.view.lblSelectedCurrencySymbol.text = scope.businessController.getCurrencySymbol(transObj["transactionCurrency"]);
          scope.view.lblSelectedTransferCurrency.text = scope.view.lblSelectedCurrencySymbol.text + " " + transObj["transactionCurrency"];
        }
        scope.view.tbxIntermediaryBic.text = transObj["intermediaryBicCode"] || "";
        scope.view.tbxE2EReference.text = transObj["endToEndReference"] || "";
        var freqData = scope.view.segFrequencyList.data, isFrequencyAvailable = false;
        for (let i = 0; i < freqData.length; i++) {
          if (freqData[i].key === transObj["frequencyType"]) {
            scope.view.segFrequencyList.selectedRowIndex = [0, i];
            isFrequencyAvailable = true;
            break;
          }
        }
        var currData = scope.view.segTransferCurrencyList.data, isCurrencyAvailable = false, paymentMethodIdx = "";
        for (let i = 0; i < currData.length; i++) {
          if (currData[i].key === transObj["transactionCurrency"]) {
            scope.view.segTransferCurrencyList.selectedRowIndex = [0, i];
            isCurrencyAvailable = true;
            if (scope.context.transferType === "Domestic Transfer" && !scope.isEmptyNullOrUndefined(transObj["paymentType"])) {
              let paymentMethod = scope.dataMapping["paymentMethods"][currData[i].key];
              for (let j = 1; j <= paymentMethod.length; j++) {
                var paymentType = transObj["paymentType"];
                if (paymentType === "INSTPAY") paymentType = "INSTANT"
                if (paymentMethod[j - 1] === paymentType) {
                  paymentMethodIdx = j;
                  break;
                }
              }
            } else {
              break;
            }
          }
        }
        var feesPaidByIdx = transObj["chargeBearer"] ? (transObj["chargeBearer"] === "OUR" ? 1 : transObj["chargeBearer"] === "BEN" ? 2 : 3) : "";
        if (isFrequencyAvailable) scope.onFrequencySelection();
        if (scope.context.transferType !== "Same Bank" && isCurrencyAvailable) scope.onCurrencySelection();
        if (scope.view.flxFeesPaidByField.isVisible && feesPaidByIdx !== "") scope.onFeesPaidBySelect(feesPaidByIdx);
        if (scope.view.flxPaymentMethodField.isVisible && paymentMethodIdx !== "") scope.onPaymentMethodSelect(paymentMethodIdx);
        scope.businessController.storeInCollection({ 
          "tbxAmount": scope.view.tbxAmount.text,
          "transactionCurrency": scope.view.lblSelectedTransferCurrency.text !== "" ? transObj["transactionCurrency"] : "",
          "tbxIntermediaryBic":  scope.view.tbxIntermediaryBic.text,
          "tbxE2EReference": scope.view.tbxE2EReference.text
        });
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "prefillComponentData",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * @api : prefillAccountFields
     * prefill the account fields for Repeat transaction flow
     * @return : NA
     */
    prefillAccountFields: function (fieldType) {
      var scope = this;
      try {
        var transObj = scope.context.transactionObject;
        if (fieldType === "From") {
          var segData = scope.view.segFromAccounts.data, isFromAccountAvailable = false;
          var fromAccountNumber = transObj.fromAccountNumber;
          if (!scope.isEmptyNullOrUndefined(scope.groupIdentifier)) {
            for (let i = 0; i < segData.length; i++) {
              var sectionRow = segData[i][1];
              for (let j = 0; j < sectionRow.length; j++) {
                if (sectionRow[j].accountID === fromAccountNumber) {
                  scope.view.segFromAccounts.selectedRowIndex = [i, j];
                  isFromAccountAvailable = true;
                  break;
                }
              }
            }
          } else {
            for (let i = 0; i < segData.length; i++) {
              if (segData[i].accountID === fromAccountNumber) {
                scope.view.segFromAccounts.selectedRowIndex = [0, i];
                isFromAccountAvailable = true;
                break;
              }
            }
          }
          if (isFromAccountAvailable) scope.onFromAccountSelection();
        } else if (fieldType === "To") {
          var segData = scope.view.segToAccounts.data, isToAccountAvailable = false;
          var toAccountNumber = transObj["transactionType"] === "P2P" ? transObj.personId : transObj.toAccountNumber;
          if (!scope.isEmptyNullOrUndefined(scope.groupIdentifier)) {
            for (let i = 0; i < segData.length; i++) {
              var sectionRow = segData[i][1];
              for (let j = 0; j < sectionRow.length; j++) {
                if ((transObj["transactionType"] === "ExternalTransfer" && sectionRow[j].accountNumber === toAccountNumber) || (transObj["transactionType"] === "InternalTransfer" && sectionRow[j].accountID === toAccountNumber) || (transObj["transactionType"] === "P2P" && sectionRow[j].PayPersonId === toAccountNumber)) {
                  scope.view.segToAccounts.selectedRowIndex = [i, j];
                  isToAccountAvailable = true;
                  scope.view.flxToTextBox.setEnabled(false);
                  break;
                }
              }
            }
          } else {
            for (let i = 0; i < segData.length; i++) {
              if ((transObj["transactionType"] === "ExternalTransfer" && segData[j].accountNumber === toAccountNumber) || (transObj["transactionType"] === "InternalTransfer" && segData[j].accountID === toAccountNumber) || (transObj["transactionType"] === "P2P" && sectionRow[j].PayPersonId === toAccountNumber)) {
                scope.view.segToAccounts.selectedRowIndex = [0, i];
                isToAccountAvailable = true;
                scope.view.flxToTextBox.setEnabled(false);
                break;
              }
            }
          }
          if (isToAccountAvailable) scope.onToAccountSelection();
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "prefillAccountFields",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * @api : resetComponentData
     * resets the component data just after it is trigerred
     * @return : NA
     */
    resetComponentData: function () {
      var scope = this;
      try {
        scope.view.segFromAccounts.removeAll();
        scope.view.segToAccounts.removeAll();
        scope.view.segFrequencyList.removeAll();
        scope.view.segTransferCurrencyList.removeAll();
        scope.view.segTransferDurationList.removeAll();
        scope.view.segDocumentList.removeAll();
        scope.documentCount = 0;
        scope.filesToBeUploaded = [];
        scope.uploadedAttachments = [];
        scope.base64Content = [];
        scope.attachments = [];
        scope.FromRecords = [];
        scope.groupedFromRecords = [];
        scope.ToRecords = [];
        scope.groupedToRecords = [];
        scope.FromSearchApplied = false;
        scope.ToSearchApplied = false;
        scope.isNewAccountNumberValid = true;
        scope.isSwiftValid = true;
        scope.serviceCurrency = "";
        scope.bankDateObj = {};
        scope.view.tbxFromAccount.text = "";
        scope.view.tbxToAccount.text = "";
        scope.view.tbxAmount.text = "";
        scope.view.tbxIntermediaryBic.text = "";
        scope.view.tbxE2EReference.text = "";
        scope.view.txtNotes.text = "";
        scope.view.lblNotesLength.text = "0/140";
        scope.view.lblFromRecordField1.text = "";
        scope.view.lblFromRecordField2.text = "";
        scope.view.lblToRecordField1.text = "";
        scope.view.lblToRecordField2.text = "";
        scope.view.lblSelectedCurrencySymbol.text = "";
        scope.view.tbxFromAccount.text = "";
        scope.view.tbxToAccount.text = "";
        scope.view.lblFromRecordField1.setVisibility(false);
        scope.view.lblFromRecordField2.setVisibility(false);
        scope.view.lblToRecordField1.setVisibility(false);
        scope.view.lblToRecordField2.setVisibility(false);
        scope.view.tbxFromAccount.setVisibility(true);
        scope.view.tbxToAccount.setVisibility(true);
        scope.view.flxToTextBox.setEnabled(true);
        scope.view.flxTransferDuration.setVisibility(false);
        scope.view.flxEndDate.setVisibility(false);
        scope.view.flxRecurrences.setVisibility(false);
        scope.view.flxDueDate.setVisibility(false);
        scope.view.flxDocumentList.setVisibility(false);
        scope.view.flxAttachDocumentError.setVisibility(false);
        scope.view.flxLookups.setVisibility(false);
        scope.view.flxPayeeAddress.setVisibility(false);
        scope.view.imgPayeeAddressDetailIcon.src = "minus_blue.png";
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "resetComponentData",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * @api : showOrHideAccountSection
     * toggle the account section rows visibility
     * @return : NA
     */
    showOrHideAccountSection: function (fieldType) {
      var scope = this;
      var sectionIndex = scope.view["seg" + fieldType + "Accounts"].selectedRowIndex[0];
      var segData = scope.view["seg" + fieldType + "Accounts"].data;
      var isRowVisible = true;
      if (segData[sectionIndex][0].lblDropdownIcon["text"] === "P") {
        segData[sectionIndex][0].lblDropdownIcon["text"] = "O";
        isRowVisible = false;
      } else {
        segData[sectionIndex][0].lblDropdownIcon["text"] = "P";
        isRowVisible = true;
      }
      var rowFlex = kony.application.getCurrentBreakpoint() === 640 ? "flxAccountsDropdownListMobile" : "flxAccountsDropdownList";
      scope.view["seg" + fieldType + "Accounts"].setSectionAt(segData[sectionIndex], sectionIndex);
      for (var i = 0; i < segData[sectionIndex][1].length; i++) {
        var rowDataTobeUpdated = segData[sectionIndex][1][i];
          rowDataTobeUpdated[rowFlex] = {
          "height": isRowVisible ? "60dp" : "0dp"
        };
        scope.view["seg" + fieldType + "Accounts"].setDataAt(rowDataTobeUpdated, i, sectionIndex);
      }
      scope.setAccountsDropdownHeight(fieldType);
    },
    /**
     * @api : showLookupPopup
     * displays lookup popup to fetch bic from bank details
     * @return : NA
     */
     showLookupPopup: function () {
      var scope = this;
      try {
        var form = kony.application.getCurrentForm();
        scope.view.segLookupRecords.contentOffset = { "x": "0%", "y": "0%" };
        scope.view.segLookupRecords.removeAll();
        this.businessController.storeInCollection({
          "txtBoxSearchField1": "",
          "txtBoxSearchField2": "",
          "txtBoxSearchField3": "",
          "txtBoxSearchField4": "",
      	});
        var popupObj = scope.view.flxLookups.clone();
        form.add(popupObj);
        popupObj.isVisible = true;
        popupObj.top = "0dp";
        popupObj.left = "0dp";
        popupObj.height = "100%";
        popupObj.flxLookupPopup.flxLookupTitle.flxLookupClose.onClick = () => {
          form.remove(popupObj);
        }
        popupObj.flxLookupPopup.flxSearchButton.btnSearch.onClick = () => {
          form.segLookupRecords.removeAll();
          scope.businessController.invokeCustomVerbforSearchSwiftCode();
        }
        scope.view.forceLayout();
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "showLookupPopup",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
      * @api : isEmptyNullOrUndefined
      * Verifies if the value is empty, null or undefined
      * data {any} - value to be verified
      * @return : {boolean} - validity of the value passed
      */
    isEmptyNullOrUndefined: function (data) {
      if (data === null || data === undefined || data === "") return true;
      if (typeof data === "object") {
        if (Array.isArray(data)) return data.length === 0;
        return Object.keys(data).length === 0;
      }
      return false;
    },
    /**
     * setTransferCurrencyFieldFromAccounts
     * @api : setTransferCurrencyFieldFromAccounts
     * sets transfer currency from accounts
     * @return : NA
     */
    setTransferCurrencyFieldFromAccounts: function (includeToAccounts) {
      var currencyList = {};
      var scope = this;
      var collectionObj = UnifiedTransferStore.getState();
      var transactionObj = collectionObj.Collection["Transaction"];
      var fromAccountCCY = scope.isEmptyNullOrUndefined(transactionObj["fromAccountCurrency"]) ? "" : transactionObj["fromAccountCurrency"];
      var toAccountCCY = scope.isEmptyNullOrUndefined(transactionObj["toAccountCurrency"]) ? "" : transactionObj["toAccountCurrency"];
      if (fromAccountCCY === "" && toAccountCCY === "") {
        return;
      }
      if (fromAccountCCY != toAccountCCY) {
        if (fromAccountCCY != "") {
          currencyList[fromAccountCCY] = fromAccountCCY;
        }
        if (toAccountCCY != "" && includeToAccounts) {
          currencyList[toAccountCCY] = toAccountCCY;
        }
        if ((!scope.isEmptyNullOrUndefined(scope.serviceCurrency)) && (fromAccountCCY != scope.serviceCurrency)) {
          currencyList[scope.serviceCurrency] = scope.serviceCurrency;
        }
      } else {
        if (fromAccountCCY != "") {
          currencyList[fromAccountCCY] = fromAccountCCY;
        }
      }
      scope.serviceCurrency = "";
      scope.setCurrencyDropdownValues(this.view.segTransferCurrencyList, currencyList);
    },
    /**
     * @api : setTransferCurrencyFieldFromAccounts
     * sets the accounts dropdown height based on number of records
     * @return : NA
     */
    setAccountsDropdownHeight: function (fieldType) {
      var scope = this;
      var segData = scope.view["seg" + fieldType + "Accounts"].data;
      var totalHeight = 0;
      var isGroupedData = !scope.isEmptyNullOrUndefined(scope.groupIdentifier);
      var rowFlex = kony.application.getCurrentBreakpoint() === 640 ? "flxAccountsDropdownListMobile" : "flxAccountsDropdownList";
      for (var i = 0; i < segData.length; i++) {
        totalHeight += isGroupedData ? 40 : 0;
        if (segData[i][1][0][rowFlex].height !== "0dp") {
          totalHeight += segData[i][1].length * 60;
        }
      }
      var breakPoint = kony.application.getCurrentBreakpoint();
      if (breakPoint === 640) {
        scope.view["flx" + fieldType + "AccountSegment"].height = totalHeight >= 572 ? "572dp" : totalHeight + "dp";
      } else if (breakPoint === 1024) {
        scope.view["flx" + fieldType + "AccountSegment"].height = totalHeight >= 520 ? "520dp" : totalHeight + "dp";
      } else {
        scope.view["flx" + fieldType + "AccountSegment"].height = totalHeight >= 546 ? "546dp" : totalHeight + "dp";
      }
    },
    /**
    * @api : resetSwiftCodeFields
    * reset the swift code & bank detail fields when new account number is entered
    * @return : NA
    */
    resetSwiftCodeFields: function() {
      var scope = this;
      if (scope.view.tbxPayeeDetail1.text !== "") {
        scope.view.tbxPayeeDetail1.text = "";
        scope.view.tbxPayeeDetail4.text = "";
        scope.resetTextBoxSkin(scope.view.tbxPayeeDetail1);
        scope.resetTextBoxSkin(scope.view.tbxPayeeDetail4);
        scope.view.tbxPayeeDetail4.setEnabled(true);
        scope.businessController.storeInCollection({
          "tbxPayeeDetail1": "",
          "tbxPayeeDetail4": "",
        });
      }
    }
  };
});
