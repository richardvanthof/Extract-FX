import {getUniqueKeys} from "./SelectFile.helpers"
import {describe, expect, it} from 'vitest';

describe("Get unique Keys from array list", () => {

    it("Returns unique keys from list of objects", () => {
        const list = [
            {Transform: {}, Stabilize: {}, Displace: {}},
            {Motion: {}, Transform:{}, Color:{}}, 
            {Transform: {}, Stabilize: {}, Limit: {}}
        ]
        expect(getUniqueKeys(list)).toStrictEqual(
            ['Transform', 'Stabilize', 'Displace', 'Motion', 'Color', 'Limit']
        );
    });

    it("Is able to compare strings regardless of casing.", () => {
        const list = [
            {TRANSform: {}, Stabilize: {}, Displace: {}},
            {Motion: {}, Transform:{}, COLOR:{}}, 
            {Transform: {}, stabilize: {}, Limit: {}}
        ]
        expect(getUniqueKeys(list)).toStrictEqual(
            ['TRANSform', 'Stabilize', 'Displace', 'Motion', 'COLOR', 'Limit']
        );
    });
    
    it("Returns unique keys from single object", () => {
        const list = {
            Transform: {},
            Stabilize: {}, 
            Displace: {}, 
            Motion: {}, 
            transform:{}, 
            Color:{}, 
            transform: {}, 
            Stabilize: {},
            Limit: {}
            }
        expect(getUniqueKeys(list)).toStrictEqual(
            ['Transform', 'Stabilize', 'Displace', 'Motion', 'Color', 'Limit']
        );
    });
});
