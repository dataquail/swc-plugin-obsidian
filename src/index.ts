import {
  ModuleItem,
} from '@swc/types';
import Visitor from '@swc/core/visitor';
import unmagler from './unmagler';

export class ObsidianSWCPlugin extends Visitor {
  constructor() {
    super();
  }

  override visitModuleItems(nodes: ModuleItem[]): ModuleItem[] {
    for (const node of nodes) {
      if (node.type === "ClassDeclaration") {
        if (node.identifier.type === "Identifier") {
          unmagler.saveIdentifier('Inject', node.identifier);
        } else if (node.identifier.type === "TsParameterProperty") {
          unmagler.saveTSParameterProperty('Inject', node.identifier);
        }

        for (const classMember of node.body) {
          if (classMember.type === "ClassMethod") {
            unmagler.saveClassMethod('Provides', classMember);
          } else if (classMember.type === "ClassProperty") {
            unmagler.saveClassProperty('Inject', classMember);
            unmagler.saveClassProperty('LateInject', classMember);
          }
        }
      }
    }
    return nodes;
  }
}

export default function plugin() {
  return new ObsidianSWCPlugin();
}
