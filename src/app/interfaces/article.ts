export interface Article {
    id: number;
    id_user?: number;
    abstract: string;
    subtitle: string;
    update_date: string;
    modificationDate?: string;
    category: string;
    title: string;
    body?: string;
    // Fields for individual article (detail view)
    image_data?: string;
    image_media_type?: string;
    // Fields for article list (list view)
    thumbnail_image?: string;
    thumbnail_media_type?: string;
}
