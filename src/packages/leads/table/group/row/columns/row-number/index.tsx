'use client';

import { leadsTableRowColumnStyles as styles } from '../styles';

type LeadsTableRowNumberColumnProps = {
  index: number;
};

export const LeadsTableRowNumberColumn = (props: LeadsTableRowNumberColumnProps) => {
  const { index } = props;
  return <td className={styles.rowNumberCell}>{index + 1}</td>;
};
