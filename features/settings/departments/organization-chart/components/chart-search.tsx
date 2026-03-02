/**
 * Chart Search Component
 * Search and filter employees in org chart
 */

import * as React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../../../../components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../../../../components/ui/select';
import { Card, CardContent } from '../../../../../components/ui/card';
import type { Employee } from '../../../../employees/types';
import type { Department } from '../../types';
import { simpleSearch } from '../../../../../lib/simple-search';

interface ChartSearchProps {
  employees: Employee[];
  departments: Department[];
  departmentFilter: string;
  onDepartmentFilterChange: (value: string) => void;
  onEmployeeSelect: (employee: Employee) => void;
}

export function ChartSearch({
  employees,
  departments,
  departmentFilter,
  onDepartmentFilterChange,
  onEmployeeSelect
}: ChartSearchProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  // Filter active employees
  const activeEmployees = React.useMemo(
    () => employees.filter(e => 
      e.employmentStatus === 'Đang làm việc' ||
      !e.employmentStatus
    ),
    [employees]
  );

  const searchResults = React.useMemo(() => {
    if (!searchQuery) return [];
    // Use simple search instead of Fuse.js
    return simpleSearch(activeEmployees, searchQuery, {
      keys: ['fullName', 'id', 'jobTitle', 'department'],
    }).slice(0, 10);
  }, [searchQuery, activeEmployees]);

  const handleSelect = (employee: Employee) => {
    onEmployeeSelect(employee);
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {/* Search input */}
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm nhân viên..."
            className="pl-9 shadow-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Department filter */}
        <Select value={departmentFilter} onValueChange={onDepartmentFilterChange}>
          <SelectTrigger className="w-[200px] shadow-md h-9">
            <SelectValue placeholder="Lọc phòng ban..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả phòng ban</SelectItem>
            {departments.map(dep => (
              <SelectItem key={dep.systemId} value={dep.name}>
                {dep.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search results dropdown */}
      {searchQuery && (
        <Card className="max-h-80 overflow-y-auto w-72">
          <CardContent className="p-2">
            {searchResults.length > 0 ? (
              searchResults.map(employee => (
                <div
                  key={employee.systemId}
                  className="p-2 hover:bg-accent rounded-md cursor-pointer transition-colors"
                  onClick={() => handleSelect(employee)}
                >
                  <p className="font-medium text-sm">{employee.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {employee.jobTitle} - {employee.department}
                  </p>
                </div>
              ))
            ) : (
              <p className="p-2 text-center text-sm text-muted-foreground">
                Không tìm thấy kết quả.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
