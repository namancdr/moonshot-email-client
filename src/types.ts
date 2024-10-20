export interface Email {
  id: string;
  from: {
    email: string;
    name: string;
  };
  date: number;
  subject: string;
  short_description: string;
  read: boolean;
  favorite: boolean;
}

export interface EmailBody extends Email {
  body: string;
}

export interface EmailListResponse {
  list: Email[];
  total: number;
}

export interface EmailBodyResponse {
  id: string;
  body: string;
}
