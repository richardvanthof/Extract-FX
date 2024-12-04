const handleClick = (e:Event|null|undefined, callback: any) => {
    e && e.preventDefault()
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

export {handleClick, generateNumberedOptions}