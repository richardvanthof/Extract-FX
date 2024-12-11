import { describe, expect, it, vi } from 'vitest';
import {screen, render} from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { getJSON, createExclusions, handleIngestFile } from './SelectFile.helpers.svelte';
import type {FileData} from './SelectFile.helpers.svelte';
import SelectFile from './SelectFile.svelte';
import type { SourceData } from '@/js/global-vars/globals.svelte';
import '@testing-library/jest-dom';

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

describe("handleIngestFile", async () => {
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

        const resultObj:FileData = {
            data,
            exclusionOptions: ['Motion', 'Opacity']
        }
        
        const file = new File([JSON.stringify(data)], 'effectsList.json', {
            type: 'application/json',
        });

        let filesList:FileData|null = $state(null);
        
        const props = {
            error: null,
            label: 'source',
            callback: vi.fn().mockImplementation(async (files) => {
                filesList = files
            })
        }
        
        const user = userEvent.setup()

        const {getByLabelText} = render(SelectFile, {props})
        const input = getByLabelText(props.label);

        await user.upload(input, file)
        if(filesList != null) {
            expect(await handleIngestFile(filesList)).toStrictEqual(resultObj)
        }
    });

    it("Puts error under file input field", async () => {
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
        
        const props = {
            error: null,
            label: 'source',
            callback: vi.fn()
        }
        
        const user = userEvent.setup()

        const {getByLabelText, rerender} = render(SelectFile, {props})
        const input = getByLabelText(props.label);


        await user.upload(input, file)
        let error:TypeError|null = null;
        
        // @ts-expect-error: parameter should be undefined for test.
        await handleIngestFile(null).catch(err => error = err)
        
        await rerender({error});

        const errorField = screen.getByTestId('select-file-error')
        
        // Check if error is displayed under file input field
        if(error != null) {
            // @ts-expect-error part of test
            expect(error.message).toBe("Cannot read properties of null (reading 'target')");
            expect(errorField).toBeInTheDocument(); 

        }
    });

})

describe("Create exclusions", () => {
    it("Transform exclusions to format compactible with Dropdown component.", ()=> {
        const input = ["Warp Stabilizer", "Motion", "Displace"];

        const result = createExclusions(input);
        
        // Check if the result is an array with the same length as input
        expect(result).toHaveLength(input.length);

        // Check each object in the array
        result.forEach((item, index) => {
            expect(item).toHaveProperty('effect', input[index]);
            expect(item).toHaveProperty('id');
            expect(item.id).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            );  // Validate UUID format
        });
    })
})

