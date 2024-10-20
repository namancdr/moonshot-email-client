import React, { useContext } from 'react';
import { EmailContext } from '../context/EmailContext';
import { EmailBody as EmailBodyType } from '../types';
import styles from './styles/EmailBody.module.css';

interface EmailBodyProps {
  email: EmailBodyType;
}

const EmailBody: React.FC<EmailBodyProps> = ({ email }) => {
  const { markAsFavorite } = useContext(EmailContext)!;

  return (
    <div className={styles.emailBody}>
      <div className={styles.emailHeader}>
        <h2>{email.subject}</h2>
        <button className={styles.favoriteButton} onClick={() => markAsFavorite(email.id)}>
          {email.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </div>
      <div className={styles.emailMetadata}>
        <span>From: {email.from.name} ({email.from.email})</span>
        <span>Date: {new Date(email.date).toLocaleString()}</span>
      </div>
      <div className={styles.emailContent} dangerouslySetInnerHTML={{ __html: email.body }} />
    </div>
  );
};

export default EmailBody;
