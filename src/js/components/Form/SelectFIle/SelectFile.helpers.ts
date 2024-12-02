export const getUniqueKeys = (data:object[]|object):string[] => {
    let keys:string[];
    if(Array.isArray(data)) {
        keys = data.map((val) => Object.keys(val)).flat();
    } else {
        keys = Object.keys(data);
    };

    return keys.filter((value, index, array) => {
        const normalizedArray = array.map((val) => val.toLocaleLowerCase()) 
        return normalizedArray.indexOf(value.toLocaleLowerCase()) === index && value
    }); 
};