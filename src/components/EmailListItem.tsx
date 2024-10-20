import React from 'react';
import { Email } from '../types';
import { formatDate } from '../utils/formatDate';
import styles from './styles/EmailListItem.module.css';

interface EmailListItemProps {
  email: Email;
  onClick: () => void;
  isActive: boolean;
}

const EmailListItem: React.FC<EmailListItemProps> = ({ email, onClick, isActive }) => {
  return (
    <div
      className={`${styles.emailListItem} 
                  ${isActive ? styles.active : ''}
                  ${email.read ? styles.read : ''} 
                  ${email.favorite ? styles.favorite : ''}`}
      onClick={onClick}
    >
      <div className={styles.avatar}>{email.from.name[0].toUpperCase()}</div>
      <div className={styles.content}>
        <h3>{email.from.name} &lt;{email.from.email}&gt;</h3>
        <p>{email.subject}</p>
        <p>{email.short_description}</p>
        <span className={styles.date}>{formatDate(email.date)}</span>
      </div>
      {email.favorite && <span className={styles.favoriteIcon}>★</span>}
    </div>
  );
};

export default EmailListItem;
