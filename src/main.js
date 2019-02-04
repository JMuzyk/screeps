const creepsManager = require('creeps_manager');
const structuresManager = require('structures_manager');
const prototypes = require('prototypes');
const trader = require('trader');

module.exports.loop = function () {

   for (let name in Memory.creeps) {
      if (!Game.creeps[name]) {
         delete Memory.creeps[name];
         console.log('Clearing non-existing creep memory:', name);
      }
   }

   creepsManager.run();
   structuresManager.run();
   trader.run();
};