import * as Safe from '@maidsafe/safe-node-app';

const info = {
  id: 'decorum.lib',
  name: 'Decorum Core Library',
  vendor: 'Project Decorum',
};

const permissions = {};

const opts = {
  own_container: true,
};

const TYPES = {
  IDENTITY: 5487,
};

export default class Decorum {
  /**
   * Initialise the Decorum object.
   *
   * @returns {Decorum}
   */
  public static async initialise() {
    const app = await Safe.initializeApp(info);

    return new this(app);
  }

  // The underlying app handle object.
  public app: any;

  /**
   * Construct the Decorum object.
   *
   * @param app  An app instance.
   */
  constructor(app: any) {
    this.app = app;
  }

  /* istanbul ignore next */
  /**
   * Request authorisation from the user
   *
   * @return {string} authorisation URI
   */
  public async authorise() {
    return await this.app.auth.genAuthUri(permissions, opts);
  }

  /**
   * Login
   *
   * @return {Decorum}
   */
  public async login(authUri?: string) {
    /* istanbul ignore if */
    if (authUri !== undefined) {
      await this.app.auth.loginFromURI(authUri);
    } else {
      await this.app.auth.loginForTest(permissions, opts);
    }

    return this;
  }

  /**
   * Create new identity.
   *
   * @param nickname
   */
  public async createIdentity(nickname: string) {
    const entries = await this.app.mutableData.newEntries();
    await entries.insert('nickname', nickname);

    const md = await this.app.mutableData.newRandomPublic(TYPES.IDENTITY);
    await md.put(Safe.CONSTANTS.MD_PERMISSION_EMPTY, entries);

    return md;
  }
}
