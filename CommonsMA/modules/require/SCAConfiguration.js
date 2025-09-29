define([], function () {
    return {

        requestBody: {
            "Meta": {
                "EventType": "urn:com:temenos:security:event:payment:v1",
                "RiskScore": {
                    "Required": "10",
                    "Current": "1"
                },
                "TransactionId": "346436436246"
            },
            // "urn:com:temenos:security:event:payment:v1": {
            //     "Name": "Pay Acme",
            //     "ConsentId": "346436436246",
            //     "Initiation": {
            //         "InstructionIdentification": "ACME412",
            //         "EndToEndIdentification": "FRESCO.21302.GFX.20",
            //         "InstructedAmount": {
            //             "Amount": "10065.88",
            //             "Currency": "GBP"
            //         },
            //         "CreditorAccount": {
            //             "SchemeName": "UK.OBIE.SortCodeAccountNumber",
            //             "Identification": "08080021325698",
            //             "Name": "ACME Inc",
            //             "SecondaryIdentification": "0002"
            //         },
            //         "RemittanceInformation": {
            //             "Reference": "FRESCO-101",
            //             "Unstructured": "Internal ops code 5120101"
            //         }
            //     }
            // }
        },

        getRequestParams: function () {
            let self = this;
            return self.requestBody;
        },

        setEventDetails: function (flowType, data) {
            let self = this;
            let eventType = "";
            switch (flowType) {
                case ("WIRE_TRANSFERS"):
                    break;
                case ("ONE_TIME_WIRE_TRANSFERS"):
                    break;
                case ("SINGLE_BILL_PAY"):
                    break;
                case ("BULK_BILL_PAY"):
                    eventType = "urn:com:temenos:security:event:bulkpayment:v1";
                    self.requestBody[eventType] = self.setPaymentDetails(data);
                    break;
                case ("PAY_A_PERSON"):
                    eventType = "urn:com:temenos:security:event:payment:v1";
                    self.requestBody[eventType] = self.setPaymentDetails(data);
                    break;
                case ("TRANSFERS_EURO"):
                    break;
                case ("TRANSFERS_UPDATE"):
                    break;
                case ("TRANSFERS"):
                    break;
                case ("CREATE_BULKWIRE_TRANSFER_TEMPLATE"):
                    break;
                case ("CREATE_BULKWIRE_TRANSFER"):
                    break;
                case ("LOCK_CARD"):
                    eventType = "urn:com:temenos:security:event:cards:v1";
                    self.requestBody[eventType] = self.setCardDetails(data);
                    break;
                case ("UNLOCK_CARD"):
                    break;
                case ("CHANGE_PIN"):
                    break;
                case ("REPORT_LOST"):
                    break;
                case ("CANCEL_CARD"):
                    break;
                case ("REPLACE_CARD"):
                    break;
                case ("UPDATE_USERNAME"):
                    break;
                case ("UPDATE_PASSWORD"):
                    break;
                case ("SECURITYQUESTION_RESET"):
                    break;
                case ("PSD2_TPP_CONSENT_REVOKED"):
                    break;
                default:
                    break;
            };
            self.requestBody.Meta.EventType = eventType;
            self.requestBody.Meta.RiskScore.Required = "";
            self.requestBody.Meta.RiskScore.Current = "";
            // self.requestBody.Meta.TransactionId = data.MFAAttributes.serviceKey;
        },

        setPaymentDetails: function (data) {
            return {
                "Name": "Pay Acme",
                "ConsentId": "346436436246",
                "Initiation": {
                    "InstructionIdentification": "ACME412",
                    "EndToEndIdentification": "FRESCO.21302.GFX.20",
                    "InstructedAmount": {
                        "Amount": "10065.88",
                        "Currency": "GBP"
                    },
                    "CreditorAccount": {
                        "SchemeName": "UK.OBIE.SortCodeAccountNumber",
                        "Identification": "08080021325698",
                        "Name": "ACME Inc",
                        "SecondaryIdentification": "0002"
                    },
                    "RemittanceInformation": {
                        "Reference": "FRESCO-101",
                        "Unstructured": "Internal ops code 5120101"
                    }
                }
            };
        },

        setCardDetails: function(data){
            return {

            };
        }
    };
});