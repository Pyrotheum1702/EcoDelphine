import { CONFIG } from "../Config/Config";
import { SERVER_CONNECT_TYPE, SERVER_URL, networkOptions } from "../Server/NetworkConfig";
import { GlobalVar } from "./GlobalVar";

const { ccclass, property } = cc._decorator;
//@ts-ignore
const zlib = require('zlib');

export default class Utils extends cc.Component {
   public static BACKGROUND_WHITE_COLOR: string = 'ebfaff';

   public static worldSpaceToLocal(worldSpace: cc.Vec2, local: cc.Node) {
      return local.convertToNodeSpaceAR(worldSpace)
   }
   public static getWorldPos(node: cc.Node): cc.Vec2 {
      return node.convertToWorldSpaceAR(cc.Vec2.ZERO_R)
   }
   public static setWorldPos(node: cc.Node, posWS: cc.Vec2) {
      node.setPosition(node.parent.convertToNodeSpaceAR(posWS));
   }

   public static getRandomRainbowColor(): cc.Color {
      var primaryColor = this.random(0, 2)
      var secondaryColor = this.random(0, 2)
      var colorAsArray = [0, 0, 0]
      colorAsArray[secondaryColor] = this.random(0, 255)
      colorAsArray[primaryColor] = 255

      return cc.color(colorAsArray[0], colorAsArray[1], colorAsArray[2])
   }

   public static getOneOrMinusOne() {
      return (this.random(0, 1) == 1) ? 1 : -1;
   }
   public static random(minInclusive: number, maxInclusive: number): number {
      const range = maxInclusive - minInclusive + 1;
      const randomValue = Math.floor(Math.random() * range) + minInclusive;
      return randomValue;
   }
   public static randomDecimal(minInclusive: number, maxInclusive: number): number {
      return Math.random() * (maxInclusive - minInclusive) + minInclusive;
   }

   public static getRandomBool100BaseChance(chance: number) {
      return this.random(0, 100) <= chance
   }

   public static getRandomItemInArray(arr: Array<any>) {
      return arr[this.random(0, arr.length - 1)]
   }

   public static booleanRandom(trueChance: number = 1, totalChance: number = 1): boolean {
      if (this.random(0, totalChance) <= trueChance) return true
      else return false
   }

   public static getLocal(itemName: string): any {
      return cc.sys.localStorage.getItem(itemName);
   }

   public static setLocal(itemName: string, value: any): void {
      return cc.sys.localStorage.setItem(itemName, value);
   }

   public static angleToVector2Normal(angle: number): cc.Vec2 {
      const x = Math.cos(angle * Math.PI / 180);
      const y = Math.sin(angle * Math.PI / 180);
      return cc.v2(x, y);
   }

   public static vector2NormalToAngle(vector2Normal: cc.Vec2): number {
      return cc.misc.radiansToDegrees(Math.atan2(vector2Normal.y, vector2Normal.x));
   }

   public static getMidPointOf2Vec2(vecA: cc.Vec2, vecB: cc.Vec2) {
      return cc.v2((vecA.x + vecB.x) / 2, (vecA.y + vecB.y) / 2)
   }
   public static initPhysic() {
      let physicManager = cc.director.getPhysicsManager();
      physicManager.enabled = true;
   }

   public static syncFixedTimeStep() {
      let physicManager = cc.director.getPhysicsManager();
      physicManager.enabledAccumulator = true;

      cc.PhysicsManager.FIXED_TIME_STEP = 1 / cc.game.getFrameRate();
      // cc.PhysicsManager.POSITION_ITERATIONS = cc.game.getFrameRate();
      // cc.PhysicsManager.MAX_ACCUMULATOR = 8;
   }

   public static slowMotionMode() {
      let physicManager = cc.director.getPhysicsManager();
      physicManager.enabledAccumulator = true;
      cc.PhysicsManager.FIXED_TIME_STEP = 1 / cc.game.getFrameRate() * 100;
   }

