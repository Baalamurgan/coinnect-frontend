import { createFetcher, ROUTES } from 'services/api';
import {
  FetchProfilePayload,
  LoginPayload,
  Profile,
  SignupPayload
} from './types';

const login = createFetcher<string, LoginPayload>({
  url: ROUTES.AUTH.LOGIN,
  method: 'POST'
});

const signup = createFetcher<Profile, SignupPayload>({
  url: ROUTES.AUTH.SIGNUP,
  method: 'POST'
});

const fetchProfile = createFetcher<Profile, FetchProfilePayload>({
  url: ROUTES.AUTH.FETCHPROFILE,
  method: 'POST'
});

export const authService = {
  login,
  signup,
  fetchProfile
};
