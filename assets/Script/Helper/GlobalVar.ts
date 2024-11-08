import { Player } from "../Config/Config"
export class GlobalVar {
   public static readonly PRODUCER = "Pyro"
   public static readonly GAME_NAME = "CoinTap"
   public static currentRoom
   public static currentRoomType

   // TEMPORARY
   public static telegramFullName = ''
   public static telegramFirstName = ''
   public static telegramLastName = ''
   public static telegramUserName = ''
   public static telegramAvatarUrl = ''
   public static telegramId = ''
   public static rawInitData = null
   public static cachedCheckInResponse: any = {}

   //
   public static profile = {
      ELO: 0,
      uuid: '',
      firstName: '',
      lastName: '',
      fullName: '',
      userName: '',
      nickName: '',
      avatarUrl: '',
      coin: 0,
      point: 0,
      spinInfo: {
         spinTotal: 0,
         spinDid: 0,
         lastSpinTimeStamp: 0,
         defaultCount: 0,
         remainCount: 0,
         isReachedMax: false,
         nextTimeStamp: 0,
         lastReceiveSpinDate: 0,
         lastSpinDay: 0,
         lastSpinDate: 0,
         freeSpinReceived: 0,
      },
      ranking: 0
   }
   public static dailyRiverProfile = {
      uuid: "",
      tryLeft: 0,
      lastLoginDay: 0,
      triedToday: false,
      successToday: false,
      rewardMultiplier: 1,
      receiveNotification: false,
   }
   public static checkinProfile = {
      currentStreak: 0,
      lastCheckInDay: 0,
      receiveNotification: false,
   }
   // 
   public static tablesConfig = []
   public static tableSelected = {
      buyIn: 0,
      speed: 0,
      tableName: '',
      bigBlind: 0
   }

   public static player: Player
   public static isOnAdrenaline = false
   public static rewardCoin = 0
   public static friendInvitedCount = 0
   public static hadFriend = false
   public static joinedYoutubeChannel = false

   public static readonly coinPerTapGetPerUpgrade = 1
   public static readonly energyBankLimitGetPerUpgrade = 500
   public static readonly energyRegenerationPerCycleGetPerUpgrade = 1
   // public static readonly energyBankLimitGetPerUpgrade = 500
   public static readonly coinPerTapBaseCost = 500
   public static readonly energyLimitBaseCost = 500
   public static readonly energyRechargeBaseCost = 5000
   public static readonly tapBotBaseCost = 200000

   public static currentPopup: cc.Node = null
}

