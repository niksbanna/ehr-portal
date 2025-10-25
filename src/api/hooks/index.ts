/**
 * React Query hooks for API endpoints
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { Patient, Encounter, LabResult, Prescription } from '../../types/index';
import { 
  PaginatedResponse, 
  ApiResponse, 
  GetPatientsParams,
  GetEncountersParams,
  GetLabResultsParams,
  GetPrescriptionsParams,
  GetDrugsParams,
  GetICD10CodesParams,
  Drug,
  ICD10Code,
  CreatePatientRequest,
  UpdatePatientRequest,
  CreateEncounterRequest,
  UpdateEncounterRequest,
  CreateLabResultRequest,
  UpdateLabResultRequest,
  CreatePrescriptionRequest,
} from '../schema';

// API client functions
async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('auth_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

// Patient hooks
export function usePatients(params?: GetPatientsParams, options?: UseQueryOptions<PaginatedResponse<Patient>>) {
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  return useQuery<PaginatedResponse<Patient>>({
    queryKey: ['patients', params],
    queryFn: () => fetchJson<PaginatedResponse<Patient>>(`/api/patients?${queryString}`),
    ...options,
  });
}

export function usePatient(id: string, options?: UseQueryOptions<ApiResponse<Patient>>) {
  return useQuery<ApiResponse<Patient>>({
    queryKey: ['patients', id],
    queryFn: () => fetchJson<ApiResponse<Patient>>(`/api/patients/${id}`),
    enabled: !!id,
    ...options,
  });
}

export function useCreatePatient(options?: UseMutationOptions<ApiResponse<Patient>, Error, CreatePatientRequest>) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Patient>, Error, CreatePatientRequest>({
    mutationFn: (data) => fetchJson<ApiResponse<Patient>>('/api/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    ...options,
  });
}

export function useUpdatePatient(options?: UseMutationOptions<ApiResponse<Patient>, Error, { id: string; data: UpdatePatientRequest }>) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Patient>, Error, { id: string; data: UpdatePatientRequest }>({
    mutationFn: ({ id, data }) => fetchJson<ApiResponse<Patient>>(`/api/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patients', variables.id] });
    },
    ...options,
  });
}

export function useDeletePatient(options?: UseMutationOptions<ApiResponse<{ message: string }>, Error, string>) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<{ message: string }>, Error, string>({
    mutationFn: (id) => fetchJson<ApiResponse<{ message: string }>>(`/api/patients/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    ...options,
  });
}

// Encounter hooks
export function useEncounters(params?: GetEncountersParams, options?: UseQueryOptions<PaginatedResponse<Encounter>>) {
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  return useQuery<PaginatedResponse<Encounter>>({
    queryKey: ['encounters', params],
    queryFn: () => fetchJson<PaginatedResponse<Encounter>>(`/api/encounters?${queryString}`),
    ...options,
  });
}

export function useEncounter(id: string, options?: UseQueryOptions<ApiResponse<Encounter>>) {
  return useQuery<ApiResponse<Encounter>>({
    queryKey: ['encounters', id],
    queryFn: () => fetchJson<ApiResponse<Encounter>>(`/api/encounters/${id}`),
    enabled: !!id,
    ...options,
  });
}

export function usePatientEncounters(patientId: string, params?: { page?: number; limit?: number }, options?: UseQueryOptions<PaginatedResponse<Encounter>>) {
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  return useQuery<PaginatedResponse<Encounter>>({
    queryKey: ['patients', patientId, 'encounters', params],
    queryFn: () => fetchJson<PaginatedResponse<Encounter>>(`/api/patients/${patientId}/encounters?${queryString}`),
    enabled: !!patientId,
    ...options,
  });
}

export function useCreateEncounter(options?: UseMutationOptions<ApiResponse<Encounter>, Error, CreateEncounterRequest>) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Encounter>, Error, CreateEncounterRequest>({
    mutationFn: (data) => fetchJson<ApiResponse<Encounter>>('/api/encounters', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['encounters'] });
    },
    ...options,
  });
}

export function useUpdateEncounter(options?: UseMutationOptions<ApiResponse<Encounter>, Error, { id: string; data: UpdateEncounterRequest }>) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Encounter>, Error, { id: string; data: UpdateEncounterRequest }>({
    mutationFn: ({ id, data }) => fetchJson<ApiResponse<Encounter>>(`/api/encounters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['encounters'] });
      queryClient.invalidateQueries({ queryKey: ['encounters', variables.id] });
    },
    ...options,
  });
}

// Lab result hooks
export function useLabResults(params?: GetLabResultsParams, options?: UseQueryOptions<PaginatedResponse<LabResult>>) {
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  return useQuery<PaginatedResponse<LabResult>>({
    queryKey: ['labs', params],
    queryFn: () => fetchJson<PaginatedResponse<LabResult>>(`/api/labs?${queryString}`),
    ...options,
  });
}

export function useLabResult(id: string, options?: UseQueryOptions<ApiResponse<LabResult>>) {
  return useQuery<ApiResponse<LabResult>>({
    queryKey: ['labs', id],
    queryFn: () => fetchJson<ApiResponse<LabResult>>(`/api/labs/${id}`),
    enabled: !!id,
    ...options,
  });
}

export function usePatientLabResults(patientId: string, params?: { page?: number; limit?: number }, options?: UseQueryOptions<PaginatedResponse<LabResult>>) {
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  return useQuery<PaginatedResponse<LabResult>>({
    queryKey: ['patients', patientId, 'labs', params],
    queryFn: () => fetchJson<PaginatedResponse<LabResult>>(`/api/patients/${patientId}/labs?${queryString}`),
    enabled: !!patientId,
    ...options,
  });
}

export function useCreateLabResult(options?: UseMutationOptions<ApiResponse<LabResult>, Error, CreateLabResultRequest>) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<LabResult>, Error, CreateLabResultRequest>({
    mutationFn: (data) => fetchJson<ApiResponse<LabResult>>('/api/labs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labs'] });
    },
    ...options,
  });
}

export function useUpdateLabResult(options?: UseMutationOptions<ApiResponse<LabResult>, Error, { id: string; data: UpdateLabResultRequest }>) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<LabResult>, Error, { id: string; data: UpdateLabResultRequest }>({
    mutationFn: ({ id, data }) => fetchJson<ApiResponse<LabResult>>(`/api/labs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['labs'] });
      queryClient.invalidateQueries({ queryKey: ['labs', variables.id] });
    },
    ...options,
  });
}

// Prescription hooks
export function usePrescriptions(params?: GetPrescriptionsParams, options?: UseQueryOptions<PaginatedResponse<Prescription>>) {
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  return useQuery<PaginatedResponse<Prescription>>({
    queryKey: ['prescriptions', params],
    queryFn: () => fetchJson<PaginatedResponse<Prescription>>(`/api/prescriptions?${queryString}`),
    ...options,
  });
}

export function usePrescription(id: string, options?: UseQueryOptions<ApiResponse<Prescription>>) {
  return useQuery<ApiResponse<Prescription>>({
    queryKey: ['prescriptions', id],
    queryFn: () => fetchJson<ApiResponse<Prescription>>(`/api/prescriptions/${id}`),
    enabled: !!id,
    ...options,
  });
}

export function usePatientPrescriptions(patientId: string, params?: { page?: number; limit?: number }, options?: UseQueryOptions<PaginatedResponse<Prescription>>) {
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  return useQuery<PaginatedResponse<Prescription>>({
    queryKey: ['patients', patientId, 'prescriptions', params],
    queryFn: () => fetchJson<PaginatedResponse<Prescription>>(`/api/patients/${patientId}/prescriptions?${queryString}`),
    enabled: !!patientId,
    ...options,
  });
}

export function useCreatePrescription(options?: UseMutationOptions<ApiResponse<Prescription>, Error, CreatePrescriptionRequest>) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Prescription>, Error, CreatePrescriptionRequest>({
    mutationFn: (data) => fetchJson<ApiResponse<Prescription>>('/api/prescriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
    ...options,
  });
}

// Drug hooks
export function useDrugs(params?: GetDrugsParams, options?: UseQueryOptions<PaginatedResponse<Drug>>) {
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  return useQuery<PaginatedResponse<Drug>>({
    queryKey: ['drugs', params],
    queryFn: () => fetchJson<PaginatedResponse<Drug>>(`/api/drugs?${queryString}`),
    ...options,
  });
}

export function useDrug(id: string, options?: UseQueryOptions<ApiResponse<Drug>>) {
  return useQuery<ApiResponse<Drug>>({
    queryKey: ['drugs', id],
    queryFn: () => fetchJson<ApiResponse<Drug>>(`/api/drugs/${id}`),
    enabled: !!id,
    ...options,
  });
}

export function useSearchDrugs(query: string, options?: UseQueryOptions<ApiResponse<Drug[]>>) {
  return useQuery<ApiResponse<Drug[]>>({
    queryKey: ['drugs', 'search', query],
    queryFn: () => fetchJson<ApiResponse<Drug[]>>(`/api/drugs/search?query=${encodeURIComponent(query)}`),
    enabled: query.length > 0,
    ...options,
  });
}

// ICD-10 hooks
export function useICD10Codes(params?: GetICD10CodesParams, options?: UseQueryOptions<PaginatedResponse<ICD10Code>>) {
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  return useQuery<PaginatedResponse<ICD10Code>>({
    queryKey: ['icd10', params],
    queryFn: () => fetchJson<PaginatedResponse<ICD10Code>>(`/api/icd10?${queryString}`),
    ...options,
  });
}

export function useICD10Code(code: string, options?: UseQueryOptions<ApiResponse<ICD10Code>>) {
  return useQuery<ApiResponse<ICD10Code>>({
    queryKey: ['icd10', code],
    queryFn: () => fetchJson<ApiResponse<ICD10Code>>(`/api/icd10/${code}`),
    enabled: !!code,
    ...options,
  });
}

export function useSearchICD10Codes(query: string, options?: UseQueryOptions<ApiResponse<ICD10Code[]>>) {
  return useQuery<ApiResponse<ICD10Code[]>>({
    queryKey: ['icd10', 'search', query],
    queryFn: () => fetchJson<ApiResponse<ICD10Code[]>>(`/api/icd10/search?query=${encodeURIComponent(query)}`),
    enabled: query.length > 0,
    ...options,
  });
}

export function useICD10Categories(options?: UseQueryOptions<ApiResponse<string[]>>) {
  return useQuery<ApiResponse<string[]>>({
    queryKey: ['icd10', 'categories'],
    queryFn: () => fetchJson<ApiResponse<string[]>>('/api/icd10/categories'),
    ...options,
  });
}
