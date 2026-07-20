export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  provider: string;
  learningGoal: string;
  currentLevel: string;
  learningStyle: string;
  preferredLanguage: string;
  weeklyStudyHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  name?: string;
  avatar?: string;
  learningGoal?: string;
  currentLevel?: string;
  learningStyle?: string;
  preferredLanguage?: string;
  weeklyStudyHours?: number;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
