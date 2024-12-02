
// Define the type for the source data
export type SourceData = {
    type: 'RS-FX-EXCHANGE';
    track: number;
    sequence: string;
    exclusions: string[];
    clips: object[];
};

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

export const getJSON = async (file: File): Promise<SourceData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const content = reader.result as string;
            try {
                if (content.length <= 0) {
                    throw new Error('This file is empty.')
                }

                const parsedContent: SourceData = JSON.parse(content);

                // Ensure the parsed content is valid and has the expected structure
                if (!parsedContent || parsedContent.type !== 'RS-FX-EXCHANGE' || !Array.isArray(parsedContent.clips) || parsedContent.clips.length === 0) {
                    throw new Error('File does not contain valid data.');
                }

                // Resolve with the parsed content if valid
                resolve(parsedContent);  
            } catch (err: unknown) {
                // Reject with the error if parsing fails or data is invalid
                reject(err);
            }
        };

        reader.onerror = () => {
            alert('Error reading the file.');
            reject(new Error('Error reading the file.'));
        };

        reader.readAsText(file);
    });
};
