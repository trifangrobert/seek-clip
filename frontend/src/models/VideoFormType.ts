export interface VideoFormValues {
    url: File | null;
    title: string;
    description: string;
}

export interface VideoFormErrors {
    url?: string;
    title?: string;
    description?: string;
}