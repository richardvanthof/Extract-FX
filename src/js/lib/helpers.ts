const handleClick = (e:Event, callback: any) => {
    e.preventDefault()
    return callback;
}

const generateNumberedOptions = (amount: number, prefix?: string, suffix?: string) => {
    let options = [];
    for (let index = 1; index <= amount; index++) {
        options.push([
            `${prefix ? prefix : ''} ${index} ${suffix ? suffix : ''}`,
            index
        ]);
    }

    return options;
}

export {handleClick, generateNumberedOptions}