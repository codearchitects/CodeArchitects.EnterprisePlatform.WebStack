import { Injectable } from '@angular/core';
import { DataContext, IMergeStrategy } from '@ca-webstack/data-context';

@Injectable()
export class DataContextService {

  private dataContext = new DataContext();

  public attach<T>(root: T, mergeStrategy?: IMergeStrategy) {
    return this.dataContext.attach(root, mergeStrategy);
  }

  public detach<T>(root: T) {
    this.dataContext.detach(root);
  }

}
