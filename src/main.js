const creepsManager = require('creeps_manager');

module.exports.loop = function () {

   for (let name in Memory.creeps) {
      if (!Game.creeps[name]) {
         delete Memory.creeps[name];
         console.log('Clearing non-existing creep memory:', name);
      }
   }

   creepsManager.run();
};