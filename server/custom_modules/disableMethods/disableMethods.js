module.exports = Model => {
  Model.disableRemoteMethodByName('find');
  Model.disableRemoteMethodByName('findById');
  Model.disableRemoteMethodByName('findOne');
  Model.disableRemoteMethodByName("count", true);
  Model.disableRemoteMethodByName("exists", true);
  Model.disableRemoteMethodByName('create', true);			
  Model.disableRemoteMethodByName('upsert', true);				
  Model.disableRemoteMethodByName('deleteById', true);	
  Model.disableRemoteMethodByName("updateAll", true);	
  Model.disableRemoteMethodByName("updateAttributes", false);	
  Model.disableRemoteMethodByName('createChangeStream', true);	
  Model.disableRemoteMethodByName('upsertWithWhere', true);
  Model.disableRemoteMethodByName('replaceOrCreate', true);
  Model.disableRemoteMethodByName('replaceById', true);
  Model.disableRemoteMethodByName('prototype.patchAttributes', true);
}