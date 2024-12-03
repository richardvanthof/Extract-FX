import { render, fireEvent, screen } from '@testing-library/svelte';
import { vi, it, expect, describe, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import '@testing-library/jest-dom';
import type { Writable } from "svelte/store"
import { Exclusion as ExclusionType} from '../../../global-vars/shared';
import { writable } from 'svelte/store';
import { setContext } from 'svelte';

import Exclusion from './Exclusion.svelte';


// Mocking the Svelte store and context

const mockExclusions:Writable<ExclusionType[]> = writable([{ id: 'uuid-1', effect: 'None' }]);
const mockExclusionOptions = [
  ['Choose an effect', null],
  ['Effect 1', 'effect1'],
  ['Effect 2', 'effect2']
];
const mockRemove = (id: string) => {
  console.log(`remove ${id}`);
  mockExclusions.update((currentItems) => {
      return currentItems.filter(({ id: exclusionId }) => exclusionId !== id);
  });
};


describe('Exclusion Component', () => {

  it('renders correctly with props', async () => {
    setContext('exclusionOptions', mockExclusionOptions);
    const { getByTestId } = render(Exclusion, {
        
      props: {
        id: 'uuid-1',
        exclusions: mockExclusions,
        remove: mockRemove
      }
    });

    // Check if the component renders the exclusion dropdown and remove button
    expect(getByTestId('exclusion')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'x' })).toBeInTheDocument();
    expect(screen.getByText('Choose an effect')).toBeInTheDocument();
  });

//   it('handles dropdown change correctly', async () => {
//     const { getByRole } = render(Exclusion, {
//       props: {
//         id: 1,
//         exclusions: mockExclusions,
//         remove: mockRemove
//       },
//       context: {
//         exclusionOptions: mockExclusionOptions
//       }
//     });

//     const dropdown = getByRole('combobox');
    
//     // Simulate selecting a new effect from the dropdown
//     await fireEvent.change(dropdown, { target: { value: 'effect1' } });
    
//     // Ensure that exclusions store was updated correctly
//     mockExclusions.update((exclusions) => {
//       expect(exclusions[0].effect).toBe('effect1');
//       return 
//     });
//   });

//   it('calls remove function when remove button is clicked', async () => {
//     const { getByRole } = render(Exclusion, {
//       props: {
//         id: 1,
//         exclusions: mockExclusions,
//         remove: mockRemove
//       },
//       context: {
//         exclusionOptions: mockExclusionOptions
//       }
//     });

//     const removeButton = getByRole('button', { name: 'x' });
    
//     // Simulate a click on the remove button
//     await fireEvent.click(removeButton);

//     // Ensure remove function was called with the correct ID
//     expect(mockRemove).toHaveBeenCalledWith(1);
//   });
});