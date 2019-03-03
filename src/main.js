const creepsManager = require('creeps_manager');
const structuresManager = require('structures_manager');
const prototypes = require('prototypes');
const trader = require('trader');
const profiler = require('screeps-profiler');

profiler.enable();

module.exports.loop = function () {

   profiler.wrap(function(){
      for (let name in Memory.creeps) {
         if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
         }
      }

      for (let roomName in Game.rooms) {
         creepsManager.run(Game.rooms[roomName]);
      }

      structuresManager.run();
      trader.run();
   });

};