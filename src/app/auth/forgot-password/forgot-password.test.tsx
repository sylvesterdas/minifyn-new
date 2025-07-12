import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ForgotPasswordPage from './page';

// Mock dependencies
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


describe('ForgotPasswordPage', () => {
  it('renders all form elements correctly', () => {
    render(<ForgotPasswordPage />);

    // Check for title and description
    expect(screen.getByRole('heading', { name: /Forgot Password/i })).toBeInTheDocument();
    expect(screen.getByText(/Enter your email and we'll send you a link to reset your password./i)).toBeInTheDocument();

    // Check for form fields
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Reset Link/i })).toBeInTheDocument();

    // Check for link
    expect(screen.getByRole('link', { name: /Sign in/i })).toBeInTheDocument();
  });
});
