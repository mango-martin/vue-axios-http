import { isArray, isFile } from './objects'

export function objectToFormData(
  object: any,
  formData = new FormData(),
  parent = '',
): FormData {
  if (object === null || object === 'undefined' || object.length === 0) {
    formData.append(parent, object)
  } else {
    for (const property in object) {
      if (Object.hasOwnProperty.call(object, property)) {
        appendToFormData(formData, getKey(parent, property), object[property])
      }
    }
  }
  return formData
}

function getKey(parent: any, property: any) {
  return parent ? parent + '[' + property + ']' : property
}

function appendToFormData(formData: FormData, key: string, value: any) {
  if (value instanceof Date) {
    return formData.append(key, value.toISOString())
  }

  if (value instanceof File) {
    return formData.append(key, value, value.name)
  }

  if (typeof value === 'boolean') {
    return formData.append(key, value ? '1' : '0')
  }

  if (value === null) {
    return formData.append(key, '')
  }

  if (typeof value !== 'object') {
    return formData.append(key, value)
  }

  if (isArray(value) && hasFilesDeep(value)) {
    for (let i = 0; i < value.length; i++) {
      formData.append(key + '[' + i + ']', value[i])
    }
    return formData
  }

  objectToFormData(value, formData, key)
}

export function hasFilesDeep(object: any): boolean {
  if (object === null) {
    return false
  }
  if (typeof object === 'object') {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        if (isFile(object[key])) {
          return true
        }
      }
    }
  }
  if (isArray(object)) {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        return hasFilesDeep(object[key])
      }
    }
  }
  return isFile(object)
}

export function hasFiles(form: any): boolean {
  for (const property in form) {
    if (!form.hasOwnProperty(property)) {
      return false
    }
    if (typeof window === 'undefined') {
      return false
    }
    if (hasFilesDeep(form[property])) {
      return true
    }
  }
  return false
}
