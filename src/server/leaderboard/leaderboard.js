const { GLOBAL } = require('../../Global/globalVar');
const models = require('../db/models');
const { getProfile } = require('../api/profile');

let updateSchedule = null
const updateScheduleTime = 1000 * 60 * 10

function startLeaderBoardUpdateSchedule() {
   console.log('startLeaderBoardUpdateSchedule.');

   updateLeaderBoard()
   if (updateSchedule) clearInterval(updateSchedule)
   updateSchedule = setInterval(() => {
      updateLeaderBoard()
   }, updateScheduleTime);
}

async function updateLeaderBoard() {
   try {
      const scores = await models.WeeklyScore.aggregate([{ $sort: { point: -1 } }]).exec();
      let entireLeaderBoard = {};
      let top100LeaderBoard = [];

      for (let [index, score] of scores.entries()) {
         await delay(5);

         let key = score.uuid;
         let profile = await getProfile(key, false);

         entireLeaderBoard[key] = {
            name: profile.firstName + ' ' + profile.lastName,
            userName: profile.userName,
            avatarUrl: profile.avatarUrl,
            score: score.point,
            rank: index + 1
         };

         if (index < 100) { top100LeaderBoard.push(entireLeaderBoard[key]); }
      }

      GLOBAL.entireLeaderBoard = entireLeaderBoard
      GLOBAL.top100LeaderBoard = top100LeaderBoard
   } catch (err) { console.error('updateLeaderBoard error:', err); throw err; }
}

function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

module.exports = {
   startLeaderBoardUpdateSchedule: startLeaderBoardUpdateSchedule
}