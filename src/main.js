const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleLightFighter = require('role.light_fighter');

module.exports.loop = function () {

    const BUILDERS_NEEDED = 1;
    const HARVESTERS_NEEDED = 3;
    const UPGRADERS_NEEDED = 3;
    const BIG_HARVESTERS_NEEDED = 1;
    const LIGHT_FIGHTERS_NEEDED = 2;

    const BIG_HARVESTER_BODY_PARTS = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE];
    const LIGHT_FIGHTER_BODY_PARTS = [ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE];

    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    if (!Game.spawns['Krakow'].spawning) {
        const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
        const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
        const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
        const lightFighters = _.filter(Game.creeps, (creep) => creep.memory.role === 'light_fighter');

        if (harvesters.length < HARVESTERS_NEEDED) {
            const newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            Game.spawns['Krakow'].spawnCreep([WORK, CARRY, MOVE], newName,
                {memory: {role: 'harvester'}});
        } else if (upgraders.length < UPGRADERS_NEEDED) {
            const newName = 'Upgrader' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            Game.spawns['Krakow'].spawnCreep([WORK, CARRY, MOVE], newName,
                {memory: {role: 'upgrader'}});
        } else if (builders.length < BUILDERS_NEEDED) {
            const newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            Game.spawns['Krakow'].spawnCreep([WORK, CARRY, MOVE], newName,
                {memory: {role: 'builder'}});
        } else if (lightFighters.length < LIGHT_FIGHTERS_NEEDED) {
            const newName = 'LightFighter' + Game.time;
            console.log('Spawning new light fighter: ' + newName);
            Game.spawns['Krakow'].spawnCreep(LIGHT_FIGHTER_BODY_PARTS, newName,
                {memory: {role: 'light_fighter'}});
        }

    }


    for (let name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role === 'light_fighter') {
            roleLightFighter.run(creep);
        }
    }
};