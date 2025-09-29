/**
  *@module CBPManager
  */

define([], function() {
  /**
 	 *CBPManager class is used to handle all functions related to scanning of QR Code for cashless transfers.
 	 *@alias module:CBPManager
 	  *@class
  */
  function CBPManager(){};

  inheritsFrom(CBPManager, kony.mvc.Business.Delegator);

  CBPManager.prototype.initializeBusinessController = function(){};


  
  
  return CBPManager;
});