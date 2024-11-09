const { getProfile, createProfile } = require('./profile')

async function apiLogin(req, res) {
   const requestBody = req.body
   const username = requestBody.username

   let profile = await getProfile(username)

   if (profile == null) profile = await createProfile(username)

   return res.status(200).send({ profile: profile })
}

module.exports = {
   apiLogin
}