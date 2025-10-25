/**
 * Lab Results API Schema
 */

import {
  ApiResponse,
  PaginatedResponse,
  Endpoint,
  PaginationParams,
  SortParams,
  FilterParams,
} from './common';
import { LabResult } from '../../types/index';

// Request/Response Types
export type CreateLabResultRequest = Omit<LabResult, 'id'>;

export type UpdateLabResultRequest = Partial<Omit<LabResult, 'id'>>;

export interface LabResultFilterParams extends FilterParams {
  patientId?: string;
  encounterId?: string;
  testCategory?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  orderedDateFrom?: string;
  orderedDateTo?: string;
  orderedBy?: string;
}

export interface GetLabResultsParams extends PaginationParams, SortParams, LabResultFilterParams {}

// Endpoints
export const LabResultEndpoints = {
  getLabResults: {
    method: 'GET',
    path: '/api/labs',
    description: 'Get paginated list of lab results with optional filters',
  } as Endpoint<GetLabResultsParams, PaginatedResponse<LabResult>>,

  getLabResult: {
    method: 'GET',
    path: '/api/labs/:id',
    description: 'Get lab result by ID',
  } as Endpoint<{ id: string }, ApiResponse<LabResult>>,

  createLabResult: {
    method: 'POST',
    path: '/api/labs',
    description: 'Create a new lab result',
  } as Endpoint<CreateLabResultRequest, ApiResponse<LabResult>>,

  updateLabResult: {
    method: 'PUT',
    path: '/api/labs/:id',
    description: 'Update lab result by ID',
  } as Endpoint<{ id: string; data: UpdateLabResultRequest }, ApiResponse<LabResult>>,

  deleteLabResult: {
    method: 'DELETE',
    path: '/api/labs/:id',
    description: 'Delete lab result by ID',
  } as Endpoint<{ id: string }, ApiResponse<{ message: string }>>,

  getPatientLabResults: {
    method: 'GET',
    path: '/api/patients/:patientId/labs',
    description: 'Get all lab results for a specific patient',
  } as Endpoint<{ patientId: string } & PaginationParams, PaginatedResponse<LabResult>>,

  getEncounterLabResults: {
    method: 'GET',
    path: '/api/encounters/:encounterId/labs',
    description: 'Get all lab results for a specific encounter',
  } as Endpoint<{ encounterId: string }, ApiResponse<LabResult[]>>,
};
