import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import SignUpPage from './page';

// Mock dependencies
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock('react', async (importOriginal) => {
    const mod = await importOriginal<typeof import('react')>();
    return {
        ...mod,
        useActionState: vi.fn((_action, initialState) => [initialState, vi.fn(), false]),
    };
});

// Mock firebase-admin to prevent it from trying to initialize in a test environment
vi.mock('@/lib/firebase-admin', () => ({
    auth: {
        createUser: vi.fn(),
        generateEmailVerificationLink: vi.fn(),
    }
}));

describe('SignUpPage', () => {
  it('renders all form elements correctly', () => {
    render(<SignUpPage />);

    // Check for title and description
    expect(screen.getByRole('heading', { name: /Sign Up/i })).toBeInTheDocument();
    expect(screen.getByText(/Enter your information to create an account/i)).toBeInTheDocument();

    // Check for form fields
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create an account/i })).toBeInTheDocument();

    // Check for link
    expect(screen.getByRole('link', { name: /Sign in/i })).toBeInTheDocument();
  });
});
