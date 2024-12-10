import { describe, expect, it, afterEach} from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import ExcludeModal from './ExcludeModal.svelte';
import type { Exclusion } from '@/js/global-vars/globals.svelte';

describe("Exclusion modal", () => {
    const options = ['Effect A', 'Effect B', 'Effect C']
    const open = true;
    
    describe('Rendering', () => {
        it("Empty component loads", () => {
            const exclusions = $state([]);
    
            const {container} = render(ExcludeModal, {
                props: {exclusions, open},
                context: new Map([['exclusionOptions', options]])
            });
            
            const placeholder = screen.queryByText('Press the +-button to add an exclusion.');
            
            // Placeholder loads
            expect(placeholder).toBeInTheDocument()
            
            // Empty component loads
            expect(container).toMatchSnapshot()
            
        })
        
        it("Loads currect exclusion items state", () => {
            const exclusions = $state([
                {effect: 'Effect A',id: 'FX1'},
                {effect: 'Effect B', id: 'FX2'}
            ]);
            
            const {container} = render(ExcludeModal, {
                props: {exclusions, open},
                context: new Map([['exclusionOptions', options]])
            });
    
            exclusions.forEach(({effect}) => {
                const value = screen.getByDisplayValue(effect);
                expect(value).toBeInTheDocument()
            })        
            
            expect(container).toMatchSnapshot()   
        })
    })

    describe('Modifiy list', () => {
       
        afterEach(() => cleanup());

        const exclusions:Exclusion[] = $state([
            {effect: 'Effect A', id: 'FX1'},
            {effect: 'Effect B', id: 'FX2'}
        ]);

        const user = userEvent.setup();

        it("Add", async () => {

            render(ExcludeModal, {
                props: {exclusions, open},
                context: new Map([['exclusionOptions', options]])
            });

            const addBtn = screen.getByText('+ Add Exclusion')
            await user.click(addBtn);

            const newExclusion = screen.getByDisplayValue('Choose an effect');
            const allExclusions = screen.getAllByTestId('exclusion')
            expect(newExclusion).toBeInTheDocument();
            expect(allExclusions.length).toBe(3);
        });

        it("Delete", async () => {

            render(ExcludeModal, {
                props: {exclusions, open},
                context: new Map([['exclusionOptions', options]])
            });

            const deleteBtn = screen.getAllByTestId('delete-exclusion')
            await user.click(deleteBtn[0]);

            const allExclusions = screen.getAllByTestId('exclusion')
            expect(allExclusions.length).toBe(1); // Updated in DOM
        });

        it("Update", async () => {
                
            render(ExcludeModal, {
                props: {exclusions, open},
                context: new Map([['exclusionOptions', options]])
            });

            // Find all dropdowns (assuming they are <select> elements)
            const dropdown = screen.getAllByRole('combobox');

            // Check if the correct value has been selected
            expect(dropdown[0]).toHaveValue('Effect A');

            fireEvent.change(dropdown[0], { target: { value: "Effect C" } });

            await waitFor(() => {

                expect(dropdown[0]).toHaveValue('Effect C'); // Check if dropdown label changed
                // expect(updatedExclusions).toEqual(result);
            });
        });

        it("Delete All", async () => {
  
            render(ExcludeModal, {
                props: {exclusions, open},
                context: new Map([['exclusionOptions', options]])
            });

            const clearBtn = screen.getByText('Clear all')
            await user.click(clearBtn);

            // Check that no exclusions are rendered (i.e., the exclusion elements are removed)
            const allExclusions = screen.queryAllByTestId('exclusion');
            expect(allExclusions.length).toBe(0);  // Check that there are no exclusions
        });


    })

})