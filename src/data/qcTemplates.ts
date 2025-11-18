import { QCFormTemplate, QCFieldBase, QCGate } from '../types/Task';

// Shared observation fields for stage QC templates
const STAGE_OBSERVATION_FIELDS: QCFieldBase[] = [
  { id: 'outer_damage_ok', label: 'Outer Damage OK?', type: 'BOOLEAN', isCritical: true },
  { id: 'dent_mark_ok', label: 'Dent Mark OK?', type: 'BOOLEAN', isCritical: true },
  { id: 'edge_damage_ok', label: 'Edge Damage OK?', type: 'BOOLEAN', isCritical: true },
  { id: 'line_mark_ok', label: 'Line Mark OK?', type: 'BOOLEAN' },
  { id: 'coating_issue_ok', label: 'Coating OK?', type: 'BOOLEAN', isCritical: true },
  { id: 'visual_defect_ok', label: 'Visual Defect OK?', type: 'BOOLEAN', isCritical: true },
  { id: 'flatness_ok', label: 'Flatness OK?', type: 'BOOLEAN' },
  { id: 'side_waviness_ok', label: 'Side Waviness OK?', type: 'BOOLEAN' },
];

// A. Inward GRN QC Template
export const TEMPLATE_INWARD_GRN_STANDARD: QCFormTemplate = {
  id: 'INWARD_GRN_STANDARD',
  gate: 'INWARD_GRN',
  title: 'Inward QC - Standard Coil',
  fields: [
    { id: 'item_description', label: 'Item Description', type: 'TEXT', hint: 'Write simple name of item' },
    { id: 'width_actual', label: 'Width Actual (mm)', type: 'NUMERIC', min: 900, max: 1500, isCritical: true },
    { id: 'thickness_actual', label: 'Thickness Actual (mm)', type: 'NUMERIC', min: 0.2, max: 3.0, isCritical: true },
    { id: 'length_actual', label: 'Length Actual (m)', type: 'NUMERIC', hint: 'If used' },
    { id: 'visual_ok', label: 'Visual OK?', type: 'BOOLEAN', isCritical: true },
    { id: 'edge_ok', label: 'Edge OK?', type: 'BOOLEAN', isCritical: true },
    { id: 'rust_ok', label: 'Rust / Corrosion OK?', type: 'BOOLEAN', isCritical: true },
    { id: 'packing_ok', label: 'Packing Condition OK?', type: 'BOOLEAN' },
    { id: 'remark', label: 'QC Remarks', type: 'TEXT', hint: 'Short notes in simple English' },
  ],
};

// B. Unpacking QC Template
export const TEMPLATE_UNPACKING_STANDARD: QCFormTemplate = {
  id: 'UNPACKING_STANDARD',
  gate: 'UNPACKING',
  title: 'Unpacking QC - Standard',
  fields: [
    { id: 'width_actual', label: 'Width Actual (mm)', type: 'NUMERIC', min: 900, max: 1500, isCritical: true },
    { id: 'outer_packing_ok', label: 'Outer Packing OK?', type: 'BOOLEAN', isCritical: true },
    { id: 'rust_visible', label: 'Rust / Corrosion Visible?', type: 'BOOLEAN', isCritical: true },
    { id: 'edge_damage_ok', label: 'Edge Damage OK?', type: 'BOOLEAN', isCritical: true },
    { id: 'line_marks_ok', label: 'Line Marks OK?', type: 'BOOLEAN' },
    { id: 'dent_marks_ok', label: 'Dent Marks OK?', type: 'BOOLEAN' },
    { id: 'packaging_removed', label: 'Packaging Removed Successfully', type: 'TEXT', hint: 'Yes / No / Partial' },
    { id: 'coil_condition', label: 'Coil Condition After Unwrapping', type: 'TEXT', hint: 'Excellent / Good / OK / Poor / Damaged' },
    { id: 'remark', label: 'QC Remarks', type: 'TEXT', hint: 'Describe damage if any' },
  ],
};

// C. Stage QC Templates
export const TEMPLATE_STAGE_SLITTING: QCFormTemplate = {
  id: 'STAGE_SLITTING_STANDARD',
  gate: 'STAGE_SLITTING',
  title: 'In-Process QC - Slitting',
  fields: [
    { id: 'width_actual', label: 'Width Actual (mm)', type: 'NUMERIC', min: 900, max: 1500, isCritical: true },
    { id: 'burr_ok', label: 'Burr OK?', type: 'BOOLEAN', isCritical: true },
    ...STAGE_OBSERVATION_FIELDS,
    { id: 'remark', label: 'QC Remarks', type: 'TEXT' },
  ],
};

