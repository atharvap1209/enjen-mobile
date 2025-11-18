import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Task, StageDetails } from '../types/Task';
import { DUMMY_TASKS } from '../data/dummyTasks';

type RootStackParamList = {
  MyTasksScreen: undefined;
  StageTaskScreen: { taskId: string };
};

type StageTaskScreenRouteProp = RouteProp<RootStackParamList, 'StageTaskScreen'>;
type StageTaskScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const StageTaskScreen: React.FC = () => {
  const route = useRoute<StageTaskScreenRouteProp>();
  const navigation = useNavigation<StageTaskScreenNavigationProp>();
  const { taskId } = route.params;

  const [task, setTask] = useState<Task | undefined>(
    DUMMY_TASKS.find((t) => t.id === taskId)
  );
  const [stageDetails, setStageDetails] = useState<StageDetails | undefined>(
    task?.stageDetails
  );

  const [updateProgressModalVisible, setUpdateProgressModalVisible] = useState(false);
  const [completeStageModalVisible, setCompleteStageModalVisible] = useState(false);

  // Update Progress Modal State
  const [completedQty, setCompletedQty] = useState('');
  const [scrapQty, setScrapQty] = useState('');
  const [remarks, setRemarks] = useState('');

  // Complete Stage Modal State
  const [finalCompletedQty, setFinalCompletedQty] = useState('');
  const [finalScrapQty, setFinalScrapQty] = useState('');
  const [finalRemarks, setFinalRemarks] = useState('');

  useEffect(() => {
    if (task?.stageDetails) {
      setStageDetails(task.stageDetails);
    }
  }, [task]);

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Task not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (task.type !== 'STAGE') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>This is not a stage task</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!stageDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Stage details not available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleStart = () => {
    const startedAt = new Date().toISOString();
    const updatedDetails = {
      ...stageDetails,
      status: 'IN_PROGRESS' as const,
      startedAt,
    };
    setStageDetails(updatedDetails);
    console.log('Stage started:', updatedDetails);
  };

  const handlePause = () => {
    const updatedDetails = {
      ...stageDetails,
      status: 'HOLD' as const,
    };
    setStageDetails(updatedDetails);
    console.log('Stage paused:', updatedDetails);
  };

  const handleUpdateProgress = () => {
    const completed = parseInt(completedQty) || 0;
    const scrap = parseInt(scrapQty) || 0;
    
    // Simple progress calculation: assume some baseline
    const newProgress = Math.min(stageDetails.progressPercent + 10, 100);
    
    const updatedDetails = {
      ...stageDetails,
      progressPercent: newProgress,
    };
    
    setStageDetails(updatedDetails);
    console.log('Progress updated:', {
      completedQty: completed,
      scrapQty: scrap,
      remarks,
      newProgress,
    });

    // Reset modal fields
    setCompletedQty('');
    setScrapQty('');
    setRemarks('');
    setUpdateProgressModalVisible(false);
  };

  const handleCompleteStage = () => {
    const finalCompleted = parseInt(finalCompletedQty) || 0;
    const finalScrap = parseInt(finalScrapQty) || 0;

    if (finalScrap > 0 && !finalRemarks.trim()) {
      Alert.alert('Error', 'Remarks are required when Final Scrap Quantity is greater than 0');
      return;
    }

    const updatedDetails = {
      ...stageDetails,
      status: 'COMPLETED' as const,
      progressPercent: 100,
    };

    setStageDetails(updatedDetails);
    console.log('Stage completed:', {
      finalCompletedQty: finalCompleted,
      finalScrapQty: finalScrap,
      finalRemarks,
    });

    // Reset modal fields
    setFinalCompletedQty('');
    setFinalScrapQty('');
    setFinalRemarks('');
    setCompleteStageModalVisible(false);

    // Navigate back after a short delay
    setTimeout(() => {
      navigation.goBack();
    }, 500);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#F59E0B';
      case 'IN_PROGRESS':
        return '#3B82F6';
      case 'COMPLETED':
        return '#10B981';
      case 'HOLD':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'COMPLETED':
        return 'Completed';
      case 'HOLD':
        return 'On Hold';
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Stage Task</Text>
        </View>

        {/* Stage Info Section */}
        <View style={styles.card}>
          <Text style={styles.stageName}>{stageDetails.stageName}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Stage ID:</Text>
            <Text style={styles.infoValue}>{stageDetails.stageId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Work Order No:</Text>
            <Text style={styles.infoValue}>{stageDetails.workOrderNo}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Machine Name:</Text>
            <Text style={styles.infoValue}>{stageDetails.machineName}</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusBadgeColor(stageDetails.status) },
              ]}
            >
              <Text style={styles.statusText}>{getStatusLabel(stageDetails.status)}</Text>
            </View>
          </View>
        </View>

        {/* Product Information Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Product Info</Text>
          <View style={styles.productRow}>
            <Text style={styles.productLabel}>Coil No</Text>
            <Text style={styles.productValue}>{stageDetails.coilNo}</Text>
          </View>
          <View style={styles.productRow}>
            <Text style={styles.productLabel}>Grade</Text>
            <Text style={styles.productValue}>{stageDetails.grade}</Text>
          </View>
          <View style={styles.productRow}>
            <Text style={styles.productLabel}>Coating</Text>
            <Text style={styles.productValue}>{stageDetails.coating}</Text>
          </View>
          <View style={styles.productRow}>
            <Text style={styles.productLabel}>Surface</Text>
            <Text style={styles.productValue}>{stageDetails.surface}</Text>
          </View>
          <View style={styles.productRow}>
            <Text style={styles.productLabel}>Product Form</Text>
            <Text style={styles.productValue}>{stageDetails.productForm}</Text>
          </View>
          <View style={styles.productRow}>
            <Text style={styles.productLabel}>Thickness</Text>
            <Text style={styles.productValue}>{stageDetails.thickness}</Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Progress:</Text>
            <Text style={styles.progressValue}>{stageDetails.progressPercent}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${stageDetails.progressPercent}%` },
              ]}
            />
          </View>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Started At:</Text>
            <Text style={styles.progressValue}>
              {stageDetails.startedAt || '-'}
            </Text>
          </View>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Elapsed Time:</Text>
            <Text style={styles.progressValue}>-</Text>
          </View>
        </View>

        {/* Action Buttons Section */}
        <View style={styles.actionsCard}>
          {stageDetails.status === 'PENDING' && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleStart}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Start</Text>
            </TouchableOpacity>
          )}

          {stageDetails.status === 'IN_PROGRESS' && (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handlePause}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setUpdateProgressModalVisible(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Update Progress</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setCompleteStageModalVisible(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Complete Stage</Text>
              </TouchableOpacity>
            </>
          )}

          {stageDetails.status === 'HOLD' && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setUpdateProgressModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Update Progress</Text>
            </TouchableOpacity>
          )}

          {stageDetails.status === 'COMPLETED' && (
            <TouchableOpacity
              style={[styles.primaryButton, styles.disabledButton]}
              disabled
            >
              <Text style={styles.primaryButtonText}>Stage Completed</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Update Progress Modal */}
      <Modal
        visible={updateProgressModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setUpdateProgressModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Progress</Text>

            <Text style={styles.inputLabel}>Completed Quantity</Text>
            <TextInput
              style={styles.input}
              value={completedQty}
              onChangeText={setCompletedQty}
              placeholder="Enter completed quantity"
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Scrap Quantity</Text>
            <TextInput
              style={styles.input}
              value={scrapQty}
              onChangeText={setScrapQty}
              placeholder="Enter scrap quantity"
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Remarks</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={remarks}
              onChangeText={setRemarks}
              placeholder="Write in simple English"
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setCompletedQty('');
                  setScrapQty('');
                  setRemarks('');
                  setUpdateProgressModalVisible(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleUpdateProgress}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Complete Stage Modal */}
      <Modal
        visible={completeStageModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCompleteStageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Complete Stage</Text>

            <Text style={styles.inputLabel}>Final Completed Quantity</Text>
            <TextInput
              style={styles.input}
              value={finalCompletedQty}
              onChangeText={setFinalCompletedQty}
              placeholder="Enter final completed quantity"
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Final Scrap Quantity</Text>
            <TextInput
              style={styles.input}
              value={finalScrapQty}
              onChangeText={setFinalScrapQty}
              placeholder="Enter final scrap quantity"
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>
              Remarks {parseInt(finalScrapQty) > 0 && '*'}
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={finalRemarks}
              onChangeText={setFinalRemarks}
              placeholder="Write in simple English"
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setFinalCompletedQty('');
                  setFinalScrapQty('');
                  setFinalRemarks('');
                  setCompleteStageModalVisible(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleCompleteStage}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSaveButtonText}>Confirm Complete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stageName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  productLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  productValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 6,
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  secondaryButtonText: {
    color: '#3B82F6',
    fontSize: 18,
    fontWeight: '700',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  modalCancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '700',
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  modalSaveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

