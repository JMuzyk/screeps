const creepsFactory = require('creeps_factory');
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleFighter = require('role.fighter');

const creepsManager = {
    run: function () {

        const BUILDERS_NEEDED = 2;
        const HARVESTERS_NEEDED = 2;
        const UPGRADERS_NEEDED = 2;
        // const BIG_HARVESTERS_NEEDED = 1;
        const FIGHTERS_NEEDED = 0;

        if (!Game.spawns['Krakow'].spawning) {
            const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
            const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
            const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
            const fighters = _.filter(Game.creeps, (creep) => creep.memory.role === 'fighter');

            if (harvesters.length < HARVESTERS_NEEDED) {
                creepsFactory.createHarvester();
            } else if (upgraders.length < UPGRADERS_NEEDED) {
                creepsFactory.createUpgrader();
            } else if (builders.length < BUILDERS_NEEDED) {
                creepsFactory.createBuilder();
            } else if (fighters.length < FIGHTERS_NEEDED) {
               creepsFactory.createFighter();
            }
        }

        for (let name in Game.creeps) {
            const creep = Game.creeps[name];
            if (creep.memory.role === 'harvester') {
                roleHarvester.run(creep);
            }
            if (creep.memory.role === 'upgrader') {
                roleUpgrader.run(creep);
            }
            if (creep.memory.role === 'builder') {
                roleBuilder.run(creep);
            }
            if (creep.memory.role === 'fighter') {
                roleFighter.run(creep);
            }
        }
    }
};

module.exports = creepsManager;