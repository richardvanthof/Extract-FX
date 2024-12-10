import { render, fireEvent, waitFor, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import App from './main.svelte';

describe('App', () => {
  it('renders correctly', () => {
    const { container } = render(App);
    expect(container).toMatchSnapshot();
  });

  it('navigates to the extract page when the extract button is clicked', async () => {
    const { getAllByText, container } = render(App);
    const extractButton = getAllByText('Extract');
    await fireEvent.click(extractButton[0]);
    const page = screen.getByTestId('extract-form')
    expect(page).toBeInTheDocument()
    expect(container).toMatchSnapshot();
  });

  it('navigates to the ingest page when the ingest button is clicked', async () => {
    const { getAllByText, container } = render(App);
    const ingestButton = getAllByText('Ingest');
    await fireEvent.click(ingestButton[0]);
    const page = screen.getByTestId('ingest-form')
    expect(page).toBeInTheDocument()
    expect(container).toMatchSnapshot();
  });
});
