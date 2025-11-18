import * as React from 'react';
import { DataTableActions } from './data-table-actions.tsx';
import { DataTableToolbar } from './data-table-toolbar.tsx';
import type { ColumnDef } from './types.ts';

interface ExampleProps {
  // This is just an example component to demonstrate usage
}

export function ExampleUsage<TData extends { id: string }>() {
  // Example state for the data table
  const [data, setData] = React.useState<TData[]>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['id']);
  const [search, setSearch] = React.useState('');
  
  // Example columns definition
  const columns = React.useMemo<ColumnDef<TData>[]>(
    () => [
      // Your column definitions here
    ],
    []
  );
  
  // Example filtered data based on search
  const filteredData = React.useMemo(() => {
    return data;
  }, [data, search]);
  
  // Example page data
  const pageData = filteredData.slice(0, 10);
  
  // Example export configuration
  const exportConfig = {
    fileName: 'exported-data',
    columns: columns,
  };
  
  // Example import configuration
  const importConfig = {
    fileName: 'data-template',
    importer: (importedData: Omit<TData, 'id'>[]) => {
      // Handle importing data
      console.log('Importing data:', importedData);
    }
  };
  
  return (
    <div className="space-y-4">
      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm kiếm..."
        numResults={filteredData.length}
      >
        <DataTableActions
          allData={data}
          filteredData={filteredData}
          pageData={pageData}
          exportConfig={exportConfig}
          importConfig={importConfig}
          columnCustomizerProps={{
            columns,
            columnVisibility,
            setColumnVisibility,
            columnOrder,
            setColumnOrder,
            pinnedColumns,
            setPinnedColumns,
          }}
        />
      </DataTableToolbar>
      
      {/* Rest of your data table goes here */}
    </div>
  );
}
