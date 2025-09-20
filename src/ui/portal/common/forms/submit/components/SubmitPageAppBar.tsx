import type { ReactNode } from "react";
import { EasyBrandAppBar } from "~/ui/portal/components/appbar/EasyBrandAppBar";

type SubmitPageAppBarProps = {
  leading?: ReactNode;
  trailing?: ReactNode;
};

export function SubmitPageAppBar({ leading, trailing }: SubmitPageAppBarProps) {
  return (
    <EasyBrandAppBar
      leading={leading}
      trailing={trailing}
    />
  );
}
