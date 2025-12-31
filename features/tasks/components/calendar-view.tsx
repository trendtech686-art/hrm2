'use client';

import * as React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import type { EventClickArg, EventDropArg } from '@fullcalendar/core';
import type { EventResizeDoneArg } from '@fullcalendar/interaction';
import type { EventContentArg } from '@fullcalendar/core';
import { useTaskStore } from '../store';
import type { Task, TaskPriority } from '../types';
import { usePageHeader } from '@/contexts/page-header-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export function TaskCalendarView() {
  usePageHeader();
  const { data: tasks, update } = useTaskStore();
  const router = useRouter();
  const calendarRef = React.useRef<FullCalendar>(null);

  const getPriorityColor = (priority: TaskPriority): string => {
    const colors = {
      'Thấp': '#6B7280',        // gray
      'Trung bình': '#3B82F6',  // blue
      'Cao': '#F59E0B',         // orange
      'Khẩn cấp': '#EF4444',    // red
    };
    return colors[priority];
  };

  const getStatusColor = (status: Task['status']): string => {
    const colors = {
      'Chưa bắt đầu': '#9CA3AF',
      'Đang thực hiện': '#F59E0B',
      'Đang chờ': '#8B5CF6',
      'Hoàn thành': '#10B981',
      'Đã hủy': '#6B7280',
    };
    return colors[status];
  };

  // Convert tasks to calendar events
  const events = React.useMemo(() => {
    return tasks.map(task => ({
      id: task.systemId,
      title: task.title,
      start: task.startDate,
      end: task.dueDate,
      backgroundColor: getPriorityColor(task.priority),
      borderColor: getStatusColor(task.status),
      extendedProps: {
        task: task,
        assigneeName: task.assigneeName,
        progress: task.progress,
        priority: task.priority,
        status: task.status,
      },
      editable: task.status !== 'Hoàn thành' && task.status !== 'Đã hủy',
    }));
  }, [tasks]);

  // Handle event click - navigate to detail
  const handleEventClick = (info: EventClickArg) => {
    const task = info.event.extendedProps.task as Task;
    router.push(`/tasks/${task.systemId}`);
  };

  // Handle event drag & drop - update dates
  const handleEventDrop = (info: EventDropArg) => {
    const task = info.event.extendedProps.task as Task;
    const newStart = info.event.start?.toISOString().split('T')[0];
    const newEnd = info.event.end?.toISOString().split('T')[0] || newStart;

    update(task.systemId, {
      ...task,
      startDate: newStart!,
      dueDate: newEnd,
    });

    toast.success("Đã cập nhật ngày", {
      description: `${task.title} - Từ ${newStart} đến ${newEnd}`,
    });
  };

  // Handle event resize - update due date
  const handleEventResize = (info: EventResizeDoneArg) => {
    const task = info.event.extendedProps.task as Task;
    const newEnd = info.event.end?.toISOString().split('T')[0];

    if (newEnd) {
      update(task.systemId, {
        ...task,
        dueDate: newEnd,
      });

      toast.success("Đã cập nhật deadline", {
        description: `${task.title} - Deadline mới: ${newEnd}`,
      });
    }
  };

  // Custom event render
  const renderEventContent = (eventInfo: EventContentArg) => {
    const progress = eventInfo.event.extendedProps.progress || 0;
    const assigneeName = eventInfo.event.extendedProps.assigneeName;
    
    return (
      <div className="fc-event-main-frame">
        <div className="fc-event-time">{eventInfo.timeText}</div>
        <div className="fc-event-title-container">
          <div className="fc-event-title fc-sticky">
            {eventInfo.event.title}
          </div>
          {eventInfo.view.type === 'dayGridMonth' && (
            <div className="text-xs opacity-80 mt-1">
              {assigneeName} • {progress}%
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button onClick={() => router.push('/tasks')} size="sm" variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Về danh sách
        </Button>
        <Button onClick={() => router.push('/tasks/new')} size="sm">
          Tạo công việc mới
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <style>{`
            .fc {
              --fc-border-color: var(--border);
              --fc-button-bg-color: var(--primary);
              --fc-button-border-color: var(--primary);
              --fc-button-hover-bg-color: color-mix(in oklch, var(--primary), transparent 10%);
              --fc-button-hover-border-color: color-mix(in oklch, var(--primary), transparent 10%);
              --fc-button-active-bg-color: color-mix(in oklch, var(--primary), transparent 20%);
              --fc-button-active-border-color: color-mix(in oklch, var(--primary), transparent 20%);
              --fc-today-bg-color: var(--accent);
            }
            .fc .fc-button {
              text-transform: none;
              font-size: 0.875rem;
              padding: 0.375rem 0.75rem;
            }
            .fc .fc-toolbar-title {
              font-size: 1.25rem;
              font-weight: 600;
            }
            .fc-event {
              cursor: pointer;
              border-width: 2px !important;
              border-left-width: 4px !important;
              padding: 2px 4px;
            }
            .fc-event:hover {
              opacity: 0.85;
            }
            .fc-daygrid-event {
              white-space: normal !important;
            }
            .fc-event-title {
              font-weight: 500;
            }
          `}</style>
          
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            buttonText={{
              today: 'Hôm nay',
              month: 'Tháng',
              week: 'Tuần',
              day: 'Ngày',
              list: 'Danh sách'
            }}
            locale="vi"
            firstDay={1} // Monday
            height="auto"
            events={events}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            eventContent={renderEventContent}
            editable={true}
            droppable={true}
            dayMaxEvents={3}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            allDayText="Cả ngày"
            noEventsText="Không có công việc"
            moreLinkText={(num) => `+${num} công việc`}
            nowIndicator={true}
          />
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="text-sm font-semibold mb-2">Chú thích:</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#6B7280' }}></div>
              <span>Độ ưu tiên Thấp</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3B82F6' }}></div>
              <span>Độ ưu tiên Trung bình</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F59E0B' }}></div>
              <span>Độ ưu tiên Cao</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#EF4444' }}></div>
              <span>Độ ưu tiên Khẩn cấp</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            💡 Kéo thả để thay đổi ngày, kéo góc để thay đổi deadline. Viền trái thể hiện trạng thái.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
