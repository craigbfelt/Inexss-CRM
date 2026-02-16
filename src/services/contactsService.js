import supabaseClient from '../lib/supabaseClient';

export const contactsService = {
  // Get all contacts
  getAll: async () => {
    const { data, error } = await supabaseClient
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get single contact
  getById: async (id) => {
    const { data, error } = await supabaseClient
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create contact
  create: async (contact) => {
    const { data, error } = await supabaseClient
      .from('contacts')
      .insert([contact])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update contact
  update: async ({ id, ...contact }) => {
    const { data, error } = await supabaseClient
      .from('contacts')
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
      .from('contacts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { id };
  },
};
