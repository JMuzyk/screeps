const creepsFactory = (function () {

    const CreepType = (function () {
        const obj = {};
        obj.BUILDER = 'builder';
        obj.UPGRADER = 'upgrader';
        obj.HARVESTER = 'harvester';
        obj.FIGHTER = 'fighter';
        Object.freeze(obj);
        return obj;
    })();

    const spawnName = 'Krakow';

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
            return [TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE]
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
            const numberOfSegmentsToBuild = parseInt(energyAvailable / segmentCost, 10);
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

    return {
        createUpgrader: createUpgrader,
        createHarvester: createHarvester,
        createBuilder: createBuilder,
        createFighter: createFighter
    };
})();


module.exports = creepsFactory;
