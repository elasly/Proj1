import { FC, useState } from 'react';
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Strategy {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    user_id: string;
    strat_name: string;
    entryRules: unknown[] | null;
    exitRules: unknown[] | null;
    riskManagement: unknown[] | null;
  }

  export const StrategiesTable: FC = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);
    const utils = api.useUtils();

    const { data: strategies, isLoading } = api.queries.getUserStrategies.useQuery();
  
    const deleteStrategyMutation = api.queries.deleteStrategy.useMutation({
      onSuccess: async () => {
        void utils.queries.getUserStrategies.invalidate();
      },
    });

    const updateStrategyMutation = api.queries.updateStrategy.useMutation({
        onSuccess: async () => {
            void utils.queries.getUserStrategies.invalidate();
            setIsEditModalOpen(false);
        },
    });

    const columns = [
        { header: 'Name', accessorKey: 'strat_name' },
        { header: 'Last Updated', accessorKey: 'updatedAt' },
        { header: 'Description', accessorKey: 'description' },
        {
            header: 'Actions',
            cell: ({ row }) => (
                <>
                    <Button onClick={() => handleEdit(row.original)}>Edit</Button>
                    <Button onClick={() => handleBacktest(row.original)}>Backtest</Button>
                    <Button variant="destructive" onClick={() => handleDelete(row.original)}>Delete</Button>
                </>
            ),
        },
    ];

    const table = useReactTable({
        data: strategies,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleEdit = (strategy) => {
        setEditingStrategy(strategy);
        setIsEditModalOpen(true);
    };

    const handleBacktest = (strategy) => {
        console.log('Backtest strategy:', strategy);
    };

    const handleDelete = async (strategy) => {
        console.log('Delete strategy:', strategy);
        await deleteStrategyMutation.mutateAsync({ id: strategy.id });
    };

    const handleUpdateStrategy = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const updatedStrategy = Object.fromEntries(formData.entries());
        if (editingStrategy) {
            await updateStrategyMutation.mutateAsync({
                id: Number(editingStrategy.id),
                strat_name: String(updatedStrategy.strat_name),
                description: String(updatedStrategy.description),
                entryRules: JSON.parse(String(updatedStrategy.entryRules)),
                exitRules: JSON.parse(String(updatedStrategy.exitRules)),
                riskManagement: JSON.parse(String(updatedStrategy.riskManagement)),
            });
        }
    };

    if (isLoading) return <p>Loading strategies...</p>;

    return (
        <>
            <Table className='w-full'>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Strategy</DialogTitle>
                        <DialogDescription>
                  {"Edit your strategy details below." }
                </DialogDescription>
                    </DialogHeader>
                    {editingStrategy && (
                        <form onSubmit={handleUpdateStrategy}>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="strat_name">Strategy Name</Label>
                                <Input type="text" id="strat_name" name="strat_name" defaultValue={editingStrategy.strat_name} />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="description">Description</Label>
                                <Input type="text" id="description" name="description" defaultValue={editingStrategy.description} />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="entryRules">Entry Rules</Label>
                                <textarea
                                    id="entryRules"
                                    name="entryRules"
                                    defaultValue={JSON.stringify(editingStrategy.entryRules, null, 2)}
                                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="exitRules">Exit Rules</Label>
                                <textarea
                                    id="exitRules"
                                    name="exitRules"
                                    defaultValue={JSON.stringify(editingStrategy.exitRules, null, 2)}
                                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="riskManagement">Risk Management</Label>
                                <textarea
                                    id="riskManagement"
                                    name="riskManagement"
                                    defaultValue={JSON.stringify(editingStrategy.riskManagement, null, 2)}
                                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default StrategiesTable;