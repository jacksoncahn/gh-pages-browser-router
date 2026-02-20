/**
 * Make a type assembled from several types/utilities more readable.
 * (e.g. the type will be shown as the final resulting type instead of as a bunch of type utils wrapping the initial type).
 */
type FinalType<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

/**
 * Merge keys of U into T, overriding value types with those in U.
 */
export type Override<T, U extends Partial<Record<keyof T, unknown>>> = FinalType<Omit<T, keyof U> & U>

export type Prettify<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

/**
 * Get the keys of an object and its nested objects.
 */
export type NestedKeys<T> = T extends object
  ? {
      [K in keyof T]-?: T[K] extends object ? NestedKeys<T[K]> : K extends undefined ? never : K
    }[keyof T]
  : never
