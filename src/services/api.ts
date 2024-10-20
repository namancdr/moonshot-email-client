import { EmailListResponse, EmailBodyResponse } from '../types';

const API_BASE_URL = 'https://flipkart-email-mock.now.sh';

export const getEmails = async (page: number = 1): Promise<EmailListResponse> => {
  const response = await fetch(`${API_BASE_URL}/emails?page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch emails');
  }
  return response.json();
};

export const getEmailBody = async (id: string): Promise<EmailBodyResponse> => {
  const response = await fetch(`${API_BASE_URL}?id=${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch email body');
  }
  return response.json();
};

