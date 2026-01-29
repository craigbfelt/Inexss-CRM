import supabase from '../lib/supabase';

// Get all clients
export const getClients = async () => {
  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      created_by:users(name)
    `)
    .eq('is_active', true)
    .order('name');
  
  if (error) throw error;
  return data;
};

// Get single client
export const getClient = async (id) => {
  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      created_by:users(name)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// Create client
export const createClient = async (clientData) => {
  const { data, error } = await supabase
    .from('clients')
    .insert([clientData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Update client
export const updateClient = async (id, clientData) => {
  const { data, error } = await supabase
    .from('clients')
    .update(clientData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Delete client
export const deleteClient = async (id) => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
