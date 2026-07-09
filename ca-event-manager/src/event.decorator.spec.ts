import { CaepEvent, CaepEventMetadataKey, ICaepEventMetadata } from './event.decorator';
import 'reflect-metadata';

class CustomList {
    @CaepEvent({ name: 'searchterm' })
    public onSearchTermChange(searchTerm: string) { }
}

describe('CaepEvent Decorator factory', () => {

    let list: CustomList;

    beforeEach(() => {
        list = new CustomList();
    });

    it('should return a decorator function', () => {
        const decorator = CaepEvent({ name: 'searchterm' });
        expect(decorator).toBeDefined();
        expect(decorator).toBeInstanceOf(Function);
    });

    it('should set event metadata on class method', () => {
        const metadata: ICaepEventMetadata = Reflect.getMetadata(CaepEventMetadataKey, list, 'onSearchTermChange');
        expect(metadata).toBeDefined();
        expect(metadata).toEqual({ name: 'searchterm' });
    });

});