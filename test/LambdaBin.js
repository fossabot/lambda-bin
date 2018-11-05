/* eslint-env mocha */
'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
chai.config.includeStack = true;

const path = require('path');

['index.js', 'bundle.js',].forEach(source => {
  const LambdaBin = require(path.join('..', source));
  describe(source, () => {
    var lambdaBin
      , originPath;

    beforeEach(() => {
      lambdaBin = new LambdaBin({
        pack: {
          '/dummy': [],
        },
      });
      const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      originPath = path.resolve(__dirname, path.join('tmp', random));
    });

    describe('#constructor()', () => {
      it('should be an instance of LambdaBin', () => {
        return expect(lambdaBin).to.be.instanceof(LambdaBin);
      });

      it('with no options, should be an instance of LambdaBin', () => {
        return expect(new LambdaBin()).to.be.instanceof(LambdaBin);
      });
    });

    describe('#applyMinPack()', () => {
      it('successfully creates symlinks', () => {
        return expect(lambdaBin.applyMinPack(originPath)).to.eventually.eql({loaded: true});
      });

      it('with no path, successfully creates symlinks', () => {
        return expect(lambdaBin.applyMinPack()).to.eventually.have.keys('loaded');
      });
    });

    describe('#setPath()', () => {
      var pathEnvVar;

      beforeEach(() => {
        pathEnvVar = process.env.PATH;
      });

      it('successfully sets PATH environment variable from a string', () => {
        expect(lambdaBin.setPath(originPath)).to.equal(`${originPath}:${pathEnvVar}:`);
      });

      it('successfully sets PATH environment variable from an array', () => {
        expect(lambdaBin.setPath([originPath])).to.equal(`${originPath}:${pathEnvVar}:`);
      });
    });

    describe('#setEnv()', () => {
      const EXISTS = 'exists';
      const LAMBDA_BIN_TEST = 'dummy';

      beforeEach(() => {
        process.env.LAMBDA_BIN_TEST = EXISTS;
      });

      it('successfully sets environment variable', () => {
        lambdaBin.setEnv({LAMBDA_BIN_TEST}, true);
        expect(process.env.LAMBDA_BIN_TEST).to.equal(LAMBDA_BIN_TEST);
      });

      it('successfully appends to environment variable', () => {
        lambdaBin.setEnv({LAMBDA_BIN_TEST}, false);
        expect(process.env.LAMBDA_BIN_TEST).to.equal(`${EXISTS}:${LAMBDA_BIN_TEST}`);
      });
    });
  });});
