exports.getRandomItemsFromArray = function getRandomItemsFromArray(array, getCount) {
   try {
      if (getCount > array.length) return array;
      let returnArray = [];
      let usedIndices = new Set();
      while (returnArray.length < getCount) {
         const randomIndex = Math.floor(Math.random() * array.length);
         if (!usedIndices.has(randomIndex)) { returnArray.push(array[randomIndex]); usedIndices.add(randomIndex); }
      }
      return returnArray;
   } catch (error) { console.log('getRandomItemsFromArray', error); }
}

exports.arraysAreIdentical = function arraysAreIdentical(arr1, arr2) {
   if (arr1.length !== arr2.length) { return false; }
   for (let i = 0; i < arr1.length; i++) { if (arr1[i] !== arr2[i]) { return false; } }
   return true;
}

exports.getEpochDay = function getEpochDay() {
   const millisecondsInADay = 24 * 60 * 60 * 1000;
   const epoch = new Date(Date.UTC(1970, 0, 1));
   const now = new Date();
   const differenceInMilliseconds = now.getTime() - epoch.getTime();
   const daysSinceEpoch = Math.floor(differenceInMilliseconds / millisecondsInADay);
   return daysSinceEpoch;
}
exports.getRandomID = function getRandomID(length = 16) {
   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let id = '';
   for (let i = 0; i < length; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
   }
   return id;
}

exports.arraysGetMatches = function arraysGetMatches(arr1, arr2) {
   return arr1.filter(value => arr2.includes(value));
}
exports.arraysGetNonMatches = function arraysGetNonMatches(arr1, arr2) {
   return arr1.filter(value => !arr2.includes(value));
}