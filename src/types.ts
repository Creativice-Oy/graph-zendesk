export interface User {
  active?: boolean;
  chat_only?: boolean;
  created_at?: string;
  default_group_id?: string;
  email?: string;
  iana_time_zone?: string;
  id?: string;
  locale?: string;
  locale_id?: number;
  moderator?: boolean;
  name: string;
  notes?: string;
  organization_id?: number;
  phone?: string;
  photo?: {
    content_url?: string;
  };
  restricted_agent?: boolean;
  role?: string;
  shared?: boolean;
  suspended?: boolean;
  time_zone?: string;
  updated_at?: string;
  url?: string;
  verified?: boolean;
}

export interface Group {
  created_at?: string;
  default?: boolean;
  deleted?: boolean;
  description?: string;
  id?: number;
  name: string;
  updated_at?: string;
  url?: string;
}

export interface Organization {
  created_at?: string;
  details?: string;
  domain_names?: string[];
  group_id?: number;
  id?: number;
  name?: string;
  notes?: string;
  shared_comments?: boolean;
  shared_tickets?: boolean;
  updated_at?: string;
  url?: string;
}

export interface Ticket {
  assignee_email?: string;
  assignee_id?: number;
  brand_id?: number;
  collaborator_ids?: string[];
  created_at?: string;
  description?: string;
  due_at?: string;
  email_cc_ids?: string[];
  follower_ids?: string[];
  forum_topic_id?: string;
  group_id?: string;
  has_incidents?: boolean;
  id?: number;
  name?: string;
  organization_id?: number;
  priority?: 'urgent' | 'high' | 'normal' | 'low';
  problem_id?: number;
  recipient?: string;
  requested_id?: number;
  status?: 'new' | 'open' | 'pending' | 'hold' | 'solved' | 'closed';
  subject?: string;
  submitter_id?: number;
  requester_id?: number;
  type?: 'problem' | 'incident' | 'question' | 'task';
  url?: string;
}
