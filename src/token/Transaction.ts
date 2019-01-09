import Md from '../Md';
import { sign, getPublicKey } from '../utils';

import { MutableData, ValueVersion } from '@maidsafe/safe-node-app/src/api/mutable';
import error_const from '@maidsafe/safe-node-app/src/error_const';
import AbstractTransaction from './AbstractTransaction';
import { SAFEApp } from '@maidsafe/safe-node-app/src/app';
import { sha3_256 } from 'js-sha3';


export default class Transaction extends AbstractTransaction {
  public signature: Buffer;
  public publicKey: Buffer;

  public parentSerial: Buffer;
  public parent: AbstractTransaction | undefined;


  constructor(
    app: SAFEApp,
    depth: number,
    outputs: Array<[Buffer, number]>,
    signature: Buffer,
    publicKey: Buffer,
    parentSerial: Buffer,
    parent?: AbstractTransaction,
  ) {
    const xor = Buffer.from(sha3_256.arrayBuffer(signature));
    super(app, xor, depth, outputs);

    this.signature = signature;
    this.publicKey = publicKey;
    this.parentSerial = parentSerial;
    this.parent = parent;
  }


  public async createEntries() {
    const entries = await super.createEntries();

    await entries.insert('parent', this.parentSerial);
    await entries.insert('signature', this.signature);
    await entries.insert('public_key', this.publicKey);

    return entries;
  }


  // /**
  //  * Setup the properties for a regular transaction.
  //  *
  //  * @param outputs
  //  * @param parent
  //  * @param sk
  //  */
  // public async setup(outputs: Array<[Buffer, number]>, parent: Transaction, sk: Buffer) {
  //   this.outputs = outputs;

  //   this.depth = parent.depth! + 1;

  //   this.parent = parent;
  //   this.signature = await parent.sign(sk);
  //   this.publicKey = await getPublicKey(sk);

  //   this.xor = await this.app.crypto.sha3Hash(this.signature);
  // }

  // public async commit() {
  //   const entries = await this.app.mutableData.newEntries();

  //   if (this.depth === undefined) {
  //     throw Error('depth is undefined');
  //   }

  //   if (this.outputs === undefined) {
  //     throw Error('outputs is undefined');
  //   }

  //   await entries.insert('depth', this.depth.toString());
  //   await entries.insert('outputs', JSON.stringify(this.outputs!.map((o) => {
  //     return [ [...o[0]], o[1] ];
  //   })));

  //   if (this.coin !== undefined) {
  //     await entries.insert('coin', this.coin);
  //   } else {
  //     await entries.insert('parent', this.parent!.xor);
  //     await entries.insert('signature', this.signature!);
  //     await entries.insert('public_key', this.publicKey!);
  //   }

  //   // Put the entries at an MD without permissions.
  //   const md = await this.app.mutableData.newPublic(this.xor, this.tag);
  //   const pm = await this.app.mutableData.newPermissions();
  //   await md.put(pm, entries);
  // }

  // public async verify() {
  //   let transaction: Transaction = this;

  //   while (true) {
  //     await transaction.fetch();

  //     // transaction.outputs;

  //     transaction = transaction.parent!;
  //   }
  // }
}
