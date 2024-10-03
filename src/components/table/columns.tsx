"use client"
 
import type { ColumnDef } from "@tanstack/react-table"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import  { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader"
import { Checkbox } from "@/components/ui/checkbox"


export type Strategy = {
    id: string
    name: number
    description: string
    user_id: string
    createdAt: Date
    updatedAt: Date | null
  }
    

    export const columns: ColumnDef<Strategy>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        },
        {
          accessorKey: "id",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="#" />
          ),
          
          
        },
        {
          accessorKey: "strat_name",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
          ),
        },
        {
          accessorKey: "description",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description" />
          ),
        },
        {
          accessorKey: "createdAt",
          //header: () => <div className="text-right">Created At</div>,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Create Date" />
          ),
        },
        {
          accessorKey: "updatedAt",
          //header: () => <div className="text-right">Updated At</div>,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last Update" />
          ),
        },
        {
           id: "actions",
          header: () => <div className="text-right">Actions</div>,
           cell: ({ row }) => {
            const value = parseFloat(row.getValue("id"))
            const formatted = new Intl.NumberFormat("en-US", {compactDisplay: "short", notation: "compact",
            }).format(value)

                       
                return (
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only"></span>
                        <div className="text-right font-medium">{formatted}</div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(value)}
                      >
                        Copy Strategy ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View customer</DropdownMenuItem>
                      <DropdownMenuItem>View Strategy details</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
            
       
            // return <div className="text-right font-medium">{formatted}</div>
          },

        },
        

      ]