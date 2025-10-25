/**
 * Prescription and Drugs API Schema
 */

import { ApiResponse, PaginatedResponse, Endpoint, PaginationParams, SortParams, FilterParams } from './common';
import { Prescription } from '../../types/index';

// Request/Response Types
export type CreatePrescriptionRequest = Omit<Prescription, 'id'>;

export type UpdatePrescriptionRequest = Partial<Omit<Prescription, 'id'>>;

export interface PrescriptionFilterParams extends FilterParams {
  patientId?: string;
  doctorId?: string;
  encounterId?: string;
  status?: 'active' | 'completed' | 'discontinued';
  dateFrom?: string;
  dateTo?: string;
}

export interface GetPrescriptionsParams extends PaginationParams, SortParams, PrescriptionFilterParams {}

export interface Drug {
  id: string;
  name: string;
  genericName: string;
  category: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  price: number;
  stock: number;
  rxRequired: boolean;
  description?: string;
}

export interface DrugFilterParams extends FilterParams {
  search?: string;
  category?: string;
  rxRequired?: boolean;
  inStock?: boolean;
}

export interface GetDrugsParams extends PaginationParams, SortParams, DrugFilterParams {}

// Endpoints
export const PrescriptionEndpoints = {
  getPrescriptions: {
    method: 'GET',
    path: '/api/prescriptions',
    description: 'Get paginated list of prescriptions with optional filters',
  } as Endpoint<GetPrescriptionsParams, PaginatedResponse<Prescription>>,

  getPrescription: {
    method: 'GET',
    path: '/api/prescriptions/:id',
    description: 'Get prescription by ID',
  } as Endpoint<{ id: string }, ApiResponse<Prescription>>,

  createPrescription: {
    method: 'POST',
    path: '/api/prescriptions',
    description: 'Create a new prescription',
  } as Endpoint<CreatePrescriptionRequest, ApiResponse<Prescription>>,

  updatePrescription: {
    method: 'PUT',
    path: '/api/prescriptions/:id',
    description: 'Update prescription by ID',
  } as Endpoint<{ id: string; data: UpdatePrescriptionRequest }, ApiResponse<Prescription>>,

  deletePrescription: {
    method: 'DELETE',
    path: '/api/prescriptions/:id',
    description: 'Delete prescription by ID',
  } as Endpoint<{ id: string }, ApiResponse<{ message: string }>>,

  getPatientPrescriptions: {
    method: 'GET',
    path: '/api/patients/:patientId/prescriptions',
    description: 'Get all prescriptions for a specific patient',
  } as Endpoint<{ patientId: string } & PaginationParams, PaginatedResponse<Prescription>>,

  getEncounterPrescriptions: {
    method: 'GET',
    path: '/api/encounters/:encounterId/prescriptions',
    description: 'Get all prescriptions for a specific encounter',
  } as Endpoint<{ encounterId: string }, ApiResponse<Prescription[]>>,
};

export const DrugEndpoints = {
  getDrugs: {
    method: 'GET',
    path: '/api/drugs',
    description: 'Get paginated list of drugs with optional filters',
  } as Endpoint<GetDrugsParams, PaginatedResponse<Drug>>,

  getDrug: {
    method: 'GET',
    path: '/api/drugs/:id',
    description: 'Get drug by ID',
  } as Endpoint<{ id: string }, ApiResponse<Drug>>,

  searchDrugs: {
    method: 'GET',
    path: '/api/drugs/search',
    description: 'Search drugs by name or generic name',
  } as Endpoint<{ query: string }, ApiResponse<Drug[]>>,
};
