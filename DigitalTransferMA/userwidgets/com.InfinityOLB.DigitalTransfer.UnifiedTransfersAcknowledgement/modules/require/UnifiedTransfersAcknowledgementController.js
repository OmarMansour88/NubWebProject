define(['FormControllerUtility','./UnifiedTransfersAckBusinessController','./UnifiedTransfersAckStore', 'DataValidationFramework/DataValidationHandler'], function(FormControllerUtility, BusinessController, UnifiedTransfersAckStore, DataValidationHandler) {
	return {
		constructor: function(baseConfig, layoutConfig, pspConfig) {
			this._serviceParameters = {};
      this._dataFormatting = {};
      this._dataMapping = {};
      this.context = {};
      this.businessController = new BusinessController();
	    this.dataValidationHandler = new DataValidationHandler();
		},
		//Logic for getters/setters of custom properties
		initGettersSetters: function() {
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
    },
    /**
    * @api : preShow
    * Gets invoked initially before rendering of UI
    * @return : NA
    */
    preShow: function () {
      var scope = this;
      try {
        this.businessController.setProperties(this.serviceParameters, this.dataMapping, this.dataFormatting);
      } catch (err) {
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
    * Performs the actions required before rendering component
    * @return : NA
    */
    postShow: function () {
      var scope = this;
      try {
        this.setFlexHeight();
        this.setData();
        this.enableSavePayeeButton();
        this.bindUIToButtons();
        this.view.button3.onClick = this.actionHandler.bind(this, this.context, 3);
        this.view.button2.onClick = this.actionHandler.bind(this, this.context, 2);
        this.view.button1.onClick = this.actionHandler.bind(this, this.context, 1);
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "postShow",
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
        this.unsubscribe = UnifiedTransfersAckStore.subscribe(this.render.bind(this));
        this.store = UnifiedTransfersAckStore;
        this.businessController.store = this.store;
        this.collectionObj = UnifiedTransfersAckStore.getState();
        this.context = context;
        this.businessController.setContextDataInStore(context);
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "SetContext",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * @api : onBreakpointChange
     * Method invoked on chaning break points
     * @return : NA
     */
    onBreakpointChange: function () {
      var scope = this;
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxSection2']);
      try {
        this.setData();
        // this.populateButtonTexts();
        this.enableSavePayeeButton();
        this.bindUIToButtons();
        this.view.forceLayout();
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "onBreakpointChange",
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
    unsubscribeStore: function () {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    },
    /**
     * setData
     * @api : setData
     * sets data in UI based on contract configurations
     * @return : NA
     */
    setData: function () {
      this.setComponentUILabelText();
      this.setComponentUILabelValues();
      this.setBankNameDetails();
      this.showOrHideUIFlex();
      this.populateDocumentsName();
      this.populateChargesBreakdown();
      this.populateAddressDetails();
    },
    /**
    * @api : render
    * This method will be invoked when collection is updated to refresh UI
    * @return : NA
    */
    render: function() {
      this.collectionObj = UnifiedTransfersAckStore.getState();
    },
    setComponentUILabelText: function () {
      this.view.lblSection1Message.text = this.businessController.getDataBasedOnDataMapping("lblSection1Message");
      this.view.lblSection1Header.text = this.businessController.getDataBasedOnDataMapping("lblSection1Header");
      this.view.lblSection2Header.text = this.businessController.getDataBasedOnDataMapping("lblSection2Header");
      for (let i = 1; i <= 25; i++) {
        var widget = "lblField" + i + "Key";
        this.view[widget].text = this.businessController.getDataBasedOnDataMapping(widget) + ":";
      }
      this.view.lblChargesBreakdownKey.text = this.businessController.getDataBasedOnDataMapping("lblChargesBreakdownKey") + ":";
      this.view.lblSupportingDocuments.text = this.businessController.getDataBasedOnDataMapping("lblSupportingDocuments") + ":";
      this.view.imgSuccess.src = "success_green.png";
      this.view.lblReferenceNumber.text = this.businessController.getDataBasedOnDataMapping("lblReferenceNumber");
    },
    setComponentUILabelValues: function () {
      for (let i = 1; i <= 25; i++) {
        var widget = "lblField" + i + "Value";
        this.view[widget].text = this.businessController.getDataBasedOnDataMapping(widget);
      }
      this.payeeTypeContext = this.businessController.getDataBasedOnDataMapping("payeeTypeContext");
      if (this.payeeTypeContext === "New Payee") { 
        this.view.lblField2Value.text = this.context.Recipients.payeeName;
        this.view.lblField10Value.text = this.context.Recipients.accountNumber;
      }
      this.view.lblReferenceNumberValue.text = this.businessController.getDataBasedOnDataMapping("lblReferenceNumberValue");
      this.view.lblSection1Message.text = this.businessController.getDataBasedOnDataMapping("lblSection1Message");
    },
    showOrHideUIFlex: function () {
      var scope = this;
      try {
        for (var j = 1; j <= 25; j++) {
          fieldValue = "lblField" + j + "Value";
          if (!scope.isEmptyNullOrUndefined(this.view[fieldValue].text)) {
            this.view["flxField" + j].isVisible = true;
          } else
            this.view["flxField" + j].isVisible = false;
        }
        if (!scope.isEmptyNullOrUndefined(this.view.lblField7Value.text)) {
          if (this.view.lblField6Value.text === "Once") {
            this.view.flxField7.isVisible = true;
            this.view.flxField8.isVisible = false;
          } else {
            this.view.flxField7.isVisible = false;
            this.view.flxField8.isVisible = true;
          }
        }
        if (scope.isEmptyNullOrUndefined(scope.view.lblReferenceNumberValue.text)) {
          scope.view.flxReferenceNumber.setVisibility(false);
        } else {
          scope.view.flxReferenceNumber.setVisibility(true);
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "showOrHideUIFlex",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
    * @api : bindUIToButtons
    * Helper method bind skin and text to the UI widgets
    * @return : NA
    */
    bindUIToButtons: function () {
      var scope = this;
      try {
        for (let i = 1; i <= 4; i++) {
          let widgetId = "button" + i;
          let text = this.businessController.getDataBasedOnDataMapping(widgetId);
          if (!this.isEmptyNullOrUndefined(text)) {
            scope.view[widgetId].text = text;
            scope.view[widgetId].toolTip = text;
          } else {
            scope.view[widgetId].setVisibility(false);
          }
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "bindUIToButtons",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * setFlexHeight
     * @api : setFlexHeight
     * event called to get and set the height of flexes dynamically
     * @return : NA
     */
    setFlexHeight: function () {
      var scope = this;
      var breakPointValue = kony.application.getCurrentBreakpoint();
      if (breakPointValue <= 1024) {
        this.view.flxSection2.doLayout = null;
        scope.view.flxSection1.height = undefined;
        this.view.flxMiddleContent.forceLayout();
      } else if (breakPointValue > 1024) {
		this.view.flxSection1.height = this.view.flxSection2.info.frame.height+"dp";
      }
    },
   /**
     * enableSavePayeeButton
     * @api : enableSavePayeeButton
     * enables Save this Payee button based on the type of payee 
     * @return : NA
     */
    enableSavePayeeButton: function () {
      this.payeeTypeContext = this.businessController.getDataBasedOnDataMapping("payeeTypeContext");
      if (this.payeeTypeContext === "New Payee") {       //how to get payee type context
        var parsedValue2 = this.businessController.getDataBasedOnDataMapping("button2");
        if (parsedValue2) {
          this.view.button2.setVisibility(true);
        } else {
          this.view.button2.setVisibility(false);
        }
      } else {
        this.view.button2.setVisibility(false);
        var breakPointValue = kony.application.getCurrentBreakpoint();
        if (breakPointValue <= 640) {
          this.view.button3.top = "80dp";
        } else {
          this.view.button3.top = "30dp";
        }
      }
    },
    actionHandler: function (context, buttonNumber) {
      var functionToCall = "button" + buttonNumber + "Click";
      this[functionToCall](context);
    },
    /**
     * @api : populateDocumentsName
     * To set the visibility of the flex for supporting documents  based on the input documents
     * @return : NA
     */
    populateDocumentsName: function () {
      var containDocument = false;
      var documentList = this.businessController.getDataBasedOnDataMapping("attachedFileList");
      // set all files to visibility false.
      for (var val = 1; val <= 5; val++) {
        this.view["flxDoc" + val].isVisible = false;
      }
      if (documentList) {
        for (var i = 0; i < documentList.length; i++) {
          var j = i + 1;
          this.view["lblDoc" + j].text = documentList[i][0];
          this.view["imgDoc" + j].src = documentList[i][1];
          containDocument = true;
          this.view["lblDoc" + j].isVisible = true;
          this.view["imgDoc" + j].isVisible = true;
          this.view["flxDoc" + j].isVisible = true;
        }
        this.view.flxSupportingDocuments.setVisibility(true);
      }
      if (containDocument === false) {
        this.view.flxSupportingDocuments.setVisibility(false);
      }
    },
    /**
      * @api : populateChargesBreakdown
      * To set the visibility of the flex for charges breakdown based on the input charges
      * @return : NA
      */
    populateChargesBreakdown: function () {
      var scope = this;
      try {
        this.view.flxChargesBreakdown.setVisibility(true);
        // this.view.lblChargesBreakdown.text = this.getLabelText(this._chargesLabel);
        var chargeJSON = this.businessController.getDataBasedOnDataMapping("lblChargesBreakdownValue");
        var chargeList = {};
        if (chargeJSON) {
          chargeList = chargeJSON.text;
          if (chargeList) {
            chargeList = chargeList.split(",");
            for (var i = 0, j = 1; j <= chargeList.length / 2; i += 2, j++) {
              var chargeLabel = chargeList[i];
              var chargeValue = chargeList[i + 1];
              if (chargeValue) {
                this.view["lblCharge" + j].text = chargeLabel;
                this.view["lblChargeValue" + j].text = chargeValue;
                this.view["flxCharge" + j].isVisible = true;
              }
              else
                this.view["flxCharge" + j].isVisible = false;
            }
          } else
            this.view.flxChargesBreakdown.isVisible = false;
        } else
          this.view.flxChargesBreakdown.setVisibility(false);
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "populateChargesBreakdown",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * populateAddressDetails
     * @api : populateAddressDetails
     * populates address details based on contracts
     * @return : NA
     */
    populateAddressDetails: function () {
      var scope = this;
      var address = "";
      var phoneNumber = this.businessController.getDataBasedOnDataMapping("lblField20Value");
      var emailId = this.businessController.getDataBasedOnDataMapping("lblField21Value");
      var addressLine1 = this.businessController.getDataBasedOnDataMapping("addressLine1");
      var addressLine2 = this.businessController.getDataBasedOnDataMapping("addressLine2");
      var city = this.businessController.getDataBasedOnDataMapping("city");
      var state = this.businessController.getDataBasedOnDataMapping("state");
      var country = this.businessController.getDataBasedOnDataMapping("country");
      var zipCode = this.businessController.getDataBasedOnDataMapping("zipCode");
      address = [addressLine1, addressLine2, city, state, country, zipCode].join(",");
      address = address.replace(/^,+|,+$/g, '').replace(/,+/g, ', ');
      if (address === "") {
        this.view.flxField22.setVisibility(false);
      } else {
        this.view.lblField22Value.text = address;
        this.view.flxField22.setVisibility(true);
      }
      if (phoneNumber) {
        this.view.lblField20Value.text = phoneNumber;
        this.view.flxField20.setVisibility(true);
      } else {
        this.view.flxField20.setVisibility(false);
      }
      if (emailId) {
        this.view.lblField21Value.text = emailId;
        this.view.flxField21.setVisibility(true);
      } else {
        this.view.flxField21.setVisibility(false);
      }
      var transferTypeContext = this.businessController.getDataBasedOnDataMapping("transactionType");
      if (transferTypeContext !== "P2P") {
        if (scope.isEmptyNullOrUndefined(address) && scope.isEmptyNullOrUndefined(phoneNumber) && scope.isEmptyNullOrUndefined(emailId))
          this.view.flxAddressHeader.setVisibility(false);
      } else {
        this.view.flxAddressHeader.setVisibility(false);
      }
    },
    /**
     * @api : setBankNameDetails
     * Method to hide/Show bank name details if available
     * @return : NA
     */
    setBankNameDetails: function () {
      var transferTypeContext = this.businessController.getDataBasedOnDataMapping("transactionType");
      if (transferTypeContext === "Domestic Transfer" || transferTypeContext === "International Transfer") {
        this.view.flxField23.isVisible = true;
      } else this.view.flxField23.isVisible = false;
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
	};
});