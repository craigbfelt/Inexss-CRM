import supabase from '../lib/supabase';

// Get all meetings with related data
export const getMeetings = async () => {
  const { data, error } = await supabase
    .from('meetings')
    .select(`
      *,
      client:clients(id, name, company),
      project:projects(id, name, project_number),
      created_by:users(id, name),
      brand_discussions(
        id,
        is_required,
        notes,
        estimated_value,
        brand:brands(id, name, category, is_active)
      ),
      action_items(
        id,
        description,
        due_date,
        completed,
        assigned_to:users(id, name)
      )
    `)
    .order('meeting_date', { ascending: false });
  
  if (error) throw error;
  
  // Filter out inactive brands from discussions
  return data.map(meeting => ({
    ...meeting,
    brand_discussions: meeting.brand_discussions?.filter(bd => bd.brand?.is_active) || [],
    action_items: meeting.action_items || []
  }));
};

// Get single meeting with full details
export const getMeeting = async (id) => {
  const { data, error } = await supabase
    .from('meetings')
    .select(`
      *,
      client:clients(id, name, company, email, phone),
      project:projects(id, name, project_number, status),
      created_by:users(id, name, email),
      brand_discussions(
        id,
        is_required,
        notes,
        estimated_value,
        brand:brands(id, name, category, description, is_active)
      ),
      action_items(
        id,
        description,
        due_date,
        completed,
        created_at,
        assigned_to:users(id, name, email)
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  return {
    ...data,
    brand_discussions: data.brand_discussions?.filter(bd => bd.brand?.is_active) || [],
    action_items: data.action_items || []
  };
};

// Get meetings by client
export const getMeetingsByClient = async (clientId) => {
  const { data, error } = await supabase
    .from('meetings')
    .select(`
      *,
      project:projects(id, name, project_number),
      created_by:users(id, name),
      brand_discussions(
        id,
        brand:brands(id, name, is_active)
      ),
      action_items(id, completed)
    `)
    .eq('client_id', clientId)
    .order('meeting_date', { ascending: false });
  
  if (error) throw error;
  
  return data.map(meeting => ({
    ...meeting,
    brand_discussions: meeting.brand_discussions?.filter(bd => bd.brand?.is_active) || [],
    action_items: meeting.action_items || []
  }));
};

// Get meetings by project
export const getMeetingsByProject = async (projectId) => {
  const { data, error } = await supabase
    .from('meetings')
    .select(`
      *,
      client:clients(id, name, company),
      created_by:users(id, name),
      brand_discussions(
        id,
        brand:brands(id, name, is_active)
      ),
      action_items(id, completed)
    `)
    .eq('project_id', projectId)
    .order('meeting_date', { ascending: false });
  
  if (error) throw error;
  
  return data.map(meeting => ({
    ...meeting,
    brand_discussions: meeting.brand_discussions?.filter(bd => bd.brand?.is_active) || [],
    action_items: meeting.action_items || []
  }));
};

// Create meeting with discussions and action items
export const createMeeting = async (meetingData) => {
  const { brand_discussions, action_items, ...meetingFields } = meetingData;
  
  // Insert meeting
  const { data: meeting, error: meetingError } = await supabase
    .from('meetings')
    .insert([meetingFields])
    .select()
    .single();
  
  if (meetingError) throw meetingError;
  
  // Insert brand discussions if provided
  if (brand_discussions && brand_discussions.length > 0) {
    const discussions = brand_discussions.map(discussion => ({
      meeting_id: meeting.id,
      brand_id: discussion.brand_id,
      is_required: discussion.is_required || false,
      notes: discussion.notes,
      estimated_value: discussion.estimated_value
    }));
    
    const { error: discussionsError } = await supabase
      .from('brand_discussions')
      .insert(discussions);
    
    if (discussionsError) throw discussionsError;
  }
  
  // Insert action items if provided
  if (action_items && action_items.length > 0) {
    const items = action_items.map(item => ({
      meeting_id: meeting.id,
      description: item.description,
      assigned_to: item.assigned_to,
      due_date: item.due_date,
      completed: item.completed || false
    }));
    
    const { error: itemsError } = await supabase
      .from('action_items')
      .insert(items);
    
    if (itemsError) throw itemsError;
  }
  
  // Return full meeting data
  return getMeeting(meeting.id);
};

// Update meeting
export const updateMeeting = async (id, meetingData) => {
  const { brand_discussions, action_items, ...meetingFields } = meetingData;
  
  // Update meeting
  const { data: meeting, error: meetingError } = await supabase
    .from('meetings')
    .update(meetingFields)
    .eq('id', id)
    .select()
    .single();
  
  if (meetingError) throw meetingError;
  
  // Update brand discussions if provided
  if (brand_discussions !== undefined) {
    // Delete existing discussions
    const { error: deleteDiscussionsError } = await supabase
      .from('brand_discussions')
      .delete()
      .eq('meeting_id', id);
    
    if (deleteDiscussionsError) throw deleteDiscussionsError;
    
    // Insert new discussions
    if (brand_discussions.length > 0) {
      const discussions = brand_discussions.map(discussion => ({
        meeting_id: id,
        brand_id: discussion.brand_id,
        is_required: discussion.is_required || false,
        notes: discussion.notes,
        estimated_value: discussion.estimated_value
      }));
      
      const { error: insertDiscussionsError } = await supabase
        .from('brand_discussions')
        .insert(discussions);
      
      if (insertDiscussionsError) throw insertDiscussionsError;
    }
  }
  
  // Update action items if provided
  if (action_items !== undefined) {
    // Delete existing action items
    const { error: deleteItemsError } = await supabase
      .from('action_items')
      .delete()
      .eq('meeting_id', id);
    
    if (deleteItemsError) throw deleteItemsError;
    
    // Insert new action items
    if (action_items.length > 0) {
      const items = action_items.map(item => ({
        meeting_id: id,
        description: item.description,
        assigned_to: item.assigned_to,
        due_date: item.due_date,
        completed: item.completed || false
      }));
      
      const { error: insertItemsError } = await supabase
        .from('action_items')
        .insert(items);
      
      if (insertItemsError) throw insertItemsError;
    }
  }
  
  // Return full meeting data
  return getMeeting(id);
};

// Delete meeting
export const deleteMeeting = async (id) => {
  // Brand discussions and action items will be deleted automatically via CASCADE
  const { error } = await supabase
    .from('meetings')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Add brand discussion to meeting
export const addBrandDiscussion = async (meetingId, discussionData) => {
  const { data, error } = await supabase
    .from('brand_discussions')
    .insert([{ 
      meeting_id: meetingId,
      ...discussionData 
    }])
    .select(`
      *,
      brand:brands(id, name, category, is_active)
    `)
    .single();
  
  if (error) throw error;
  return data;
};

// Update brand discussion
export const updateBrandDiscussion = async (id, discussionData) => {
  const { data, error } = await supabase
    .from('brand_discussions')
    .update(discussionData)
    .eq('id', id)
    .select(`
      *,
      brand:brands(id, name, category, is_active)
    `)
    .single();
  
  if (error) throw error;
  return data;
};

// Delete brand discussion
export const deleteBrandDiscussion = async (id) => {
  const { error } = await supabase
    .from('brand_discussions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Add action item to meeting
export const addActionItem = async (meetingId, itemData) => {
  const { data, error } = await supabase
    .from('action_items')
    .insert([{ 
      meeting_id: meetingId,
      ...itemData 
    }])
    .select(`
      *,
      assigned_to:users(id, name, email)
    `)
    .single();
  
  if (error) throw error;
  return data;
};

// Update action item
export const updateActionItem = async (id, itemData) => {
  const { data, error } = await supabase
    .from('action_items')
    .update(itemData)
    .eq('id', id)
    .select(`
      *,
      assigned_to:users(id, name, email)
    `)
    .single();
  
  if (error) throw error;
  return data;
};

// Delete action item
export const deleteActionItem = async (id) => {
  const { error } = await supabase
    .from('action_items')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Toggle action item completion
export const toggleActionItemCompletion = async (id) => {
  // First get current state
  const { data: currentItem, error: fetchError } = await supabase
    .from('action_items')
    .select('completed')
    .eq('id', id)
    .single();
  
  if (fetchError) throw fetchError;
  
  // Toggle completion
  const { data, error } = await supabase
    .from('action_items')
    .update({ completed: !currentItem.completed })
    .eq('id', id)
    .select(`
      *,
      assigned_to:users(id, name, email)
    `)
    .single();
  
  if (error) throw error;
  return data;
};
