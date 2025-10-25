/**
 * ICD-10 Codes API Schema
 */

import { ApiResponse, PaginatedResponse, Endpoint, PaginationParams, SortParams, FilterParams } from './common';

// ICD-10 Code structure
export interface ICD10Code {
  code: string;
  description: string;
  category: string;
  subcategory?: string;
  notes?: string;
  includes?: string[];
  excludes?: string[];
}

export interface ICD10FilterParams extends FilterParams {
  search?: string;
  category?: string;
  subcategory?: string;
}

export interface GetICD10CodesParams extends PaginationParams, SortParams, ICD10FilterParams {}

// Endpoints
export const ICD10Endpoints = {
  getICD10Codes: {
    method: 'GET',
    path: '/api/icd10',
    description: 'Get paginated list of ICD-10 codes with optional filters',
  } as Endpoint<GetICD10CodesParams, PaginatedResponse<ICD10Code>>,

  getICD10Code: {
    method: 'GET',
    path: '/api/icd10/:code',
    description: 'Get ICD-10 code by code',
  } as Endpoint<{ code: string }, ApiResponse<ICD10Code>>,

  searchICD10Codes: {
    method: 'GET',
    path: '/api/icd10/search',
    description: 'Search ICD-10 codes by description or code',
  } as Endpoint<{ query: string }, ApiResponse<ICD10Code[]>>,

  getICD10Categories: {
    method: 'GET',
    path: '/api/icd10/categories',
    description: 'Get list of ICD-10 categories',
  } as Endpoint<void, ApiResponse<string[]>>,
};
