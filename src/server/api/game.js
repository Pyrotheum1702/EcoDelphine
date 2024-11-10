const { CONFIG } = require('../../Config/config')
const { GLOBAL } = require('../../Global/globalVar')
const models = require('../db/models')
const leaderboard = require('../leaderboard/leaderboard')
const { getProfile } = require('./profile')

async function apiReportGameResult(req, res) {
   const requestBody = req.body
   const username = requestBody.username
   const score = requestBody.score
   const mapPieces = requestBody.mapPieces

   let profile = await getProfile(username)

   if (!profile) { return res.status(404).send({ message: "profile not found!" }) }

   const tokenAmount = Math.round(score * CONFIG.pointToTokenRatio)

   profile.score += score
   profile.token += tokenAmount
   await models.Profile.findOneAndUpdate({ username: username }, { $inc: { token: tokenAmount, score: score } })

   console.log('send', profile);

   res.status(200).send({
      profile: profile,
      result: {
         score: score,
         token: tokenAmount
      }
   })
}

async function apiGetLeaderBoard(req, res) {
   console.log('send', GLOBAL.top100LeaderBoard);
   res.status(200).send({ leaderboard: GLOBAL.top100LeaderBoard })
}

module.exports = {
   apiReportGameResult,
   apiGetLeaderBoard
}