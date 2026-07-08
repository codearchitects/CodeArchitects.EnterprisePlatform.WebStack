import { Inject, Injectable, Optional } from '@angular/core';
import { NavigationEnd, Params, Router } from '@angular/router';
import { Activity, BaseDelegates } from '@ca-webstack/ng-shell';
import { UUID } from 'angular2-uuid';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, shareReplay, startWith } from 'rxjs/operators';
import { CaepSideMenuPreserveNavigationFlowCallback, ICaepSideMenuEntry, ICaepSideMenuNavigationArgs } from '../models';
import { ICaepSideMenuLinkedEntry } from '../models/linked-entry';
import { ICaepSideMenuMapToUrlOptions } from '../models/map-to-url';
import { CAEP_SIDE_MENU_TASK_ID_INDEX } from '../tokens';
import {
  CAEP_SIDE_MENU_PRESERVE_NAVIGATION_FLOW,
  CAEP_SIDE_MENU_PRESERVE_NAVIGATION_FLOW_OVERRIDE
} from '../tokens/preserve-navigation-flow.token';

/**
 * Service which handles side menu
 */
@Injectable()
export class CaepSideMenuService {
  //#region Internals
  /**
   * Stores menu entries
   */
  private _entries$ = new BehaviorSubject<ICaepSideMenuEntry[]>([]);
  //#endregion
  //#region Public
  /**
   * Observable which emits everytime entries are modified.
   * This observable replays current entries.
   */
  public entries$: Observable<ICaepSideMenuEntry[]> = this._entries$.asObservable();
  /**
   * Observable which emits everytime location changes.
   * Location is retrived from window.location.hash and comes without `#` and task identifier.
   * This is a multicast observable which shares last emit.
   */
  public location$: Observable<string>;
  /**
   * Retrieves current entries
   */
  public get snapshot() {
    return this._entries$.value;
  }
  /**
   * Set current activity.
   */
  public set activity(act: Activity<any> | null | undefined) {
    this._currentActivity = act;
  }
  /**
   * Set current delegates.
   */
  public set delegates(del: BaseDelegates | null | undefined) {
    this._currentDelegates = del;
  }
  /**
   * Stores current activity.
   */
  private _currentActivity: Activity<any>;
  /**
   * Stores current delegates.
   */
  private _currentDelegates: BaseDelegates;
  //#endregion
  constructor(
    @Inject(CAEP_SIDE_MENU_TASK_ID_INDEX) private _taskIdIndex: number,
    @Optional()
    @Inject(CAEP_SIDE_MENU_PRESERVE_NAVIGATION_FLOW)
    private _customPreserveNavigation: CaepSideMenuPreserveNavigationFlowCallback,
    @Optional()
    @Inject(CAEP_SIDE_MENU_PRESERVE_NAVIGATION_FLOW_OVERRIDE)
    private _isCustomPreserveOverride: boolean,
    private _router: Router
  ) {
    this._init();
  }
  //#region Hooks
  //#region CRUD
  /**
   * Appends given entries to existing ones.
   * @param entries Entries to be appended.
   * @returns Added entries with default parameters set.
   */
  public append(entry: ICaepSideMenuEntry): ICaepSideMenuEntry;
  public append(...entries: ICaepSideMenuEntry[]): ICaepSideMenuEntry[];
  public append(...entries: ICaepSideMenuEntry[]): ICaepSideMenuEntry | ICaepSideMenuEntry[] {
    const toAppend = entries?.map(entry => this._setDefaults(entry, true));
    if (toAppend?.length) {
      this._entries$.next([...this._entries$.value, ...toAppend]);
    }
    return this._firstOrArray(toAppend);
  }
  /**
   * Set given entries to provided ones.
   * @param entries Entries to be set.
   * @returns Set entries with default parameters set.
   */
  public set(entry: ICaepSideMenuEntry): ICaepSideMenuEntry;
  public set(...entries: ICaepSideMenuEntry[]): ICaepSideMenuEntry[];
  public set(...entries: ICaepSideMenuEntry[]): ICaepSideMenuEntry | ICaepSideMenuEntry[] {
    const toSet = entries?.map(entry => this._setDefaults(entry, true)) ?? [];
    this._entries$.next(toSet ?? []);
    return this._firstOrArray(toSet);
  }
  /**
   * Update given entries to provided ones.
   * @param entries Entries to be updated.
   * @returns Updated entries with default parameters set.
   */
  public update(entry: ICaepSideMenuEntry): ICaepSideMenuEntry;
  public update(...entries: ICaepSideMenuEntry[]): ICaepSideMenuEntry[];
  public update(...entries: ICaepSideMenuEntry[]): ICaepSideMenuEntry | ICaepSideMenuEntry[] {
    const copy = [...this._entries$.value];
    const updated: ICaepSideMenuEntry[] = [];
    entries.forEach(entry => {
      const { container, index, firstLevel } = this._findEntryContainer(copy, item => item.id === entry.id) ?? {};
      if (container?.[index]) {
        const toUpdate = this._setDefaults(entry, firstLevel);
        container[index] = toUpdate;
        updated.push(toUpdate);
      }
    });
    if (updated.length > 0) {
      this._entries$.next(copy);
    }
    return entries?.length > 1 ? updated : updated[0];
  }
  /**
   * Update given entries to provided ones or appends them if not exists.
   * @param entries Entries to be updated/created.
   * @returns Updated/created entries with default parameters set.
   */
  public createOrUpdate(entry: ICaepSideMenuEntry): ICaepSideMenuEntry;
  public createOrUpdate(...entries: ICaepSideMenuEntry[]): ICaepSideMenuEntry[];
  public createOrUpdate(...entries: ICaepSideMenuEntry[]): ICaepSideMenuEntry | ICaepSideMenuEntry[] {
    const copy = [...this._entries$.value];
    const updated: ICaepSideMenuEntry[] = [];
    entries.forEach(entry => {
      const { container, index, firstLevel } = this._findEntryContainer(copy, item => item.id === entry.id) ?? {};
      if (container?.[index]) {
        const toUpdate = this._setDefaults(entry, firstLevel);
        container[index] = toUpdate;
        updated.push(toUpdate);
      } else {
        const toAppend = this._setDefaults(entry, true);
        copy.push(toAppend);
        updated.push(toAppend);
      }
    });
    if (updated.length > 0) {
      this._entries$.next(copy);
    }
    return this._firstOrArray(updated);
  }
  /**
   * Removes entries by id.
   * @param ids Entries to be removed identifiers.
   * @returns Deleted entries.
   */
  public delete(id: string): ICaepSideMenuEntry;
  public delete(...ids: string[]): ICaepSideMenuEntry[];
  public delete(...ids: string[]): ICaepSideMenuEntry | ICaepSideMenuEntry[] {
    const toDelete = [...(ids ?? [])];
    const deleted: ICaepSideMenuEntry[] = [];
    const entries = this._entries$.value.filter(entry => {
      const idx = toDelete.findIndex(id => entry.id === id);
      if (idx > -1) {
        deleted.push(entry);
        toDelete.splice(idx, 1);
        return false;
      }
      return true;
    });

    if (entries.length !== this._entries$.value.length) {
      this._entries$.next(entries);
    }
    return ids?.length > 1 ? deleted : deleted[0];
  }
  /**
   * Looks for an entry having provided identifier.
   * @param id Identifier to look for.
   * @returns Entry if found, undefined otherwise.
   */
  public getEntryById(id: string): ICaepSideMenuEntry | undefined {
    const { container, index } = this._findEntryContainer(this._entries$.value, item => item.id === id) ?? {};
    return container?.[index];
  }
  //#endregion
  //#region State
  /**
   * Check whether given entry is active based on provided location.
   * When deep search is enabled, and provided entry is not active, this function retrieves true when a child entry is active.
   * When activeEntry param is not provided, it will be internally retrieved. You can provide it to avoid from being retrieved on each call.
   * @param entry Entry to be checked.
   * @param location Current router location.
   * @param deep Whether to look for child entries when provided one is not active.
   * @param activeEntry Current active entry.
   * @returns Whether provided entry, or child when enabled, is active or not.
   */
  public isActive(entry: ICaepSideMenuEntry, location: string, deep = true, activeEntry?: ICaepSideMenuEntry): boolean {
    const match = activeEntry ?? this.getActiveEntry(location);
    return (
      match &&
      (match.id === entry.id ||
        (deep && entry.children?.findIndex(child => this.isActive(child, location, deep, match)) > -1))
    );
  }
  /**
   * Returns active entry based on location.
   * @param location Current location.
   * @returns Active entry if found.
   */
  public getActiveEntry(location: string): ICaepSideMenuEntry | null {
    return this._findMostMatchingEntry(location);
  }
  //#endregion
  //#region Navigation
  /**
   * Whether based on a source location and a destination entry, navigation flow can be preserved or not.
   * @param source Source location.
   * @param destination Destination entry.
   * @returns Whether to preserve navigation flow.
   */
  public canPreserveNavigation(source: string, destination: ICaepSideMenuEntry): boolean {
    const sourceEntry = this._findMostMatchingEntry(source);
    if (!sourceEntry?.link?.url || !destination?.link?.url) return false; // source and destination entries must have url
    if (this._customPreserveNavigation) {
      const sourceArgs: ICaepSideMenuNavigationArgs = {
        entry: this._mapToLinkedEntry(sourceEntry),
        ...this.mapToNavigationArgs(sourceEntry.link.url)
      };
      const destinationArgs: ICaepSideMenuNavigationArgs = {
        entry: this._mapToLinkedEntry(destination),
        ...this.mapToNavigationArgs(destination.link.url)
      };
      return this._isCustomPreserveOverride
        ? this._customPreserveNavigation(sourceArgs, destinationArgs)
        : this._canPreserveNavigation(sourceEntry, destination) &&
            this._customPreserveNavigation(sourceArgs, destinationArgs);
    }
    return this._canPreserveNavigation(sourceEntry, destination);
  }
  /**
   * Maps navigation args to url.
   * @param args Navigation args.
   */
  public mapToUrl(
    args: Omit<ICaepSideMenuNavigationArgs, 'entry'>,
    options: ICaepSideMenuMapToUrlOptions = { addStart: false, addTaskId: false }
  ): string {
    let url = '';
    if (args.application) {
      url += `/${this._toUrlSegment(args.application)}`;
    }
    if (args.domain) {
      url += `/${this._toUrlSegment(args.domain)}`;
    }
    if (args.scenario) {
      url += `/${this._toUrlSegment(args.scenario)}`;
    }
    if (args.action) {
      let actionSegment = this._toUrlSegment(args.action);
      if (options.addStart && !actionSegment.startsWith('start')) {
        actionSegment = `start/${actionSegment}`;
      }
      url += `/${actionSegment}`;
    }
    if (url.length) {
      if (options.addTaskId) {
        // adding task id at defined index
        const segments = url.split('/');
        segments.splice(this._taskIdIndex, 0, UUID.UUID());
        url = segments.join('/');
      }
      // adding query params
      if (args.queryParams && Object.keys(args.queryParams).length) {
        url += `?${new URLSearchParams(args.queryParams).toString()}`;
      }
    }
    return url;
  }
  /**
   * Maps a given URL to a ICaepSideMenuNavigationArgs like object.
   * @param url Url to be mapped.
   * @returns Mapped url.
   */
  public mapToNavigationArgs(
    url: string | Omit<ICaepSideMenuNavigationArgs, 'entry'>,
    hasTaskId = false
  ): Partial<ICaepSideMenuNavigationArgs> {
    // TODO: Support menu navigation with fragments
    const _url = typeof url === 'string' ? url : this.mapToUrl(url);
    const [routeWithParams, fragment] = _url.split('#');
    const [fullRoute, queryParams] = routeWithParams.split('?');
    const route = fullRoute.startsWith('/') ? fullRoute.substring(1) : fullRoute;
    const segments = route.split('/');
    const normalizedSegments: string[] = [];
    let taskId: string;
    const relativeTaskIdIndex = segments[0] === '' ? this._taskIdIndex : this._taskIdIndex - 1;
    for (let index = 0; index < segments.length; index++) {
      const segment = segments[index];
      if (!hasTaskId || index !== relativeTaskIdIndex) {
        normalizedSegments.push(segment);
      } else {
        taskId = segment;
      }
    }
    const [application, domain, scenario, ...action] = normalizedSegments;

    const params: Params = queryParams?.split('&').reduce((acc, param) => {
      const [key, value] = param.split('=');
      acc[key] = value;
      return acc;
    }, {});

    const mapped: Partial<ICaepSideMenuNavigationArgs> = {
      application,
      domain,
      scenario: hasTaskId && taskId ? [scenario, taskId] : scenario,
      action: action?.length > 1 ? action : action?.length === 1 ? action[0] : undefined,
      queryParams: params,
      activity: this._currentActivity,
      delegates: this._currentDelegates
    };

    return this._cleanObject(mapped);
  }
  //#endregion
  //#endregion
  //#region Internal hooks
  /**
   * Service initializations.
   */
  private _init() {
    this.location$ = this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(0),
      map(() => this._removeTaskId(window.location.hash.replace(`#`, ''))),
      shareReplay(1)
    );
  }
  /**
   * Maps path to url segment(s)
   */
  private _toUrlSegment(path: string | string[]): string {
    return typeof path === 'string' ? path : path.join('/');
  }
  /**
   * Looks for entry having url which most match provided location.
   * @param location Location query.
   * @return Most matching side menu entry.
   */
  private _findMostMatchingEntry(location: string): ICaepSideMenuEntry | null {
    let maxMatches = 0;
    let mostMatchingEntry: ICaepSideMenuEntry | null = null;

    const [query, queryFragment] = location.split('#');
    const [queryUrl, queryParams] = query.split('?');

    const traverseTree = (entry: ICaepSideMenuEntry) => {
      if (entry.link?.url) {
        const url = typeof entry.link.url === 'string' ? entry.link.url : this.mapToUrl(entry.link.url);
        const [urlWithoutFragment, urlFragment] = url.split('#');
        const [urlWithoutParams, urlParams] = urlWithoutFragment.split('?');
        const urlSegments = urlWithoutParams.split('/');
        const querySegments = queryUrl.split('/');

        // URLS may start with an empty segment, since usually starts with /. This will not be considered as a match
        if (querySegments[0] === '') {
          querySegments.splice(0, 1);
        }
        if (urlSegments[0] === '') {
          urlSegments.splice(0, 1);
        }

        let matches = 0;

        for (let i = 0; i < urlSegments.length; i++) {
          if ((querySegments[i] || querySegments[i] === '') && querySegments[i] === urlSegments[i]) {
            matches++;
          } else {
            // This entry can not be considered
            matches = 0;
            break;
          }
        }

        // Checking queryParams
        if (matches && urlParams) {
          const urlParamsMap = new Map<string, string>(
            urlParams.split('&').map(param => {
              const [key, value] = param.split('=');
              return [key, value];
            })
          );
          const queryParamsMap = new Map<string, string>(
            queryParams?.split('&').map(param => {
              const [key, value] = param.split('=');
              return [key, value];
            }) ?? []
          );

          for (const [key, value] of urlParamsMap.entries()) {
            if (queryParamsMap.get(key) === value) {
              matches++;
            } else {
              // When entry has a specific query param, it must match actual location param, otherwise this entry is not suitable
              matches = 0;
              break;
            }
          }
        }

        // Checking fragments
        if (matches && urlFragment) {
          if (urlFragment === queryFragment) {
            matches++;
          } else {
            matches = 0;
          }
        }

        // Updating most matching entry
        if (matches > maxMatches) {
          maxMatches = matches;
          mostMatchingEntry = entry;
        }
      }

      // Traversing children
      if (entry.children) {
        for (const child of entry.children) {
          traverseTree(child);
        }
      }
    };

    this._entries$.value.forEach(node => {
      traverseTree(node);
    });

    return mostMatchingEntry;
  }
  /**
   * Find entry container by provided query.
   * @param entries Entries container in which look for query.
   * @param filter Filter callback.
   * @param firstLevel Whether this is the first level entries container
   * @returns When found the container which hold this entry, the entry index in this container and whether entry has been found at first level container.
   */
  private _findEntryContainer(
    entries: ICaepSideMenuEntry[],
    filter: (item: ICaepSideMenuEntry) => boolean,
    firstLevel = true
  ): { container: ICaepSideMenuEntry[]; index: number; firstLevel?: boolean } {
    const idx = entries.findIndex(child => filter(child));
    if (idx > -1) {
      return { container: entries, index: idx, firstLevel };
    }
    for (const entry of entries) {
      if (entry.children) {
        const found = this._findEntryContainer(entry.children, filter, false);
        if (found) {
          return found;
        }
      }
    }
  }
  /**
   * Returns first item if array has one element only, otherwise return provided value.
   * @param items Items to be mapped.
   * @returns First or all items.
   */
  private _firstOrArray<T>(items?: T[]): T | T[] {
    return items?.length > 1 ? items : items?.[0];
  }
  /**
   * Set default values about given entries.
   * @param entry Completed entry.
   * @param firstLevel Whether this is a first level entry or not.
   */
  private _setDefaults(entry: ICaepSideMenuEntry, firstLevel?: boolean): ICaepSideMenuEntry {
    return this._cleanObject({
      ...entry,
      id: entry.id ?? UUID.UUID(),
      enable: entry.enable ?? true,
      show: entry.show ?? true,
      children: entry.children?.map(child => this._setDefaults(child))
    });
  }
  /**
   * Removes task identifier from url. If taskIdIndex is negative, nothing will be removed from url.
   * @param url Url to be mapped.
   * @returns Url without task identifier.
   */
  private _removeTaskId(url: string): string {
    if (this._taskIdIndex < 0) return url;
    const segments = url.split('/');
    segments.splice(this._taskIdIndex, 1);
    return segments.join('/');
  }
  /**
   * Checks if there is a preserved navigation match between two entries in a tree.
   * @param source The source entry.
   * @param destination The destination entry.
   * @returns True if there is a preserved navigation match, false otherwise.
   */
  private _canPreserveNavigation(source: ICaepSideMenuEntry, destination: ICaepSideMenuEntry): boolean {
    if (source.id === destination.id && source.preserveNavigation != null) {
      // The source and destination entries are the same and preserveNavigation was set
      return source.preserveNavigation;
    }

    const sourceAncestors = this._findAncestors(source);
    const destinationAncestors = this._findAncestors(destination);

    // Find common and uncommon ancestors
    const commonAncestors: ICaepSideMenuEntry[] = [];
    const uncommonAncestors: ICaepSideMenuEntry[] = [];
    for (let i = 0; i < Math.max(sourceAncestors.length, destinationAncestors.length); i++) {
      if (sourceAncestors[i]?.id === destinationAncestors[i]?.id) {
        // This ancestor is common to both source and destination
        commonAncestors.push(sourceAncestors[i]);
      } else {
        if (sourceAncestors[i]) {
          uncommonAncestors.push(sourceAncestors[i]);
        }
        if (destinationAncestors[i]) {
          uncommonAncestors.push(destinationAncestors[i]);
        }
      }
    }

    // Uncommon ancestors are closer source or destination ancestors than common ones. Which means if one of them can not preserve navigation, function returns false
    for (const ancestor of uncommonAncestors) {
      if (ancestor.preserveNavigation === false) {
        return false;
      }
    }

    // There is no common ancestor so we can not preserve navigation flow
    if (!commonAncestors.length) {
      return false;
    }

    // Traversing ancestors we return the closest preserveNavigation set value
    for (let i = commonAncestors.length - 1; i >= 0; i--) {
      const currentAncestor = commonAncestors[i];
      if (currentAncestor.preserveNavigation != null) {
        return currentAncestor.preserveNavigation;
      }
    }

    return false;
  }
  /**
   * Retrieves the ancestors of a ICaepSideMenuEntry given its id.
   * @param entry The entry ICaepSideMenuEntry to retrieve ancestors for.
   * @param tree The entire ICaepSideMenuEntry structure to search through.
   * @returns An array of ICaepSideMenuEntry ancestors of the entry, ordered from the root to the direct parent.
   * Returns an empty array if the entry is not found or has no ancestors.
   */
  private _findAncestors(entry: ICaepSideMenuEntry): ICaepSideMenuEntry[] {
    // Initialize an empty array to hold the ancestors.
    const ancestors: ICaepSideMenuEntry[] = [];

    // Define a recursive function to search for the ICaepSideMenuEntry with the specified ID.
    function findNode(currentNode: ICaepSideMenuEntry): boolean {
      // If the current node has the specified ID, return true to indicate success.
      if (currentNode.id === entry.id) {
        return true;
      }

      // If the current node does not have the specified ID, recursively search its children.
      for (const child of currentNode.children ?? []) {
        if (findNode(child)) {
          // If the specified ID is found in a child node, add the current node to the ancestors array and return true.
          ancestors.unshift(currentNode);
          return true;
        }
      }

      // If the specified ID is not found in the current node or its children, return false to indicate failure.
      return false;
    }

    // Call the recursive function on each node in the root array to start the search.
    for (const node of this._entries$.value) {
      if (findNode(node)) {
        // If the specified ID is found in a node, return the ancestors array.
        return ancestors;
      }
    }

    // If the specified ID is not found in any of the nodes, return an empty array.
    return [];
  }
  /**
   * Maps a given ICaepSideMenuEntry to an ICaepSideMenuLinkedEntry object, filling in the parent nodes properly.
   * The root node(s) of the tree must be passed in as an array.
   *
   * @param entry - The ICaepSideMenuEntry node to map.
   * @param parent - The parent node of the entry node.
   * @param roots - The root node(s) of the tree.
   * @returns The corresponding ICaepSideMenuLinkedEntry object.
   */
  private _mapToLinkedEntry(entry: ICaepSideMenuEntry): ICaepSideMenuLinkedEntry {
    const ancestors = this._findAncestors(entry).reverse();
    if (!ancestors.length) return { entry };

    const traverse = (child: ICaepSideMenuEntry, ancestors: ICaepSideMenuEntry[]) => {
      const parent = ancestors.length > 1 ? traverse(ancestors[0], ancestors.slice(1)) : { entry: ancestors[0] };
      return { entry: child, parent };
    };
    return traverse(entry, ancestors);
  }
  /**
   * Removes undefined entries from object.
   * This is not a pure function, so reference are cleaned straight on the given object
   *  This is not a recursive function, so only top level references are cleaned.
   */
  private _cleanObject<T>(obj: T): T {
    Object.keys(obj).forEach(key => {
      if (obj[key] === undefined) delete obj[key];
    });
    return obj;
  }
  //#endregion
}
