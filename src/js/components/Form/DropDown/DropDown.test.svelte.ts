import { render, fireEvent, waitFor } from '@testing-library/svelte';
import { screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import {it, describe, expect, vi} from 'vitest';
import DropDown from './DropDown.svelte';


type Props = {
    options: [string|number, string|number|null][],
    value: string|number,
    callback?: (update: number|string) => void
}


describe('DropDown', () => {
    
    const config:Props = {
        value: 'Effect A',
        options: ['Effect A', 'Effect B', 'Effect C'].map(option => [option, option])
    }

    describe('Render', () => {

        const isRendering = async (config:Props, useCallBack: boolean) => {
            const props = {
                ...config
            }
            
            if(useCallBack) { props.callback = (update) => props.value = update}
            
            render(DropDown, { props });
            
            let dropdown;
            if(useCallBack) {

                dropdown = screen.getByTestId('dropdown-callback');
            } else {
                dropdown = screen.getByTestId('dropdown-bind');
            }
            expect(dropdown).toBeInTheDocument();
        }

        it('Show separate callback version', () => isRendering(config, true))
        it('Show bound variable version', () => isRendering(config, false))
    });

    describe('Update', () => {

        // TODO: create better way to verify the bound variables.
         const testDropDown = async (config:Props, useCallback: boolean) => {
            let props = config;
            const targetEffect = "Effect C";

            if(useCallback) { props['callback'] = (update) => props.value = update}

            const { rerender } = render(DropDown, { props });

            // Check if dropdown exists
            let dropdown = screen.getByRole('combobox');
            expect(dropdown).toBeInTheDocument()

            // Check if the correct dropdown type is rendered (bind or callback)
            dropdown = screen.getByDisplayValue(props.value);
            
            expect(dropdown).toBeInTheDocument()

            // Perform update action
            fireEvent.change(dropdown, { target: { value: targetEffect } });
            
            rerender(props);

            if(useCallback) {
                expect(props.value).toBe(targetEffect); // On state
            } 

            expect(dropdown).toHaveValue(targetEffect); // On element

        }

        it('Use separate callback', () => testDropDown(config, true))
        it('Use bound variable', () => testDropDown(config, false))

    })

});

