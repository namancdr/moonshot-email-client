import React, { useContext } from 'react';
import { EmailContext } from '../context/EmailContext';
import EmailListItem from './EmailListItem';
import styles from './styles/EmailList.module.css';
import { useEmail } from '../hooks/use-email';
import Pagination from './Pagination';

const EmailList: React.FC = () => {
  const { emails, loading, page, totalPages, selectEmail, goToPreviousPage, goToNextPage } = useContext(EmailContext)!;
  const { filter } = useEmail();

  const filteredEmails = React.useMemo(() => {
    return emails.filter(email => {
      if (filter === 'all') return true;
      if (filter === 'read') return email.read === true;
      if (filter === 'unread') return !email.read; 
      if (filter === 'favorites') return email.favorite === true;
      return true;
    });
  }, [emails, filter]);

  return (
    <div className={styles.emailList}>
      {filteredEmails.map((email) => (
        <EmailListItem key={email.id} email={email} onClick={() => selectEmail(email.id)} isActive={false} />
      ))}
      {loading && <div className={styles.loading}>Loading...</div>}

      {filter === 'all' && (
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPrevPage={goToPreviousPage} 
          onNextPage={goToNextPage}
        />
      )}
    </div>
  );
};

export default EmailList;
