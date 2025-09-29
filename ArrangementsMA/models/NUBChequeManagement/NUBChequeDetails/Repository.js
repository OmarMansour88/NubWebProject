define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function NUBChequeDetailsRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	NUBChequeDetailsRepository.prototype = Object.create(BaseRepository.prototype);
	NUBChequeDetailsRepository.prototype.constructor = NUBChequeDetailsRepository;

	//For Operation 'NUBgetDetails' with service id 'NUBgetChequeSupplements4753'
	NUBChequeDetailsRepository.prototype.NUBgetDetails = function(params, onCompletion){
		return NUBChequeDetailsRepository.prototype.customVerb('NUBgetDetails', params, onCompletion);
	};

	return NUBChequeDetailsRepository;
})