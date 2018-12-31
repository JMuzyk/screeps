const creepsFactory = (function () {

    const CreepType = (function () {
        const obj = {};
        obj.BUILDER = 'builder';
        obj.UPGRADER = 'upgrader';
        obj.HARVESTER = 'harvester';
        Object.freeze(obj);
        return obj;
    })();


    const spawnName = 'Krakow';
    const FIGHTER_BODY_PARTS = [ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE];


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
    }

    function assembleBodyParts(creepType) {
        const defaultBody = getDefaultBodies(creepType);
        const bodyPartsSegment = getBodyPartSegments(creepType);
        const segmentCost = bodyCost(bodyPartsSegment);
        const energyAvailable = Game.spawns[spawnName].room.energyAvailable;

        if (energyAvailable < segmentCost) {
            return defaultBody;
        } else {
            const numberOfSegmentsToBuild = parseInt(energyAvailable / segmentCost, 10);
            if (numberOfSegmentsToBuild > 1) {
                let assemblyBodyParts = [];
                for (let i = 0; i < numberOfSegmentsToBuild; i++) {
                    assemblyBodyParts = assemblyBodyParts.concat(bodyPartsSegment);
                }
                return assemblyBodyParts;
            } else {
                return bodyPartsSegment;
            }
        }
    }

    function bodyCost(body) {
        return body.reduce((cost, part) => cost + BODYPART_COST[part], 0);
    }

    function createCreep(creepType) {
        const newName = creepType + Game.time;
        console.log('Spawning new ' + creepType + ': '  + newName);
        Game.spawns[spawnName].spawnCreep(assembleBodyParts(creepType), newName, {memory: {role: creepType}});
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
        const newName = 'Fighter' + Game.time;
        console.log('Spawning new fighter: ' + newName);
        console.log(Game.spawns[spawnName].spawnCreep(FIGHTER_BODY_PARTS, newName, {memory: {role: 'fighter'}}));
    }

    return {
        createUpgrader: createUpgrader,
        createHarvester: createHarvester,
        createBuilder: createBuilder,
        createFighter: createFighter
    };
})();


module.exports = creepsFactory;
