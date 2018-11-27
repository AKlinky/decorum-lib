import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import * as Safe from '@maidsafe/safe-node-app';
import { SAFEApp } from '@maidsafe/safe-node-app/src/app';


const INFO = {
  id: 'decorum.lib',
  name: 'Decorum Core Library',
  vendor: 'Project Decorum',
};

const PERMISSIONS =  {
  _public: ['Read', 'Insert', 'Update', 'Delete'],
  _publicNames: ['Read', 'Insert', 'Update', 'Delete'],
};


/**
 * Initialize a logged in app from the pre-setup mock vault.
 *
 * @param id App ID.
 */
export async function get_app(id: string) {
  const app = await Safe.initialiseApp(INFO, undefined, { enableExperimentalApis: true});
  await app.auth.loginForTest(PERMISSIONS);

  return app;
}
