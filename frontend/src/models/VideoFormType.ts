export interface VideoFormValues {
    url: File | null;
    title: string;
    description: string;
    hashtags: string[];
}

export interface VideoFormErrors {
    url?: string;
    title?: string;
    description?: string;
    hashtags?: string;
}

export interface EditVideoFormValues {
    title: string;
    description: string;
    hashtags: string[];
}

export interface EditVideoFormErrors {
    title?: string;
    description?: string;
    hashtags?: string;
}