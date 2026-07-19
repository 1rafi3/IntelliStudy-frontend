export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  createdAt: string;
}

export interface UpdateProfileDto {
  name?: string;
  avatar?: string;
}
