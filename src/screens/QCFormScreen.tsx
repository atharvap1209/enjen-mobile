import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Task, QCFieldBase, QCDecision } from '../types/Task';
import { DUMMY_TASKS } from '../data/dummyTasks';

type RootStackParamList = {
  MyTasksScreen: undefined;
  QCFormScreen: { taskId: string };
};

type QCFormScreenRouteProp = RouteProp<RootStackParamList, 'QCFormScreen'>;
type QCFormScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type QCAnswers = {
  [fieldId: string]: string | boolean | number;
};

// Helper function for AI cleanup (placeholder)
function cleanWithAI(raw: string): string {
  // Placeholder for future AI cleanup
  return raw.trim();
}

export const QCFormScreen: React.FC = () => {
  const navigation = useNavigation<QCFormScreenNavigationProp>();
  const route = useRoute<QCFormScreenRouteProp>();
  const { taskId } = route.params;

  const task = DUMMY_TASKS.find((t) => t.id === taskId);

  const [qcAnswers, setQcAnswers] = useState<QCAnswers>({});
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    // Initialize boolean fields to OK (true)
    if (task?.qcTemplate) {
      const initialAnswers: QCAnswers = {};
      task.qcTemplate.fields.forEach((field) => {
        if (field.type === 'BOOLEAN') {
          initialAnswers[field.id] = true; // OK by default
        }
      });
      setQcAnswers(initialAnswers);
    }
  }, [task]);

  if (!task || !task.qcTemplate) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No QC template found for this task.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const {
    qcTemplate,
    qcContextForStage,
    qcContextForGRN,
    qcContextForUnpacking,
    qcContextForPostPacking,
    qcContextForPreDispatch,
  } = task;

  // Check if there are any abnormalities (considering isCritical)
  const hasAbnormal = (): boolean => {
    for (const field of qcTemplate.fields) {
      const answer = qcAnswers[field.id];

      if (field.type === 'BOOLEAN' && answer === false) {
        // For boolean, "Not OK" (false) is abnormal
        if (field.isCritical) {
          return true; // Critical abnormality
        }
      }

      if (field.type === 'NUMERIC' && answer !== undefined && answer !== '') {
        const numValue = typeof answer === 'number' ? answer : parseFloat(answer as string);
        if (!isNaN(numValue) && field.min !== undefined && field.max !== undefined) {
          if (numValue < field.min || numValue > field.max) {
            if (field.isCritical) {
              return true; // Critical out of range
            }
          }
        }
      }
    }
    return false;
  };

  // Check if any critical field is abnormal
  const hasCriticalAbnormal = (): boolean => {
    for (const field of qcTemplate.fields) {
      if (!field.isCritical) continue;

      const answer = qcAnswers[field.id];

      if (field.type === 'BOOLEAN' && answer === false) {
        return true; // Critical field is Not OK
      }

      if (field.type === 'NUMERIC' && answer !== undefined && answer !== '') {
        const numValue = typeof answer === 'number' ? answer : parseFloat(answer as string);
        if (!isNaN(numValue) && field.min !== undefined && field.max !== undefined) {
          if (numValue < field.min || numValue > field.max) {
            return true; // Critical field out of range
          }
        }
      }
    }
    return false;
  };

  const handleBooleanChange = (fieldId: string, value: boolean) => {
    setQcAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleNumericChange = (fieldId: string, value: string) => {
    setQcAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleTextChange = (fieldId: string, value: string) => {
    setQcAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  // Voice input handler (simulated)
  const handleVoiceInput = (fieldId: string) => {
    // Simulate voice-to-text
    const simulatedText = 'Spoken text (simulated)';
    const cleanedText = cleanWithAI(simulatedText);
    
    // Append to existing text or set new
    const currentValue = (qcAnswers[fieldId] as string) || '';
    const newValue = currentValue ? `${currentValue} ${cleanedText}` : cleanedText;
    handleTextChange(fieldId, newValue);
  };

  const handleSaveDraft = () => {
    console.log('Saved as Draft:', { qcAnswers, remarks, decision: 'DRAFT' });
    Alert.alert('Saved', 'QC form saved as draft.');
  };

  const handlePass = () => {
    if (hasAbnormal()) {
      Alert.alert('Cannot Pass', 'Cannot Pass. One or more points are Not OK.');
      return;
    }
    if (hasCriticalAbnormal() && !remarks.trim()) {
      Alert.alert('Remarks Required', 'Remarks are required when there are critical abnormalities.');
      return;
    }
    console.log('Passed:', { qcAnswers, remarks, decision: 'PASS' });
    Alert.alert('QC Passed', 'QC form submitted as Pass.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleHold = () => {
    if (hasCriticalAbnormal() && !remarks.trim()) {
      Alert.alert('Remarks Required', 'Remarks are required when there are critical abnormalities.');
      return;
    }
    console.log('On Hold:', { qcAnswers, remarks, decision: 'HOLD' });
    Alert.alert('QC On Hold', 'QC form submitted as Hold.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleFail = () => {
    if (hasCriticalAbnormal() && !remarks.trim()) {
      Alert.alert('Remarks Required', 'Remarks are required when there are critical abnormalities.');
      return;
    }
    console.log('Failed:', { qcAnswers, remarks, decision: 'FAIL' });
    Alert.alert('QC Failed', 'QC form submitted as Fail.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const criticalAbnormal = hasCriticalAbnormal();
  const todayDate = new Date().toLocaleDateString();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Critical Abnormal Alert Banner */}
        {criticalAbnormal && (
          <View style={styles.abnormalBanner}>
            <Text style={styles.abnormalText}>
              Stop work. Call supervisor. Wait for instructions.
            </Text>
          </View>
        )}

        {/* Header Section */}
        <View style={styles.section}>
          <Text style={styles.title}>{qcTemplate.title}</Text>
          <Text style={styles.date}>Date: {todayDate}</Text>
        </View>

        {/* Context Section - Stage */}
        {qcContextForStage && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Context</Text>
            <View style={styles.contextGrid}>
              <ContextRow label="Work Order No" value={qcContextForStage.workOrderNo} />
              <ContextRow label="Stage" value={qcContextForStage.stageName} />
              <ContextRow label="Stage ID" value={qcContextForStage.stageId} />
              <ContextRow label="Machine" value={qcContextForStage.machineName} />
              <ContextRow label="Coil ID" value={qcContextForStage.coil.coilId} />
              <ContextRow label="Grade" value={qcContextForStage.coil.grade} />
              <ContextRow label="Coating" value={qcContextForStage.coil.coating} />
              <ContextRow label="Surface" value={qcContextForStage.coil.surface} />
              <ContextRow label="Product Form" value={qcContextForStage.coil.productForm} />
              <ContextRow label="Thickness" value={qcContextForStage.coil.thickness} />
              {qcContextForStage.coil.width && (
                <ContextRow label="Width" value={qcContextForStage.coil.width} />
              )}
              {qcContextForStage.coil.length && (
                <ContextRow label="Length" value={qcContextForStage.coil.length} />
              )}
              {qcContextForStage.coil.weight && (
                <ContextRow label="Weight" value={qcContextForStage.coil.weight} />
              )}
            </View>
          </View>
        )}

        {/* Context Section - GRN */}
        {qcContextForGRN && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Context</Text>
            <View style={styles.contextGrid}>
              <ContextRow label="Check Sheet Title" value={qcContextForGRN.checkSheetTitle} />
              <ContextRow label="QC Gate" value={qcContextForGRN.qcGate} />
              <ContextRow label="SR. No." value={qcContextForGRN.srNo} />
              <ContextRow label="Challan No" value={qcContextForGRN.challanNo} />
              <ContextRow label="Challan Date" value={new Date(qcContextForGRN.challanDate).toLocaleDateString()} />
              <ContextRow label="Party Name" value={qcContextForGRN.partyName} />
              <ContextRow label="Invoice No" value={qcContextForGRN.invoiceNo} />
              <ContextRow label="Invoice Date" value={new Date(qcContextForGRN.invoiceDate).toLocaleDateString()} />
              <ContextRow label="Item No" value={qcContextForGRN.itemNo} />
              <ContextRow label="Part Number" value={qcContextForGRN.partNumber} />
              <ContextRow label="Lot No" value={qcContextForGRN.lotNo} />
              <ContextRow label="Quantity" value={qcContextForGRN.quantity.toString()} />
              <ContextRow label="Balance Qty" value={qcContextForGRN.balanceQuantity.toString()} />
              <ContextRow label="Coil ID" value={qcContextForGRN.coil.coilId} />
              <ContextRow label="Grade" value={qcContextForGRN.coil.grade} />
              <ContextRow label="Coating" value={qcContextForGRN.coil.coating} />
              <ContextRow label="Surface" value={qcContextForGRN.coil.surface} />
              <ContextRow label="Product Form" value={qcContextForGRN.coil.productForm} />
              <ContextRow label="Thickness" value={qcContextForGRN.coil.thickness} />
              {qcContextForGRN.coil.width && (
                <ContextRow label="Width" value={qcContextForGRN.coil.width} />
              )}
              {qcContextForGRN.coil.weight && (
                <ContextRow label="Weight" value={qcContextForGRN.coil.weight} />
              )}
            </View>
          </View>
        )}

        {/* Context Section - Unpacking */}
        {qcContextForUnpacking && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Context</Text>
            <View style={styles.contextGrid}>
              <ContextRow label="Task ID" value={qcContextForUnpacking.taskId} />
              <ContextRow label="GRN No" value={qcContextForUnpacking.grnNo} />
              <ContextRow label="Coil ID" value={qcContextForUnpacking.coil.coilId} />
              <ContextRow label="Grade" value={qcContextForUnpacking.coil.grade} />
              <ContextRow label="Coating" value={qcContextForUnpacking.coil.coating} />
              <ContextRow label="Colour" value={qcContextForUnpacking.coil.colour} />
              <ContextRow label="Product Form" value={qcContextForUnpacking.coil.productForm} />
              <ContextRow label="Thickness" value={qcContextForUnpacking.coil.thickness} />
              <ContextRow label="Width Specified" value={qcContextForUnpacking.coil.widthSpecified} />
              <ContextRow label="Net Weight" value={qcContextForUnpacking.coil.netWeight} />
            </View>
          </View>
        )}

        {/* Context Section - Post Packing */}
        {qcContextForPostPacking && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Context</Text>
            <View style={styles.contextGrid}>
              <ContextRow label="Packing Task ID" value={qcContextForPostPacking.packingTaskId} />
              <ContextRow label="Pick List ID" value={qcContextForPostPacking.pickListId} />
              <ContextRow label="Customer" value={qcContextForPostPacking.customerName} />
              <ContextRow label="Sales Order" value={qcContextForPostPacking.salesOrderNo} />
              {qcContextForPostPacking.dispatchId && (
                <ContextRow label="Dispatch ID" value={qcContextForPostPacking.dispatchId} />
              )}
              <ContextRow label="Total Items" value={qcContextForPostPacking.totalItems.toString()} />
              <ContextRow label="Total Weight" value={qcContextForPostPacking.totalWeight} />
            </View>
          </View>
        )}

        {/* Context Section - Pre Dispatch */}
        {qcContextForPreDispatch && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Context</Text>
            <View style={styles.contextGrid}>
              <ContextRow label="Dispatch ID" value={qcContextForPreDispatch.dispatchId} />
              <ContextRow label="Vehicle No" value={qcContextForPreDispatch.vehicleNo} />
              {qcContextForPreDispatch.driverName && (
                <ContextRow label="Driver Name" value={qcContextForPreDispatch.driverName} />
              )}
              {qcContextForPreDispatch.driverPhone && (
                <ContextRow label="Driver Phone" value={qcContextForPreDispatch.driverPhone} />
              )}
              {qcContextForPreDispatch.bayId && (
                <ContextRow label="Bay" value={qcContextForPreDispatch.bayId} />
              )}
              <ContextRow label="Customer" value={qcContextForPreDispatch.customerName} />
              <ContextRow label="Sales Order" value={qcContextForPreDispatch.salesOrderNo} />
              <ContextRow label="Total Items" value={qcContextForPreDispatch.totalItems.toString()} />
              <ContextRow label="Total Weight" value={qcContextForPreDispatch.totalWeight} />
            </View>
          </View>
        )}

        {/* QC Fields Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QC Checks</Text>
          {qcTemplate.fields.map((field) => (
            <View key={field.id} style={styles.fieldContainer}>
              {field.type === 'BOOLEAN' && (
                <BooleanField
                  field={field}
                  value={qcAnswers[field.id] as boolean}
                  onChange={(value) => handleBooleanChange(field.id, value)}
                />
              )}
              {field.type === 'NUMERIC' && (
                <NumericField
                  field={field}
                  value={qcAnswers[field.id] as string}
                  onChange={(value) => handleNumericChange(field.id, value)}
                />
              )}
              {field.type === 'TEXT' && (
                <TextField
                  field={field}
                  value={qcAnswers[field.id] as string}
                  onChange={(value) => handleTextChange(field.id, value)}
                  onVoiceInput={() => handleVoiceInput(field.id)}
                />
              )}
            </View>
          ))}
        </View>

        {/* Remarks Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Remarks {criticalAbnormal && <Text style={styles.required}>*</Text>}
          </Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.remarksInput}
              placeholder="Enter remarks..."
              placeholderTextColor="#9CA3AF"
              value={remarks}
              onChangeText={setRemarks}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={styles.voiceButton}
              onPress={() => {
                const simulatedText = 'Spoken text (simulated)';
                const cleanedText = cleanWithAI(simulatedText);
                const newValue = remarks ? `${remarks} ${cleanedText}` : cleanedText;
                setRemarks(newValue);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.voiceButtonText}>🎤</Text>
            </TouchableOpacity>
          </View>
          {criticalAbnormal && (
            <Text style={styles.hintText}>
              You can type or tap mic and speak. Text will be cleaned automatically.
            </Text>
          )}
        </View>

        {/* Footer Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.draftButton]}
            onPress={handleSaveDraft}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Save Draft</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.passButton]}
            onPress={handlePass}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Pass</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.holdButton]}
            onPress={handleHold}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Hold</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.failButton]}
            onPress={handleFail}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Fail</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Context Row Component
const ContextRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.contextRow}>
    <Text style={styles.contextLabel}>{label}</Text>
    <Text style={styles.contextValue}>{value}</Text>
  </View>
);

// Boolean Field Component
const BooleanField: React.FC<{
  field: QCFieldBase;
  value: boolean;
  onChange: (value: boolean) => void;
}> = ({ field, value, onChange }) => (
  <View style={styles.booleanContainer}>
    <Text style={styles.fieldLabel}>{field.label}</Text>
    {field.hint && <Text style={styles.hintText}>{field.hint}</Text>}
    <View style={styles.booleanButtons}>
      <TouchableOpacity
        style={[
          styles.booleanButton,
          value === true && styles.booleanButtonActiveOK,
        ]}
        onPress={() => onChange(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.booleanButtonText,
            value === true && styles.booleanButtonTextActive,
          ]}
        >
          OK
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.booleanButton,
          value === false && styles.booleanButtonActiveNotOK,
        ]}
        onPress={() => onChange(false)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.booleanButtonText,
            value === false && styles.booleanButtonTextActive,
          ]}
        >
          Not OK
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

// Numeric Field Component
const NumericField: React.FC<{
  field: QCFieldBase;
  value: string;
  onChange: (value: string) => void;
}> = ({ field, value, onChange }) => {
  const numValue = value !== '' ? parseFloat(value) : NaN;
  const isOutOfRange =
    !isNaN(numValue) &&
    field.min !== undefined &&
    field.max !== undefined &&
    (numValue < field.min || numValue > field.max);

  return (
    <View style={styles.numericContainer}>
      <Text style={styles.fieldLabel}>{field.label}</Text>
      {field.hint && <Text style={styles.hintText}>{field.hint}</Text>}
      <TextInput
        style={[styles.numericInput, isOutOfRange && styles.numericInputError]}
        placeholder="Enter value"
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
      />
      {field.min !== undefined && field.max !== undefined && (
        <Text style={styles.helperText}>
          Limit: {field.min} to {field.max}
        </Text>
      )}
      {isOutOfRange && (
        <Text style={styles.errorText}>Value is out of range!</Text>
      )}
    </View>
  );
};

// Text Field Component with Voice Input
const TextField: React.FC<{
  field: QCFieldBase;
  value: string;
  onChange: (value: string) => void;
  onVoiceInput: () => void;
}> = ({ field, value, onChange, onVoiceInput }) => {
  return (
    <View style={styles.textContainer}>
      <Text style={styles.fieldLabel}>{field.label}</Text>
      {field.hint && <Text style={styles.hintText}>{field.hint}</Text>}
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter text..."
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChange}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={styles.voiceButton}
          onPress={onVoiceInput}
          activeOpacity={0.7}
        >
          <Text style={styles.voiceButtonText}>🎤</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  },
  backButton: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3B82F6',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  abnormalBanner: {
    backgroundColor: '#FEE2E2',
    borderWidth: 2,
    borderColor: '#EF4444',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  abnormalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#B91C1C',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  required: {
    color: '#EF4444',
  },
  contextGrid: {
    gap: 8,
  },
  contextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contextLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  contextValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  booleanContainer: {},
  booleanButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  booleanButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  booleanButtonActiveOK: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  booleanButtonActiveNotOK: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  booleanButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  booleanButtonTextActive: {
    color: '#111827',
  },
  numericContainer: {},
  numericInput: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  numericInputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 6,
  },
  textContainer: {},
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 80,
  },
  voiceButton: {
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  voiceButtonText: {
    fontSize: 20,
  },
  remarksInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 100,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  draftButton: {
    backgroundColor: '#9CA3AF',
  },
  passButton: {
    backgroundColor: '#10B981',
  },
  holdButton: {
    backgroundColor: '#F59E0B',
  },
  failButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
