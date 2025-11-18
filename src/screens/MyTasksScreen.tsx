import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Task, TaskStatus } from '../types/Task';
import { DUMMY_TASKS } from '../data/dummyTasks';
import { TaskCard } from '../components/TaskCard';

type FilterType = 'All' | TaskStatus;

type RootStackParamList = {
  MyTasksScreen: undefined;
  StageTaskScreen: { taskId: string };
  QCFormScreen: { taskId: string };
  PutawayTaskScreen: { taskId: string };
};

type MyTasksScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const MyTasksScreen: React.FC = () => {
  const navigation = useNavigation<MyTasksScreenNavigationProp>();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('PENDING');

  const filterOptions: FilterType[] = ['All', 'PENDING', 'IN_PROGRESS', 'COMPLETED'];

  const filteredTasks = selectedFilter === 'All'
    ? DUMMY_TASKS
    : DUMMY_TASKS.filter((task) => task.status === selectedFilter);

  const handleTaskPress = (task: Task) => {
    if (task.type === 'STAGE') {
      navigation.navigate('StageTaskScreen', { taskId: task.id });
    } else if (
      task.type === 'STAGE_QC' ||
      task.type === 'GRN_QC' ||
      task.type === 'PACKING_QC' ||
      task.type === 'PREDISPATCH_QC' ||
      (task.type === 'UNPACKING' && task.qcTemplate)
    ) {
      navigation.navigate('QCFormScreen', { taskId: task.id });
    } else if (task.type === 'PUTAWAY') {
      navigation.navigate('PutawayTaskScreen', { taskId: task.id });
    } else {
      console.log('Task pressed:', task);
    }
  };

  const getFilterLabel = (filter: FilterType): string => {
    switch (filter) {
      case 'All':
        return 'All';
      case 'PENDING':
        return 'Pending';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'COMPLETED':
        return 'Completed';
      default:
        return filter;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tasks</Text>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        {filterOptions.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === filter && styles.filterChipTextActive,
              ]}
            >
              {getFilterLabel(filter)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onPress={() => handleTaskPress(item)} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks found</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#9CA3AF',
  },
});

