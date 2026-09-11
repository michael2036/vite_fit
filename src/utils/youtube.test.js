import { describe, it, expect } from 'vitest';
import { getYoutubeEmbedUrl } from './youtube';

describe('getYoutubeEmbedUrl', () => {
    it('returns null for a falsy url', () => {
        expect(getYoutubeEmbedUrl(null)).toBeNull();
        expect(getYoutubeEmbedUrl('')).toBeNull();
    });

    it('extracts the video id from a standard watch url', () => {
        expect(getYoutubeEmbedUrl('https://www.youtube.com/watch?v=f-Vf2yRRqOg'))
            .toBe('https://www.youtube.com/embed/f-Vf2yRRqOg');
    });

    it('extracts the video id from a shortened youtu.be url', () => {
        expect(getYoutubeEmbedUrl('https://youtu.be/f-Vf2yRRqOg'))
            .toBe('https://www.youtube.com/embed/f-Vf2yRRqOg');
    });

    it('returns null when there is no recognizable 11-character video id', () => {
        expect(getYoutubeEmbedUrl('https://example.com/not-a-video')).toBeNull();
    });
});
