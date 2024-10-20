import React, { createContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Email, EmailBody, EmailListResponse } from '../types';
import { getEmails, getEmailBody } from '../services/api';

interface EmailContextType {
  emails: Email[];
  selectedEmail: EmailBody | null;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  filter: 'all' | 'read' | 'unread' | 'favorites';
  setFilter: (filter: 'all' | 'read' | 'unread' | 'favorites') => void;
  selectEmail: (id: string) => Promise<void>;
  markAsFavorite: (id: string) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

export const EmailContext = createContext<EmailContextType | undefined>(undefined);

interface EmailsState {
  list: Email[];
  page: number;
  totalPages: number;
}

export const EmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emailsState, setEmailsState] = useState<EmailsState>({
    list: [],
    page: 1,
    totalPages: 1,
  });
  const [selectedEmail, setSelectedEmail] = useState<EmailBody | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread' | 'favorites'>('all');

  // Internal cache
  const cachedPages = useRef<Record<number, Email[]>>({});
  const isInitialMount = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const emailCache = useRef<Map<string, EmailBody>>(new Map());

  const persistedDataRef = useRef<{ favorites: string[], readEmails: string[] }>({ favorites: [], readEmails: [] });
  
  const fetchEmails = useCallback(async (pageNum: number): Promise<EmailListResponse> => {
    setLoading(true);
    try {
      const response = await getEmails(pageNum);
      setError(null);
      return response;
    } catch (err) {
      setError('Failed to fetch emails');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  
    const updateLocalStorage = useCallback((key: 'favoriteEmails' | 'readEmails', value: string[]) => {
      localStorage.setItem(key, JSON.stringify(value));
    }, []);
  
  const memoizedUpdateLocalStorage = useMemo(() => {
    const debouncedUpdate = debounce(updateLocalStorage, 300);
    return (key: 'favoriteEmails' | 'readEmails', value: string[]) => {
      persistedDataRef.current[key === 'favoriteEmails' ? 'favorites' : 'readEmails'] = value;
      debouncedUpdate(key, value);
    };
  }, [updateLocalStorage]);



  const loadEmailsForPage = useCallback(async (pageNum: number) => {
    if (loading || pageNum < 1 || pageNum > emailsState.totalPages) return;

    setLoading(true);

    try {
      let newEmails: Email[];
      let totalPages: number;
      if (cachedPages.current[pageNum]) {
        newEmails = cachedPages.current[pageNum];
        totalPages = emailsState.totalPages;

      } else {
        const response = await fetchEmails(pageNum);
        newEmails = response.list;
        totalPages = Math.ceil(response.total / 10);
        cachedPages.current[pageNum] = newEmails;
      }

      const favorites = JSON.parse(localStorage.getItem('favoriteEmails') || '[]');
      const readEmails = JSON.parse(localStorage.getItem('readEmails') || '[]');

      const updatedNewEmails = newEmails.map(email => ({
        ...email,
        favorite: favorites.includes(email.id),
        read: readEmails.includes(email.id)
      }));

      setEmailsState(prevState => {
        const startIndex = (pageNum - 1) * 10;
        // const endIndex = startIndex + 10;
        const newList = [...prevState.list];
        newList.splice(startIndex, 10, ...updatedNewEmails);
        return {
          list: newList,
          page: pageNum,
          totalPages: totalPages,
        };
      });

      // Update persistedDataRef
      persistedDataRef.current = { favorites, readEmails };
    } catch (err) {
      console.error('Error loading emails:', err);
      setError('Failed to load emails');
    } finally {
      setLoading(false);
    }
  }, [loading, emailsState.totalPages, fetchEmails]);



  const goToNextPage = useCallback(() => {
    if (emailsState.page < emailsState.totalPages) {
      loadEmailsForPage(emailsState.page + 1);
    }
  }, [emailsState.page, emailsState.totalPages, loadEmailsForPage]);

  const goToPreviousPage = useCallback(() => {
    if (emailsState.page > 1) {
      loadEmailsForPage(emailsState.page - 1);
    }
  }, [emailsState.page, loadEmailsForPage]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      loadEmailsForPage(1);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadEmailsForPage]);

  const selectEmail = useCallback(async (id: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      let emailBody: EmailBody;
      if (emailCache.current.has(id)) {
        emailBody = emailCache.current.get(id)!;
      } else {
        const body = await getEmailBody(id);
        const email = emailsState.list.find(e => e.id === id);
        if (email) {
          emailBody = { ...email, body: body.body };
          emailCache.current.set(id, emailBody);
        } else {
          throw new Error('Email not found');
        }
      }
      setSelectedEmail(emailBody);
      setEmailsState(prev => {
        const updatedList = prev.list.map(e => e.id === id ? { ...e, read: true } : e);
        persistedDataRef.current.readEmails = updatedList.filter(e => e.read).map(e => e.id);
        memoizedUpdateLocalStorage('readEmails', persistedDataRef.current.readEmails);
        return { ...prev, list: updatedList };
      });
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError('Failed to fetch email body');
      }
    } finally {
      setLoading(false);
    }
  }, [emailsState.list, memoizedUpdateLocalStorage]);

  

  const markAsFavorite = useCallback((id: string) => {
    setEmailsState(prev => {
      const updatedList = prev.list.map(e => e.id === id ? { ...e, favorite: !e.favorite } : e);
      persistedDataRef.current.favorites = updatedList.filter(e => e.favorite).map(e => e.id);
      memoizedUpdateLocalStorage('favoriteEmails', persistedDataRef.current.favorites);
      return { ...prev, list: updatedList };
    });
    setSelectedEmail(prev => prev && prev.id === id ? { ...prev, favorite: !prev.favorite } : prev);
    if (emailCache.current.has(id)) {
      const cachedEmail = emailCache.current.get(id)!;
      emailCache.current.set(id, { ...cachedEmail, favorite: !cachedEmail.favorite });
    }
  }, [memoizedUpdateLocalStorage]);

  
  const contextValue = useMemo(() => {
    const startIndex = (emailsState.page - 1) * 10;
    const endIndex = startIndex + 10;
    const currentPageEmails = emailsState.list.slice(startIndex, endIndex);

    return {
      emails: currentPageEmails,
      selectedEmail,
      loading,
      error,
      page: emailsState.page,
      totalPages: emailsState.totalPages,
      filter,
      setFilter,
      selectEmail,
      markAsFavorite,
      goToNextPage,
      goToPreviousPage,
    };
  }, [emailsState, selectedEmail, loading, error, filter, selectEmail, markAsFavorite, goToNextPage, goToPreviousPage]);

  return (
    <EmailContext.Provider value={contextValue}>
      {children}
    </EmailContext.Provider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(func: T, timeout = 300): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | undefined;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { func(...args); }, timeout);
  };
}
