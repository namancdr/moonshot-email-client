import React from 'react';
import { useParams } from 'react-router-dom';
import FilterBar from './FilterBar';
import EmailList from './EmailList';
import EmailBody from './EmailBody';
import { useEmail } from '../hooks/use-email';

const EmailClientContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedEmail, selectEmail } = useEmail();

  React.useEffect(() => {
    if (id && id !== selectedEmail?.id) {
      selectEmail(id);
    }
  }, [id, selectedEmail, selectEmail]);

  return (
    <div className="email-client-container">
      <FilterBar />
      <div className="email-content">
        <EmailList />
        {selectedEmail && <EmailBody email={selectedEmail} />}
      </div>
    </div>
  );
};

export default EmailClientContainer;
