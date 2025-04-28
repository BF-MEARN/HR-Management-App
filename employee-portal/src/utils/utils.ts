import { Draft, WritableDraft } from 'immer';

/**
 * Mutates the given draft object by applying a shallow smart update from the patch object.
 *
 * ✅ Supports:
 * - Primitive fields (e.g., string, number, boolean)
 * - Arrays (fully replaced)
 * - Level 1 nested objects (shallow merge via Object.assign)
 *
 * ⚠️ Does NOT support:
 * - Deeply nested merging beyond one level
 * - Merging of arrays (arrays will be overwritten, not merged)
 * - Preserving undefined or null structures
 *
 * Designed for use with Immer (WritableDraft<T>).
 */
export function smartUpdate<T>(target: WritableDraft<T>, patch: DeepPartial<T>) {
  for (const key in patch) {
    const patchValue = patch[key];
    if (patchValue === undefined) continue;

    const targetValue = target[key];
    if (
      patchValue &&
      typeof patchValue === 'object' &&
      !Array.isArray(patchValue) &&
      typeof targetValue === 'object' &&
      targetValue !== null
    ) {
      Object.assign(target[key] as object, patchValue);
    } else {
      target[key] = patchValue as Draft<T[typeof key]>;
    }
  }
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export const api = (path: string, options: RequestInit = {}, jsonBody = true) => {
  return fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    credentials: 'include',
    headers: jsonBody ? { 'Content-Type': 'application/json' } : {},
    ...options,
  });
};

export const formatDateString = (dateString: string | undefined) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().substring(0, 10);
};

export const uploadEmployeeDocument = async (
  file: File,
  field: 'profilePictureFile' | 'driverLicenseFile' | 'optReceiptFile'
) => {
  const formData = new FormData();
  formData.append(field, file);

  const response = await api(
    `/employee/docs/upload`,
    {
      method: 'PUT',
      body: formData,
    },
    false
  );

  if (!response.ok) {
    throw new Error('Failed to upload document');
  }

  const result = await response.json();
  return result.s3Key; // the uploaded S3 key
};

export async function getDocumentUrl(s3Key: string) {
  const params = new URLSearchParams();
  params.append('key', s3Key);
  const response = await api(`/employee/docs/file?${params}`, {}, false);
  const { url } = await response.json();
  return url;
}
