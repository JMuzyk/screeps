const CreepType = require('enums').CreepType;

const creepsFactory = (function () {

    const spawnName = 'Krakow';

    function isAnySpawnAvailable(room) {
        const idleSpawns = room.find(FIND_MY_SPAWNS, {
            filter: (spawn) => !spawn.spawning
        });
        return idleSpawns > 0;
    }

    function getDefaultBodies(creepType) {
        if (creepType === CreepType.UPGRADER) {
            return [WORK, WORK, CARRY, MOVE];
        }
        if (creepType === CreepType.BUILDER) {
            return [WORK, CARRY, MOVE];
        }
        if (creepType === CreepType.HARVESTER) {
            return [WORK, WORK, CARRY, MOVE];
        }
        if (creepType === CreepType.FIGHTER) {
            return [TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
        }
        if (creepType === CreepType.MINER) {
            return [WORK, WORK, WORK, WORK, WORK, WORK, MOVE];
        }
        if (creepType === CreepType.MINERAL_HARVESTER) {
            return [WORK, WORK, CARRY, MOVE];
        }
        if (creepType === CreepType.CARRIER) {
            return [CARRY, CARRY, MOVE];
        }
    }

    function getBodyPartSegments(creepType) {
        if (creepType === CreepType.UPGRADER) {
            return [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];
        }
        if (creepType === CreepType.BUILDER) {
            return [WORK, WORK, WORK, CARRY, MOVE, MOVE];
        }
        if (creepType === CreepType.HARVESTER) {
            return [WORK, WORK, WORK, CARRY, MOVE, MOVE];
        }
        if (creepType === CreepType.FIGHTER) {
            return [TOUGH, ATTACK, MOVE];
        }
        if (creepType === CreepType.MINER) {
            return [WORK, WORK, WORK, WORK, WORK, WORK, MOVE]
        }
        if (creepType === CreepType.MINERAL_HARVESTER) {
            return [WORK, WORK, WORK, CARRY, MOVE, MOVE];
        }
        if (creepType === CreepType.CARRIER) {
            return [CARRY, CARRY, MOVE];
        }
    }

    function getMaxNumberOfSegments(creepType) {
        if (creepType === CreepType.UPGRADER) {
            return 2;
        }
        if (creepType === CreepType.BUILDER) {
            return 3;
        }
        if (creepType === CreepType.HARVESTER) {
            return 3;
        }
        if (creepType === CreepType.FIGHTER) {
            return 10;
        }
        if (creepType === CreepType.MINER) {
            return 7;
        }
        if (creepType === CreepType.MINERAL_HARVESTER) {
            return 7;
        }
        if (creepType === CreepType.CARRIER) {
            return 7;
        }
    }

    let energyTickCounter = 0;
    function assembleBodyParts(creepType) {
        const energyAvailable = Game.spawns[spawnName].room.energyAvailable;
        const energyCapacity= Game.spawns[spawnName].room.energyCapacityAvailable;
        if(energyAvailable < energyCapacity && energyTickCounter < 100) {
            energyTickCounter = energyTickCounter + 1;
            return [];
        } else {
            energyTickCounter = 0;
        }

        const defaultBody = getDefaultBodies(creepType);
        const bodyPartsSegment = getBodyPartSegments(creepType);
        const segmentCost = bodyCost(bodyPartsSegment);


        if (energyAvailable < segmentCost) {
            return defaultBody;
        } else {
            const numberOfSegmentsToBuild = Math.min(parseInt(energyAvailable / segmentCost, 10), getMaxNumberOfSegments(creepType));
            if (numberOfSegmentsToBuild > 1) {
                let assembledBodyParts = [];
                for (let i = 0; i < numberOfSegmentsToBuild; i++) {
                    assembledBodyParts = assembledBodyParts.concat(bodyPartsSegment);
                }
                if (creepType === CreepType.FIGHTER) {
                    assembledBodyParts = assembledBodyParts.sort(fighterBodyPartsSortFunction);
                }
                return assembledBodyParts;
            } else {
                return bodyPartsSegment;
            }
        }
    }

    function fighterBodyPartsSortFunction(a, b) {
        const sortOrder = {
            tough: 5,
            move: 3,
            attack: 2
        };

        return sortOrder[b] - sortOrder[a];
    }

    function bodyCost(body) {
        return body.reduce((cost, part) => cost + BODYPART_COST[part], 0);
    }

    function createCreep(creepType) {
        const newName = creepType + Game.time;
        console.log('Spawning new ' + creepType + ': ' + newName);
        const bodyParts = assembleBodyParts(creepType);
        if(bodyParts.length > 0) {
            Game.spawns[spawnName].spawnCreep(bodyParts, newName, {memory: {role: creepType}});
        }
    }

    function createUpgrader() {
        createCreep(CreepType.UPGRADER);
    }

    function createHarvester() {
        createCreep(CreepType.HARVESTER);
    }

    function createBuilder() {
        createCreep(CreepType.BUILDER);
    }

    function createFighter() {
        createCreep(CreepType.FIGHTER);
    }

    function createMiner() {
        createCreep(CreepType.MINER);
    }

    function createMineralHarvester() {
        createCreep(CreepType.MINERAL_HARVESTER);
    }

    function createCarrier() {
        createCreep(CreepType.CARRIER);
    }

    return {
        isAnySpawnAvailable: isAnySpawnAvailable,
        createUpgrader: createUpgrader,
        createHarvester: createHarvester,
        createBuilder: createBuilder,
        createFighter: createFighter,
        createMiner: createMiner,
        createMineralHarvester: createMineralHarvester,
        createCarrier: createCarrier
    };
})();


module.exports = creepsFactory;
