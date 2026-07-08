interface ICaepStartRouteNavigateOptions {
  /**
   * When true preserve start's item into stack.
   * When false start's action component must navigate into another action component.
   * When true start's action component must not navigate into another action component.
   * @default false
   */
  preserveStack?: boolean;
}

/**
 * Identifies a component like a start route,
 * providing implicit navigation by query parameter,
 * @param preserveStack if true
 */
export function CaepStartRoute(navigateOptions: ICaepStartRouteNavigateOptions = { preserveStack: false }) {
  return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
    const onInit = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const params: { action: string; param: string } = this.activatedRoute.queryParams.value;
      const { action: originalAction, ...rest } = this.activatedRoute.params.value;
      const { stack } = this.payload;
      if (!navigateOptions.preserveStack && stack[stack.length - 1]?.action?.[0] === 'start') {
        stack.splice(stack.length - 1, 1);
      }
      if (originalAction) {
        const action = rest ? [originalAction, ...Object.values(rest)] : [originalAction];
        this.navigate({ action, queryParams: params });
        return null;
      } else {
        return onInit.apply(this, params);
      }
    };
    return descriptor;
  };
}
