import { createFetcher, ROUTES } from '@/services/api';
import {
  FetchProfileByEmailPayload,
  FetchProfilePayload,
  LoginPayload,
  Profile,
  SignupPayload,
  UpdateProfilePayload
} from './types';

const login = createFetcher<Profile, LoginPayload>({
  url: ROUTES.AUTH.LOGIN,
  method: 'POST'
});

const signup = createFetcher<Profile, SignupPayload>({
  url: ROUTES.AUTH.SIGNUP,
  method: 'POST'
});

const fetchProfile = createFetcher<Profile, FetchProfilePayload>({
  url: ROUTES.AUTH.PROFILE.FETCH,
  method: 'POST'
});

const fetchProfileByEmail = createFetcher<Profile, FetchProfileByEmailPayload>({
  url: ROUTES.AUTH.PROFILE.FETCHBYEMAIL,
  method: 'POST'
});

const updateProfile = createFetcher<
  Profile,
  UpdateProfilePayload,
  {
    user_id: string;
  }
>({
  url: ({ user_id }: { user_id: string }) =>
    ROUTES.AUTH.PROFILE.UPDATE({ user_id }),
  method: 'PUT'
});

export const authService = {
  login,
  signup,
  fetchProfileByEmail,
  fetchProfile,
  updateProfile
};
