define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function DITransactionsListRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	DITransactionsListRepository.prototype = Object.create(BaseRepository.prototype);
	DITransactionsListRepository.prototype.constructor = DITransactionsListRepository;

	//For Operation 'DIgetRecent' with service id 'getAccountPendingAndPostedTransactions7824'
	DITransactionsListRepository.prototype.DIgetRecent = function(params, onCompletion){
		return DITransactionsListRepository.prototype.customVerb('DIgetRecent', params, onCompletion);
	};

	return DITransactionsListRepository;
})