import { TaskType, TaskStatus } from '../types/Task';

export const getTaskTypeLabel = (type: TaskType): string => {
  switch (type) {
    case 'STAGE':
      return 'Stage';
    case 'STAGE_QC':
      return 'Stage QC';
    case 'GRN_QC':
      return 'GRN QC';
    case 'UNPACKING':
      return 'Unpacking';
    case 'PUTAWAY':
      return 'Putaway';
    case 'PACKING_QC':
      return 'Packing QC';
    case 'PREDISPATCH_QC':
      return 'Pre-Dispatch QC';
    default:
      return type;
  }
};

export const getStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case 'PENDING':
      return 'Pending';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'COMPLETED':
      return 'Completed';
    case 'HOLD':
      return 'Hold';
    default:
      return status;
  }
};

export const getActionButtonLabel = (status: TaskStatus): string => {
  switch (status) {
    case 'PENDING':
      return 'Start';
    case 'IN_PROGRESS':
      return 'Open';
    case 'COMPLETED':
      return 'View';
    case 'HOLD':
      return 'Open';
    default:
      return 'Open';
  }
};

export const getTaskTypeColor = (type: TaskType): string => {
  switch (type) {
    case 'STAGE':
      return '#3B82F6'; // blue
    case 'STAGE_QC':
      return '#8B5CF6'; // purple
    case 'GRN_QC':
      return '#EC4899'; // pink
    case 'UNPACKING':
      return '#F59E0B'; // amber
    case 'PUTAWAY':
      return '#10B981'; // green
    case 'PACKING_QC':
      return '#6366F1'; // indigo
    case 'PREDISPATCH_QC':
      return '#EF4444'; // red
    default:
      return '#6B7280'; // gray
  }
};

export const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case 'PENDING':
      return '#F59E0B'; // amber
    case 'IN_PROGRESS':
      return '#3B82F6'; // blue
    case 'COMPLETED':
      return '#10B981'; // green
    case 'HOLD':
      return '#EF4444'; // red
    default:
      return '#6B7280'; // gray
  }
};

