import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../types/Task';
import {
  getTaskTypeLabel,
  getStatusLabel,
  getActionButtonLabel,
  getTaskTypeColor,
  getStatusColor,
} from '../utils/taskUtils';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* First Row: Type Tag and Status Badge */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.typeTag,
            { backgroundColor: getTaskTypeColor(task.type) },
          ]}
        >
          <Text style={styles.typeText}>{getTaskTypeLabel(task.type)}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(task.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusLabel(task.status)}</Text>
        </View>
      </View>

      {/* Second Row: Main Label */}
      <Text style={styles.mainLabel}>{task.mainLabel}</Text>

      {/* Third Row: Sub Label (if present) */}
      {task.subLabel && (
        <Text style={styles.subLabel}>{task.subLabel}</Text>
      )}

      {/* Fourth Row: Created Date */}
      <Text style={styles.createdDate}>Created: {task.createdAt}</Text>

      {/* Action Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>
            {getActionButtonLabel(task.status)}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  mainLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  createdDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

