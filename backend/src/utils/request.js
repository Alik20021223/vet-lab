export async function parseRequestData(request) {
  const contentType = request.headers['content-type'] || '';
  
  if (contentType.includes('multipart/form-data')) {
    // Handle multipart form data
    const data = {};
    const parts = request.parts();
    
    for await (const part of parts) {
      if (part.file) {
        // File upload
        data[part.fieldname] = part;
      } else {
        // Text field
        const value = part.value;
        if (part.fieldname === 'categoryId' || part.fieldname === 'order' || part.fieldname === 'price') {
          data[part.fieldname] = value ? (part.fieldname === 'price' ? parseFloat(value) : value) : undefined;
        } else {
          data[part.fieldname] = value;
        }
      }
    }
    
    return data;
  } else {
    // Handle JSON body
    return request.body || {};
  }
}

