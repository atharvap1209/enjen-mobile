import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Task } from '../types/Task';
import { DUMMY_TASKS } from '../data/dummyTasks';
import { getStatusLabel, getStatusColor } from '../utils/taskUtils';

type RootStackParamList = {
  MyTasksScreen: undefined;
  PutawayTaskScreen: { taskId: string };
};

type PutawayTaskScreenRouteProp = RouteProp<RootStackParamList, 'PutawayTaskScreen'>;
type PutawayTaskScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const PutawayTaskScreen: React.FC = () => {
  const route = useRoute<PutawayTaskScreenRouteProp>();
  const navigation = useNavigation<PutawayTaskScreenNavigationProp>();
  const { taskId } = route.params;

  const task = DUMMY_TASKS.find((t) => t.id === taskId);

  const [binId, setBinId] = useState(task?.putawayDetails?.suggestedBinId || '');
  const [confirmed, setConfirmed] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [cannotPutawayModalVisible, setCannotPutawayModalVisible] = useState(false);
  const [cannotPutawayReason, setCannotPutawayReason] = useState('');

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Task not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (task.type !== 'PUTAWAY') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>This is not a putaway task</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!task.putawayDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No putaway details available</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { putawayDetails } = task;

  const handleConfirmPutaway = () => {
    if (!confirmed) {
      Alert.alert(
        'Confirmation Required',
        'Please confirm that you have placed the coil in this bin.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    if (!binId.trim()) {
      Alert.alert(
        'Bin ID Required',
        'Please enter a Bin ID.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    // Update task status to completed (in real app, this would be an API call)
    task.status = 'COMPLETED';
    if (task.putawayDetails) {
      task.putawayDetails.finalBinId = binId;
      task.putawayDetails.remarks = remarks;
    }

    Alert.alert(
      'Success',
      `Putaway completed for Coil ${putawayDetails.coilId}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleCannotPutaway = () => {
    setCannotPutawayModalVisible(true);
  };

  const handleSubmitCannotPutaway = () => {
    if (!cannotPutawayReason.trim()) {
      Alert.alert(
        'Reason Required',
        'Please provide a reason why you cannot complete the putaway.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    // In real app, this would log the reason via API
    console.log('Cannot putaway reason:', cannotPutawayReason);

    setCannotPutawayModalVisible(false);
    Alert.alert(
      'Issue Reported',
      'Your issue has been reported. Supervisor will be notified.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonHeader}
        >
          <Text style={styles.backButtonHeaderText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Putaway</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* (A) Header Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coil Details</Text>
          <View style={styles.card}>
            <Text style={styles.bigText}>Coil ID: {putawayDetails.coilId}</Text>
            <Text style={styles.smallText}>
              Putaway Task ID: {putawayDetails.putawayTaskId}
            </Text>
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Status: </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(task.status) },
                ]}
              >
                <Text style={styles.statusBadgeText}>
                  {getStatusLabel(task.status)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* (B) Current Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Location</Text>
          <View style={styles.card}>
            <Text style={styles.valueText}>{putawayDetails.currentLocation}</Text>
          </View>
        </View>

        {/* (C) Target Bin Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Bin</Text>
          <View style={styles.card}>
            {putawayDetails.suggestedBinId && (
              <Text style={styles.label}>
                Suggested Bin ID: {putawayDetails.suggestedBinId}
              </Text>
            )}

            <Text style={styles.inputLabel}>Bin ID</Text>
            <TextInput
              style={styles.textInput}
              value={binId}
              onChangeText={setBinId}
              placeholder="Enter Bin ID"
              placeholderTextColor="#9CA3AF"
            />

            {putawayDetails.zone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Zone:</Text>
                <Text style={styles.infoValue}>{putawayDetails.zone}</Text>
              </View>
            )}

            {putawayDetails.rack && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Rack:</Text>
                <Text style={styles.infoValue}>{putawayDetails.rack}</Text>
              </View>
            )}

            {putawayDetails.level && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Level:</Text>
                <Text style={styles.infoValue}>{putawayDetails.level}</Text>
              </View>
            )}
          </View>
        </View>

        {/* (D) Confirmation Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Confirmation</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setConfirmed(!confirmed)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, confirmed && styles.checkboxChecked]}>
                {confirmed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>
                I have placed this coil in this bin.
              </Text>
            </TouchableOpacity>

            <Text style={styles.inputLabel}>Remarks (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={remarks}
              onChangeText={setRemarks}
              placeholder="Write in simple English (optional)"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      {/* (E) Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleConfirmPutaway}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Confirm Putaway</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleCannotPutaway}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Cannot Putaway</Text>
        </TouchableOpacity>
      </View>

      {/* Cannot Putaway Modal */}
      <Modal
        visible={cannotPutawayModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCannotPutawayModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cannot Putaway</Text>
            <Text style={styles.modalSubtitle}>
              Please provide the reason why you cannot complete this putaway task:
            </Text>

            <TextInput
              style={[styles.textInput, styles.textArea, styles.modalInput]}
              value={cannotPutawayReason}
              onChangeText={setCannotPutawayReason}
              placeholder="Enter reason..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => {
                  setCannotPutawayModalVisible(false);
                  setCannotPutawayReason('');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSubmitCannotPutaway}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonTextPrimary}>Submit</Text>
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
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonHeader: {
    marginRight: 16,
  },
  backButtonHeaderText: {
    fontSize: 18,
    color: '#3B82F6',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bigText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  smallText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  valueText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 8,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: '#111827',
    marginBottom: 16,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '600',
    flex: 1,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 20,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    color: '#EF4444',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 24,
  },
  modalInput: {
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#3B82F6',
  },
  modalButtonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  modalButtonTextPrimary: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  modalButtonTextSecondary: {
    color: '#6B7280',
    fontSize: 18,
    fontWeight: '700',
  },
});

