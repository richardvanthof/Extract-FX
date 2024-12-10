import { describe, it, vi, expect } from "vitest";
import { fireEvent, render, screen } from '@testing-library/svelte';
import Switch from './Switch.svelte';

describe('Switch',() => {
    it('Renders', () => {
        const props = {
            value: 'file',
            options: ['File', 'Sequence'],
            callback: vi.fn()
        }
        
        const { container } = render(Switch, { props })

        expect(container).toMatchSnapshot()

    })
    it('Check if switch works', async () => {
        const props = {
            value: 'file',
            options: ['File', 'Sequence'],
            callback: vi.fn((selection: string) => {
                props.value = selection;
            })
        }
        
        const {container, rerender} = render(Switch, { props })

        const sequenceBtn = screen.getByText('Sequence');

        await fireEvent.click(sequenceBtn);
        
        expect(props.callback).toHaveBeenCalledTimes(1);
        expect(container).toMatchSnapshot() // File is active
        
        await rerender({ value: props.value })

        expect(props.callback).toHaveBeenCalledWith('sequence');
        expect(container).toMatchSnapshot() // Sequence is active
    });
});