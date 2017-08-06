class Storage {
  static set(payload) {
    return new Promise( (resolve, reject) => {
      chrome.storage.local.set(payload, data => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(data)
        }
      })
    })
  }

  static get(keys) {
    return new Promise( (resolve, reject) => {
      chrome.storage.local.get(keys, data => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(data)
        }
      })
    })
  }

  static clear() {
    return new Promise( (resolve, reject) => {
      chrome.storage.local.clear(data => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(data)
        }
      })
    })
  }
}

export default Storage;
