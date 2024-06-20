export const objectToString = Object.prototype.toString

export const toTypeString = (value: unknown): string => objectToString.call(value)

export function isUndef(val: any): val is undefined {
  return val === undefined
}

export function isNull(val: unknown): val is null {
  return val === null
}

export function isUndefOrNull(val: unknown): val is null | undefined {
  return isUndef(val) || isNull(val)
}

export function isDef<T>(val: T): val is NonNullable<T> {
  return val !== undefined && val !== null
}

export function isFunction(val: unknown): val is Function {
  return typeof val === 'function'
}

export function isObject(val: unknown): val is Record<any, any> {
  return val !== null && typeof val === 'object'
}

export function isRegExp(val: any): val is RegExp {
  return toTypeString(val) === '[object RegExp]'
}

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch) && val instanceof Promise
}

export function isArray(arg: unknown): arg is any[] {
  return Array.isArray(arg)
}

export function isMap(val: unknown): val is Map<any, any> {
  return toTypeString(val) === '[object Map]'
}

export function isSet(val: unknown): val is Set<any> {
  return toTypeString(val) === '[object Set]'
}

export function isDate(val: unknown): val is Date {
  return toTypeString(val) === '[object Date]'
}

export function isString(val: unknown): val is string {
  return typeof val === 'string'
}

export function isSymbol(val: unknown): val is symbol {
  return typeof val === 'symbol'
}

export function isNumber(val: unknown): val is number {
  return typeof val === 'number' && isFinite(val)
}

export function isBigInt(val: unknown): val is BigInt {
  return typeof val === 'bigint'
}

export function isInteger(val: unknown): val is number {
  return Number.isInteger(val)
}

export function isNaN(val: unknown): val is number {
  return Number.isNaN(val)
}

export function isFinite(val: unknown): val is number {
  return Number.isFinite(val)
}

export function isBoolean(val: unknown): val is boolean {
  return typeof val === 'boolean'
}

export function isOfType<T extends object>(targetObj: unknown, prop: keyof T): targetObj is T {
  // return prop in (targetObj as T)
  return (targetObj as T)[prop] !== undefined
}

export function isOfTypes<T extends object>(
  targetObj: unknown,
  props: (keyof T)[]
): targetObj is T {
  return props.every((prop) => {
    return isOfType(targetObj, prop)
  })
}

export function isKey<T extends object>(targetObj: T, key: PropertyKey): key is keyof T {
  return key in targetObj
}
