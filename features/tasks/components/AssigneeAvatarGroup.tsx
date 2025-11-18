import React from 'react';
import { Users } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip';
import { Badge } from '../../../components/ui/badge';
import type { TaskAssignee, AssigneeRole } from '../types';

interface AssigneeAvatarGroupProps {
  assignees: TaskAssignee[];
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
  showRoles?: boolean;
}

const sizeClasses = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
};

const roleColors: Record<AssigneeRole, string> = {
  owner: 'ring-2 ring-blue-500 ring-offset-1',
  contributor: 'ring-2 ring-green-500 ring-offset-1',
  reviewer: 'ring-2 ring-purple-500 ring-offset-1',
};

const roleLabels: Record<AssigneeRole, string> = {
  owner: 'Chủ sở hữu',
  contributor: 'Thành viên',
  reviewer: 'Kiểm duyệt',
};

export const AssigneeAvatarGroup: React.FC<AssigneeAvatarGroupProps> = ({
  assignees,
  maxVisible = 3,
  size = 'md',
  showRoles = false,
}) => {
  if (!assignees || assignees.length === 0) {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Users className="h-3 w-3" />
        <span>Chưa phân công</span>
      </div>
    );
  }

  const visibleAssignees = assignees.slice(0, maxVisible);
  const remainingCount = assignees.length - maxVisible;

  return (
    <TooltipProvider>
      <div className="flex items-center">
        {/* Avatar Stack */}
        <div className="flex -space-x-2">
          {visibleAssignees.map((assignee, index) => (
            <Tooltip key={assignee.systemId}>
              <TooltipTrigger asChild>
                <div
                  className={`
                    ${sizeClasses[size]} 
                    flex items-center justify-center 
                    rounded-full bg-gradient-to-br from-blue-400 to-blue-600 
                    font-medium text-white
                    cursor-pointer
                    transition-transform hover:scale-110 hover:z-10
                    ${showRoles ? roleColors[assignee.role] : 'ring-2 ring-white'}
                  `}
                  style={{ zIndex: visibleAssignees.length - index }}
                >
                  {assignee.employeeName.charAt(0).toUpperCase()}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-semibold">{assignee.employeeName}</p>
                  {showRoles && (
                    <p className="text-xs text-muted-foreground">
                      {roleLabels[assignee.role]}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}

          {/* Remaining Count Badge */}
          {remainingCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`
                    ${sizeClasses[size]} 
                    flex items-center justify-center 
                    rounded-full bg-muted 
                    font-medium text-muted-foreground
                    ring-2 ring-white
                    cursor-pointer
                  `}
                  style={{ zIndex: 0 }}
                >
                  +{remainingCount}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-semibold mb-1">Còn {remainingCount} người:</p>
                  {assignees.slice(maxVisible).map((assignee) => (
                    <div key={assignee.systemId} className="text-xs">
                      {assignee.employeeName}
                      {showRoles && ` (${roleLabels[assignee.role]})`}
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
