const { GLOBAL } = require('../../Global/globalVar');
const models = require('../db/models');
const { getProfile } = require('../api/profile');

let updateSchedule = null
const updateScheduleTime = 1000 * 60 * 0.25

function startLeaderBoardUpdateSchedule() {
   console.log('startLeaderBoardUpdateSchedule.');

   updateLeaderBoard()
   if (updateSchedule) clearInterval(updateSchedule)
   updateSchedule = setInterval(() => { updateLeaderBoard() }, updateScheduleTime);
}

async function updateLeaderBoard() {
   try {
      const scores = await models.Profile.aggregate([{ $sort: { point: -1 } }]).limit(50).exec();
      let entireLeaderBoard = {};
      let top100LeaderBoard = [];

      for (let [index, score] of scores.entries()) {
         let key = score.username;
         let profile = await getProfile(key);

         entireLeaderBoard[key] = {
            name: profile.username,
            score: profile.score,
            rank: index + 1
         };

         if (index < 100) { top100LeaderBoard.push(entireLeaderBoard[key]); }
      }

      GLOBAL.entireLeaderBoard = entireLeaderBoard
      GLOBAL.top100LeaderBoard = top100LeaderBoard
      // console.log('GLOBAL.top100LeaderBoard\n', GLOBAL.top100LeaderBoard);

   } catch (err) { console.error('updateLeaderBoard error:', err); throw err; }
}

function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

module.exports = {
   startLeaderBoardUpdateSchedule: startLeaderBoardUpdateSchedule
}