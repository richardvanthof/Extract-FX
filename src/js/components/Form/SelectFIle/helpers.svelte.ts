import type { SourceData } from "@/js/global-vars/globals.svelte";

export type FileData = {
    data?: SourceData,
    exclusionOptions?: string[]
}

export const getUniqueKeys = (data:object[]|object):string[] => {
    let keys:string[];
    if(Array.isArray(data)) { keys = data.map((val) => Object.keys(val)).flat();} 
    else { keys = Object.keys(data);};

    return keys.filter((value, index, array) => {
        const normalizedArray = array.map((val) => val.toLocaleLowerCase()) 
        return normalizedArray.indexOf(value.toLocaleLowerCase()) === index;
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

export const handleIngestFile = async (event: Event):Promise<FileData> => {
    const result:FileData = {}

    const input = event.target as HTMLInputElement;
    const files = input?.files;

    // Decode and parse the JSON file
    if(!files) {throw new Error("File not found.")}
    result.data = await getJSON(files[0]);
    result.exclusionOptions = getUniqueKeys(result.data.clips);

    return result;
};
