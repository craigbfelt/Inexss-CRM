import supabaseClient from '../lib/supabaseClient';

export const leadsService = {
  // Get all leads (projects with Lead status)
  getAllLeads: async () => {
    const { data, error } = await supabaseClient
      .from('projects')
      .select(`
        *,
        client:clients(name, company, type, email, phone),
        created_by_user:users!created_by(name)
      `)
      .eq('status', 'Lead')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get lead by ID
  getLeadById: async (id) => {
    const { data, error } = await supabaseClient
      .from('projects')
      .select(`
        *,
        client:clients(*),
        created_by_user:users!created_by(*)
      `)
      .eq('id', id)
      .eq('status', 'Lead')
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new lead
  createLead: async (lead) => {
    // Ensure status is set to Lead
    const leadData = { ...lead, status: 'Lead' };
    
    const { data, error } = await supabaseClient
      .from('projects')
      .insert([leadData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a lead
  updateLead: async (id, updates) => {
    const { data, error } = await supabaseClient
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Convert lead to quoted/in progress
  convertLead: async (id, newStatus) => {
    const { data, error } = await supabaseClient
      .from('projects')
      .update({ status: newStatus })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a lead
  deleteLead: async (id) => {
    const { error } = await supabaseClient
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
