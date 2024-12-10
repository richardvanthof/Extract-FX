import { render } from '@testing-library/svelte';
import { describe, expect, it, afterEach, vi } from 'vitest';
import Ingest from './Ingest.svelte';

describe('Ingest component', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Renders', () => {
    const { container } = render(Ingest);
    expect(container).toMatchSnapshot();
  });
  
});
