// Exclusions.test.js
import { render, fireEvent, screen } from '@testing-library/svelte';
import { vi, it, expect, describe } from 'vitest';
import { get } from 'svelte/store';
import Exclusions from './ExcludeModal.svelte'; // Adjust the path if necessary
import { writable } from 'svelte/store';
import '@testing-library/jest-dom';
import type { Writable } from "svelte/store"
import { Exclusion } from '~/js/global-vars/shared';

//temp store
const exclusions:Writable<Exclusion[]> = writable([]);

describe('Exclusions Component', () => {
  // Test case for rendering the component
  it('renders correctly', async () => {
    render(Exclusions, {
      props: {
        exclusions,
        open: writable(true),
      }
    });

    // Check for the Exclusion header
    expect(screen.getByText('Exclude effects')).toBeInTheDocument();

    // Check if the Add Exclusion button is present
    expect(screen.getByText('+ Add Exclusion')).toBeInTheDocument();
    expect(screen.getByTitle('add')).toBeInTheDocument();
  });

  // Test case for adding an exclusion
  it('adds an exclusion when the add button is clicked', async () => {
    render(Exclusions, {
      props: {
        exclusions,
        open: writable(true),
      }
    });

    // Initially, the exclusions array should be empty

    expect(get(exclusions).length).toBe(0);

    // Click on the Add Exclusion button
    const addButton = screen.getByText('+ Add Exclusion');
    await fireEvent.click(addButton);

    // After clicking, the exclusions array should have one item
    expect(get(exclusions).length).toBe(1);
  });

  // Test case for clearing all exclusions
  it('removes all exclusions when the "Clear all" button is clicked', async () => {
    exclusions.set([
      { effect: 'Effect 1', id: 'mock-uuid-123' },
      { effect: 'Effect 2', id: 'mock-uuid-456' },
    ]);

    render(Exclusions, {
      props: {
        exclusions,
        open: writable(true),
      }
    });

    // Ensure there are two exclusions initially
    expect(screen.getAllByTestId('exclusion')).toHaveLength(2);

    // Click the "Clear all" button
    const clearButton = screen.getByText('Clear all');
    await fireEvent.click(clearButton);

    // After clicking, no exclusions should remain
    expect(screen.queryByRole('exclusion')).toBeNull();
  });

  // Test case for showing the placeholder when no exclusions exist
  it('shows the placeholder when no exclusions are present', async () => {
    exclusions.set([]);

    render(Exclusions, {
      props: {
        exclusions,
        open: writable(true),
      }
    });

    // Ensure the placeholder is shown
    expect(screen.getByText('Press the +-button to add an exclusion.')).toBeInTheDocument();
  });

  // Test case for checking if the exclusion count updates dynamically
  it('shows the correct exclusion count', async () => {
    exclusions.set([
      { effect: 'Effect 1', id: 'mock-uuid-123' },
      { effect: 'Effect 2', id: 'mock-uuid-456' },
    ]);

    render(Exclusions, {
      props: {
        exclusions,
        open: writable(true),
      }
    });

    // Ensure the exclusion count is displayed correctly in the summary
    expect(screen.getByText('Exclude effects (2)')).toBeInTheDocument();
  });
});
