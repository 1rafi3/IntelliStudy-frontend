export interface RegisterDto {
  name: string;
  email: string;
  password?: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    avatar: string;
    learningGoal?: string;
    currentLevel?: string;
    learningStyle?: string;
    preferredLanguage?: string;
    weeklyStudyHours?: number;
  };
  accessToken: string;
}
