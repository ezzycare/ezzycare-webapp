export type TeamMemberType = {
  id: number;
  name: string;
  email: string;
  role: string;
  lastActive: string;
  status: string;
};

export type RoleType = {
  id: number;
  name: string;
  creatorName: string;
  creatorEmail: string;
  createdAt: string;
};
