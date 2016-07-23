//     Seed-client 0.0.1Unexpected
//     (c) 2015 Nguyen Pham Nguyen

(function() {

  function main() {
    return System.import('./ApplicationLoader').then(module => {
      const loader = new module.default()
      loader.start()
    })
  }
  if (window.WEBPACK_DEV_ENV) {
    return main()
  }

  return System.import('offline-plugin/runtime').then(runtime => {
    (runtime.default || runtime).install()
    return main()
  })

})()
