import supabase from '../lib/supabase';

// Get all brands
export const getBrands = async () => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
};

// Get single brand
export const getBrand = async (id) => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// Create brand
export const createBrand = async (brandData) => {
  const { data, error } = await supabase
    .from('brands')
    .insert([brandData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Update brand
export const updateBrand = async (id, brandData) => {
  const { data, error } = await supabase
    .from('brands')
    .update(brandData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Delete brand
export const deleteBrand = async (id) => {
  const { error } = await supabase
    .from('brands')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
