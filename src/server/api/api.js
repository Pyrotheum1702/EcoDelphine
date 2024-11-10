const { apiReportGameResult, apiGetLeaderBoard } = require("./game");
const { apiLogin } = require("./login");

const API_OPERATION = {
   LOGIN: 1,
   REPORT_GAME_RESULT: 2,
   GET_LEADER_BOARD: 3,
}

async function handleCallAPI(req, res) {
   try {
      const body = req.body

      switch (body.operation) {
         case API_OPERATION.LOGIN: apiLogin(req, res); break;
         case API_OPERATION.REPORT_GAME_RESULT: apiReportGameResult(req, res); break;
         case API_OPERATION.GET_LEADER_BOARD: apiGetLeaderBoard(req, res); break;
      }
   } catch (error) { console.log('onCallAPI', error); }
}

module.exports = {
   handleCallAPI
}