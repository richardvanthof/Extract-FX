const handleClick = (e:Event, callback: unknown) => {
    e.preventDefault()
    return callback;
}

const generateNumberedOptions = (amount: number, prefix?: string, suffix?: string):[string,number][] => {
    const options:[string,number][] = [];
    for (let index = 1; index <= amount; index++) {
        options.push([
            `${prefix ? prefix : ''} ${index} ${suffix ? suffix : ''}`,
            index
        ]);
    }

    return options;
}
const getUniqueKeys = (data:object[]|object):string[] => {
    let keys:string[];
    if(Array.isArray(data)) { keys = data.map((val) => Object.keys(val)).flat();} 
    else { keys = Object.keys(data);};

    return keys.filter((value, index, array) => {
        const normalizedArray = array.map((val) => val.toLocaleLowerCase()) 
        return normalizedArray.indexOf(value.toLocaleLowerCase()) === index;
    }); 
};

export {handleClick, getUniqueKeys, generateNumberedOptions}