import supabaseClient from '../lib/supabaseClient';

export const projectsService = {
  // Get all projects
  getAllProjects: async () => {
    const { data, error } = await supabaseClient
      .from('projects')
      .select(`
        *,
        client:clients(name, company, type),
        created_by_user:users!created_by(name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get project by ID
  getProjectById: async (id) => {
    const { data, error } = await supabaseClient
      .from('projects')
      .select(`
        *,
        client:clients(*),
        created_by_user:users!created_by(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new project
  createProject: async (project) => {
    const { data, error } = await supabaseClient
      .from('projects')
      .insert([project])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a project
  updateProject: async (id, updates) => {
    const { data, error } = await supabaseClient
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a project
  deleteProject: async (id) => {
    const { error } = await supabaseClient
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get projects by status
  getProjectsByStatus: async (status) => {
    const { data, error } = await supabaseClient
      .from('projects')
      .select(`
        *,
        client:clients(name, company, type),
        created_by_user:users!created_by(name)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get projects by client
  getProjectsByClient: async (clientId) => {
    const { data, error } = await supabaseClient
      .from('projects')
      .select(`
        *,
        client:clients(name, company, type),
        created_by_user:users!created_by(name)
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
