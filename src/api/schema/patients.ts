/**
 * Patient API Schema
 */

import { ApiResponse, PaginatedResponse, Endpoint, PaginationParams, SortParams, FilterParams } from './common';
import { Patient } from '../../types/index';

// Request/Response Types
export type CreatePatientRequest = Omit<Patient, 'id' | 'registrationDate'>;

export type UpdatePatientRequest = Partial<Omit<Patient, 'id' | 'registrationDate'>>;

export interface PatientFilterParams extends FilterParams {
  search?: string;
  gender?: 'male' | 'female' | 'other';
  city?: string;
  state?: string;
  bloodGroup?: string;
  registrationDateFrom?: string;
  registrationDateTo?: string;
}

export interface GetPatientsParams extends PaginationParams, SortParams, PatientFilterParams {}

// Endpoints
export const PatientEndpoints = {
  getPatients: {
    method: 'GET',
    path: '/api/patients',
    description: 'Get paginated list of patients with optional filters',
  } as Endpoint<GetPatientsParams, PaginatedResponse<Patient>>,

  getPatient: {
    method: 'GET',
    path: '/api/patients/:id',
    description: 'Get patient by ID',
  } as Endpoint<{ id: string }, ApiResponse<Patient>>,

  createPatient: {
    method: 'POST',
    path: '/api/patients',
    description: 'Create a new patient',
  } as Endpoint<CreatePatientRequest, ApiResponse<Patient>>,

  updatePatient: {
    method: 'PUT',
    path: '/api/patients/:id',
    description: 'Update patient by ID',
  } as Endpoint<{ id: string; data: UpdatePatientRequest }, ApiResponse<Patient>>,

  deletePatient: {
    method: 'DELETE',
    path: '/api/patients/:id',
    description: 'Delete patient by ID',
  } as Endpoint<{ id: string }, ApiResponse<{ message: string }>>,

  searchPatients: {
    method: 'GET',
    path: '/api/patients/search',
    description: 'Search patients by name, phone, or aadhaar',
  } as Endpoint<{ query: string }, ApiResponse<Patient[]>>,
};
