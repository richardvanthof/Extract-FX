import {
    getUniqueKeys,
    getJSON
} from "./SelectFile.helpers";
import type { SourceData } from "./SelectFile.helpers";
import { describe, expect, it } from 'vitest';


describe("Get unique keys from object array()", () => {

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
            //@ts-expect-error part of test
            transform: {}, 
            //@ts-expect-error part of test
            Stabilize: {},
            Limit: {}
            }
        expect(getUniqueKeys(list)).toStrictEqual(
            ['Transform', 'Stabilize', 'Displace', 'Motion', 'Color', 'Limit']
        );
    });
});

describe("getJSON", async () => {
    it("Returns JS object from JSON-file", async () => {
        const data:SourceData = {
            type: 'RS-FX-EXCHANGE',
            track: 1,
            sequence: 'My Video',
            exclusions: [],
            clips: [
                {Motion: {}, Opacity: {}},
                {Motion: {}, Opacity: {}},
                {Motion: {}, Opacity: {}}
            ]
        };

        const file = new File([JSON.stringify(data)], 'effectsList.json', {
            type: 'application/json',
        });

        const result = await getJSON(file);
        
        expect(result).toStrictEqual(data);
    });

    it("Returns error when file is empty.", async () => {
        const file = new File([''], 'emptyList.json', {
            type: 'application/json',
        });

        await expect(getJSON(file)).rejects.toThrowError("This file is empty.");
    })

    it("Returns error when file does not contain clips data.", async () => {
        const data:SourceData= {
            type: 'RS-FX-EXCHANGE',
            track: 1,
            sequence: 'My Video',
            exclusions: [],
            clips: []
        };

        const file = new File([JSON.stringify(data)], 'noClips.json', {
            type: 'application/json',
        });

        await expect(getJSON(file)).rejects.toThrowError("No clip effect data has been found.");
    })

    it("Returns error when file does not contain the correct data type.", async () => {
        const data:SourceData= {
            // @ts-expect-error part of test
            type: 'NOT-RS-FX-EXCHANGE', // this file is not the correct type.
            track: 1,
            sequence: 'My Video',
            exclusions: [],
            clips: [
                {Motion: {}, Opacity: {}},
                {Motion: {}, Opacity: {}},
                {Motion: {}, Opacity: {}}
            ]
        };

        const file = new File([JSON.stringify(data)], 'invalid.json', {
            type: 'application/json',
        });

        await expect(getJSON(file)).rejects.toThrowError("This file contains invalid data and cannot be opened.");
    })
})

