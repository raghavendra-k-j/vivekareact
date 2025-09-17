import clsx from "clsx";
import { AdminUserListItem } from "~/domain/users/models/AdminUserListItem";
import { UserAvatar } from "~/ui/portal/components/avatar/UserAvatar";
import { Badge } from "~/ui/widgets/badges/Badge";
import { DateFmt } from "~/core/utils/DateFmt";

export default function UserItemView({ item, selected = false }: { item: AdminUserListItem; selected?: boolean }) {
	return (
		<div className={clsx("flex items-center gap-3 p-2 hover:bg-content2 rounded", selected && "bg-content2") }>
			<UserAvatar id={item.base.id} name={item.base.name} sizeClass="w-8 h-8" />
			<div className="min-w-0">
				<div className="flex items-center gap-2">
					<div className="font-medium text-default truncate">{item.base.name}</div>
					<div className="text-[12px] text-secondary truncate">{item.base.userName ?? ""}</div>
				</div>
				<div className="text-[12px] text-secondary flex items-center gap-2">
					<div className="truncate">{item.base.email}</div>
					<div>•</div>
					<div>{item.base.mobile ?? "-"}</div>
				</div>
			</div>
			<div className="ml-auto flex items-center gap-2">
				<Badge variant="soft" color="secondary" size="xs">{item.role.name}</Badge>
				<div className="text-[12px] text-secondary">{DateFmt.date(item.createdAt)}</div>
			</div>
		</div>
	);
}
