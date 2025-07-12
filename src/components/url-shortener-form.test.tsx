import { render, screen } from '@testing-library/react';
import { UrlShortenerForm } from './url-shortener-form';
import { vi } from 'vitest';

// Mock useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('UrlShortenerForm', () => {
  it('renders the form with an input field and a submit button', () => {
    render(<UrlShortenerForm />);

    // Check for the input field
    const inputElement = screen.getByPlaceholderText('https://your-super-long-url.com/goes-here');
    expect(inputElement).toBeInTheDocument();

    // Check for the submit button
    const buttonElement = screen.getByRole('button', { name: /Shorten URL/i });
    expect(buttonElement).toBeInTheDocument();

    // Check for the title
    expect(screen.getByText('MiniFyn')).toBeInTheDocument();
  });
});
