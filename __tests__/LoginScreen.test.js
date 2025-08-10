import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen'; // Update the path as needed
import { LoginUser } from '../helper/LocalStorage';
import { useTranslation } from 'react-i18next';

// Mock the navigation prop
const mockNavigate = jest.fn();
const mockReset = jest.fn();

const mockNavigation = {
  navigate: mockNavigate,
  reset: mockReset,
};

// Mock i18n translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
}));

// Mock LoginUser
jest.mock('../helper/LocalStorage', () => ({
  LoginUser: jest.fn(),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all required elements', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation} />);

    expect(getByPlaceholderText('login.email')).toBeTruthy();
    expect(getByPlaceholderText('login.password')).toBeTruthy();
    expect(getByText('login.button')).toBeTruthy();
  });

  it('shows error on empty fields', async () => {
    const { getByText, findByText } = render(<LoginScreen navigation={mockNavigation} />);

    const loginButton = getByText('login.button');
    fireEvent.press(loginButton);

    expect(await findByText(/login.error-empty/)).toBeTruthy();
  });

  it('shows error on invalid email', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<LoginScreen navigation={mockNavigation} />);

    fireEvent.changeText(getByPlaceholderText('login.email'), 'invalidemail');
    fireEvent.changeText(getByPlaceholderText('login.password'), '123456');
    fireEvent.press(getByText('login.button'));

    expect(await findByText(/Enter a valid email/)).toBeTruthy();
  });

  it('calls LoginUser and navigates on success', async () => {
    LoginUser.mockResolvedValueOnce({ success: true });

    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation} />);

    fireEvent.changeText(getByPlaceholderText('login.email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('login.password'), 'password123');
    fireEvent.press(getByText('login.button'));

    await waitFor(() => {
      expect(LoginUser).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockReset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'Drawer' }] });
    });
  });

  it('shows error on failed login', async () => {
    LoginUser.mockRejectedValueOnce(new Error('Invalid credentials'));

    const { getByPlaceholderText, getByText, findByText } = render(<LoginScreen navigation={mockNavigation} />);

    fireEvent.changeText(getByPlaceholderText('login.email'), 'wrong@example.com');
    fireEvent.changeText(getByPlaceholderText('login.password'), 'wrongpass');
    fireEvent.press(getByText('login.button'));

    expect(await findByText(/login.error-invalid/)).toBeTruthy();
  });

  it('navigates to ForgotPassword on link press', () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('login.forgot'));

    expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword');
  });

  it('navigates to Signup screen on link press', () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('login.signup'));

    expect(mockReset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'Signup' }] });
  });
});
