import { IBasePolicy } from './core';
import { Context } from './policy-engine';
import * as ts from 'typescript';

/*
* compiled rule prototype
*/
export type CompiledRule = (ruleArgs: IRuleArgs) => any;

/*
* business rules type
*/
export enum RuleType {
  Simple = <any>'Simple',
  ForwardChaining = <any>'ForwardChaining',
  BackwardChaining = <any>'BackwardChaining',
  Full = <any>'Full'
}

/*
* single business rule policy
*/
export interface IBusinessRulePolicy extends IBasePolicy {
  type: 'business';
  policyInfo: IBusinessRulePolicyInfo | IBusinessRulePolicyInfo[];
}

export interface IJsonBusinessRulePolicy {
  ['type']: 'business';
  ['policyInfo']: IJsonBusinessRulePolicyInfo | IJsonBusinessRulePolicyInfo[];
}

/**
 * a single validation policy
 */
export interface IBusinessRulePolicyInfo {
  name?: string;
  expression: string | string[];
  type?: RuleType;
  compiledRule?: CompiledRule | CompiledRule[];
}

export interface IJsonBusinessRulePolicyInfo {
  ['name']: string;
  ['expression']: string | string[];
  ['type']?: RuleType;
}

/**
 * open extensible rule context arguments interface
 */
export interface IBusinessRuleContext {
  [propertyName: string]: any;
}

/**
 * extensible rule args
 */
export interface IRuleArgs {
  // some context data to use in rules
  context: IBusinessRuleContext;
  // extensions
  [propertyName: string]: any;
}

function compileExpression(policy: IBusinessRulePolicyInfo, expression: string): CompiledRule {
  const jscript = ts.transpile(expression).replace(new RegExp('_this', 'g'), 'this').replace('var this = this;', '');
  // tslint:disable-next-line
  return eval(jscript);
}

function runSingleBusinessPolicy(policyInfo: IBusinessRulePolicyInfo, context: Context) {
  let retval;
  if (!policyInfo.compiledRule) {
    if (Array.isArray(policyInfo.expression)) {
      const rules = policyInfo.compiledRule = [];
      policyInfo.expression.forEach(i => rules.push(compileExpression(policyInfo, i)));
      policyInfo.compiledRule = rules;
    } else {
      policyInfo.compiledRule = compileExpression(policyInfo, policyInfo.expression);
    }
  }
  if (policyInfo.compiledRule) {
    if (Array.isArray(policyInfo.compiledRule)) {
      const temp = [];
      policyInfo.compiledRule.forEach(i => temp.push(i.apply(context.data, [context])));
      retval = {};
      temp.forEach(i => {
        for (const j in i) {
          retval[j] = i[j];
        }
      });
    } else {
      retval = policyInfo.compiledRule.apply(context.data, [context]);
    }
  }
  return retval;
}

export function runBusinessPolicy(policy: IBusinessRulePolicy, context: Context): any {
  let temp = [];
  const result = {};
  if (Array.isArray(policy.policyInfo)) {
    temp = [];
    policy.policyInfo.forEach(i => temp.push(runSingleBusinessPolicy(i, context)));
  } else {
    temp = runSingleBusinessPolicy(policy.policyInfo, context);
  }
  temp.filter(i => !!i).forEach(i => {
    for (const j in i)
      result[j] = i[j];
  });

  return result;
}
