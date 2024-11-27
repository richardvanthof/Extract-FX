const handleClick = (e:Event|null|undefined, callback: any) => {
    e && e.preventDefault()
    return callback;
}

export type NumberedOption  = [string|number, number];

const generateNumberedOptions = (amount: number, prefix?: string, suffix?: string):NumberedOption[] => {
    let options:NumberedOption[] = [];
    for (let index = 1; index <= amount; index++) {
        options.push([
            `${prefix ? prefix : ''} ${index} ${suffix ? suffix : ''}`,
            index
        ]);
    }

    return options;
}

export {handleClick, generateNumberedOptions}