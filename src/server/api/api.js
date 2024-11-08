const { CONFIG, SPIN_CONFIG, RESPONSE_STATUS, TABLE_CONFIG, DAILY_CHECKIN } = require("../../Config/config");
const { getProfile, saveProfile, updateJoinTelegramReward, apiGetBalance } = require("./profile");
const { updateSpin, getSpin, createSpin, getSpinProfile } = require("./spin");
const { getObjectives, getObjectiveStatus } = require('./objective');
const { getDailyWinners, getTopWinners } = require('./social');
const { getLevels, getSelfLevel, getGlobalRank, checkTableAccess } = require('./level');
const { GLOBAL } = require('../../Global/globalVar');
const models = require('../db/models');
const { validateTelegramInitDataAndReturnUser, getValueFromInitData, parseQueryString } = require('../telegram/telegramValidation');
const { login } = require('./login');
const { getReferralList } = require('./referral');
const { apiGetDailyRiver, apiSubmitDailyRiverCards, apiUpdateDailyRiverNotificationOption } = require('./dailyRiver');
const { getTask, doTask, claimMissionComplete } = require("./task");
const { apiUpdateDailyCheckInrNotificationOption } = require("./dailyCheckin");
var ton_core = require('@ton/core');
const { apiGetShop, apiBuyItemWithStar: apiBuyItemWithTStar, apiBuySkipRank } = require("../shop/shop");

const API_OPERATION = {
   LOGIN: 1,
}

exports.onCallAPI = async function onCallAPI(req, res) {
   try {
      const body = req.body

      switch (req.body.operation) {
         case API_OPERATION.LOGIN: apiLogin(body, res); break;
      }
   } catch (error) { console.log('onCallAPI', error); }
}