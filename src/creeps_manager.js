const creepsFactory = require('creeps_factory');
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleFighter = require('role.fighter');
const roleMineralHarvester = require('role.mineral_harvester');
const CreepType = require('enums').CreepType;

const creepsManager = {
    run: function () {

        const BUILDERS_NEEDED = 1;
        const HARVESTERS_NEEDED = 2;
        const UPGRADERS_NEEDED = 2;
        const MINERS_NEEDED = 0;
        const FIGHTERS_NEEDED = Game.spawns['Krakow'].room.controller.level > 1 ? 3 : 0;
        const MINERAL_HARVESTERS_NEEDED = 1; //TODO change to check for extractors built

        if (!Game.spawns['Krakow'].spawning) {
            const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === CreepType.HARVESTER && creep.ticksToLive > 50);
            const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === CreepType.UPGRADER && creep.ticksToLive > 50);
            const builders = _.filter(Game.creeps, (creep) => creep.memory.role === CreepType.BUILDER && creep.ticksToLive > 50);
            const fighters = _.filter(Game.creeps, (creep) => creep.memory.role === CreepType.FIGHTER && creep.ticksToLive > 50);
            const mineral_harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === CreepType.MINERAL_HARVESTER && creep.ticksToLive > 50);

            if (harvesters.length < HARVESTERS_NEEDED) {
                creepsFactory.createHarvester();
            } else if (upgraders.length < UPGRADERS_NEEDED) {
                creepsFactory.createUpgrader();
            } else if (builders.length < BUILDERS_NEEDED) {
                creepsFactory.createBuilder();
            } else if (fighters.length < FIGHTERS_NEEDED) {
               creepsFactory.createFighter();
            } else if (fighters.length < MINERS_NEEDED) {
                creepsFactory.createMiner();
            } else if (mineral_harvesters.length < MINERAL_HARVESTERS_NEEDED) {
                creepsFactory.createMineralHarvester();
            }
        }

        for (let name in Game.creeps) {
            const creep = Game.creeps[name];
            if (creep.memory.role === CreepType.HARVESTER) {
                roleHarvester.run(creep);
            }
            if (creep.memory.role === CreepType.UPGRADER) {
                roleUpgrader.run(creep);
            }
            if (creep.memory.role === CreepType.BUILDER) {
                roleBuilder.run(creep);
            }
            if (creep.memory.role === CreepType.FIGHTER) {
                roleFighter.run(creep);
            }
            if (creep.memory.role === CreepType.MINERAL_HARVESTER) {
                roleMineralHarvester.run(creep);
            }
        }
    }
};

module.exports = creepsManager;