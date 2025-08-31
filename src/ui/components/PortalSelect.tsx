import RS, { Props as RSProps } from "react-select";

export function PortalSelect<Option, IsMulti extends boolean = false>(
  props: RSProps<Option, IsMulti>
) {
  const portalTarget =
    typeof document !== "undefined" ? document.body : undefined;

  return (
    <RS
      {...props}
      menuPortalTarget={portalTarget}
      menuPosition="fixed"
      styles={{
        ...props.styles,
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        menu: (base) => ({ ...base, zIndex: 9999 }),
      }}
      menuShouldScrollIntoView={false}
    />
  );
}
