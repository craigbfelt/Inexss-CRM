import supabaseClient from '../lib/supabaseClient';

export const contactsService = {
  // Get all contacts (using clients table)
  getAll: async () => {
    const { data, error } = await supabaseClient
      .from('clients')
      .select(`
        *,
        created_by_user:users!created_by(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get single contact
  getById: async (id) => {
    const { data, error } = await supabaseClient
      .from('clients')
      .select(`
        *,
        created_by_user:users!created_by(name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create contact
  create: async (contact) => {
    const { data, error } = await supabaseClient
      .from('clients')
      .insert([contact])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update contact
  update: async ({ id, ...contact }) => {
    const { data, error } = await supabaseClient
      .from('clients')
      .update(contact)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete contact
  delete: async (id) => {
    const { error } = await supabaseClient
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { id };
  },

  // Get contacts by type
  getByType: async (type) => {
    const { data, error } = await supabaseClient
      .from('clients')
      .select(`
        *,
        created_by_user:users!created_by(name)
      `)
      .eq('type', type)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },
};

