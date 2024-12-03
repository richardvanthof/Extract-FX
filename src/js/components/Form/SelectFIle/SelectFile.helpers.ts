// Define the type for the source data
export type SourceData = {
    type: 'RS-FX-EXCHANGE';
    track: number;
    sequence: string;
    exclusions: string[];
    clips: object[];
};

// Get all uniqe keys from an (array of) object(s).
export const getUniqueKeys = (data:object[]|object):string[] => {
    let keys:string[];
    
    // Check if we're working with an array or just a single object
    if(Array.isArray(data)) {
        keys = data.map((val: object) => Object.keys(val)).flat();
    } else {
        keys = Object.keys(data);
    };

    // Normalize all values to lowerkey and flatten to onedimensional array.
    const normalizedKeys = keys.map((val) => val.toLocaleLowerCase()) 

    // Remove duplicate values
    return normalizedKeys.filter((value, index, array) => {
        return array.indexOf(value.toLocaleLowerCase()) === index;
    }); 
};

// Type guard to check if the parsed content is of type SourceData
const isSourceData = (data: unknown, type: string = "RS-FX-EXCHANGE"): data is SourceData => {
    return (
        data !== null &&
        typeof data === 'object' &&
        'type' in data &&
        'track' in data &&
        'sequence' in data &&
        'exclusions' in data &&
        'clips' in data &&
        Array.isArray(data.exclusions) &&
        Array.isArray(data.clips) &&
        data.type === type
    )
}

// Get json data from file and check if data is a valid.
export const getJSON = async (file: File): Promise<SourceData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            // We know that reader.result should be a string, so we assert it to string
            const content = reader.result as string;

            if (content.length <= 0) {
                reject(new Error('This file is empty.'));
                return;
            }

            try {
                // Try parsing the content into a SourceData type
                const parsedContent: SourceData = JSON.parse(content);

                // Type assertion to `SourceData`
                if (isSourceData(parsedContent)) {
                    
                    // Check if it contains clip effect data
                    if(parsedContent.clips.length <= 0) {
                        reject("No clip effect data has been found.")
                    }
                    resolve(parsedContent);
                } else {
                    reject(new Error('This file contains invalid data and cannot be opened.'));
                }
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            alert('Error reading the file.');
            reject(new Error('Error reading the file.'));
        };

        reader.readAsText(file);
    });
};
