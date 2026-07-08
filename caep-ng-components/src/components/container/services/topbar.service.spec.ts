import { Injector, provideZoneChangeDetection } from '@angular/core';
import { TestBed, fakeAsync, flush, inject } from '@angular/core/testing';
import { UUID } from 'angular2-uuid';
import { CaepIdSequenceService } from '../../../services';
import { CaepContainerModule } from '../container.module';
import { ICaepTopbarItem } from '../models';
import { CaepTopbarService } from './topbar.service';

describe('CaepTopbarService', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CaepContainerModule.forRoot({ taskSlotFactory: null, stackFrameFactory: null })],
      declarations: [],
      providers: [CaepIdSequenceService, provideZoneChangeDetection()]
    });
    TestBed.compileComponents();
  });
  it('should be provided', inject([Injector], (injector: Injector) => {
    const injecting = () => {
      const srv = injector.get(CaepTopbarService);
      expect(srv).not.toBeNull();
      expect(srv).toBeDefined();
    };

    expect(injecting).not.toThrowError();
  }));
  describe('CRUD', () => {
    let sut: CaepTopbarService;
    beforeEach(inject([CaepTopbarService], (srv: CaepTopbarService) => {
      sut = srv;
    }));
    afterEach(() => {
      sut.clear();
    });
    it('should register an item', () => {
      const item: ICaepTopbarItem = {
        id: UUID.UUID()
      };
      // pre-assert
      expect(sut.snapshot.length).toEqual(0);
      // act
      sut.register(item);
      // assert
      expect(sut.snapshot.length).toEqual(1);
    });
    it('should update registered item', () => {
      const id = UUID.UUID();
      const item: ICaepTopbarItem = {
        id
      };
      expect(sut.snapshot.length).toEqual(0);
      // arrange
      sut.register(item);
      expect(sut.snapshot.length).toEqual(1);
      const updated = { ...sut.getItemById(id), label: UUID.UUID() };
      // act
      sut.update(updated);
      // assert
      expect(sut.getItemById(id)).toEqual(updated);
    });
    it('should update registered item if exists', () => {
      const id = UUID.UUID();
      const item: ICaepTopbarItem = {
        id
      };
      expect(sut.snapshot.length).toEqual(0);
      // arrange
      sut.register(item);
      expect(sut.snapshot.length).toEqual(1);
      const updated = { ...sut.getItemById(id), label: UUID.UUID() };
      // act
      sut.registerOrUpdate(updated);
      // assert
      expect(sut.getItemById(id)).toEqual(updated);
      expect(sut.snapshot.length).toEqual(1); // items are still one only
    });
    it('should register item if not exists', () => {
      const id = UUID.UUID();
      const item: ICaepTopbarItem = {
        id
      };
      expect(sut.snapshot.length).toEqual(0);
      // arrange
      sut.register(item);
      expect(sut.snapshot.length).toEqual(1);
      const newId = UUID.UUID();
      const updated = { ...sut.getItemById(id), id: newId }; // we are changing identifier so it is a new item
      // act
      sut.registerOrUpdate(updated);
      // assert
      expect(sut.getItemById(newId)).toEqual(updated); // has been registered
      expect(sut.snapshot.length).toEqual(2); // items are two now
    });
    it('should unregister an item', () => {
      const id = UUID.UUID();
      const id1 = UUID.UUID();
      const item: ICaepTopbarItem = {
        id
      };
      const item1: ICaepTopbarItem = {
        id: UUID.UUID()
      };
      // pre-assert
      expect(sut.snapshot.length).toEqual(0);
      // arrange
      sut.register(item);
      sut.register(item1);
      expect(sut.snapshot.length).toEqual(2);
      // act
      sut.unregister(id);
      expect(sut.snapshot.length).toEqual(1);
      expect(sut.getItemById(id1)).not.toBeNull();
    });
    it('should clear all registered itemsm', () => {
      const item: ICaepTopbarItem = {
        id: UUID.UUID()
      };
      const item1: ICaepTopbarItem = {
        id: UUID.UUID()
      };
      // pre-assert
      expect(sut.snapshot.length).toEqual(0);
      // arrange
      sut.register(item);
      sut.register(item1);
      expect(sut.snapshot.length).toEqual(2);
      // act
      sut.clear();
      expect(sut.snapshot.length).toEqual(0);
    });
    it('should retrieve an item by id', () => {
      const id = UUID.UUID();
      const ariaLabel = 'sunt aliquip eiusmod esse';
      const item: ICaepTopbarItem = {
        id,
        ariaLabel
      };
      // arrange
      sut.register(item);
      // act
      const itm = sut.getItemById(id);
      // assert
      expect(itm).toBeDefined();
      expect(itm).not.toBeNull();
      expect(itm?.ariaLabel).toEqual(ariaLabel);
    });
    it('should emit when a crud action is performed', fakeAsync(() => {
      const spy = jasmine.createSpy();
      sut.items$.subscribe(spy);
      flush();
      spy.calls.reset();
      const item: ICaepTopbarItem = {
        id: UUID.UUID()
      };
      expect(spy).toHaveBeenCalledTimes(0);
      sut.register(item);
      flush();
      expect(spy).toHaveBeenCalledTimes(1);
    }));
  });
});
