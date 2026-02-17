import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsService } from '../services';

export function useLeads() {
  return useQuery({
    queryKey: ['leads'],
    queryFn: leadsService.getAllLeads,
  });
}

export function useLead(id) {
  return useQuery({
    queryKey: ['leads', id],
    queryFn: () => leadsService.getLeadById(id),
    enabled: !!id,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leadsService.createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updates }) => leadsService.updateLead(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads', data.id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useConvertLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newStatus }) => leadsService.convertLead(id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leadsService.deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
