export interface VideoFormValues {
    url: File | null;
    title: string;
}

export interface VideoFormErrors {
    url?: string;
    title?: string;
}