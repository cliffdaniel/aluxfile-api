import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

interface UnsplashImage {
    id: string;
    urls: {
        regular: string;
    };
}

interface UnsplashResponse {
    results: UnsplashImage[];
}

@Injectable()
export class UnsplashService {
    private readonly apiUrl = 'https://api.unsplash.com/search/photos';
    private readonly accessKey = process.env.UNSPLASH_ACCESS_KEY;

    async searchImages(query: string): Promise<string[]> {
        if (!this.accessKey) {
            throw new BadRequestException('Unsplash API key is missing');
        }

        try {
            const response = await axios.get<UnsplashResponse>(this.apiUrl, {
                params: { query, per_page: 10 },
                headers: { Authorization: `Client-ID ${this.accessKey}` },
            });

            return response.data.results.map((image) => image.urls.regular);
        } catch {
            throw new BadRequestException(
                'Error fetching images from Unsplash',
            );
        }
    }
}
