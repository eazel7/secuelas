const PEM = require('pem')

function Certificates(config, db, bus) {
  if (!config) throw new Error('config is required')
  if (typeof (config) !== 'object') throw new Error('config is required to be an object')

  if (!db) throw new Error('db is required')
  if (!bus) throw new Error('bus is required')

  this.certicatesCollection = db.collection('certificates')
  this.bus = bus
}

Certificates.prototype.add = function (name, publicKey, privateKey) {
  if (!name) throw new Error('certificate name is required')
  if (typeof (name) !== 'string') throw new Error('certificate name is required to be a string')

  if (!publicKey) throw new Error('public key is required')
  if (typeof (publicKey) !== 'string') throw new Error('public key is required to be a string')

  if (!privateKey) throw new Error('private key is required')
  if (typeof (privateKey) !== 'string') throw new Error('private key is required to be a string')

  return new Promise((resolve, reject) => {
    PEM.readCertificateInfo(publicKey, (err) => {
      if (err) return reject(err)

      this.certicatesCollection.count({
        name: name
      }, (err, count) => {
        if (err) return reject(err)
        if (count !== 0) return reject(new Error('duplicate name'))

        this.certicatesCollection.insert({
          name: name,
          publicKey: publicKey,
          privateKey: privateKey
        }, (err) => {
          if (err) return reject(err)

          resolve()

          this.bus.emit('new-certificate', name)
        })
      })
    })
  })
}

Certificates.prototype.generate = function (name, parent) {
  if (!name) throw new Error('certificate name is required')
  if (typeof (name) !== 'string') throw new Error('certificate name is required to be a string')

  if (!parent) throw new Error('parent certificate name is required')
  if (typeof (parent) !== 'string') throw new Error('parent certificate name is required to be a string')

  return new Promise((resolve, reject) => {
    this.certicatesCollection.findOne({
      name: parent
    }, (err, parentDoc) => {
      if (err) return reject(err)
      if (!parentDoc) return reject(new Error('parent certificate does not exists'))

      PEM.readCertificateInfo(parentDoc.pem, (err, parentCertificate) => {
        PEM.createPrivateKey(2048, (err, key) => {
          PEM.createCSR({
            country: 'AR',
            state: 'Argentina',
            commonName: name
          }, (err, csr) => {
            PEM.createCertificate({
              csr: csr.csr,
              serviceKey: key.key,
              serviceKey: parentDoc.privateKey,
              serviceCertificate: parentDoc.publicKey
            }, (err, newCert) => {
              if (err) return reject(err)

              this.certicatesCollection.insert({
                name: name,
                publicKey: newCert.certificate,
                privateKey: key.key
              }, (err) => {
                if (err) return reject(err)

                resolve()

                this.bus.emit('new-certificate', name)
              })
            })
          })
        })
      })
    })
  })
}

module.exports = Certificates
