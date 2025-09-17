import { Observer } from "mobx-react-lite";
import { useRef, useEffect } from "react";
import { AdminUsersService } from "~/domain/users/services/AdminUsersService";
import { Dialog, DialogContent, DialogOverlay, DialogScaffold } from "~/ui/widgets/dialogmanager";
import UsersSelectDialogProvider, { useUsersSelectDialogStore } from "./UsersSelectDialogContex";
import { UsersSelectDialogStore } from "./UsersSelectDialogStore";
import { Input } from "~/ui/widgets/form/Input";
import { Button } from "~/ui/widgets/button/Button";
import { Pagination } from "~/ui/widgets/pagination/Pagination";
import UserItemView from "./UserItemView";

export interface UsersSelectDialogProps {
	onSelect?: (id: number) => void;
}

function DialogInner({ onSelect }: { onSelect?: (id: number) => void }) {
	const store = useUsersSelectDialogStore();

	useEffect(() => {
		store.loadUsers({ page: 1 });
	}, [store]);

	return (
		<Dialog onClose={() => { }}>
			<DialogOverlay />
			<DialogScaffold className="p-4">
				<DialogContent className="w-full max-w-3xl max-h-[600px]">
					<div className="flex items-center justify-between mb-3">
						<Input placeholder="Search users by name, email or mobile" type="search" onChange={(e) => store.setSearchText(e.target.value)} />
						<Button variant="solid" color="primary">Select</Button>
					</div>

					<div className="overflow-auto">
						<Observer>
							{() => {
								return store.loadState.stateWhen({
									initOrLoading: () => <div className="p-6">Loading...</div>,
									error: () => <div className="p-6 text-red-500">{store.loadState.error?.message}</div>,
									loaded: () => {
										const items = store.loadState.data!.items;
										return (
											<div className="flex flex-col gap-1">
												{items.map((it) => (
													<div key={it.base.id} onClick={() => { store.setSelected(it); onSelect?.(it.base.id); }}>
														<UserItemView item={it} selected={store.selectedUser?.base.id === it.base.id} />
													</div>
												))}
											</div>
										);
									},
								});
							}}
						</Observer>
					</div>

					<div className="mt-3 flex justify-end">
						<Observer>
							{() => store.loadState.stateWhen({
								loaded: () => {
									const pi = store.loadState.data!.pageInfo;
									return (
										<Pagination
											currentPage={pi.page}
											totalPages={pi.totalPages}
											onNext={() => store.onPageChanged(pi.page + 1)}
											onPrev={() => store.onPageChanged(pi.page - 1)}
											onFirst={() => store.onPageChanged(1)}
											onLast={() => store.onPageChanged(pi.totalPages)}
										/>
									);
								},
								initOrLoading: () => null,
								error: () => null,
							})}
						</Observer>
					</div>
				</DialogContent>
			</DialogScaffold>
		</Dialog>
	);
}

export default function UsersSelectDialog(props: UsersSelectDialogProps) {
	const storeRef = useRef<UsersSelectDialogStore | null>(null);
	if (!storeRef.current) {
		storeRef.current = new UsersSelectDialogStore({ usersService: new AdminUsersService() });
	}
	return (
		<UsersSelectDialogProvider store={storeRef.current}>
			<DialogInner onSelect={props.onSelect} />
		</UsersSelectDialogProvider>
	);
}
