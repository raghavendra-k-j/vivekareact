import * as React from "react";
import Select, { components as RS, GroupBase } from "react-select";
import type { Props as RSProps } from "react-select";

type Option = { label: string; value: string };

type ComboInMenuProps = RSProps<Option, false, GroupBase<Option>> & {
  inputSize?: "sm" | "md";
};

export function ComboBoxInMenu({
  options = [],
  inputSize = "md",
  classNamePrefix = "combo",
  isSearchable = false,     // force off
  ...props
}: ComboInMenuProps) {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(o => o.label.toLowerCase().includes(q));
  }, [options, query]);

  // Custom Menu with a search input at the top
  const Menu = (menuProps: any) => (
    <RS.Menu {...menuProps}>
      <div className={`${classNamePrefix}__menu`}>
        <div className={`${classNamePrefix}__menu-search`}>
          <input
            className={`${classNamePrefix}__menu-search-input`}
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            // optional: stop propagation so react-select doesn't intercept keys
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        <RS.MenuList {...menuProps}>
          {menuProps.children}
        </RS.MenuList>
      </div>
    </RS.Menu>
  );

  return (
    <div className={`combo combo--${inputSize}`}>
      <Select
        isSearchable={false}
        classNamePrefix={classNamePrefix}
        components={{ Menu }}
        options={filtered}
        menuIsOpen={props.menuIsOpen}
        {...props}
      />
    </div>
  );
}
