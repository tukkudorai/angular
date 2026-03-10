export interface UserRegistrationDto {
  firstName: string;
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  userId: string;
  username: string;
}

export interface UserProfileDto {
  userId: string;
  username: string;
  displayName: string;
  bio?: string;
  location?: string;
  website?: string;
  profilePictureUrl?: string;
}