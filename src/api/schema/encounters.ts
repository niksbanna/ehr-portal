/**
 * Encounter API Schema
 */

import {
  ApiResponse,
  PaginatedResponse,
  Endpoint,
  PaginationParams,
  SortParams,
  FilterParams,
} from './common';
import { Encounter } from '../../types/index';

// Request/Response Types
export type CreateEncounterRequest = Omit<Encounter, 'id'>;

export type UpdateEncounterRequest = Partial<Omit<Encounter, 'id'>>;

export interface EncounterFilterParams extends FilterParams {
  patientId?: string;
  doctorId?: string;
  type?: 'consultation' | 'followup' | 'emergency';
  status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  dateFrom?: string;
  dateTo?: string;
  diagnosisCode?: string;
}

export interface GetEncountersParams extends PaginationParams, SortParams, EncounterFilterParams {}

// Endpoints
export const EncounterEndpoints = {
  getEncounters: {
    method: 'GET',
    path: '/api/encounters',
    description: 'Get paginated list of encounters with optional filters',
  } as Endpoint<GetEncountersParams, PaginatedResponse<Encounter>>,

  getEncounter: {
    method: 'GET',
    path: '/api/encounters/:id',
    description: 'Get encounter by ID',
  } as Endpoint<{ id: string }, ApiResponse<Encounter>>,

  createEncounter: {
    method: 'POST',
    path: '/api/encounters',
    description: 'Create a new encounter',
  } as Endpoint<CreateEncounterRequest, ApiResponse<Encounter>>,

  updateEncounter: {
    method: 'PUT',
    path: '/api/encounters/:id',
    description: 'Update encounter by ID',
  } as Endpoint<{ id: string; data: UpdateEncounterRequest }, ApiResponse<Encounter>>,

  deleteEncounter: {
    method: 'DELETE',
    path: '/api/encounters/:id',
    description: 'Delete encounter by ID',
  } as Endpoint<{ id: string }, ApiResponse<{ message: string }>>,

  getPatientEncounters: {
    method: 'GET',
    path: '/api/patients/:patientId/encounters',
    description: 'Get all encounters for a specific patient',
  } as Endpoint<{ patientId: string } & PaginationParams, PaginatedResponse<Encounter>>,
};
