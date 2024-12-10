import { render } from '@testing-library/svelte';
import { screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import {it, describe, expect } from 'vitest';
import Loader from './Loader.svelte';

describe('Loader Component', () => {
    type Props = {
        message?: string,
        progress?: number
    }

    it('Renders', ()=> {
        
        const {container} = render(Loader)

        const progress = screen.getByRole('progressbar');

        expect(progress).toBeInTheDocument();
        expect(container).toMatchSnapshot();

    });

    it('Shows status message', () => {
        const props:Props = {
            message: 'Extracting...'
        };
        const {container} = render(Loader, {props})

        const messageText = screen.getByText(props.message);

        expect(messageText).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    })
});
