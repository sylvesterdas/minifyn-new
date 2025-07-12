import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UrlShortenerForm } from './url-shortener-form';
import { vi } from 'vitest';
import * as actions from '@/app/actions';

// Mock the useToast hook
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock the server action
vi.mock('@/app/actions', () => ({
    shortenUrl: vi.fn(),
}));

// Mock useActionState and useFormStatus
vi.mock('react', async (importOriginal) => {
    const mod = await importOriginal<typeof import('react')>();
    const useActionState = (action: any, initialState: any) => {
        const [state, setState] = mod.useState(initialState);
        const dispatch = async (payload: FormData) => {
            const newState = await action(state, payload);
            setState(newState);
        };
        return [state, dispatch, false]; 
    }
    return {
        ...mod,
        useActionState,
        // Keep original useEffect for state updates
        useEffect: mod.useEffect,
    };
});
vi.mock('react-dom', async (importOriginal) => {
    const mod = await importOriginal<typeof import('react-dom')>();
    return {
        ...mod,
        useFormStatus: vi.fn(() => ({ pending: false })),
    };
});


describe('UrlShortenerForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form with an input field and a submit button', () => {
    render(<UrlShortenerForm />);
    expect(screen.getByLabelText('URL to shorten')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Shorten URL/i })).toBeInTheDocument();
  });

  it('shows the shortened URL on successful submission', async () => {
    const mockShortUrl = 'http://localhost:3000/abcdef';
    (actions.shortenUrl as vi.Mock).mockResolvedValue({
        success: true,
        message: 'URL shortened successfully!',
        shortUrl: mockShortUrl
    });

    render(<UrlShortenerForm />);
    
    const input = screen.getByLabelText('URL to shorten');
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: 'https://www.google.com' } });
    
    fireEvent.submit(form!);

    await waitFor(() => {
        expect(screen.getByText(mockShortUrl.replace(/^https?:\/\//, ''))).toBeInTheDocument();
    });
  });

  it('shows an error toast on failed submission', async () => {
    const errorMessage = 'This domain is not allowed.';
    (actions.shortenUrl as vi.Mock).mockResolvedValue({
        success: false,
        message: errorMessage,
    });

    render(<UrlShortenerForm />);

    const input = screen.getByLabelText('URL to shorten');
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: 'https://evil.org' } });
    fireEvent.submit(form!);

    await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
            title: "Oops!",
            description: errorMessage,
            variant: "destructive",
        });
    });
  });
});
