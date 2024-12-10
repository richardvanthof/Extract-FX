import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import NavBar from './NavBar.svelte';

describe('NavBar', () => {
    
    it('Renders', () => {
        const props = {
            mode: 'extract',
            options: ['Extract', 'Ingest'],
            setMode: vi.fn()
        };
      
        const { container } = render(NavBar, { props });

        const links = screen.getAllByTestId('navbar-option');
        expect(container).toMatchSnapshot();
        expect(links).toHaveLength(2);

    });

    it('Checks if choosing new page works', async () => {
        const props = {
            mode: 'extract',
            options: ['Extract', 'Ingest'],
            setMode: vi.fn((mode: string) => {
                console.log(mode)
                props.mode = mode
            })
        };

        const {rerender} = render(NavBar, {props});

        const links = screen.getAllByTestId('navbar-option');

        expect(links[0].classList).toContain('active');
        expect(links[1].classList).not.toContain('active');

        await fireEvent.click(links[1]);
        await rerender({mode: props.mode})

        expect(links[0].classList).not.toContain('active');
        expect(links[1].classList).toContain('active');
    });
});
