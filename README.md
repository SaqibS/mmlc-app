# mmlc-app
Front-end client of the [MathMLCloud API](https://github.com/benetech/mmlc-api)

### Getting Started

The MathML Cloud app organized in modules using require.js. 

For development, it runs in a Vagrant-defined virtual machine. 

Dependencies:

  - Vagrant and VirtualBox. See http://docs.vagrantup.com/v2/getting-started/index.html for installation instructions.

### Installation

```
git clone https://github.com/benetech/mmlc-app.git yourProjectName
cd yourProjectName
vagrant up
```

The app will be running at http://localhost:4567.

The app expects the API to be running at http://localhost:1337. If you'd like to test against staging, edit js/app.js#initialize.

### Hosting

An instance of this application is hosted by Benetech in Microsoft Azure at https://mathmlcloud.org

### License

See the [LICENSE.txt](LICENSE.txt) file for use information.
