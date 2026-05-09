'use client';

import { leadsTableRowColumnStyles as styles } from '../styles';

type LeadsTableRowCheckboxColumnProps = {
  isSelected: boolean;
  onToggle: () => void;
};

export const LeadsTableRowCheckboxColumn = (
  props: LeadsTableRowCheckboxColumnProps
) => {
  const { isSelected, onToggle } = props;
  return (
    <td className={styles.checkboxCell} onClick={(e) => e.stopPropagation()}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => {
          onToggle();
        }}
        className={styles.checkbox}
        title="Select lead"
      />
    </td>
  );
};