   public static shuffle(array) {
      let currentIndex = array.length, randomIndex;

      // While there remain elements to shuffle.
      while (currentIndex > 0) {
         // Pick a remaining element.
         randomIndex = Math.floor(Math.random() * currentIndex);
         currentIndex--;

         // And swap it with the current element.
         [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
      }

      return array;
   }

   public static threeDigitBased(number: number): string {
      if (number < 10) {
         return '00' + number
      } else if (number < 100) {
         return '0' + number
      } else return number.toString()
   }

   public static twoDigitBased(number: number): string {
      if (number < 10) return '0' + number
      else return number.toString()
   }
   public static randomPositionInsideCircle(centralPoint: cc.Vec2, radius: number): cc.Vec2 {// Generate random angles for x and y coordinates
      var randomAngle = Math.random() * 2 * Math.PI;

      // Calculate random position inside the circle
      var randomX = centralPoint.x + Math.cos(randomAngle) * (Math.random() * radius);
      var randomY = centralPoint.y + Math.sin(randomAngle) * (Math.random() * radius);

      // Return the random position as a cc.Vector2 object
      return new cc.Vec2(randomX, randomY);
   }
   public static randomString(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
         counter += 1;
      }
      return result;
   }

   public static zip(data, callback) {
      zlib.gzip(JSON.stringify(data), (error, datazip) => {
         if (error) {
            console.log('error: ', error);
         } else {
            callback(datazip.toString('base64'));
         }
      });
   }
   public static unzip(data, callback) {
      //@ts-ignore
      const buffer = Buffer.from(data, 'base64');
      zlib.gunzip(buffer, (error, dataUnzip) => {
         if (error) {
            console.log('error: ', error, dataUnzip);
         } else {
            callback(JSON.parse(dataUnzip));
         }
      });
   }
   public static removeElementFromArray(element, arr) {
      const index = arr.indexOf(element);
      if (index !== -1) {
         arr.splice(index, 1);
      }
   }
   public static convertPosToClientCoordinate(pos: cc.Vec3): cc.Vec2 {
      return cc.v2(pos.x - 2500, 2500 - pos.y)
   }
   public static convertPosToServerCoordinate(pos: cc.Vec3): cc.Vec2 {
      return cc.v2(pos.x + 2500, 2500 - pos.y)
   }
   public static tweenLb(label: cc.Label, startNumber: number, endNumber: number, duration: number = 1, easing = 'sineIn', onCompleteCallback?, appendFront = '', pushFront = '', formatFunc?, onValueChange?) {
      let dummyTween = new cc.Node()
      dummyTween.parent = cc.director.getScene()
      dummyTween.angle = startNumber
      let lbTween = cc.tween(dummyTween).to(duration, { angle: endNumber }, {
         easing: 'sineIn', onUpdate: () => {
            let string = appendFront + (Math.round(dummyTween.angle)).toString() + pushFront
            if (formatFunc) string = formatFunc(string)
            if (label) label.string = string
            if (onValueChange) onValueChange()
         }
      }).call(() => {
         dummyTween.destroy()
         if (onCompleteCallback) onCompleteCallback()
      }).start()

      return lbTween
   }
   public static collapseNode(node: cc.Node, duration: number = 0.25, callBack = null, destroyOnCollapsed = false) {
      if (!node) return
      let target = node
      let startScale = target.scale
      cc.tween(target).to(duration, { scale: 0, opacity: 0 }, { easing: 'backIn' }).call(() => { if (callBack) callBack() }).call(() => { node.active = false; node.scale = startScale }).call(() => { if (destroyOnCollapsed) target.destroy() }).start()
   }
   public static popupNode(node: cc.Node, duration: number = 0.25, callBack = null, up = true) {
      node.active = true
      let startScale = node.scale
      let startPos = cc.v3(node.position.x, node.position.y, 1)
      node.opacity = 0
      let blockInput = new cc.Node()
      blockInput.setContentSize(10000, 10000)
      blockInput.addComponent(cc.BlockInputEvents)
      blockInput.parent = node
      blockInput.setSiblingIndex(cc.macro.MAX_ZINDEX)

      node.scale = 0
      node.position = cc.v3(node.position.x, node.position.y - ((up) ? 50 : 0))
      cc.tween(node).to(duration, { scale: startScale, position: startPos, opacity: 255 }, { easing: 'backOut' }).call(() => { if (callBack) callBack(); blockInput.destroy() }).start()
   }

   public static parseToTime(time: number): string {
      let min = '' + Math.floor(time / 10)
      let second = '' + Math.floor((time % 60) / 10) + time % 10
      let s = '' + Math.floor(time / 60) + ":" + second
      return s
   }

   public static wrap(value: number, min: number, max: number): number {
      const range = max - min;
      return ((value - min) % range + range) % range + min;
   }

