import { IBusinessRulePolicy } from './business-policy';
import { Context } from './policy-engine';
import { IJsonPolicyWrapper } from './policy-wrapper';

export type PolicyType = 'authorization' | 'business';

export type IPolicy = IBusinessRulePolicy | IAuthorizationPolicy | IBasePolicy;

export interface IPolicyHandler {
  // the policy type this handler can handle
  type: string;
  handler: (policy: IPolicy, claims: IClaim[], context: Context) => any;
  createWrapHandler: () => IJsonPolicyWrapper;
}

export interface IAuthorizationPolicy extends IBasePolicy {
  type: 'authorization';
}

export interface IBasePolicy {
  resource: RegExp;
  condition: IPolicyCondition;
  selector: string;
  [key: string]: any;
}

export type IPolicyCondition = IPolicyRuleLeaf | IPolicyRuleOrNode | IPolicyRuleAndNode;

export interface IPolicyRuleLeaf {
  claimType: string;
  claimValue: string;
}

export interface IPolicyRuleOrNode {
  or: IPolicyCondition[];
}

export interface IPolicyRuleAndNode {
  and: IPolicyCondition[];
}

export interface IClaim {
  type: string;
  value: string;
}

export class Utility {
  static isLeafNode(ruleNode: any): ruleNode is IPolicyRuleLeaf {
    return ruleNode.claimType !== undefined;
  }

  static isOrNode(ruleNode: any): ruleNode is IPolicyRuleOrNode {
    return ruleNode.or !== undefined;
  }

  static isAndNode(ruleNode: any): ruleNode is IPolicyRuleAndNode {
    return ruleNode.and !== undefined;
  }
}
