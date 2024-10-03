"Use Client";
import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { stratOptions } from "./getStrats";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export function StratTable() {
  const { data } = useSuspenseQuery(stratOptions);

  return (
    <div>
        <DataTable columns={columns} data={data} />
    </div>
  );
}
