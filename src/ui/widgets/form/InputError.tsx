
type InputErrorProps = React.HTMLAttributes<HTMLElement> & {
    as?: React.ElementType;
};

export function InputError({ as: Component = "div", children, ...props }: InputErrorProps) {
    return (
        <Component {...props} className={`text-sm text-error ${props.className || ""}`}>
            {children}
        </Component>
    );
}