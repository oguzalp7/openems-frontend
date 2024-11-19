export const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
};


export const removeKeysFromObject = (obj, keysToRemove) => {
    const newObj = { ...obj };
    keysToRemove.forEach((key) => {
      delete newObj[key];
    });
    return newObj;
};
  
export const removeKeysFromArrayOfObjects = (array, keysToRemove) => {
    return array.map((obj) => removeKeysFromObject(obj, keysToRemove));
};

export const renameColumn = (data, oldKey, newKey) => {
    return data.map(item => {
      let newItem = { ...item };
  
      // Check if the old key exists
      if (oldKey in newItem) {
        newItem[newKey] = newItem[oldKey];
        delete newItem[oldKey];
      }
  
      return newItem;
    });
};

export const reorderColumns = (data, order) => {
    return data.map(item => {
        let orderedItem = {};
        order.forEach(key => {
        // Check if the key exists in the item and is not null, undefined, or an empty string
        if (item[key] !== null && item[key] !== undefined && item[key] !== '') {
            orderedItem[key] = item[key];
        }
        });
        return orderedItem;
    });
};