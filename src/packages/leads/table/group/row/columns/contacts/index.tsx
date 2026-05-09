'use client';

import { leadsTableRowColumnStyles as styles } from '../styles';

type LeadsTableRowContactsColumnProps = {
  contactCount: number;
};

export const LeadsTableRowContactsColumn = (
  props: LeadsTableRowContactsColumnProps
) => {
  const { contactCount } = props;
  return (
    <td className={styles.tableCellCenter}>
      <span
        className={contactCount > 0 ? styles.contactCount : styles.emptyValue}
      >
        {contactCount > 0 ? contactCount : '—'}
      </span>
    </td>
  );
};
