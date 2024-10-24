import * as swc from '@swc/core';
import {
  ModuleItem,
} from '@swc/types';
import type {
  Plugin,
  PluginOption,
} from 'vite'
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

export default function plugin(): PluginOption[] {
  const viteObsidian: Plugin = {
    name: 'vite:obsidian',
    async transform(code) {
      const result = await swc.transform(code, {
        filename: "input.js",
        jsc: {
        parser: {
          syntax: "typescript",
          decorators: true
        }
      },
        plugin(m) {
          return new ObsidianSWCPlugin().visitProgram(m);
        },
      });

      if (result) {
        let code = result.code!
        return { code, map: result.map }
      }

      return;
    },
  }

  return [viteObsidian];
}
