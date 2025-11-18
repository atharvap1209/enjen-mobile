export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'HOLD';

export type TaskType =
  | 'STAGE'        // production stage execution
  | 'STAGE_QC'     // in-process QC for a stage
  | 'GRN_QC'       // GRN QC
  | 'UNPACKING'    // unpacking task
  | 'PUTAWAY'      // bin assignment / putaway
  | 'PACKING_QC'   // post-packing QC
  | 'PREDISPATCH_QC'; // pre-dispatch QC

export type QCDecision = 'DRAFT' | 'PASS' | 'HOLD' | 'FAIL';

export type QCFieldType = 'BOOLEAN' | 'NUMERIC' | 'TEXT';

export type QCGate =
  | 'INWARD_GRN'
  | 'UNPACKING'
  | 'STAGE_SLITTING'
  | 'STAGE_CUTTING'
  | 'STAGE_PACKING'
  | 'STAGE_PREDISPATCH'
  | 'POST_PACKING'
  | 'PRE_DISPATCH';

export interface QCFieldBase {
  id: string;
  label: string;          // simple English label
  type: QCFieldType;
  min?: number;           // for numeric
  max?: number;           // for numeric
  hint?: string;          // helper text in simple English
  isCritical?: boolean;   // if abnormal here, show in red summary
}

export interface QCFormTemplate {
  id: string;
  gate: QCGate;
  title: string;             // e.g. "Inward QC - Standard Coil"
  fields: QCFieldBase[];
}

// Legacy QCField for backward compatibility
export interface QCField extends QCFieldBase {}

export interface QCContextCommonCoil {
  coilId: string;
  grade: string;
  coating: string;
  surface: string;
  productForm: string;      // Coil / Sheet etc.
  thickness: string;
  width?: string;
  length?: string;
  weight?: string;
}

export interface QCContextForStage {
  workOrderNo: string;
  stageId: string;
  stageName: string;         // Slitting, Cutting, Packing, Pre-Dispatch
  machineName: string;
  coil: QCContextCommonCoil;
}

export interface QCContextForGRN {
  checkSheetTitle: string;
  qcGate: string;
  date: string;
  srNo: string;
  challanNo: string;
  challanDate: string;
  partyName: string;
  invoiceNo: string;
  invoiceDate: string;
  itemNo: string;
  partNumber: string;
  lotNo: string;
  quantity: number;
  balanceQuantity: number;
  coil: QCContextCommonCoil;
}

export interface QCContextForUnpacking {
  taskId: string;
  grnNo: string;
  coil: QCContextCommonCoil & {
    colour: string;
    widthSpecified: string;
    netWeight: string;
  };
}

export interface QCContextForPostPacking {
  packingTaskId: string;
  pickListId: string;
  customerName: string;
  salesOrderNo: string;
  dispatchId?: string;
  totalItems: number;
  totalWeight: string;
}

export interface QCContextForPreDispatch {
  dispatchId: string;
  vehicleNo: string;
  driverName?: string;
  driverPhone?: string;
  bayId?: string;
  customerName: string;
  salesOrderNo: string;
  totalItems: number;
  totalWeight: string;
}

export interface PutawayDetails {
  putawayTaskId: string;
  coilId: string;
  currentLocation: string; // e.g. "Dock A, Bay 3"
  suggestedBinId?: string; // optional
  zone?: string;
  rack?: string;
  level?: string;
  finalBinId?: string; // actual bin where coil was placed
  remarks?: string;     // worker remarks
}

export interface StageDetails {
  stageId: string;
  stageName: string;
  workOrderNo: string;
  machineName: string;
  status: TaskStatus;
  progressPercent: number;
  startedAt?: string;
  coilNo: string;
  grade: string;
  coating: string;
  surface: string;
  productForm: string;
  thickness: string;
}

export interface Task {
  id: string;
  type: TaskType;
  status: TaskStatus;
  mainLabel: string;        // simple title like "Stage: Slitting"
  subLabel?: string;        // secondary info like "WO-123 | Machine-1"
  primaryId: string;        // main reference ID (Stage ID, GRN No, Coil ID, etc.)
  createdAt: string;        // ISO string
  updatedAt?: string;       // ISO string
  priority?: 'NORMAL' | 'URGENT';
  stageDetails?: StageDetails;
  qcTemplate?: QCFormTemplate;       // used if type is some QC type
  qcGate?: QCGate;
  qcContextForStage?: QCContextForStage;
  qcContextForGRN?: QCContextForGRN;
  qcContextForUnpacking?: QCContextForUnpacking;
  qcContextForPostPacking?: QCContextForPostPacking;
  qcContextForPreDispatch?: QCContextForPreDispatch;
  qcDecision?: QCDecision;
  putawayDetails?: PutawayDetails;
}

