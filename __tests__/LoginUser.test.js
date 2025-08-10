import { LoginUser } from '../helper/LocalStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

describe('LoginUser', () => {
  const email = 'user@example.com';
  const password = 'password123';
  const mockToken = 'token';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('successfully logs in and stores the token', async () => {
    const mockResponse = {
      data: {
        data: {
          token: mockToken,
        },
      },
    };

    axios.post.mockResolvedValueOnce(mockResponse);

    const result = await LoginUser(email, password);

    expect(axios.post).toHaveBeenCalledWith(
      'https://mobile.faveodemo.com/mudabir/public/v3/api/login',
      null,
      { params: { email, password } }
    );

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('auth_token', mockToken);
    expect(result).toEqual(mockResponse.data);
  });

  it('throws error on failed login', async () => {
    const errorMessage = 'Invalid credentials';
    axios.post.mockRejectedValueOnce(new Error(errorMessage));

    await expect(LoginUser(email, password)).rejects.toThrow(errorMessage);

    expect(axios.post).toHaveBeenCalledWith(
      'https://mobile.faveodemo.com/mudabir/public/v3/api/login',
      null,
      { params: { email, password } }
    );

    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });
});
