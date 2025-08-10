import axios from 'axios';
import { registerUser } from '../helper/LocalStorage';

jest.mock('axios'); // mock axios

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('registerUser', () => {
  const mockData = {
    firstName: 'Mudabir',
    lastName: 'Kowsar',
    email: 'mudabir@example.com',
    password: 'password123',
  };

  it('should call the API with correct data and return response', async () => {
    const mockResponse = {
      data: {
        message: 'User created successfully',
        user: { id: 1, email: mockData.email },
      },
      status: 200,
    };

    axios.post.mockResolvedValue(mockResponse);

    const response = await registerUser(
      mockData.firstName,
      mockData.lastName,
      mockData.email,
      mockData.password
    );

    expect(axios.post).toHaveBeenCalledWith(
      'https://mobile.faveodemo.com/mudabir/public/v3/user/create/api',
      null,
      {
        params: {
          first_name: mockData.firstName,
          last_name: mockData.lastName,
          email: mockData.email,
          password: mockData.password,
          scenario: 'create',
          category: 'requester',
          panel: 'client',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    expect(response).toEqual(mockResponse);
  });

  it('should throw an error when the API call fails', async () => {
    const mockError = new Error('Invalid credentials');
    axios.post.mockRejectedValue(mockError);

    await expect(
      registerUser(
        mockData.firstName,
        mockData.lastName,
        mockData.email,
        mockData.password
      )
    ).rejects.toThrow('Invalid credentials');
  });
});
