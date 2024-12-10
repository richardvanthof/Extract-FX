import { render } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import { describe, expect, it, afterEach, vi } from 'vitest';
import Extract from '@/js/pages/Extract/Extract.svelte';

describe('Extract.svelte', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Renders correct layout', () => {
    const { container } = render(Extract);
    expect(container).toMatchSnapshot();
  })
});
