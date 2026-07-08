import { IPolicyCondition, IPolicyRuleLeaf, IPolicyRuleOrNode, IPolicyRuleAndNode, IPolicy } from './core';
import { PolicyEngine } from './policy-engine';

export interface IJsonPolicyClaim {
  'claimType': string;
  'claimValue': string;
}

export interface IJsonPolicyConditionNode {
  'claim'?: IJsonPolicyClaim | IJsonPolicyClaim[];
  'or'?: IJsonPolicyConditionNode | IJsonPolicyConditionNode[];
  'and'?: IJsonPolicyConditionNode | IJsonPolicyConditionNode[];
}

export interface IJsonPolicy {
  'resource': string;
  'selector': string;
  'type': string;
  [key: string]: any;
}

export interface IJsonPolicyClaimRoot extends IJsonPolicy {
  'claim': IJsonPolicyClaim;
}

export interface IJsonPolicyOrRoot extends IJsonPolicy {
  'or': IJsonPolicyConditionNode;
}

export interface IJsonPolicyAndRoot extends IJsonPolicy {
  'and': IJsonPolicyConditionNode;
}

export interface IJsonClaimsPolicyManager {
  policy: IJsonPolicy[];
}

export interface IJsonPolicies {
  claimsAuthorizationPolicyManager: IJsonClaimsPolicyManager;
}

export interface IJsonPolicyWrapper {
  wrapJsonPolicy: (policy: IJsonPolicy) => IPolicy;
}

export class PolicyWrapperHelper {
  static wrapJsonPolicies(jsonPolicies: IJsonPolicies): IPolicy[] {
    return jsonPolicies.claimsAuthorizationPolicyManager.policy
      .map(policy => {
        const type = policy['type'];
        const policyHandler = PolicyEngine.GetPolicyHandler(type);
        return policyHandler.createWrapHandler().wrapJsonPolicy(policy);
      });
  }
}

export class PolicyWrapper implements IJsonPolicyWrapper {

  public wrapJsonPolicy(jsonPolicy: IJsonPolicy): IPolicy {
    return {
      resource: this.wrapJsonResource(jsonPolicy['resource']),
      selector: jsonPolicy['selector'],
      type: jsonPolicy['type'],
      condition: this.wrapJsonPolicyNodes(jsonPolicy),
    };
  }

  protected wrapJsonPolicyNodes(jsonPolicy: any): IPolicyCondition {
    if (this.isClaimRoot(jsonPolicy)) {
      return this.wrapJsonPolicyClaimRoot(jsonPolicy);
    } else if (this.isOrRoot(jsonPolicy)) {
      return this.wrapJsonPolicyOrRoot(jsonPolicy);
    } else if (this.isAndRoot(jsonPolicy)) {
      return this.wrapJsonPolicyAndRoot(jsonPolicy);
    }
  }

  protected wrapJsonPolicyClaimRoot(root: IJsonPolicyClaimRoot): IPolicyRuleLeaf {
    return this.wrapJsonPolicyClaimNode(root['claim']);
  }

  protected wrapJsonPolicyOrRoot(root: IJsonPolicyOrRoot): IPolicyRuleOrNode {
    return this.wrapJsonPolicyOrNode(root['or']);
  }

  protected wrapJsonPolicyAndRoot(root: IJsonPolicyAndRoot): IPolicyRuleAndNode {
    return this.wrapJsonPolicyAndNode(root['and']);
  }
  public wrapJsonPolicyNode(node: IJsonPolicyConditionNode): IPolicyCondition[] {
    const result = [];
    if (node['claim']) {
      result.push(...this.wrapJsonPolicyClaimNodes(node['claim']));
    }
    if (node['or']) {
      result.push(...this.wrapJsonPolicyOrNodes(node['or']));
    }
    if (node['and']) {
      result.push(...this.wrapJsonPolicyAndNodes(node['and']));
    }
    return result;
  }

  protected wrapJsonPolicyClaimNodes(node: IJsonPolicyClaim | IJsonPolicyClaim[]): IPolicyRuleLeaf[] {
    if (node instanceof Array) {
      return node.map(this.wrapJsonPolicyClaimNode);
    } else {
      return [this.wrapJsonPolicyClaimNode(node)];
    }
  }

  protected wrapJsonPolicyOrNodes(node: IJsonPolicyConditionNode | IJsonPolicyConditionNode[]): IPolicyRuleOrNode[] {
    if (node instanceof Array) {
      return node.map(this.wrapJsonPolicyOrNode);
    } else {
      return [this.wrapJsonPolicyOrNode(node)];
    }
  }

  protected wrapJsonPolicyAndNodes(node: IJsonPolicyConditionNode | IJsonPolicyConditionNode[]): IPolicyRuleAndNode[] {
    if (node instanceof Array) {
      return node.map(this.wrapJsonPolicyAndNode);
    } else {
      return [this.wrapJsonPolicyAndNode(node)];
    }
  }

  protected wrapJsonPolicyClaimNode(claim: IJsonPolicyClaim): IPolicyRuleLeaf {
    return {
      claimType: claim['claimType'],
      claimValue: claim['claimValue']
    };
  }

  protected wrapJsonPolicyOrNode(node: IJsonPolicyConditionNode): IPolicyRuleOrNode {
    return {
      or: this.wrapJsonPolicyNode(node)
    };
  }

  protected wrapJsonPolicyAndNode(node: IJsonPolicyConditionNode): IPolicyRuleAndNode {
    return {
      and: this.wrapJsonPolicyNode(node)
    };
  }

  protected wrapJsonResource(jsonResource: string): RegExp {
    const escapedString = jsonResource.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    const wildcardedString = escapedString.replace(/\\\*/g, '.*').replace(/\\\?/g, '.');
    return new RegExp(`^${wildcardedString}$`);
  }

  protected isClaimRoot(root: IJsonPolicyClaimRoot): root is IJsonPolicyClaimRoot {
    return root['claim'] !== undefined;
  }

  protected isOrRoot(root: IJsonPolicyOrRoot): root is IJsonPolicyOrRoot {
    return root['or'] !== undefined;
  }

  protected isAndRoot(root: IJsonPolicyAndRoot): root is IJsonPolicyAndRoot {
    return root['and'] !== undefined;
  }
}
