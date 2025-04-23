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

export const api = (path: string, options: RequestInit = {}) => {
  return fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
};
