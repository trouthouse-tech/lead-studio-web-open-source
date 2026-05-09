'use client';

type LeadsFiltersCategoryMenuOptionProps = {
  name: string;
  checked: boolean;
  onToggle: () => void;
};

export const LeadsFiltersCategoryMenuOption = (
  props: LeadsFiltersCategoryMenuOptionProps
) => {
  const { name, checked, onToggle } = props;

  return (
    <label
      className={styles.option}
      onMouseDown={(e) => e.preventDefault()}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle()}
        className={styles.checkbox}
      />
      <span>{name}</span>
    </label>
  );
};

const styles = {
  option: `
    flex items-center gap-2 px-2 py-1.5 text-sm text-gray-800 cursor-pointer
    hover:bg-gray-50
  `,
  checkbox: `cursor-pointer shrink-0`,
};
