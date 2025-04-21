export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  onboardingStatus: 'Not Started' | 'Pending' | 'Approved' | 'Rejected';
  onboardingFeedback?: string;
  userId?: {
    _id: string;
    email: string;
  };
}
