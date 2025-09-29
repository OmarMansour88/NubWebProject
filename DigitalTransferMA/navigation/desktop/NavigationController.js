define({
  //Add your navigation controller code here.


  handlefrmAcknowledgementNavigation:function(data){
    if (data !== null) {
      if (data.button1click === true) {
        return {
          "friendlyName": "frmUTFLanding",
          "appName": "UnifiedTransferMA"
        };
      } else if (data.button2click === true) {
        return {
          "friendlyName": "frmUTFLanding",
          "appName" : "UnifiedTransferMA"
        };
      }
    }
    return null;
  },

  handlefrmActivateP2PNavigation:function(data){
    if (data !== null) {
      if (data.buttonCancelclick === true) {
        return {
          "friendlyName": "frmUTFLanding",
          "appName": "UnifiedTransferMA"
        };
      } else if (data.setAckFlow === "Activation") {
        return {
          "friendlyName": "frmAcknowledgement",
          "appName" : "DigitalTransferMA"
        };
      }
      else if (data.setAckFlow === "Deactivation") {
        return {
          "friendlyName": "frmDeactivateAcknowledgement",
          "appName" : "DigitalTransferMA"
        };
      }
      else if (data.setAckFlowFailure === true) {
        return {
          "friendlyName": "frmUTFLanding",
          "appName" : "UnifiedTransferMA"
        };
      }
    }
    return null;
  },

  handlefrmDeactivateAcknowledgementNavigation:function(data){
    if (data !== null) {
      if (data.button1click === true) {
        return {
          "friendlyName": "frmUTFLanding",
          "appName": "UnifiedTransferMA"
        };
      } 
    }
    return null;
  },

  handlefrmUTFP2PTransferNavigation:function(data){
    if (data !== null) {
      if (data.onCancelClick === true) {
        return {
          "friendlyName": "frmUTFLanding",
          "appName": "UnifiedTransferMA"
        };
      } else if (data.transferType === "Same Bank") {
        return {
          "friendlyName": "frmUTFSameBankTransfer",
          "appName" : "UnifiedTransferMA"
        };
      }
      else if (data.transferType === "Domestic Transfer") {
        return {
          "friendlyName": "frmUTFDomesticTransfer",
          "appName" : "UnifiedTransferMA"
        };
      }
      else if (data.transferType === "International Transfer") {
        return {
          "friendlyName": "frmUTFInternationalTransfer",
          "appName" : "UnifiedTransferMA"
        };
      }
      else if (data.transferType === "Pay a Person") {
        return {
          "friendlyName": "frmUTFP2PTransfer",
          "appName" : "DigitalTransferMA"
        };
      }
      else if(data.createTransfer === true){
         return {
          "friendlyName": "frmUTFP2PTransferConfirmation",
          "appName": "DigitalTransferMA"
        };
      }
      
    }
    return null;
  },

  handlefrmUTFP2PTransferAcknowledgementNavigation:function(data){
    if (data !== null) {
      if (data.button1click === true) {
        return {
          "friendlyName": "frmUTFLanding",
          "appName": "UnifiedTransferMA"
        };
      } else if (data.button2click === true) {
        return {
          "friendlyName": "frmSavePayeeforOTT",
          "appName" : "UnifiedTransferMA"
        };
      }
    }
    return null;
  },

  handlefrmUTFP2PTransferConfirmationNavigation:function(data){
    if (data !== null) {
      if (data.MFAType === "SECURE_ACCESS_CODE") {
        return {
          "friendlyName": "frmUTFEmailOrSMS",
          "appName": "UnifiedTransferMA"
        };
      } else if (data.MFAType === "SECURITY_QUESTIONS") {
        return {
          "friendlyName": "frmUTFSecurityQuestions",
          "appName" : "UnifiedTransferMA"
        };
      }
      else if (data.buttonModifyClick === true) {
        return {
          "friendlyName": "frmUTFP2PTransfer",
          "appName" : "DigitalTransferMA"
        };
      }
      else if (data.buttonCancelClick === true) {
        return {
          "friendlyName": "frmUTFLanding",
          "appName" : "UnifiedTransferMA"
        };
      }
      else if (data.buttonConfirmClick === true) {
        return {
          "friendlyName": "frmUTFP2PTransferAcknowledgement",
          "appName" : "DigitalTransferMA"
        };
      }
    }
    return null;
  },

  handlefrmPayaPersonAddBeneAcknowledgementNavigation:function(data){
    if (data !== null) {
      if (data.newTransfer === true) {
        return {
          "friendlyName": "frmUTFLanding",
          "appName": "UnifiedTransferMA"
        };
      } 
    }
    return null;
  },

  handlefrmPayaPersonAddBeneficiaryNavigation:function(data){
    if (data !== null) {
      if (data.samebankTransfer === true) {
        return {
          "friendlyName": "frmSameBankAddBeneficiary",
          "appName": "UnifiedTransferMA"
        };
      } else if (data.domesticTransfer === true) {
        return {
          "friendlyName": "frmDomesticAddBeneficiary",
          "appName" : "UnifiedTransferMA"
        };
      }
        else if (data.internationalTransfer === true) {
        return {
          "friendlyName": "frmInternationalAddBeneficiary",
          "appName" : "UnifiedTransferMA"
        };
        }
        else if (data.p2pTransfer === true) {
        return {
          "friendlyName": "frmPayaPersonAddBeneficiary",
          "appName" : "DigitalTransferMA"
        };
        
      }
      else if (data.continueAddBen === false) {
        return {
          "friendlyName": "frmLinkPayee",
          "appName" : "UnifiedTransferMA"
        };
        
      }
      else if (data.continueAddBen !== false) {
        return {
          "friendlyName": "frmPayaPersonAddBeneficiaryConfirm",
          "appName" : "DigitalTransferMA"
        };
        
      }
     else if (data.buttonConfirmCancel === true){
        return {
          "friendlyName": "frmUTFLanding",
          "appName" : "UnifiedTransferMA"
        };
     }
    }
    return null;
  },

  handlefrmPayaPersonAddBeneficiaryConfirmNavigation:function(data){
    if (data !== null) {
      if (data.preshowCall === true) {
        return {
          "friendlyName": "frmUTFLanding",
          "appName": "UnifiedTransferMA"
        };
      } else if (data.navToack === true) {
        return {
          "friendlyName": "frmPayaPersonAddBeneAcknowledgement",
          "appName" : "DigitalTransferMA"
        };
      }
      else if (data.modifyTransfer === true) {
        return {
          "friendlyName": "frmPayaPersonAddBeneficiary",
          "appName" : "DigitalTransferMA"
        };
      }
      else if (data.confirmTransferSuccess === true) {
        return {
          "friendlyName": "frmPayaPersonAddBeneAcknowledgement",
          "appName" : "DigitalTransferMA"
        };
      }
       else if (data.confirmTransferError === true) {
        return {
          "friendlyName": "frmPayaPersonAddBeneficiary",
          "appName" : "DigitalTransferMA"
        };
      }

    }
    return null;
  },

});