   public static loadImgFromUrl(_sprite: cc.Sprite = null, url: string = '', callback = null, errorCallback = null) {
      try {
         if (_sprite === undefined || _sprite === null || url === '') {
            if (errorCallback) errorCallback()
            return;
         }
         cc.assetManager.loadRemote<cc.Texture2D>(url, (err, tex: cc.Texture2D) => {
            if (err != null) {
               if (errorCallback) errorCallback()
               return;
            }
            if (_sprite === undefined || _sprite === null) {
               if (errorCallback) errorCallback()
               return;
            }
            try {
               _sprite.spriteFrame = new cc.SpriteFrame(tex);
               if (callback) callback()
               return
            } catch (e) {
               if (errorCallback) errorCallback()
               return
            }
         });
      } catch (e) {
         if (errorCallback) errorCallback()
         return
      }
   }

   public static loadImgFromUrlRounded(_sprite: cc.Sprite = null, url: string = '', callback = null, errorCallback = null) {
      try {
         if (!_sprite || !url || url === 'undefined') {
            if (errorCallback) errorCallback();
            return;
         }

         cc.assetManager.loadRemote<cc.Texture2D>(url, (err, tex: cc.Texture2D) => {
            if (err) {
               console.error('Error loading image:', err);
               if (errorCallback) errorCallback();
               return;
            }

            try {
               let canvas = document.createElement('canvas');
               let ctx = canvas.getContext('2d');
               const width = tex.width, height = tex.height, radius = height / 2;
               canvas.width = width;
               canvas.height = height;

               let imgElement = new Image();
               imgElement.crossOrigin = 'anonymous';  // Enable CORS for the image
               imgElement.src = tex.nativeUrl;

               imgElement.onload = () => {
                  ctx.drawImage(imgElement, 0, 0, width, height);
                  ctx.globalCompositeOperation = 'destination-in';
                  ctx.beginPath();
                  ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2, true);
                  ctx.fill();

                  let newTexture = new cc.Texture2D();
                  newTexture.initWithElement(canvas);
                  newTexture.handleLoadedTexture();

                  _sprite.spriteFrame = new cc.SpriteFrame(newTexture);

                  if (callback) callback();
               };

               imgElement.onerror = () => {
                  console.error('Failed to load the image from URL:', url);
                  if (errorCallback) errorCallback();
               };
            } catch (e) {
               console.error('Error during processing:', e);
               if (errorCallback) errorCallback();
            }
         });
      } catch (e) {
         console.error('Unexpected error:', e);
         if (errorCallback) errorCallback();
      }
   }

   static findClosestPoint(referencePoint: cc.Vec2, points: cc.Vec2[]): cc.Vec2 | null {
      if (points.length === 0) return null;

      let closestPoint: cc.Vec2 | null = null;
      let minDistance = Infinity;

      for (const point of points) {
         const dist = cc.Vec2.distance(point, referencePoint)
         if (dist < minDistance) {
            minDistance = dist;
            closestPoint = point;
         }
      }

      return closestPoint;
   }

   public static calculateMiddlePoint(points: cc.Vec2[]): cc.Vec2 {
      const length = points.length;
      let totalX = 0;
      let totalY = 0;

      for (const point of points) {
         totalX += point.x;
         totalY += point.y;
      }
      return cc.v2(totalX / length, totalY / length);
   }

   public static parseToBalanceString(value, removeUnnecessaryDigit = false): string {
      if (value < 0) return '???'
      if (value < 1e3) return value.toString()
      let s = ''

      if (value == Infinity) return '∞'

      if (value >= 1e3 && value < 1e6) {
         if (value == 1e3) return '1K'
         s = Math.floor(value / 1e3) + ((!removeUnnecessaryDigit) ? (',' + Math.floor(value % 1e3 / 1e2) + Math.floor(value % 1e2 / 1e1)) : '') + 'K'
      } else if (value >= 1e6 && value < 1e9) {
         if (value == 1e6) return '1M'
         s = Math.floor(value / 1e6) + ((!removeUnnecessaryDigit) ? (',' + Math.floor(value % 1e6 / 1e5) + Math.floor(value % 1e5 / 1e4)) : '') + 'M'
      } else if (value >= 1e9 && value < 1e12) {
         if (value == 1e9) return '1B'
         s = Math.floor(value / 1e9) + ((!removeUnnecessaryDigit) ? (',' + Math.floor(value % 1e9 / 1e8) + Math.floor(value % 1e8 / 1e7)) : '') + 'B'
      } else if (value >= 1e12 && value < 1e15) {
         if (value == 1e12) return '1T'
         s = Math.floor(value / 1e12) + ((!removeUnnecessaryDigit) ? (',' + Math.floor(value % 1e12 / 1e11) + Math.floor(value % 1e11 / 1e10)) : '') + 'T'
      }
      for (let i = 0; i < 3; i++) {
         if (s[s.length - 2] == '0' || s[s.length - 2] == ',') s = s.slice(0, s.length - 2) + s[s.length - 1]
      }
      return s
   }

   public static isNumberChar(char: string): boolean {
      const regex = /^\d+$/;
      return regex.test(char);
   }

   public static formatNumberWithCommas(number) {
      if (number == null) {
         console.log(number);
         return ""
      }
      let numberString = number
      if (!isNaN(number)) numberString = number.toString();
      const partition = ','
      let formattedString = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, partition);
      return formattedString;
   }

   public static formatNumberWithDots(number) {
      let numberString = number
      if (!isNaN(number)) numberString = number.toString();
      const partition = '.'
      let formattedString = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, partition);
      return formattedString;
   }

   public static async callAPI(param = null, onComplete = null, onError = null) {
      let method = "POST";
      let url = ""
      switch (networkOptions.globalConnectType) {
         case SERVER_CONNECT_TYPE.LOCAL: { url = SERVER_URL.LOCAL; break }
         case SERVER_CONNECT_TYPE.SERVER: { url = SERVER_URL.SERVER; break }
      }

      try {
         let xhr = new XMLHttpRequest();
         xhr.addEventListener("readystatechange", () => {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {
               let data = null
               if (xhr.responseText != null && xhr.responseText != '') try { data = JSON.parse(xhr.responseText) } catch (e) { console.log("Err :", e) }
               if (onComplete) onComplete(data)
            }
         });

         xhr.open(method, url, true);
         xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
         xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
         xhr.setRequestHeader("Data-Check-String", GlobalVar.rawInitData);
         xhr.timeout = 10000
         if (param != null) xhr.send(JSON.stringify(param));
         else xhr.send();
         xhr.onerror = () => { console.log("api call onerror: "); if (onError) onError() }
         xhr.ontimeout = () => { console.log("api call ontimeout: "); if (onError) onError() }
      } catch (e) { console.log("On callAPI error: ", e); if (onError) onError() }
   }

   public static shake(node: cc.Node, iter, intervalTime, originalPos, minDis = 5, maxDis = 10, onComplete = null) {
      if (iter > 0) {
         let randAngle = Math.random() * 360 - 180
         let dir = Utils.angleToVector2Normal(randAngle)

         let newPos = cc.v2(originalPos).add(dir.multiplyScalar(Math.random() * minDis + (maxDis - minDis)))
         cc.tween(node).to(intervalTime, { position: cc.v3(newPos) }).call(() => {
            this.shake(node, iter - 1, intervalTime, originalPos, minDis, maxDis, onComplete)
         }).start()
      } else {
         cc.tween(node).to(intervalTime, { position: originalPos }).call(() => { if (onComplete) onComplete() }).start()
      }
   }

   public static labelToSpriteFrame(lb: cc.Label) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const label = lb
      ctx.font = `${label.fontSize}px ${label.fontFamily}`;
      canvas.width = label.node.width;
      canvas.height = label.node.height

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = label.node.color.toCSS();

      ctx.fillText(label.string, 0, label.node.height);

      const dataUrl = canvas.toDataURL();

      const texture = new cc.Texture2D();
      texture.initWithElement(canvas);
      const spriteFrame = new cc.SpriteFrame();
      spriteFrame.setTexture(texture);

      return spriteFrame;
   }

   public static logRandom(min: number, max: number): number {
      const range = max - min + 1;
      const randomNumber = Math.random();
      const transformedRandom = Math.log(randomNumber + 1) / Math.log(2);
      return Math.floor(min + transformedRandom * range);
   }

   public static rotateVector2ByDegree(v, dreg) {
      let rad = cc.misc.degreesToRadians(dreg)
      return cc.v2(
         v.x * Math.cos(rad) - v.y * Math.sin(rad),
         v.x * Math.sin(rad) + v.y * Math.cos(rad))
   }
   public static parseRarityNameToIndex(name) {
      if (name == 'Common') return 0
      else if (name == 'Unique') return 1
      else if (name == 'Rare') return 2
      else if (name == 'Epic') return 3
      else if (name == 'Mythical') return 4
      else if (name == 'Legendary') return 5
      else return 0
   }
   public static captureNodeAsSpriteFrame(targetNode: cc.Node): cc.SpriteFrame {
      let renderTexture: cc.RenderTexture = new cc.RenderTexture();
      renderTexture.initWithSize(cc.visibleRect.width, cc.visibleRect.height);
      let cameraNode: cc.Node = new cc.Node();
      let camera: cc.Camera = cameraNode.addComponent(cc.Camera);
      camera.targetTexture = renderTexture;
      camera.render();
      let spriteFrame: cc.SpriteFrame = new cc.SpriteFrame(renderTexture);
      return spriteFrame;
   }
   public static findClosestPos(pos: cc.Vec2, positions): cc.Vec2 {
      let minDistSq = Number.MAX_VALUE;
      let closestPos: cc.Vec2;

      for (const p of positions) {
         const distSq = cc.v2(pos).sub(p.position).magSqr();
         if (distSq < minDistSq) {
            minDistSq = distSq;
            closestPos = p.position;
         }
      }

      return closestPos;
   }

   public static lerpUnclamped(start: cc.Vec2, end: cc.Vec2, t: number): cc.Vec2 { return cc.v2(start.x + (end.x - start.x) * t, start.y + (end.y - start.y) * t); }
   public static addBalanceSpacing(numberString) {
      numberString = numberString.toString();
      return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
   }

   public static removeSpacing(numberString) { return numberString.replace(/\s+/g, ''); }
   public static removeComma(numberString) { return numberString.replace(/,/g, ''); }

   public static fadeOutNode(node: cc.Node, duration: number = 0.25, callBack = null, destroyOnHidden = false) {
      if (!node) return
      let target = node
      cc.tween(target).to(duration, { opacity: 0 }, { easing: 'sineIn' }).call(() => { if (callBack) callBack() }).call(() => { node.active = false; }).call(() => { if (destroyOnHidden) target.destroy() }).start()
   }

   public static fadeInNode(node: cc.Node, duration: number = 0.25, callBack = null, blockInput = true) {
      node.active = true
      node.opacity = 0
      let blockInputNode
      if (blockInput) {
         blockInputNode = new cc.Node()
         blockInputNode.setContentSize(10000, 10000)
         blockInputNode.addComponent(cc.BlockInputEvents)
         blockInputNode.parent = node
         blockInputNode.setSiblingIndex(cc.macro.MAX_ZINDEX)
      }

      cc.tween(node).to(duration, { opacity: 255 }, { easing: 'sineOut' }).call(() => { if (callBack) callBack(); if (blockInputNode) blockInputNode.destroy() }).start()
   }

   public static randomRange(min: number, max: number, round: boolean = false) {
      const delta = max - min;
      const rnd = Math.random();
      let result = min + rnd * delta;

      if (round) { result = Math.round(result); }
      return result;
   }

   public static getMillisecondsUntilNextDayUTC(): number {
      const now = new Date();
      const nextDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
      return nextDay.getTime() - now.getTime();
   }

   public static getMillisecondsUntilNextHourUTC(): number {
      const now = new Date();
      const nextDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getHours() + 1));
      return nextDay.getTime() - now.getTime();
   }

   public static millisecondsToTime(ms) {
      const pad = n => n < 0 ? '00' : ((n < 10 ? '0' : '') + n);
      let seconds = Math.floor(ms / 1000), minutes = Math.floor(seconds / 60), hours = Math.floor(minutes / 60);
      return `${pad(hours)}:${pad(minutes % 60)}:${pad(seconds % 60)}`;
   }

   public static millisecondsToTimeNonHour(ms) {
      const pad = n => n < 0 ? '00' : ((n < 10 ? '0' : '') + n);
      let seconds = Math.floor(ms / 1000), minutes = Math.floor(seconds / 60);
      return `${pad(minutes % 60)}:${pad(seconds % 60)}`;
   }

   public static getEpochDay() {
      const millisecondsInADay = 24 * 60 * 60 * 1000;
      const epoch = new Date(Date.UTC(1970, 0, 1));
      const now = new Date();
      const differenceInMilliseconds = now.getTime() - epoch.getTime();
      const daysSinceEpoch = Math.floor(differenceInMilliseconds / millisecondsInADay);
      return daysSinceEpoch;
   }
}
