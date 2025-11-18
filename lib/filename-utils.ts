/**
 * Utility functions for Vietnamese filename processing and slug generation
 */

/**
 * Convert Vietnamese characters to ASCII equivalents
 */
function removeVietnameseAccents(str: string): string {
  const vietnameseMap: { [key: string]: string } = {
    'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
    'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
    'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
    'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
    'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
    'đ': 'd',
    'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A', 'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
    'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
    'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
    'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
    'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
    'Đ': 'D'
  };

  return str.split('').map(char => vietnameseMap[char] || char).join('');
}

/**
 * Generate a clean URL-safe slug from filename
 */
export function generateFileSlug(filename: string): string {
  // Split filename and extension
  const lastDotIndex = filename.lastIndexOf('.');
  const name = lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
  const extension = lastDotIndex > 0 ? filename.substring(lastDotIndex) : '';

  // Convert Vietnamese to ASCII
  let slug = removeVietnameseAccents(name);
  
  // Convert to lowercase and replace spaces/special chars with hyphens
  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  // If slug is empty after processing, use default
  if (!slug) {
    slug = 'file';
  }

  return slug + extension;
}

/**
 * Generate smart filename with metadata when duplicates exist
 */
export function generateSmartFilename(
  originalFilename: string,
  employeeInfo?: {
    name?: string;
    department?: string;
    employeeId?: string;
  },
  duplicateCount: number = 0
): {
  slug: string;
  displayName: string;
  metadata: string;
} {
  const baseSlug = generateFileSlug(originalFilename);
  
  let metadata = '';
  let suffix = '';

  // Add metadata based on context
  if (employeeInfo) {
    const parts = [];
    
    if (employeeInfo.employeeId) {
      parts.push(`nv${employeeInfo.employeeId}`);
    }
    
    if (employeeInfo.department) {
      const deptSlug = generateFileSlug(employeeInfo.department).replace(/\.[^.]*$/, '');
      parts.push(deptSlug);
    }

    if (parts.length > 0) {
      metadata = parts.join('-');
    }
  }

  // Add duplicate counter if needed
  if (duplicateCount > 0) {
    suffix = `-v${duplicateCount + 1}`;
  }

  // Construct final slug
  const extension = baseSlug.includes('.') ? baseSlug.substring(baseSlug.lastIndexOf('.')) : '';
  const nameWithoutExt = baseSlug.replace(extension, '');
  
  let finalSlug = nameWithoutExt;
  if (metadata) {
    finalSlug += `-${metadata}`;
  }
  if (suffix) {
    finalSlug += suffix;
  }
  finalSlug += extension;

  // Generate display name with metadata info
  let displayName = originalFilename;
  if (duplicateCount > 0 || metadata) {
    const displayParts = [];
    if (metadata) {
      displayParts.push(`${employeeInfo?.name || 'NV'} - ${employeeInfo?.department || ''}`);
    }
    if (duplicateCount > 0) {
      displayParts.push(`v${duplicateCount + 1}`);
    }
    
    if (displayParts.length > 0) {
      const nameWithoutExt = originalFilename.replace(/\.[^.]*$/, '');
      const ext = originalFilename.match(/\.[^.]*$/)?.[0] || '';
      displayName = `${nameWithoutExt} (${displayParts.join(', ')})${ext}`;
    }
  }

  return {
    slug: finalSlug,
    displayName: displayName,
    metadata: metadata || 'none'
  };
}

/**
 * Extract employee info from context for smart naming
 */
export function extractEmployeeContext(context: any): {
  name?: string;
  department?: string;
  employeeId?: string;
} {
  return {
    name: context?.employee?.name || context?.name,
    department: context?.employee?.department || context?.department,
    employeeId: context?.employee?.id || context?.employeeId || context?.id
  };
}

/**
 * Check if two filenames would conflict after slug conversion
 */
export function wouldConflict(filename1: string, filename2: string): boolean {
  return generateFileSlug(filename1) === generateFileSlug(filename2);
}

// Export examples for testing
export const examples = {
  // Vietnamese filename examples
  vietnamese: [
    'Hợp đồng lao động.pdf',
    'Bằng cấp chứng chỉ.docx', 
    'Đơn xin nghỉ phép.doc',
    'Báo cáo tháng 10.xlsx'
  ],
  
  // Expected slug outputs
  expectedSlugs: [
    'hop-dong-lao-dong.pdf',
    'bang-cap-chung-chi.docx',
    'don-xin-nghi-phep.doc', 
    'bao-cao-thang-10.xlsx'
  ]
};
