var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    if(!Game.spawns['Krakow'].spawning) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');

        if(harvesters.length < 3) {
            const newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            Game.spawns['Krakow'].spawnCreep([WORK,CARRY,MOVE], newName,
                {memory: {role: 'harvester'}});
        }
        else if(upgraders.length < 3) {
            const newName = 'Upgrader' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            Game.spawns['Krakow'].spawnCreep([WORK,CARRY,MOVE], newName,
                {memory: {role: 'upgrader'}});
        }
        else if(builders.length < 2) {
            const newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            Game.spawns['Krakow'].spawnCreep([WORK,CARRY,MOVE], newName,
                {memory: {role: 'builder'}});
        }
    }


    for(let name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
    }
}