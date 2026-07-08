import { provideZoneChangeDetection } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';
import { UUID } from 'angular2-uuid';
import { CaepIdSequenceService } from '../../../services';
import { CaepContainerModule } from '../container.module';
import { ICaepSideMenuEntry } from '../models';
import { CaepSideMenuService } from './side-menu.service';

describe('CaepSideMenuService', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CaepContainerModule.forRoot({ taskSlotFactory: null, stackFrameFactory: null })],
      declarations: [],
      providers: [CaepIdSequenceService, provideZoneChangeDetection()]
    });
    TestBed.compileComponents();
  });
  const createConcreteEntry = (id?: string, preserveNavigation?: boolean, url?: string) => {
    const entry = {
      id: id ?? UUID.UUID(),
      label: '',
      link: { url: url ?? '' },
      enable: true,
      show: true,
      preserveNavigation
    };

    Object.keys(entry).forEach(key => {
      if (entry[key] === undefined) delete entry[key];
    });

    return entry;
  };
  describe('_mapToNavigationArgs', () => {
    it('should map application link correctly', inject([CaepSideMenuService], (service: CaepSideMenuService) => {
      expect(service.mapToNavigationArgs('/app')).toEqual({ application: 'app' });
    }));
    it('should map application+queryParams link correctly', inject(
      [CaepSideMenuService],
      (service: CaepSideMenuService) => {
        expect(service.mapToNavigationArgs('/app?foo=bar&quo=baz')).toEqual({
          application: 'app',
          queryParams: { foo: 'bar', quo: 'baz' }
        });
      }
    ));
    it('should map application+domain link correctly', inject([CaepSideMenuService], (service: CaepSideMenuService) => {
      expect(service.mapToNavigationArgs('/app/main')).toEqual({ application: 'app', domain: 'main' });
    }));
    it('should map application+domain+queryParams link correctly', inject(
      [CaepSideMenuService],
      (service: CaepSideMenuService) => {
        expect(service.mapToNavigationArgs('/app/main?foo=bar')).toEqual({
          application: 'app',
          domain: 'main',
          queryParams: { foo: 'bar' }
        });
      }
    ));
    it('should map application+domain+scenario link correctly', inject(
      [CaepSideMenuService],
      (service: CaepSideMenuService) => {
        expect(service.mapToNavigationArgs('/app/main/user')).toEqual({
          application: 'app',
          domain: 'main',
          scenario: 'user'
        });
      }
    ));
    it('should map application+domain+scenario+queryParams link correctly', inject(
      [CaepSideMenuService],
      (service: CaepSideMenuService) => {
        expect(service.mapToNavigationArgs('/app/main/user?foo=bar')).toEqual({
          application: 'app',
          domain: 'main',
          scenario: 'user',
          queryParams: { foo: 'bar' }
        });
      }
    ));
    it('should map application+domain+scenario+action link correctly', inject(
      [CaepSideMenuService],
      (service: CaepSideMenuService) => {
        expect(service.mapToNavigationArgs('/app/main/user/browse')).toEqual({
          application: 'app',
          domain: 'main',
          scenario: 'user',
          action: 'browse'
        });
      }
    ));
    it('should map application+domain+scenario+action+queryParams link correctly', inject(
      [CaepSideMenuService],
      (service: CaepSideMenuService) => {
        expect(service.mapToNavigationArgs('/app/main/user/browse?userId=1')).toEqual({
          application: 'app',
          domain: 'main',
          scenario: 'user',
          action: 'browse',
          queryParams: {
            userId: '1'
          }
        });
      }
    ));
    it('should map application+domain+scenario+action+routeParams link correctly', inject(
      [CaepSideMenuService],
      (service: CaepSideMenuService) => {
        expect(service.mapToNavigationArgs('/app/main/user/browse/1')).toEqual({
          application: 'app',
          domain: 'main',
          scenario: 'user',
          action: ['browse', '1']
        });
      }
    ));
    it('should map application+domain+scenario+action+routeParams+queryParams link correctly', inject(
      [CaepSideMenuService],
      (service: CaepSideMenuService) => {
        expect(service.mapToNavigationArgs('/app/main/user/browse/1?userName=john')).toEqual({
          application: 'app',
          domain: 'main',
          scenario: 'user',
          action: ['browse', '1'],
          queryParams: {
            userName: 'john'
          }
        });
      }
    ));
  });
  describe('Internals', () => {
    describe('_canPreserveNavigation', () => {
      /**
       * When enabled and user navigates towards this entry, navigation flow is preserved when closest ancestor preserves navigation.
       * E.g.:
       * Given a menu graph like
       * 1
       *  - 1.1 (preserveNavigation = true)
       *    - 1.1.1
       *    - 1.1.2
       *  - 1.2
       *    - 1.2.1 (preserveNavigation = true)
       *    - 1.2.2
       * 2 (preserveNavigation = true)
       *  - 2.1
       *    - 2.1.1
       *    - 2.1.2
       *  - 2.2
       *    - 2.2.1
       *    - 2.2.2
       *    - 2.2.3 (preserveNavigation = false)
       *      - 2.2.3.1
       *      - 2.2.3.2
       *
       * navigation flow acts like:
       * - navigating from `1.2.1` towards same route `1.2.1` (e.g. changing parameters) will preserve navigation flow since this entry preserves
       * - navigating from `1.1.1` towards `1.1.2` will preserve navigation flow since its parent preserves
       * - navigating from `1.2.1` towards `1.1.1` and from `2` to `1` will not preserve navigation flow since they do not have a common parent which actually preserves navigation
       * - navigating from `2.1.1` towards `2.2.1` will preserve navigation flow since they have a common parent which preserves
       * - navigating from `2.2.1` towards `2.2.2` will preserve navigation flow since they have a common parent which preserves
       * - navigating from `2.2.3.1` towards `2.2.2` will not preserve navigation flow since even if they have a common preserve parent (`2`) source has closest parent which explicitly do not preserve
       * - navigating from `2.2.2` towards `2.2.3.1` will not preserve navigation flow since even if they have a common preserve parent (`2`) destination has closest parent which explicitly do not preserve
       * - navigating from `2.2.3.1` towards `2.2.3.2` will not preserve navigation flow since they have a close parent which explicitly set preserveNavigation to false
       */
      const menu: ICaepSideMenuEntry[] = [
        {
          ...createConcreteEntry('1'),
          children: [
            {
              ...createConcreteEntry('1.1', true),
              children: [createConcreteEntry('1.1.1'), createConcreteEntry('1.1.2')]
            },
            {
              ...createConcreteEntry('1.2'),
              children: [createConcreteEntry('1.2.1', true), createConcreteEntry('1.2.1')]
            }
          ]
        },
        {
          ...createConcreteEntry('2', true),
          children: [
            { ...createConcreteEntry('2.1'), children: [createConcreteEntry('2.1.1'), createConcreteEntry('2.1.2')] },
            {
              ...createConcreteEntry('2.2'),
              children: [
                createConcreteEntry('2.2.1'),
                createConcreteEntry('2.2.2'),
                {
                  ...createConcreteEntry('2.2.3', false),
                  children: [createConcreteEntry('2.2.3.1'), createConcreteEntry('2.2.3.2')]
                }
              ]
            }
          ]
        }
      ];
      beforeEach(inject([CaepSideMenuService], (service: CaepSideMenuService) => {
        service.set(...menu);
      }));
      it('should return true when navigating towards same route which has preserveNavigation to true', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const _121 = service.getEntryById('1.2.1');
          expect(service['_canPreserveNavigation'](_121, _121)).toBeTrue();
        }
      ));
      it('should return false when navigating towards same route which has preserveNavigation to false', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const _223 = service.getEntryById('2.2.3');
          expect(service['_canPreserveNavigation'](_223, _223)).toBeFalse();
        }
      ));
      it('should return true when navigating towards same parent route which (parent) has preserveNavigation to true', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const _111 = service.getEntryById('1.1.1');
          const _112 = service.getEntryById('1.1.2');
          expect(service['_canPreserveNavigation'](_111, _112)).toBeTrue();
        }
      ));
      it('should return false when navigating towards a route which has no common parent (both routes have no parent)', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const _2 = service.getEntryById('2');
          const _1 = service.getEntryById('1');
          expect(service['_canPreserveNavigation'](_2, _1)).toBeFalse();
        }
      ));
      it('should return false when navigating towards a route which has no common parent (both routes have parent)', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const _121 = service.getEntryById('1.2.1');
          const _111 = service.getEntryById('1.1.1');
          expect(service['_canPreserveNavigation'](_121, _111)).toBeFalse();
        }
      ));
      it('should return true when source and destination routes have a common parent with truthy preserveNavigation', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const _211 = service.getEntryById('2.1.1');
          const _221 = service.getEntryById('2.2.1');
          expect(service['_canPreserveNavigation'](_211, _221)).toBeTrue();
        }
      ));
      it('should return true when source and destination routes have a common parent (not directly) with truthy preserveNavigation and other closeser parents have no preserveNavigation rules', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const _221 = service.getEntryById('2.2.1');
          const _222 = service.getEntryById('2.2.2');
          expect(service['_canPreserveNavigation'](_221, _222)).toBeTrue();
        }
      ));
      it('should return false when source route has a closest parent which has preserveNavigation to false even if a common ancestor preserves navigation', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const _2231 = service.getEntryById('2.2.3.1');
          const _222 = service.getEntryById('2.2.2');
          expect(service['_canPreserveNavigation'](_2231, _222)).toBeFalse();
        }
      ));
      it('should return false when destination route as a closest parent which has preserveNavigation to false even if a common ancestor preserves navigation', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const _222 = service.getEntryById('2.2.2');
          const _2231 = service.getEntryById('2.2.3.1');
          expect(service['_canPreserveNavigation'](_222, _2231)).toBeFalse();
        }
      ));
      it('should return false when closest common ancestor has preserveNavigation set to false', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const _2231 = service.getEntryById('2.2.3.1');
          const _2232 = service.getEntryById('2.2.3.2');
          expect(service['_canPreserveNavigation'](_2231, _2232)).toBeFalse();
        }
      ));
    });
    describe('_mapToLinkedEntry', () => {
      const menu = [
        {
          ...createConcreteEntry('1'),
          children: [
            createConcreteEntry('1.1'),
            {
              ...createConcreteEntry('1.2'),
              children: [createConcreteEntry('1.2.1'), createConcreteEntry('1.2.2')]
            }
          ]
        }
      ];
      beforeEach(inject([CaepSideMenuService], (service: CaepSideMenuService) => {
        service.set(...menu);
      }));
      it('should return given entry without parent when entry has no ancestors', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const _1 = service.getEntryById('1');
          const result = service['_mapToLinkedEntry'](_1);
          expect(result.entry).toEqual(_1);
          expect(result.parent).toBeUndefined();
        }
      ));
      it('should return given entry with root parent ancestor when entry has one ancestor', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const _1 = service.getEntryById('1');
          const _11 = service.getEntryById('1.1');
          const expectedParent = service['_mapToLinkedEntry'](_1);
          const result = service['_mapToLinkedEntry'](_11);
          expect(result.entry).toEqual(_11);
          expect(result.parent).toEqual(expectedParent);
          expect(result.parent.parent).toBeUndefined();
        }
      ));
      it('should return given entry with all parents set properly when there is more than one ancestor', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const _1 = service.getEntryById('1');
          const _12 = service.getEntryById('1.2');
          const _122 = service.getEntryById('1.2.2');
          const expectedParent = service['_mapToLinkedEntry'](_12);
          const expectedGrandparent = service['_mapToLinkedEntry'](_1);

          const result = service['_mapToLinkedEntry'](_122);
          expect(result.entry).toEqual(_122);
          expect(result.parent).toEqual(expectedParent);
          expect(result.parent.parent).toEqual(expectedGrandparent);
        }
      ));
    });
    describe('_findAncestors', () => {
      const menu: ICaepSideMenuEntry[] = [
        {
          ...createConcreteEntry(),
          children: [
            createConcreteEntry(),
            {
              ...createConcreteEntry(),
              children: [createConcreteEntry(), { ...createConcreteEntry(), children: [createConcreteEntry()] }]
            }
          ]
        },
        {
          ...createConcreteEntry(),
          children: [createConcreteEntry()]
        }
      ];
      beforeEach(inject([CaepSideMenuService], (service: CaepSideMenuService) => {
        service.set(...menu);
      }));
      it('should return an empty array for an entry that is not found', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const ancestors = service['_findAncestors']({ id: '8', label: '', link: { url: '' }, children: [] });
          expect(ancestors).toEqual([]);
        }
      ));
      it('should return an empty array for an entry with no ancestors', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const ancestors = service['_findAncestors'](menu[0]);
          expect(ancestors).toEqual([]);
        }
      ));
      it('should return the direct parent for a entry with one ancestor', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const ancestors = service['_findAncestors'](menu[1].children[0]);
          expect(ancestors).toEqual([menu[1]]);
        }
      ));
      it('should return all ancestors for an entry with multiple ancestors', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const ancestors = service['_findAncestors'](menu[0].children[1].children[0]);
          expect(ancestors).toEqual([menu[0], menu[0].children[1]]);
        }
      ));
      it('should return all ancestors for an entry with multiple ancestors (deeper)', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const ancestors = service['_findAncestors'](menu[0].children[1].children[1].children[0]);
          expect(ancestors).toEqual([menu[0], menu[0].children[1], menu[0].children[1].children[1]]);
        }
      ));
    });
    describe('_findMostMatchingEntry', () => {
      const menu: ICaepSideMenuEntry[] = [
        {
          ...createConcreteEntry(null, null, '/main'),
          children: [createConcreteEntry(null, null, '/main/users'), createConcreteEntry(null, null, '/main/settings')]
        },
        {
          ...createConcreteEntry(null, null, '/crm'),
          children: [
            {
              ...createConcreteEntry(null, null, '/crm/company'),
              children: [
                createConcreteEntry(null, null, '/crm/company/history'),
                createConcreteEntry(null, null, '/crm/company/team'),
                createConcreteEntry(null, null, '/crm/company/people#details')
              ]
            },
            createConcreteEntry(null, null, '/crm/contact')
          ]
        },
        {
          ...createConcreteEntry(null, null, '/home?lang=en&color=blue'),
          children: [
            createConcreteEntry(null, null, '/home/users?lang=en&color=red'),
            createConcreteEntry(null, null, '/home/users?lang=es'),
            createConcreteEntry(null, null, '/home/settings?lang=fr&color=blue')
          ]
        },
        {
          ...createConcreteEntry(null, null, '/about?lang=en&color=green'),
          children: [
            {
              ...createConcreteEntry(null, null, '/about/company?lang=en&color=yellow'),
              children: [
                createConcreteEntry(null, null, '/about/company/history?lang=en&color=orange'),
                createConcreteEntry(null, null, '/about/company/team?lang=fr&color=purple'),
                createConcreteEntry(null, null, '/about/company/team?lang=it#details'),
                createConcreteEntry(null, null, '/about/company/team?lang=es')
              ]
            },
            createConcreteEntry(null, null, '/about/contact?lang=en&color=blue')
          ]
        }
      ];
      beforeEach(inject([CaepSideMenuService], (service: CaepSideMenuService) => {
        service.set(...menu);
      }));
      it('should return null when given an empty array of tree nodes', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          service.set();
          const result = service['_findMostMatchingEntry']('/main/users');
          expect(result).toBeNull();
        }
      ));
      it('should return null when no nodes match the url', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const result = service['_findMostMatchingEntry']('/blog');
          expect(result).toBeNull();
        }
      ));
      it('should return the root node when the url matches the root node', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const result = service['_findMostMatchingEntry']('/main');
          expect(result).toEqual(menu[0]);
        }
      ));
      it('should return the most matching node when there is a match', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const result = service['_findMostMatchingEntry']('/crm/company/team');
          expect(result).toEqual(menu[1].children![0].children![1]);
        }
      ));
      it('should ignore url fragments if tree has not one when finding the most matching node', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const result = service['_findMostMatchingEntry']('/crm/company/team#details');
          expect(result).toEqual(menu[1].children![0].children![1]);
        }
      ));
      it('should consider url fragments when tree has one when finding the most matching node', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const result = service['_findMostMatchingEntry']('/crm/company/people#details');
          expect(result).toEqual(menu[1].children![0].children![2]);
        }
      ));
      it('should consider url segments when finding the most matching node', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const result = service['_findMostMatchingEntry']('/main/users');
          expect(result).toEqual(menu[0].children![0]);
        }
      ));
      it('should return the most matching node when there are multiple matches with different url segments', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const result = service['_findMostMatchingEntry']('/crm/company');
          expect(result).toEqual(menu[1].children![0]);
        }
      ));
      it('should return the most matching node when there are multiple matches with different url segments and nested children', inject(
        [CaepSideMenuService],
        (service: CaepSideMenuService) => {
          const result = service['_findMostMatchingEntry']('/crm');
          expect(result).toEqual(menu[1]);
        }
      ));
      describe('with query params', () => {
        it('should return null when given an empty array of tree nodes', inject(
          [CaepSideMenuService],
          (service: CaepSideMenuService) => {
            service.set();
            const result = service['_findMostMatchingEntry']('/home/users');
            expect(result).toBeNull();
          }
        ));
        it('should return null when no nodes match the query', inject(
          [CaepSideMenuService],
          (service: CaepSideMenuService) => {
            const result = service['_findMostMatchingEntry']('/blog');
            expect(result).toBeNull();
          }
        ));
        it('should return the root node when the query matches the root node', inject(
          [CaepSideMenuService],
          (service: CaepSideMenuService) => {
            const result = service['_findMostMatchingEntry']('/home?lang=en&color=blue');
            expect(result).toEqual(menu[2]);
          }
        ));
        it('should return null when tree has query params and given location has not', inject(
          [CaepSideMenuService],
          (service: CaepSideMenuService) => {
            const result = service['_findMostMatchingEntry']('/about/company/team');
            expect(result).toBeNull();
          }
        ));
        it('should return null when one query param does not match', inject(
          [CaepSideMenuService],
          (service: CaepSideMenuService) => {
            const result = service['_findMostMatchingEntry']('/about/company/team?lang=en');
            expect(result).toBeNull();
          }
        ));
        it('should ignore fragments when tree has not one', inject(
          [CaepSideMenuService],
          (service: CaepSideMenuService) => {
            const result = service['_findMostMatchingEntry']('/about/company/team?lang=es#details');
            expect(result).toEqual(menu[3].children![0].children![3]);
          }
        ));
        it('should consider fragments when tree has one', inject(
          [CaepSideMenuService],
          (service: CaepSideMenuService) => {
            const result = service['_findMostMatchingEntry']('/about/company/team?lang=it#details');
            expect(result).toEqual(menu[3].children![0].children![2]);
          }
        ));
        it('should consider query params when finding the most matching node', inject(
          [CaepSideMenuService],
          (service: CaepSideMenuService) => {
            const result = service['_findMostMatchingEntry']('/home/users?lang=es');
            expect(result).toEqual(menu[2].children![1]);
          }
        ));
        it('should consider all query params when finding the most matching node', inject(
          [CaepSideMenuService],
          (service: CaepSideMenuService) => {
            const result = service['_findMostMatchingEntry']('/home/users?lang=en');
            expect(result).toBeNull();

            const result1 = service['_findMostMatchingEntry']('/home/users?lang=en&color=red');
            expect(result1).toEqual(menu[2].children[0]);
          }
        ));
        it('should consider wrong query params when finding the most matching node', inject(
          [CaepSideMenuService],
          (service: CaepSideMenuService) => {
            const result = service['_findMostMatchingEntry']('/home/users?lang=en&color=brown');
            expect(result).toBeNull();
          }
        ));
      });
    });
  });
});