export const TEMPLATE_STAGE_CUTTING: QCFormTemplate = {
  id: 'STAGE_CUTTING_STANDARD',
  gate: 'STAGE_CUTTING',
  title: 'In-Process QC - Cutting',
  fields: [
    { id: 'length_actual', label: 'Length Actual (mm)', type: 'NUMERIC', min: 200, max: 6000, isCritical: true },
    { id: 'width_actual', label: 'Width Actual (mm)', type: 'NUMERIC', min: 900, max: 1500, isCritical: true },
    ...STAGE_OBSERVATION_FIELDS,
    { id: 'remark', label: 'QC Remarks', type: 'TEXT' },
  ],
};

export const TEMPLATE_STAGE_PACKING: QCFormTemplate = {
  id: 'STAGE_PACKING_STANDARD',
  gate: 'STAGE_PACKING',
  title: 'In-Process QC - Packing',
  fields: [
    { id: 'label_match_ok', label: 'Label Match with System?', type: 'BOOLEAN', isCritical: true },
    { id: 'packing_integrity_ok', label: 'Packing Integrity OK?', type: 'BOOLEAN', isCritical: true },
    ...STAGE_OBSERVATION_FIELDS,
    { id: 'remark', label: 'QC Remarks', type: 'TEXT' },
  ],
};

export const TEMPLATE_STAGE_PREDISPATCH: QCFormTemplate = {
  id: 'STAGE_PREDISPATCH_STANDARD',
  gate: 'STAGE_PREDISPATCH',
  title: 'In-Process QC - Pre-Dispatch',
  fields: [
    { id: 'final_count_ok', label: 'Final Count OK?', type: 'BOOLEAN', isCritical: true },
    { id: 'final_weight_ok', label: 'Final Weight OK?', type: 'BOOLEAN', isCritical: true },
    ...STAGE_OBSERVATION_FIELDS,
    { id: 'remark', label: 'QC Remarks', type: 'TEXT' },
  ],
};

// D. Post-Packing QC Template
export const TEMPLATE_POST_PACKING_STANDARD: QCFormTemplate = {
  id: 'POST_PACKING_STANDARD',
  gate: 'POST_PACKING',
  title: 'Post-Packing QC',
  fields: [
    { id: 'packaging_integrity_ok', label: 'Packaging Integrity OK?', type: 'BOOLEAN', isCritical: true },
    { id: 'labeling_correct', label: 'Labeling Correct?', type: 'BOOLEAN', isCritical: true },
    { id: 'count_match', label: 'Count Match with System?', type: 'BOOLEAN', isCritical: true },
    { id: 'physical_condition_ok', label: 'Physical Condition OK?', type: 'BOOLEAN', isCritical: true },
    { id: 'remark', label: 'QC Remarks', type: 'TEXT' },
  ],
};

// E. Pre-Dispatch QC Template
export const TEMPLATE_PRE_DISPATCH_STANDARD: QCFormTemplate = {
  id: 'PRE_DISPATCH_STANDARD',
  gate: 'PRE_DISPATCH',
  title: 'Pre-Dispatch QC',
  fields: [
    { id: 'vehicle_condition_ok', label: 'Vehicle Condition OK?', type: 'BOOLEAN', isCritical: true },
    { id: 'loading_security_ok', label: 'Loading Secure?', type: 'BOOLEAN', isCritical: true },
    { id: 'documents_ok', label: 'All Documents OK?', type: 'BOOLEAN', isCritical: true },
    { id: 'final_count_ok', label: 'Final Count OK?', type: 'BOOLEAN', isCritical: true },
    { id: 'final_weight_ok', label: 'Final Weight OK?', type: 'BOOLEAN', isCritical: true },
    { id: 'remark', label: 'QC Remarks', type: 'TEXT' },
  ],
};

// All templates lookup map
export const ALL_QC_TEMPLATES: Record<string, QCFormTemplate> = {
  INWARD_GRN_STANDARD: TEMPLATE_INWARD_GRN_STANDARD,
  UNPACKING_STANDARD: TEMPLATE_UNPACKING_STANDARD,
  STAGE_SLITTING_STANDARD: TEMPLATE_STAGE_SLITTING,
  STAGE_CUTTING_STANDARD: TEMPLATE_STAGE_CUTTING,
  STAGE_PACKING_STANDARD: TEMPLATE_STAGE_PACKING,
  STAGE_PREDISPATCH_STANDARD: TEMPLATE_STAGE_PREDISPATCH,
  POST_PACKING_STANDARD: TEMPLATE_POST_PACKING_STANDARD,
  PRE_DISPATCH_STANDARD: TEMPLATE_PRE_DISPATCH_STANDARD,
};

// Helper function to get template by gate
export function getTemplateByGate(gate: QCGate): QCFormTemplate | undefined {
  const templates = Object.values(ALL_QC_TEMPLATES);
  return templates.find(t => t.gate === gate);
}

