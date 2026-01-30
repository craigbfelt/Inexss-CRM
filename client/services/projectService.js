import supabase from '../lib/supabase';

// Get all projects with related data
export const getProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      client:clients(id, name, company),
      created_by:users(name),
      project_brands(
        brand:brands(id, name, is_active)
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Flatten brand data for easier use
  return data.map(project => ({
    ...project,
    brands: project.project_brands?.map(pb => pb.brand).filter(b => b.is_active) || []
  }));
};

// Get single project with full details
export const getProject = async (id) => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      client:clients(id, name, company, email, phone),
      created_by:users(name),
      project_brands(
        brand:brands(id, name, description, category, is_active)
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  // Flatten brand data
  return {
    ...data,
    brands: data.project_brands?.map(pb => pb.brand).filter(b => b.is_active) || []
  };
};

// Get projects by client
export const getProjectsByClient = async (clientId) => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      created_by:users(name),
      project_brands(
        brand:brands(id, name, is_active)
      )
    `)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return data.map(project => ({
    ...project,
    brands: project.project_brands?.map(pb => pb.brand).filter(b => b.is_active) || []
  }));
};

// Get projects by brand
export const getProjectsByBrand = async (brandId) => {
  const { data, error } = await supabase
    .from('project_brands')
    .select(`
      project:projects(
        *,
        client:clients(id, name, company),
        created_by:users(name)
      )
    `)
    .eq('brand_id', brandId);
  
  if (error) throw error;
  return data.map(pb => pb.project);
};

// Create project with brands
export const createProject = async (projectData) => {
  const { brands, ...projectFields } = projectData;
  
  // Insert project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert([projectFields])
    .select()
    .single();
  
  if (projectError) throw projectError;
  
  // Insert project-brand relationships if brands provided
  if (brands && brands.length > 0) {
    const projectBrands = brands.map(brandId => ({
      project_id: project.id,
      brand_id: brandId
    }));
    
    const { error: brandsError } = await supabase
      .from('project_brands')
      .insert(projectBrands);
    
    if (brandsError) throw brandsError;
  }
  
  // Return full project data
  return getProject(project.id);
};

// Update project and brands
export const updateProject = async (id, projectData) => {
  const { brands, ...projectFields } = projectData;
  
  // Update project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .update(projectFields)
    .eq('id', id)
    .select()
    .single();
  
  if (projectError) throw projectError;
  
  // Update brands if provided
  if (brands !== undefined) {
    // Delete existing brand associations
    const { error: deleteError } = await supabase
      .from('project_brands')
      .delete()
      .eq('project_id', id);
    
    if (deleteError) throw deleteError;
    
    // Insert new brand associations
    if (brands.length > 0) {
      const projectBrands = brands.map(brandId => ({
        project_id: id,
        brand_id: brandId
      }));
      
      const { error: insertError } = await supabase
        .from('project_brands')
        .insert(projectBrands);
      
      if (insertError) throw insertError;
    }
  }
  
  // Return full project data
  return getProject(id);
};

// Delete project
export const deleteProject = async (id) => {
  // Project brands will be deleted automatically via CASCADE
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Add brand to project
export const addBrandToProject = async (projectId, brandId) => {
  const { data, error } = await supabase
    .from('project_brands')
    .insert([{ project_id: projectId, brand_id: brandId }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Remove brand from project
export const removeBrandFromProject = async (projectId, brandId) => {
  const { error } = await supabase
    .from('project_brands')
    .delete()
    .eq('project_id', projectId)
    .eq('brand_id', brandId);
  
  if (error) throw error;
};
