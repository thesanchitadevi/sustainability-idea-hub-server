// this function is used to pick specific keys from an object and return a new object with only those keys
// it is a generic function that takes an object and an array of keys as arguments and returns a new object with only those keys
// it uses the keyof operator to ensure that the keys passed in are valid keys of the object
// it uses the Partial<T> type to ensure that the returned object is a partial object of the original object
// it uses the Record<string, unknown> type to ensure that the object passed in is a valid object with string keys and unknown values
// it uses the Object.hasOwnProperty method to check if the object has the key passed in
// it uses the for...of loop to iterate over the keys array and pick the keys from the object
// it uses the spread operator to create a new object with only the keys passed in
// it uses the return statement to return the new object with only the keys passed in

// Mainly for search and filter functions to pick specific keys from the object
const Pick = <T extends Record<string, unknown>, k extends keyof T>(
  obj: T,
  keys: k[]
): Partial<T> => {
  const finalObj: Partial<T> = {};

  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }

  // console.log(finalObj)
  return finalObj;
};

export default Pick;
