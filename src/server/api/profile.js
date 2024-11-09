const { getRandomID } = require('../../Utils/Utils');
const models = require('../db/models')

async function getProfile(username) {
   let profile = await models.Profile.findOne({ username: username })
   return profile
}

async function createProfile(username) {
   const uuid = getRandomID(12)
   let profile = await models.Profile.create(({
      uuid: uuid,
      username: username
   }))
   return profile;
}


module.exports = {
   getProfile,
   createProfile,
}